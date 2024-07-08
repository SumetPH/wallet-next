import React, { useState } from "react";
import TransactionFormDialog from "./TransactionFormDialog";
import { CategoryType } from "@/services/category/useCategoryList";
import { Ellipsis } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

type Props = {
  onSuccess: () => void;
};

export default function TransactionHeader({ onSuccess }: Props) {
  const [categoryType, setCategoryType] = useState(CategoryType.expense);

  return (
    <>
      <div className="flex justify-between gap-2 mb-2">
        <section className="text-lg font-medium">รายการใช้จ่าย</section>
        <section>
          <TransactionFormDialog
            mode="create"
            categoryType={categoryType}
            onSuccess={onSuccess}
          >
            {({ openDialog }) => (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Ellipsis />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => {
                      setCategoryType(CategoryType.expense);
                      openDialog();
                    }}
                  >
                    เพิ่มรายจ่าย
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setCategoryType(CategoryType.income);
                      openDialog();
                    }}
                  >
                    เพิ่มรายรับ
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </TransactionFormDialog>
        </section>
      </div>
    </>
  );
}
