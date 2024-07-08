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
import { useToast } from "../ui/use-toast";

type Props = {
  // eslint-disable-next-line no-unused-vars
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
  const { toast } = useToast();

  const deleteAccount = async () => {
    try {
      // await axiosWithToken({
      //   url: "/transaction-delete",
      //   method: "DELETE",
      //   data: {
      //     transaction_id: transaction.transaction_id,
      //   },
      // });

      toast({
        title: "ลบรายการสําเร็จ",
        description: "ลบรายการสําเร็จ",
      });
      setAlert(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถลบรายการได้",
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
            <AlertDialogTitle className="text-xl">ลบรายการ</AlertDialogTitle>
            <AlertDialogDescription></AlertDialogDescription>
          </AlertDialogHeader>
          <div>
            <section>
              {transaction.account_name} {transaction.category_name} :{" "}
              {transaction.transaction_amount} บาท
            </section>
            <section>คุณต้องการลบรายการนี้ใช่หรือไม่</section>
          </div>
          <AlertDialogFooter className="sm:justify-between gap-4 pt-4">
            <Button className="bg-red-500" onClick={deleteAccount}>
              ลบ
            </Button>
            <Button onClick={() => setAlert(false)}>ยกเลิก</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
