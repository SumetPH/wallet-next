import numeral from "numeral";
import React from "react";
import SkeletonLoading from "../SkeletonLoading";

import { type TransactionRes } from "@/services/transaction/useTransactionList";
import TransactionRow from "./TransactionRow";

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
                    ? `${numeral(item.expense).format("0,0.00")}`
                    : null}
                </span>
              </div>
            </div>

            {item.transactions.map((transaction) => (
              <TransactionRow
                key={transaction.transaction_id}
                transaction={transaction}
                onSuccess={onSuccess}
              />
            ))}
          </div>
        ))}
    </>
  );
}
