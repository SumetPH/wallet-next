import React, { useState } from "react";
import numeral from "numeral";
import TransactionFormDialog from "./dialog/TransactionFormDialog";
import { Transaction } from "@/services/transaction/useTransactionList";
import { CategoryType } from "@/services/categoryType/useCategoryTypeList";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { amountColor, cn } from "@/lib/utils";
import { EllipsisVertical } from "lucide-react";
import dayjs from "dayjs";
import TransferFormDialog from "./dialog/TransferFormDialog";
import DebtPaymentFormDialog from "./dialog/DebtPaymentFormDialog";
import TransactionDeleteAlert from "./dialog/TransactionDeleteAlert";

type Props = {
  transaction: Transaction;
  onSuccess: () => void;
};

export default function TransactionRow({ transaction, onSuccess }: Props) {
  const [isTransactionOpen, setIsTransactionOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [isDebtPaymentOpen, setIsDebtPaymentOpen] = useState(false);
  const [isAlertDeleteOpen, setIsAlertDeleteOpen] = useState(false);

  return (
    <>
      <div
        className="bg-background p-2 border-b last:border-none flex gap-3 justify-between items-center cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          if (transaction.transfer_id) {
            setIsTransferOpen(true);
          } else if (transaction.debt_payment_id) {
            setIsDebtPaymentOpen(true);
          } else {
            setIsTransactionOpen(true);
          }
        }}
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
                  setIsAlertDeleteOpen(true);
                }}
              >
                ลบ
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Avatar>
            <AvatarFallback
              className={cn({
                "bg-red-600 text-white":
                  transaction.transaction_type_id === "1",
                "bg-green-600 text-white":
                  transaction.transaction_type_id === "2",
              })}
            >
              <span className="text-xs">
                {transaction.transaction_type_name}
              </span>
            </AvatarFallback>
          </Avatar>
          <div className="text-xs sm:text-sm">
            <div className="flex flex-wrap">
              <section className="font-medium mr-1">
                {transaction.account_name}
              </section>
              <section className="font-medium mr-1">
                {transaction.transaction_type_name}
              </section>
              <section className="font-medium">
                {transaction.category_name}
              </section>
            </div>
            <div>
              <section className="text-sm text-gray-500 dark:text-gray-400">
                {dayjs(transaction.transaction_date).format("HH:mm")}
              </section>
            </div>
          </div>
        </div>
        <div>
          <section
            className={cn(
              "font-medium text-base sm:text-lg",
              amountColor(transaction.transaction_amount)
            )}
          >
            {numeral(transaction.transaction_amount).format("0,0.00")}
          </section>
        </div>
      </div>

      <TransactionFormDialog
        dialog={isTransactionOpen}
        setDialog={setIsTransactionOpen}
        mode="edit"
        transaction={transaction}
        transactionType={transaction.transaction_type_id}
        onSuccess={onSuccess}
        categoryType={
          transaction.category_type_id === "1"
            ? CategoryType.expense
            : CategoryType.income
        }
      />

      <TransferFormDialog
        dialog={isTransferOpen}
        setDialog={setIsTransferOpen}
        mode="edit"
        transaction={transaction}
        onSuccess={onSuccess}
      />

      <DebtPaymentFormDialog
        dialog={isDebtPaymentOpen}
        setDialog={setIsDebtPaymentOpen}
        mode="edit"
        transaction={transaction}
        onSuccess={onSuccess}
      />

      <TransactionDeleteAlert
        alert={isAlertDeleteOpen}
        setAlert={setIsAlertDeleteOpen}
        transaction={transaction}
        onSuccess={onSuccess}
      />
    </>
  );
}
