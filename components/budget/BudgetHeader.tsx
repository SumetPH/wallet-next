import React from "react";
import { Ellipsis } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import BudgetFormDialog from "./dialog/BudgetFormDialog";
import { Button } from "../ui/button";

type Props = {
  onSuccess?: () => void;
  isOnSort?: boolean;
  onSort?: () => void;
  onSortSave?: () => void;
  onSortCancel?: () => void;
};

export default function BudgetHeader({
  onSuccess,
  isOnSort,
  onSort,
  onSortSave,
  onSortCancel,
}: Props) {
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
        <section className="flex gap-4">
          {isOnSort && (
            <div className="flex gap-2">
              <Button size="sm" className="bg-sky-600" onClick={onSortSave}>
                บันทึก
              </Button>
              <Button size="sm" onClick={onSortCancel}>
                ยกเลิก
              </Button>
            </div>
          )}

          {!isOnSort && (
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
                <DropdownMenuItem
                  onClick={() => {
                    if (onSort) onSort();
                  }}
                >
                  แก้ไขการจัดเรียง
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </section>
      </div>
    </>
  );
}
