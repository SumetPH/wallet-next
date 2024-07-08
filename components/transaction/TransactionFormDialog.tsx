"use client";

import CurrencyInput from "react-currency-input-field";
import dayjs from "dayjs";
import React, { useState } from "react";
import useAccountList from "@/services/account/useAccountList";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { TimePicker } from "../ui/time-picker/time-picker";
import { Transaction } from "@/services/transaction/useTransactionList";
import { useForm } from "react-hook-form";
import { useToast } from "../ui/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  DialogHeader,
  DialogFooter,
  DialogContent,
  DialogTitle,
  DialogDescription,
  Dialog,
} from "../ui/dialog";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import useCategoryList, {
  CategoryType,
} from "@/services/category/useCategoryList";

type Props = {
  // eslint-disable-next-line no-unused-vars
  children: ({ openDialog }: { openDialog: () => void }) => React.ReactNode;
  transaction?: Transaction;
  mode: "create" | "edit";
  categoryType: CategoryType;
  onSuccess?: () => void;
};

const schema = z.object({
  transactionAmount: z
    .string({ required_error: "กรุณากรอกจํานวนเงิน" })
    .min(1, { message: "กรุณากรอกจํานวนเงิน" })
    .regex(/^\d+(\.\d{2})?$/, {
      message: "รูปแบบจำนวนเงินไม่ถูกต้อง",
    }),
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
  children,
  transaction,
  mode,
  categoryType,
}: Props) {
  const [dialog, setDialog] = useState(false);
  const { toast } = useToast();
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      transactionAmount: transaction?.transaction_amount,
      accountId: transaction?.account_id,
      categoryId: transaction?.category_id,
      transactionNote: transaction?.transaction_note || "",
      createdAt: transaction?.transaction_created_at
        ? dayjs(transaction.transaction_created_at).toDate()
        : dayjs().toDate(),
    },
  });

  const accountList = useAccountList({
    enable: dialog,
  });

  const categoryList = useCategoryList({
    enable: dialog,
    categoryType: categoryType,
  });

  const openDialog = () => {
    setDialog(true);
  };

  const submit = (data: FormData) => {
    if (mode === "create") {
      createTransaction(data);
    } else {
      updateAccount(data);
    }
  };

  const createTransaction = async (data: FormData) => {
    console.log("🚀 ~ createTransaction ~ data:", data);
    try {
      // const res = await axiosWithToken({
      //   url: "/transaction-create",
      //   method: "POST",
      //   data: {
      //     account_id: [...data.accountId][0],
      //     category_id: [...data.categoryId][0],
      //     transaction_amount: data.transactionAmount,
      //     transaction_note: data.transactionNote,
      //     transaction_created_at: dayjs(data.createdAt).format(
      //       "YYYY-MM-DD HH:mm:ss"
      //     ),
      //   },
      // });
      // if (res.status === 200) {
      //   toast({
      //     title: "บันทึกสําเร็จ",
      //   });
      //   form.reset();
      //   setDialog(false);
      //   if (onSuccess) onSuccess();
      // }
    } catch (error) {
      console.error(error);
      toast({
        title: "บันทึกไม่สําเร็จ",
        variant: "destructive",
      });
    }
  };

  const updateAccount = async (data: FormData) => {
    console.log("🚀 ~ updateAccount ~ data:", data);
    try {
      // const res = await axiosWithToken({
      //   url: "/transaction-update",
      //   method: "PUT",
      //   data: {
      //     transaction_id: transaction?.transaction_id,
      //     account_id: [...data.accountId][0],
      //     category_id: [...data.categoryId][0],
      //     transaction_amount: data.transactionAmount,
      //     transaction_note: data.transactionNote,
      //     transaction_created_at: dayjs(data.createdAt).format(
      //       "YYYY-MM-DD HH:mm:ss"
      //     ),
      //   },
      // });
      // if (res.status === 200) {
      //   toast({
      //     title: "บันทึกสําเร็จ",
      //   });
      //   form.reset();
      //   setDialog(false);
      //   if (onSuccess) onSuccess();
      // }
    } catch (error) {
      console.error(error);
      toast({
        title: "บันทึกไม่สําเร็จ",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      {children({ openDialog })}

      <Dialog open={dialog} onOpenChange={(value) => setDialog(value)}>
        <DialogContent
          onEscapeKeyDown={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(submit)}>
              <DialogHeader>
                <DialogTitle className="mb-4">
                  {categoryType === CategoryType.expense ? (
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
                          defaultValue={field.value}
                          decimalsLimit={2}
                          onValueChange={(value) => field.onChange(value)}
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
                          {accountList.isLoading && (
                            <SelectItem value="loading" disabled>
                              กำลังโหลด...
                            </SelectItem>
                          )}
                          {accountList.data?.length === 0 && (
                            <SelectItem value="empty" disabled>
                              ไม่พบหมวดหมู่
                            </SelectItem>
                          )}
                          {accountList.data?.map((accountType) => (
                            <SelectGroup key={accountType.account_type_id}>
                              <SelectLabel>
                                {accountType.account_type_name}
                              </SelectLabel>
                              {accountType.accounts.map((account) => (
                                <SelectItem
                                  key={account.account_id}
                                  value={account.account_id}
                                >
                                  {account.account_name}
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
                          {categoryList.isLoading && (
                            <SelectItem value="loading" disabled>
                              กำลังโหลด...
                            </SelectItem>
                          )}
                          {categoryList.data?.length === 0 && (
                            <SelectItem value="empty" disabled>
                              ไม่พบหมวดหมู่
                            </SelectItem>
                          )}
                          {categoryList.data?.map((category) => (
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
                    <FormItem className="mb-4 flex flex-col">
                      <FormLabel className="text-left">วันที่</FormLabel>
                      <Popover>
                        <FormControl>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "justify-start text-left font-normal",
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
                <Button type="submit">บันทึก</Button>
                <Button
                  type="reset"
                  className="bg-red-500"
                  onClick={() => setDialog(false)}
                >
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
