"use client";

import { useQuery } from "@tanstack/react-query";
import { axiosWithToken } from "../axiosWithToken";

export interface Budget {
  budget_total: string;
  budget_spend: string;
  budget_remain: string;
}

export interface BudgetList {
  budget_id: string;
  budget_name: string;
  budget_amount: string;
  expense: string;
  remain: string;
  category_id: string;
}

export interface BudgetRes {
  budget: Budget;
  budgetList: BudgetList[];
}

type Props = {
  enable: boolean;
};

export default function useBudgetList({ enable = true }: Props) {
  const budgetList = useQuery({
    enabled: enable,
    queryKey: ["/budget-list"],
    queryFn: () =>
      axiosWithToken<BudgetRes>({
        url: `/budget-list`,
        method: "GET",
      }).then((res) => res.data),
  });

  return budgetList;
}
