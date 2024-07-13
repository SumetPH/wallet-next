"use client";

import TransactionList from "@/components/transaction/TransactionList";
import useTransactionList from "@/services/transaction/useTransactionList";
import React from "react";

type Props = {
  params: {
    accountId: string;
  };
};

export default function AccountTransaction({ params }: Props) {
  const transactionList = useTransactionList({
    accountId: params.accountId,
  });

  return (
    <TransactionList
      transactionRes={transactionList.data ?? []}
      isFetching={transactionList.isFetching}
      onSuccess={transactionList.refetch}
    />
  );
}
