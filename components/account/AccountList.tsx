"use client";

import React from "react";
import AccountHeader from "./AccountHeader";
import SkeletonLoading from "../SkeletonLoading";
import { amountColor, cn } from "@/lib/utils";
import numeral from "numeral";
import { AccountType } from "@/services/account/useAccountList";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import AccountDeleteAlert from "./AccountDeleteAlert";
import AccountFormDialog from "./AccountFormDialog";
import { useRouter } from "next/navigation";

type Props = {
  accountTypeList: AccountType[];
  isLoading: boolean;
  onSuccess: () => void;
};

export default function AccountList({
  accountTypeList,
  isLoading,
  onSuccess,
}: Props) {
  const router = useRouter();

  return (
    <>
      <AccountHeader onSuccess={onSuccess} />

      <SkeletonLoading
        isLoading={isLoading}
        dataLength={accountTypeList.length}
      />

      {accountTypeList.map((accountType) => (
        <div key={accountType.account_type_id}>
          <div className="flex justify-between gap-2 p-1 bg-gray-100 dark:bg-gray-800">
            <span>{accountType.account_type_name}</span>
            <span
              className={cn(
                "font-medium",
                amountColor(accountType.account_type_balance)
              )}
            >
              {numeral(accountType.account_type_balance).format("0,0.00")} บาท
            </span>
          </div>

          {accountType.accounts.map((account) => (
            <AccountFormDialog
              key={account.account_id}
              account={account}
              mode="edit"
              onSuccess={onSuccess}
            >
              {({ openDialog: openDialogEdit }) => (
                <AccountDeleteAlert account={account} onSuccess={onSuccess}>
                  {({ openAlert: openAlertDelete }) => (
                    <div
                      className="p-2 border-b last:border-none flex justify-between items-center cursor-pointer"
                      onClick={() =>
                        router.push(`/account/${account.account_id}`)
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
                                openDialogEdit();
                              }}
                            >
                              แก้ไข
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                openAlertDelete();
                              }}
                            >
                              ลบ
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>

                        <Avatar>
                          <AvatarFallback>
                            <span className="text-xs">
                              {account.account_name}
                            </span>
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <section>{account.account_name}</section>
                          <section
                            className={cn(
                              "font-medium",
                              amountColor(account.net_balance)
                            )}
                          >
                            {numeral(account.net_balance).format("0,0.00")} บาท
                            <br />
                          </section>
                        </div>
                      </div>
                    </div>
                  )}
                </AccountDeleteAlert>
              )}
            </AccountFormDialog>
          ))}
        </div>
      ))}
    </>
  );
}
