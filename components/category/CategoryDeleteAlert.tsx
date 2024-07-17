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
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";
import { Category } from "@/services/category/useCategoryList";
import numeral from "numeral";

type Props = {
  alert: boolean;
  setAlert: React.Dispatch<React.SetStateAction<boolean>>;
  category: Category;
  onSuccess: () => void;
};

export default function CategoryDeleteAlert({
  alert,
  setAlert,
  category,
  onSuccess,
}: Props) {
  const deleteFn = async () => {
    try {
      await fetch("/api/v1/category-delete", {
        method: "DELETE",
        body: JSON.stringify({
          category_id: category.category_id,
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
            <section>หมวดหมู่ : {category.category_name}</section>
            <section>
              จํานวน : {numeral(category.total).format("0,0.00")} บาท
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
