"use client";

import React from "react";
import useTransactionList from "@/services/transaction/useTransactionList";
import TransactionList from "@/components/transaction/TransactionList";

export default function TransactionPage() {
  const transactionList = useTransactionList({});

  return (
    <TransactionList
      transactionRes={transactionList.data}
      isLoading={transactionList.isLoading}
      onCreateOrUpdate={() => transactionList.refetch()}
      onDelete={() => transactionList.refetch()}
    />
  );
}
