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
import BudgetFormDialog from "./dialog/BudgetFormDialog";
import BudgetDeleteAlert from "./dialog/BudgetDeleteAlert";

type Props = {
  budget: BudgetList;
  budgetPercent: number;
  onSuccess: () => void;
};

export default function BudgetRow({ budget, budgetPercent, onSuccess }: Props) {
  const router = useRouter();
  const [isOpenDialogForm, setIsOpenDialogForm] = React.useState(false);
  const [isOpenAlertDelete, setIsOpenAlertDelete] = React.useState(false);

  return (
    <>
      <BudgetFormDialog
        dialog={isOpenDialogForm}
        setDialog={setIsOpenDialogForm}
        mode="edit"
        budget={budget}
        onSuccess={onSuccess}
      />

      <BudgetDeleteAlert
        alert={isOpenAlertDelete}
        setAlert={setIsOpenAlertDelete}
        budget={budget}
        onSuccess={onSuccess}
      />

      <div
        className="grid grid-cols-12 gap-2 py-2 border-b last:border-none cursor-pointer"
        onClick={() =>
          router.push(
            `/budget/${budget.category_id}?title=${budget.budget_name}`,
            { scroll: false }
          )
        }
      >
        <div className="col-span-6 flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <EllipsisVertical />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpenDialogForm(true);
                }}
              >
                แก้ไข
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpenAlertDelete(true);
                }}
              >
                ลบ
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Avatar className="hidden sm:flex">
            <AvatarFallback className="text-xs">
              {budget.budget_name}
            </AvatarFallback>
          </Avatar>
          <div className="font-medium text-sm sm:text-base sm:mx-2">
            <section>{budget.budget_name}</section>
            <section>
              {numeral(budget.budget_amount).format("0,0.00")} บาท
            </section>
          </div>
        </div>
        <div className="col-span-6">
          <section className="text-red-600 text-end text-sm sm:text-base">
            {numeral(budget.expense).format("0,0.00")} บาท
            <span className="hidden sm:inline">
              {" "}
              ({budgetPercent.toFixed(2)}%)
            </span>
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
              "text-end text-sm sm:text-base",
              Number(budget.remain) < 0 ? "text-red-600" : "text-green-600"
            )}
          >
            {numeral(budget.remain).format("0,0.00")} บาท
          </section>
        </div>
      </div>
    </>
  );
}
