"use client";

import TransactionList from "@/components/transaction/TransactionList";
import useTransactionList from "@/services/transaction/useTransactionList";
import React from "react";

export default function CategoryTransaction({
  params,
}: {
  params: { categoryId: string };
}) {
  const transactionList = useTransactionList({
    categoryId: params.categoryId,
  });

  return (
    <TransactionList
      transactionRes={transactionList.data ?? []}
      isFetching={transactionList.isFetching}
      onSuccess={transactionList.refetch}
    />
  );
}
