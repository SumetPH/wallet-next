import React, { useState } from "react";
import TransactionFormDialog from "./dialog/TransactionFormDialog";
import { CategoryType } from "@/services/categoryType/useCategoryType";
import { Ellipsis } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { TransactionType } from "@/services/transactionType/useTransactionType";
import TransferFormDialog from "./dialog/TransferFormDialog";
import DebtPaymentFormDialog from "./dialog/DebtPaymentFormDialog";
import { useSearchParams } from "next/navigation";

type Props = {
  onSuccess: () => void;
};

export default function TransactionHeader({ onSuccess }: Props) {
  const searchParams = useSearchParams();
  const title = searchParams.get("title");

  const [isTransactionOpen, setIsTransactionOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isDebtPaymentOpen, setIsDebtPaymentOpen] = useState(false);

  const [transactionType, setTransactionType] = useState(
    TransactionType.expense
  );
  const [categoryType, setCategoryType] = useState(CategoryType.expense);

  return (
    <>
      <div className="flex justify-between gap-2 mb-2">
        <section className="text-lg font-medium">
          {title ? (
            <span data-testid="title">รายการ : {title}</span>
          ) : (
            <span data-testid="title">รายการ</span>
          )}
        </section>
        <section>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Ellipsis />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                data-testid="btn-create-transaction"
                onClick={() => {
                  setTransactionType(TransactionType.expense);
                  setCategoryType(CategoryType.expense);
                  setIsTransactionOpen(true);
                }}
              >
                เพิ่มรายจ่าย
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setTransactionType(TransactionType.income);
                  setCategoryType(CategoryType.income);
                  setIsTransactionOpen(true);
                }}
              >
                เพิ่มรายรับ
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setIsTransferOpen(true);
                }}
              >
                โอน
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setIsDebtPaymentOpen(true);
                }}
              >
                ชําระหนี้
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </section>
      </div>

      <TransactionFormDialog
        dialog={isTransactionOpen}
        setDialog={setIsTransactionOpen}
        mode="create"
        transactionType={transactionType}
        onSuccess={onSuccess}
        categoryType={categoryType}
      />

      <TransferFormDialog
        dialog={isTransferOpen}
        setDialog={setIsTransferOpen}
        mode="create"
        onSuccess={onSuccess}
      />

      <DebtPaymentFormDialog
        dialog={isDebtPaymentOpen}
        setDialog={setIsDebtPaymentOpen}
        mode="create"
        onSuccess={onSuccess}
      />
    </>
  );
}
