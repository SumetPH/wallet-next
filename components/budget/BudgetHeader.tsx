import React from "react";
import { Ellipsis } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import BudgetFormDialog from "./dialog/BudgetFormDialog";

type Props = {
  onSuccess?: () => void;
};

export default function BudgetHeader({ onSuccess }: Props) {
  const [isOpenDialog, setIsOpenDialog] = React.useState(false);

  return (
    <>
      <BudgetFormDialog
        dialog={isOpenDialog}
        setDialog={setIsOpenDialog}
        mode="create"
        onSuccess={onSuccess}
      />

      <div className="flex justify-between gap-2 mb-2 sticky top-0 bg-background z-50">
        <section className="text-lg font-medium">งบประมาณ</section>
        <section>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Ellipsis />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setIsOpenDialog(true);
                }}
              >
                เพิ่มงบประมาณ
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </section>
      </div>
    </>
  );
}
