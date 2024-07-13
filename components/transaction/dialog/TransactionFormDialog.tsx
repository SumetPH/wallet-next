"use client";

import CurrencyInput from "react-currency-input-field";
import dayjs from "dayjs";
import React, { useCallback, useEffect, useState } from "react";
import useAccountList from "@/services/account/useAccountList";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TimePicker } from "@/components/ui/time-picker/time-picker";
import { Transaction } from "@/services/transaction/useTransactionList";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DialogHeader,
  DialogFooter,
  DialogContent,
  DialogTitle,
  DialogDescription,
  Dialog,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import useCategoryList from "@/services/category/useCategoryList";
import { toast } from "@/components/ui/use-toast";
import useLoadingStore from "@/stores/useLoading";
import { TransactionType } from "@/services/transactionType/useTransactionType";
import numeral from "numeral";

type Props = {
  dialog: boolean;
  setDialog: React.Dispatch<React.SetStateAction<boolean>>;
  mode: "create" | "edit";
  transaction?: Transaction;
  transactionType: string;
  categoryType: string;
  onSuccess?: () => void;
};

const schema = z.object({
  transactionAmount: z
    .string({ required_error: "กรุณากรอกจํานวนเงิน" })
    .min(1, { message: "กรุณากรอกจํานวนเงิน" }),
  accountId: z
    .string({ required_error: "กรุณาเลือกบัญชี" })
    .min(1, { message: "กรุณาเลือกบัญชี" }),
  categoryId: z
    .string({ required_error: "กรุณาเลือกหมวดหมู่" })
    .min(1, { message: "กรุณาเลือกหมวดหมู่" }),
  transactionNote: z.string().optional(),
  createdAt: z.date({ required_error: "กรุณาเลือกวันที่" }),
});

type FormData = z.infer<typeof schema>;

