import React from "react";
import numeral from "numeral";
import { BudgetList } from "@/services/budget/useBudgetList";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Progress } from "../ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";

type Props = {
  budget: BudgetList;
  budgetPercent: number;
};

export default function BudgetRow({ budget, budgetPercent }: Props) {
  const router = useRouter();

  return (
    <div
      className="grid grid-cols-2 gap-2 py-2 border-b last:border-none cursor-pointer"
      onClick={() =>
        router.push(`/budget/${budget.category_id}?title=${budget.budget_name}`)
      }
    >
      <div className="col-span-2 sm:col-span-1 flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <EllipsisVertical />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              แก้ไข
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              ลบ
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Avatar>
          <AvatarFallback className="text-xs">
            {budget.budget_name}
          </AvatarFallback>
        </Avatar>
        <div className="font-medium text-sm sm:text-base">
          <section>{budget.budget_name}</section>
          <section>
            {numeral(budget.budget_amount).format("0,0.00")} บาท
          </section>
        </div>
      </div>
      <div className="col-span-2 sm:col-span-1">
        <section className="text-red-600 text-end">
          {numeral(budget.expense).format("0,0.00")} บาท (
          {budgetPercent.toFixed(2)}
          %)
        </section>
        <section className="my-1">
          <Progress
            className="h-3"
            indicatorClassName="bg-red-600"
            value={budgetPercent}
          />
        </section>
        <section
          className={cn(
            "text-end",
            Number(budget.remain) < 0 ? "text-red-600" : "text-green-600"
          )}
        >
          {numeral(budget.remain).format("0,0.00")} บาท
        </section>
      </div>
    </div>
  );
}
