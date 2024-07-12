import React, { useState } from "react";
import TransactionFormDialog from "./TransactionFormDialog";
import { CategoryType } from "@/services/categoryType/useCategoryType";
import { Ellipsis } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { TransactionType } from "@/services/transactionType/useTransactionType";

type Props = {
  onSuccess: () => void;
};

export default function TransactionHeader({ onSuccess }: Props) {
  const [transactionType, setTransactionType] = useState(
    TransactionType.expense
  );
  const [categoryType, setCategoryType] = useState(CategoryType.expense);

  return (
    <>
      <div className="flex justify-between gap-2 mb-2">
        <section className="text-lg font-medium">รายการใช้จ่าย</section>
        <section>
          <TransactionFormDialog
            mode="create"
            transactionType={transactionType}
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
                      setTransactionType(TransactionType.expense);
                      setCategoryType(CategoryType.expense);
                      openDialog();
                    }}
                  >
                    เพิ่มรายจ่าย
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setTransactionType(TransactionType.income);
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
