"use client";

import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Transaction } from "@/services/transaction/useTransactionList";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";
import numeral from "numeral";

type Props = {
  children: ({ openAlert }: { openAlert: () => void }) => React.ReactNode;
  transaction: Transaction;
  onSuccess: () => void;
};

export default function TransactionDeleteAlert({
  children,
  transaction,
  onSuccess,
}: Props) {
  const [alert, setAlert] = useState(false);

  const deleteFn = async () => {
    try {
      await fetch("/api/v1/transaction-delete", {
        method: "DELETE",
        body: JSON.stringify({
          transaction_id: transaction.transaction_id,
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
      {children({ openAlert: () => setAlert(true) })}

      <AlertDialog open={alert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">
              คุณต้องการลบรายการนี้ใช่หรือไม่
            </AlertDialogTitle>
            <AlertDialogDescription></AlertDialogDescription>
          </AlertDialogHeader>
          <div>
            <section>บัญชี : {transaction.account_name}</section>
            <section>หมวดหมู่ : {transaction.category_name}</section>
            <section>
              จํานวน :{" "}
              {numeral(transaction.transaction_amount).format("0,0.00")} บาท
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
