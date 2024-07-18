"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import numeral from "numeral";
import { BudgetList } from "@/services/budget/useBudgetList";

type Props = {
  alert: boolean;
  setAlert: React.Dispatch<React.SetStateAction<boolean>>;
  budget: BudgetList;
  onSuccess: () => void;
};

export default function BudgetDeleteAlert({
  alert,
  setAlert,
  budget,
  onSuccess,
}: Props) {
  const deleteFn = async () => {
    try {
      await fetch("/api/v1/budget-delete", {
        method: "DELETE",
        body: JSON.stringify({
          budget_id: budget.budget_id,
        }),
      });

      toast({
        title: "ลบรายการสําเร็จ",
      });
      setAlert(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
      toast({
        title: "ไม่สามารถลบรายการได้",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <AlertDialog open={alert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">
              คุณต้องการลบรายการนี้ใช่หรือไม่
            </AlertDialogTitle>
            <AlertDialogDescription></AlertDialogDescription>
          </AlertDialogHeader>
          <div>
            <section>งบประมาณ : {budget.budget_name}</section>
            <section>
              จํานวน : {numeral(budget.budget_amount).format("0,0.00")} บาท
            </section>
          </div>
          <AlertDialogFooter className="sm:justify-between gap-4 pt-4">
            <Button className="bg-red-500" onClick={deleteFn}>
              ลบ
            </Button>
            <Button onClick={() => setAlert(false)}>ยกเลิก</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
