import React from "react";
import type { TransactionRes } from "@/services/transaction/useTransactionList";
import TransactionHeader from "./TransactionHeader";
import TransactionRow from "./TransactionRow";
import numeral from "numeral";
import SkeletonLoading from "../SkeletonLoading";

type Props = {
  transactionRes?: TransactionRes[];
  isLoading?: boolean;
  onCreateOrUpdate: () => void;
  onDelete: () => void;
};

export default function TransactionList({
  transactionRes = [],
  isLoading = false,
  onCreateOrUpdate,
  onDelete,
}: Props) {
  return (
    <>
      <TransactionHeader onCreateOrUpdate={onCreateOrUpdate} />

      <SkeletonLoading
        isLoading={isLoading}
        dataLength={transactionRes.length}
      />

      {transactionRes.map((item) => (
        <div key={item.date}>
          <div className="flex justify-between gap-2 p-1 bg-gray-100 font-medium">
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
            <TransactionRow
              key={transaction.transaction_id}
              transaction={transaction}
              onCreateOrUpdate={onCreateOrUpdate}
              onDelete={onDelete}
            />
          ))}
        </div>
      ))}
    </>
  );
}
