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
import { Transaction } from "@/services/transaction/useTransactionList";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import numeral from "numeral";

type Props = {
  alert: boolean;
  setAlert: React.Dispatch<React.SetStateAction<boolean>>;
  transaction: Transaction;
  onSuccess: () => void;
};

export default function TransactionDeleteAlert({
  alert,
  setAlert,
  transaction,
  onSuccess,
}: Props) {
  const deleteTransaction = async () => {
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

  const deleteTransfer = async () => {
    try {
      await fetch("/api/v1/transfer-delete", {
        method: "DELETE",
        body: JSON.stringify({
          transfer_id: transaction.transfer_id,
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

  const deleteDebtPayment = async () => {
    try {
      await fetch("/api/v1/debt-payment-delete", {
        method: "DELETE",
        body: JSON.stringify({
          debt_payment_id: transaction.debt_payment_id,
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
            <section>บัญชี : {transaction.account_name}</section>
            <section>หมวดหมู่ : {transaction.category_name}</section>
            <section>
              จํานวน :{" "}
              {numeral(transaction.transaction_amount).format("0,0.00")} บาท
            </section>
          </div>
          <AlertDialogFooter className="sm:justify-between gap-4 pt-4">
            <Button
              className="bg-red-500"
              onClick={() => {
                if (transaction.transfer_id) {
                  deleteTransfer();
                } else if (transaction.debt_payment_id) {
                  deleteDebtPayment();
                } else {
                  deleteTransaction();
                }
              }}
            >
              ลบ
            </Button>
            <Button onClick={() => setAlert(false)}>ยกเลิก</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
