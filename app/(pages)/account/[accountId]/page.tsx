"use client";

import React from "react";
import TransactionList from "@/components/transaction/TransactionList";
import TransactionHeader from "@/components/transaction/TransactionHeader";
import useTransactionList from "@/services/transaction/useTransactionList";

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
