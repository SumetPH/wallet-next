"use client";

import { useQuery } from "@tanstack/react-query";

type AccountType = {
  account_type_id: string;
  account_type_name: string;
  account_type_created_at: string;
  account_type_updated_at: string;
};

type Props = {
  enable: boolean;
};

export default function useAccountTypeList({ enable = true }: Props) {
  const accountTypeList = useQuery({
    enabled: enable,
    queryKey: ["/account-type-list"],
    queryFn: async () => {
      const res = await fetch(`/api/v1/account-type-list`);
      const json: AccountType[] = await res.json();
      return json;
    },
  });

  return accountTypeList;
}