export default function TransactionFormDialog({
  dialog,
  setDialog,
  mode,
  transaction,
  categoryType,
  transactionType,
  onSuccess,
}: Props) {
  const { setIsLoading } = useLoadingStore();
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      transactionAmount: "",
      accountId: "",
      categoryId: "",
      transactionNote: "",
      createdAt: dayjs().toDate(),
    },
  });

  const accountList = useAccountList({
    enable: dialog,
  });

  const categoryList = useCategoryList({
    enable: dialog,
    categoryType: categoryType,
  });

  const openDialog = useCallback(() => {
    setDialog(true);

    if (transaction && mode === "edit") {
      form.setValue(
        "transactionAmount",
        transaction.transaction_amount.replace("-", "")
      );
      form.setValue("accountId", transaction.account_id ?? "");
      form.setValue("categoryId", transaction.category_id ?? "");
      form.setValue("transactionNote", transaction.transaction_note ?? "");
      form.setValue("createdAt", dayjs(transaction.transaction_date).toDate());
    }
  }, [form, mode, setDialog, transaction]);

  useEffect(() => {
    if (dialog) {
      openDialog();
    }
  }, [dialog, openDialog]);

  const submit = (data: FormData) => {
    if (mode === "create") {
      createTransaction(data);
    } else {
      updateTransaction(data);
    }
  };

  const createTransaction = async (data: FormData) => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/v1/transaction-create", {
        method: "POST",
        body: JSON.stringify({
          transaction_amount:
            transactionType === TransactionType.expense
              ? `-${data.transactionAmount}`
              : data.transactionAmount,
          transaction_note: data.transactionNote,
          transaction_date: dayjs(data.createdAt).format("YYYY-MM-DD HH:mm:ss"),
          transaction_type_id: transactionType,
          account_id: data.accountId,
          category_id: data.categoryId,
        }),
      });

      if (res.status === 200) {
        toast({
          title: "บันทึกสําเร็จ",
        });
        form.reset();
        setDialog(false);
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "บันทึกไม่สําเร็จ",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateTransaction = async (data: FormData) => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/v1/transaction-update", {
        method: "PUT",
        body: JSON.stringify({
          transaction_id: transaction?.transaction_id,

          transaction_amount:
            transactionType === TransactionType.expense
              ? `-${data.transactionAmount}`
              : data.transactionAmount,
          transaction_note: data.transactionNote,
          transaction_date: dayjs(data.createdAt).format("YYYY-MM-DD HH:mm:ss"),
          transaction_type_id: transaction?.transaction_type_id,
          account_id: data.accountId,
          category_id: data.categoryId,
        }),
      });
      if (res.status === 200) {
        toast({
          title: "บันทึกสําเร็จ",
        });
        form.reset();
        setDialog(false);
        if (onSuccess) onSuccess();
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "บันทึกไม่สําเร็จ",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={dialog} onOpenChange={(value) => setDialog(value)}>
        <DialogContent
          onEscapeKeyDown={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(submit)}>
              <DialogHeader>
                <DialogTitle className="mb-4">
                  {transactionType === TransactionType.expense ? (
                    <span className="text-red-600">รายจ่าย</span>
                  ) : (
                    <span className="text-green-600">รายรับ</span>
                  )}
                </DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>
              <div>
                <FormField
                  control={form.control}
                  name="transactionAmount"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>จํานวน</FormLabel>
                      <FormControl>
                        <CurrencyInput
                          placeholder="จํานวน"
                          className="input-currency"
                          decimalsLimit={2}
                          allowNegativeValue={false}
                          defaultValue={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="accountId"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>บัญชี</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="เลือกบัญชี" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {accountList.isFetching && (
                            <SelectItem value="loading" disabled>
                              กำลังโหลด...
                            </SelectItem>
                          )}
                          {accountList.data?.length === 0 && (
                            <SelectItem value="empty" disabled>
                              ไม่พบหมวดหมู่
                            </SelectItem>
                          )}
                          {!accountList.isFetching &&
                            accountList.data?.map((accountType) => (
                              <SelectGroup key={accountType.account_type_id}>
                                <SelectLabel>
                                  {accountType.account_type_name}
                                </SelectLabel>
                                {accountType.accounts.map((account) => (
                                  <SelectItem
                                    key={account.account_id}
                                    value={account.account_id}
                                  >
                                    <span>{account.account_name} : </span>
                                    <span>
                                      {numeral(account.net_balance).format(
                                        "0,0.00"
                                      )}{" "}
                                      บาท
                                    </span>
                                  </SelectItem>
                                ))}
                                <SelectSeparator />
                              </SelectGroup>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>หมวดหมู่</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="เลือกหมวดหมู่" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categoryList.isFetching && (
                            <SelectItem value="loading" disabled>
                              กำลังโหลด...
                            </SelectItem>
                          )}
                          {categoryList.data?.length === 0 && (
                            <SelectItem value="empty" disabled>
                              ไม่พบหมวดหมู่
                            </SelectItem>
                          )}
                          {!categoryList.isFetching &&
                            categoryList.data?.map((category) => (
                              <SelectItem
                                key={category.category_id}
                                value={category.category_id}
                              >
                                {category.category_name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="createdAt"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel className="text-left">วันที่</FormLabel>
                      <Popover>
                        <FormControl>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "flex justify-start font-normal w-full",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                dayjs(field.value).format("YYYY-MM-DD HH:mm")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                        </FormControl>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(value) => {
                              const date = dayjs(value)
                                .hour(field.value.getHours())
                                .minute(field.value.getMinutes())
                                .toDate();
                              field.onChange(date);
                            }}
                          />
                          <div className="p-3 border-t border-border">
                            <TimePicker
                              setDate={field.onChange}
                              date={field.value}
                            />
                          </div>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter className="sm:justify-between gap-4 pt-4 ">
                <Button className="bg-sky-600" type="submit">
                  บันทึก
                </Button>
                <Button type="reset" onClick={() => setDialog(false)}>
                  ยกเลิก
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
