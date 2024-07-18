"use client";

import BudgetHeader from "@/components/budget/BudgetHeader";
import BudgetList from "@/components/budget/BudgetList";
import useBudgetList from "@/services/budget/useBudgetList";

export default function BudgetPage() {
  const budgetList = useBudgetList({ enable: true });

  return (
    <>
      <BudgetHeader onSuccess={budgetList.refetch} />

      <BudgetList
        budgetRes={budgetList.data}
        isFetching={budgetList.isFetching}
        onSuccess={budgetList.refetch}
      />
    </>
  );
}
