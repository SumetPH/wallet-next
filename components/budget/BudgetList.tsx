import React, { useMemo } from "react";
import dayjs from "dayjs";
import numeral from "numeral";
import { BudgetRes } from "@/services/budget/useBudgetList";
import { Progress } from "@/components/ui/progress";
import BudgetRow from "./BudgetRow";
import SkeletonLoading from "../SkeletonLoading";
import ReactDragListView from "react-drag-listview";
import { GripVertical } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

type Props = {
  budgetRes?: BudgetRes;
  isFetching: boolean;
  isOnSort?: boolean;
  onSuccess: () => void;
};

export default function BudgetList({
  budgetRes,
  isFetching,
  isOnSort,
  onSuccess,
}: Props) {
  const queryClient = useQueryClient();

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
          <div className="flex justify-between items-center font-medium text-sm lg:text-base mb-1">
            <span>เดือน {dayjs().format("MM-YYYY")}</span>
            <span>เหลือ {remainingDays} วัน</span>
          </div>
          <div className="text-center font-medium text-base sm:text-lg">
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

          <div className="flex justify-between items-center mb-4 text-sm sm:text-base">
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

      {!isFetching && budgetRes && (
        <ReactDragListView
          nodeSelector={isOnSort ? ".budget-row" : undefined}
          onDragEnd={(fromIndex, toIndex) => {
            const list = [...budgetRes.budgetList];
            const item = list.splice(fromIndex, 1)[0];
            list.splice(toIndex, 0, item);
            queryClient.setQueryData(["/budget-list"], {
              ...budgetRes,
              budgetList: list,
            });
          }}
        >
          {budgetRes.budgetList.map((budget) => (
            <div
              key={budget.budget_id}
              className="budget-row flex items-center bg-background border-b last:border-none"
            >
              <div className="w-full ">
                <BudgetRow
                  budget={budget}
                  budgetPercent={budgetPercent(
                    budget.budget_amount || "0",
                    budget.expense || "0"
                  )}
                  onSuccess={onSuccess}
                  isOnSort={isOnSort}
                />
              </div>
              {isOnSort && <GripVertical className="mx-5 cursor-pointer" />}
            </div>
          ))}
        </ReactDragListView>
      )}
    </>
  );
}
