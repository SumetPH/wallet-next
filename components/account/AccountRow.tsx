import React from "react";
import { Account } from "@/services/account/useAccountList";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { amountColor, cn } from "@/lib/utils";
import numeral from "numeral";
import AccountDeleteAlert from "./AccountDeleteAlert";
import AccountFormDialog from "./AccountFormDialog";

type Props = {
  account: Account;
  onSuccess: () => void;
};

export default function AccountRow({ account, onSuccess }: Props) {
  const router = useRouter();
  const [openDialogEdit, setOpenDialogEdit] = React.useState(false);
  const [openAlertDelete, setOpenAlertDelete] = React.useState(false);

  return (
    <>
      <AccountFormDialog
        mode="edit"
        dialog={openDialogEdit}
        setDialog={setOpenDialogEdit}
        account={account}
        onSuccess={onSuccess}
      />

      <AccountDeleteAlert
        alert={openAlertDelete}
        setAlert={setOpenAlertDelete}
        account={account}
        onSuccess={onSuccess}
      />

      <div
        className="p-2 border-b last:border-none flex justify-between items-center cursor-pointer"
        onClick={() =>
          router.push(
            `/account/${account.account_id}?title=${account.account_name}`
          )
        }
      >
        <div className="flex gap-3 items-center">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <EllipsisVertical />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenDialogEdit(true);
                }}
              >
                แก้ไข
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenAlertDelete(true);
                }}
              >
                ลบ
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Avatar>
            <AvatarFallback>
              <span className="text-xs">{account.account_name}</span>
            </AvatarFallback>
          </Avatar>
          <div className="text-sm sm:text-base">
            <section data-testid="account-name">{account.account_name}</section>
            <section
              data-testid="account-balance"
              className={cn("font-medium", amountColor(account.net_balance))}
            >
              {numeral(account.net_balance).format("0,0.00")} บาท
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
