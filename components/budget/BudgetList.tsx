import React, { useMemo } from "react";
import dayjs from "dayjs";
import numeral from "numeral";
import { BudgetRes } from "@/services/budget/useBudgetList";
import { Progress } from "@/components/ui/progress";
import BudgetRow from "./BudgetRow";
import SkeletonLoading from "../SkeletonLoading";

type Props = {
  budgetRes?: BudgetRes;
  isFetching: boolean;
  onSuccess?: () => void;
};

export default function BudgetList({
  budgetRes,
  isFetching,
  onSuccess,
}: Props) {
  const remainingDays = useMemo(() => {
    const lastDateInMonth = dayjs().endOf("month").format("DD");
    const currentDate = dayjs().format("DD");
    const remainingDays = Number(lastDateInMonth) - Number(currentDate);
    return remainingDays + 1;
  }, []);

  const budgetPercent = (budgetAmount: string, expense: string): number => {
    const budgetAmountNum = Number(budgetAmount);
    const expenseNum = Math.abs(Number(expense));

    if (budgetAmountNum === 0 || expenseNum === 0) return 0;
    if (budgetAmountNum - expenseNum < 0) return 100;

    return Number((expenseNum * 100) / budgetAmountNum);
  };

  return (
    <>
      <SkeletonLoading
        isLoading={isFetching}
        dataLength={budgetRes?.budgetList.length}
      />

      {!isFetching && budgetRes && budgetRes.budgetList.length > 0 && (
        <>
          <div className="flex justify-between items-center font-medium">
            <span>รายเดือน</span>
            <span>เหลือ {remainingDays} วัน</span>
          </div>
          <div className="text-center font-medium text-lg">
            {numeral(budgetRes.budget.budget_total).format("0,0.00")} บาท
          </div>
          <div className="my-3">
            <Progress
              indicatorClassName="bg-red-600"
              value={budgetPercent(
                budgetRes.budget.budget_total || "0",
                budgetRes.budget.budget_spend || "0"
              )}
            />
          </div>

          <div className="flex justify-between items-center mb-4">
            <section className="text-red-600">
              {numeral(budgetRes.budget.budget_spend).format("0,0.00")} บาท (
              {budgetPercent(
                budgetRes.budget.budget_total || "0",
                budgetRes.budget.budget_spend || "0"
              ).toFixed(2)}
              %)
            </section>
            <section className="text-green-600">
              {numeral(budgetRes.budget.budget_remain).format("0,0.00")} บาท
            </section>
          </div>
        </>
      )}

      {!isFetching &&
        budgetRes &&
        budgetRes.budgetList.map((budget) => (
          <BudgetRow
            key={budget.budget_id}
            budget={budget}
            budgetPercent={budgetPercent(
              budget.budget_amount || "0",
              budget.expense || "0"
            )}
          />
        ))}
    </>
  );
}
