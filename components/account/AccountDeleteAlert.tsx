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
import { Account } from "@/services/account/useAccountList";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";

type Props = {
  children: ({ openAlert }: { openAlert: () => void }) => React.ReactNode;
  account: Account;
  onSuccess: () => void;
};

export default function AccountDeleteAlert({
  children,
  account,
  onSuccess,
}: Props) {
  const [alert, setAlert] = useState(false);

  const deleteAccount = async () => {
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
            <section>บัญชี : {account.account_name}</section>
            <section>จํานวน : {account.net_balance} บาท</section>
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
