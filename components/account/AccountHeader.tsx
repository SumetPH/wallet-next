import React from "react";
import { Ellipsis } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import AccountFormDialog from "./AccountFormDialog";

type Props = {
  onSuccess: () => void;
};

export default function AccountHeader({ onSuccess }: Props) {
  return (
    <>
      <div className="flex justify-between gap-2 mb-2">
        <section className="text-lg font-medium">บัญชี</section>
        <section>
          <AccountFormDialog mode="create" onSuccess={onSuccess}>
            {({ openDialog }) => (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Ellipsis />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      openDialog();
                    }}
                  >
                    เพิ่มบัญชี
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </AccountFormDialog>
        </section>
      </div>
    </>
  );
}
