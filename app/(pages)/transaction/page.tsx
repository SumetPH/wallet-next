"use client";

import React from "react";
import useTransactionList from "@/services/transaction/useTransactionList";
import TransactionList from "@/components/transaction/TransactionList";
import TransactionHeader from "@/components/transaction/TransactionHeader";

export default function TransactionPage() {
  const transactionList = useTransactionList({});

  return (
    <>
      <TransactionHeader onSuccess={transactionList.refetch} />

      <TransactionList
        transactionRes={transactionList.data ?? []}
        isFetching={transactionList.isFetching}
        onSuccess={() => transactionList.refetch()}
      />
    </>
  );
}
