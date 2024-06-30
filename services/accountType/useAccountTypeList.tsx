"use client";

import { useQuery } from "@tanstack/react-query";
import { axiosWithToken } from "../axiosWithToken";

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
    queryFn: () =>
      axiosWithToken<AccountType[]>({
        url: `/account-type-list`,
        method: "GET",
      }).then((res) => res.data),
  });

  return accountTypeList;
}
