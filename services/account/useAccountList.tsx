"use client";

import { useQuery } from "@tanstack/react-query";

export type AccountList = AccountType[];

export interface AccountType {
  account_type_id: string;
  account_type_name: string;
  account_type_created_at: string;
  account_type_updated_at: string;
  account_type_balance: string;
  accounts: Account[];
}

export interface Account {
  account_id: string;
  account_name: string;
  account_created_at: string;
  account_updated_at: string;
  account_type_id: string;
  account_type_name: string;
  account_balance: string;
  expense: string;
  income: string;
  net_balance: string;
}

type Props = {
  enable: boolean;
};

export default function useAccountList({ enable = true }: Props) {
  const accountList = useQuery({
    enabled: enable,
    queryKey: ["/account-list"],
    queryFn: async () => {
      const res = await fetch(`/api/v1/account-list`);
      const json: AccountType[] = await res.json();
      return json;
    },
  });

  return accountList;
}
