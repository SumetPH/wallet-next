import dayjs from "dayjs";
import numeral from "numeral";
import React from "react";
import SkeletonLoading from "../SkeletonLoading";
import TransactionDeleteAlert from "./TransactionDeleteAlert";
import TransactionFormDialog from "./TransactionFormDialog";
import TransactionHeader from "./TransactionHeader";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { amountColor, cn } from "@/lib/utils";
import { EllipsisVertical } from "lucide-react";
import type { TransactionRes } from "@/services/transaction/useTransactionList";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { CategoryType } from "@/services/category/useCategoryList";

type Props = {
  transactionRes: TransactionRes[];
  isFetching: boolean;
  onSuccess: () => void;
};

export default function TransactionList({
  transactionRes,
  isFetching,
  onSuccess,
}: Props) {
  return (
    <>
      <TransactionHeader onSuccess={onSuccess} />

      <SkeletonLoading
        isLoading={isFetching}
        dataLength={transactionRes.length}
      />

      {!isFetching &&
        transactionRes.length > 0 &&
        transactionRes?.map((item) => (
          <div key={item.date}>
            <div className="flex justify-between gap-2 p-1 bg-gray-100 dark:bg-gray-800 font-medium">
              <span className="text-sm">{item.date}</span>
              <div className="flex gap-3">
                <span className="text-sm text-green-600">
                  {item.income !== "0"
                    ? `+${numeral(item.income).format("0,0.00")}`
                    : null}
                </span>
                <span className="text-sm text-red-600">
                  {item.expense !== "0"
                    ? `-${numeral(item.expense).format("0,0.00")}`
                    : null}
                </span>
              </div>
            </div>

            {item.transactions.map((transaction) => (
              <TransactionDeleteAlert
                key={transaction.transaction_id}
                transaction={transaction}
                onSuccess={onSuccess}
              >
                {({ openAlert: openAlertDelete }) => (
                  <TransactionFormDialog
                    transaction={transaction}
                    mode="edit"
                    categoryType={
                      transaction.category_type_id === "1"
                        ? CategoryType.expense
                        : CategoryType.income
                    }
                    onSuccess={onSuccess}
                  >
                    {({ openDialog }) => (
                      <div
                        className="bg-background p-2 border-b last:border-none flex gap-3 justify-between items-center cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDialog();
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
                                {transaction.account_name}
                              </span>
                            </AvatarFallback>
                          </Avatar>
                          <div className="text-xs sm:text-sm">
                            <div className="flex flex-wrap">
                              <section className="font-medium mr-2">
                                {transaction.account_name}
                              </section>
                              <section className="font-bold">
                                {transaction.transfer_type_id
                                  ? transaction.transfer_type_name
                                  : transaction.category_name}
                              </section>
                            </div>
                            <div>
                              <section className="text-sm text-gray-500 dark:text-gray-400">
                                {dayjs(
                                  transaction.transaction_created_at
                                ).format("HH:mm")}
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
                            {numeral(transaction.transaction_amount).format(
                              "0,0.00"
                            )}
                          </section>
                        </div>
                      </div>
                    )}
                  </TransactionFormDialog>
                )}
              </TransactionDeleteAlert>
            ))}
          </div>
        ))}
    </>
  );
}
