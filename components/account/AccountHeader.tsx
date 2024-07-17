import React, { useState } from "react";
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <AccountFormDialog
        mode="create"
        dialog={isDialogOpen}
        setDialog={setIsDialogOpen}
        onSuccess={onSuccess}
      />

      <div className="flex justify-between gap-2 mb-2">
        <section className="text-lg font-medium">บัญชี</section>
        <section>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Ellipsis />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setIsDialogOpen(true);
                }}
              >
                เพิ่มบัญชี
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </section>
      </div>
    </>
  );
}
