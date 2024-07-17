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
import { Account } from "@/services/account/useAccountList";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import numeral from "numeral";

type Props = {
  alert: boolean;
  setAlert: React.Dispatch<React.SetStateAction<boolean>>;
  account: Account;
  onSuccess: () => void;
};

export default function AccountDeleteAlert({
  alert,
  setAlert,
  account,
  onSuccess,
}: Props) {
  const deleteFn = async () => {
    try {
      await fetch("/api/v1/account-delete", {
        method: "DELETE",
        body: JSON.stringify({
          account_id: account.account_id,
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
            <section>บัญชี : {account.account_name}</section>
            <section>
              จํานวน : {numeral(account.net_balance).format("0,0.00")} บาท
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
