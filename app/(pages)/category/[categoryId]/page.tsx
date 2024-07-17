"use client";

import TransactionHeader from "@/components/transaction/TransactionHeader";
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
    <>
      <TransactionHeader onSuccess={transactionList.refetch} />

      <TransactionList
        transactionRes={transactionList.data ?? []}
        isFetching={transactionList.isFetching}
        onSuccess={transactionList.refetch}
      />
    </>
  );
}
