"use client";

import BudgetHeader from "@/components/budget/BudgetHeader";
import BudgetList from "@/components/budget/BudgetList";
import { toast } from "@/components/ui/use-toast";
import useBudgetList from "@/services/budget/useBudgetList";
import useLoadingStore from "@/stores/useLoading";
import React from "react";

export default function BudgetPage() {
  const { setIsLoading } = useLoadingStore();
  const budgetList = useBudgetList({ enable: true });
  const [isOnSort, setIsOnSort] = React.useState(false);

  const onSortCancel = () => {
    setIsOnSort(false);
    budgetList.refetch();
  };

  const onSortSave = async () => {
    try {
      setIsLoading(true);

      const budgetOrder = budgetList.data?.budgetList.map((budget, index) => ({
        budget_id: budget.budget_id,
        budget_order: index,
      }));

      const res = await fetch("/api/v1/budget-update-order", {
        method: "PATCH",
        body: JSON.stringify({
          budget_list: budgetOrder,
        }),
      });

      if (res.status === 200) {
        toast({
          title: "บันทึกสําเร็จ",
        });
        setIsOnSort(false);
        budgetList.refetch();
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "เกิดข้อผิดพลาด",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <BudgetHeader
        onSuccess={budgetList.refetch}
        isOnSort={isOnSort}
        onSort={() => setIsOnSort(true)}
        onSortCancel={onSortCancel}
        onSortSave={onSortSave}
      />

      <BudgetList
        budgetRes={budgetList.data}
        isFetching={budgetList.isFetching}
        isOnSort={isOnSort}
        onSuccess={budgetList.refetch}
      />
    </>
  );
}
