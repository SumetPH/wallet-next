"use client";

import { useQuery } from "@tanstack/react-query";

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
    queryFn: async () => {
      const res = await fetch(`/api/v1/budget-list`);
      const json: BudgetRes = await res.json();
      return json;
    },
  });

  return budgetList;
}
