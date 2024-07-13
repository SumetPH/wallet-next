"use client";

import { useQuery } from "@tanstack/react-query";

export interface TransactionRes {
  date: string;
  income: string;
  expense: string;
  total: string;
  transactions: Transaction[];
}

export interface Transaction {
  transaction_id: string;
  transaction_amount: string;
  transaction_note: string | null;
  transaction_date: string;
  transaction_type_id: string;
  transaction_type_name: string;
  category_id: string | null;
  category_name: string | null;
  category_type_id: string | null;
  category_type_name: string | null;
  account_id: string | null;
  account_name: string | null;
  transfer_id: string | null;
  transfer_amount: string | null;
  transfer_note: string | null;
  transfer_date: string | null;
  transfer_from_account_id: string | null;
  transfer_to_account_id: string | null;
  debt_payment_id: null | string;
  debt_payment_amount: null | string;
  debt_payment_note: null | string;
  debt_payment_date: null | string;
  debt_payment_from_account_id: null | string;
  debt_payment_to_account_id: null | string;
}

type Props = {
  accountId?: string;
  categoryId?: string;
  startDate?: string;
  endDate?: string;
};

export default function useTransactionList({
  accountId,
  categoryId,
  startDate,
  endDate,
}: Props) {
  const searchParams = new URLSearchParams();
  if (accountId) searchParams.append("account_id", accountId);
  if (categoryId) searchParams.append("category_id", categoryId);
  if (startDate) searchParams.append("start_date", startDate);
  if (endDate) searchParams.append("end_date", endDate);
  const query = searchParams.toString() ? `?${searchParams.toString()}` : "";

  const transactionList = useQuery({
    queryKey: ["/transaction-list", query],
    queryFn: async () => {
      const res = await fetch(`/api/v1/transaction-list${query}`);
      const json: TransactionRes[] = await res.json();
      return json;
    },
  });

  return transactionList;
}
