"use client";

import CurrencyInput from "react-currency-input-field";
import dayjs from "dayjs";
import React, { useCallback, useEffect } from "react";
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
import { toast } from "@/components/ui/use-toast";
import useLoadingStore from "@/stores/useLoading";
import numeral from "numeral";
import useCategoryList from "@/services/category/useCategoryList";
import { CategoryType } from "@/services/categoryType/useCategoryTypeList";

type Props = {
  dialog: boolean;
  setDialog: React.Dispatch<React.SetStateAction<boolean>>;
  mode: "create" | "edit";
  transaction?: Transaction;
  onSuccess?: () => void;
};

const schema = z.object({
  debtPaymentAmount: z
    .string({ required_error: "กรุณากรอกจํานวนเงิน" })
    .min(1, { message: "กรุณากรอกจํานวนเงิน" }),
  debtPaymentNote: z.string().optional(),
  debtPaymentDate: z.date({ required_error: "กรุณาเลือกวันที่" }),
  debtPaymentFromAccountId: z
    .string({ required_error: "กรุณาเลือกบัญชีต้นทาง" })
    .min(1, { message: "กรุณาเลือกบัญชีต้นทาง" }),
  debtPaymentToAccountId: z
    .string({ required_error: "กรุณาเลือกบัญชีปลายทาง" })
    .min(1, { message: "กรุณาเลือกบัญชีปลายทาง" }),
  categoryId: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function DebtPaymentFormDialog({
  dialog,
  setDialog,
  mode,
  transaction,
  onSuccess,
}: Props) {
  const { setIsLoading } = useLoadingStore();
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      debtPaymentAmount: "",
      debtPaymentNote: "",
      debtPaymentDate: dayjs().toDate(),
      debtPaymentFromAccountId: "",
      debtPaymentToAccountId: "",
    },
  });

  const accountList = useAccountList({
    enable: dialog,
  });

  const categoryList = useCategoryList({
    enable: dialog,
    categoryType: CategoryType.expense,
  });

  useEffect(() => {
    if (dialog && accountList.data && categoryList.data) {
      if (mode === "create") {
        form.setValue("debtPaymentDate", dayjs().toDate());
      }

      if (transaction && mode === "edit") {
        form.setValue(
          "debtPaymentAmount",
          transaction.debt_payment_amount ?? ""
        );
        form.setValue("debtPaymentNote", transaction.debt_payment_note ?? "");
        form.setValue(
          "debtPaymentDate",
          dayjs(transaction.debt_payment_date).toDate()
        );
        form.setValue(
          "debtPaymentFromAccountId",
          transaction.debt_payment_from_account_id ?? ""
        );
        form.setValue(
          "debtPaymentToAccountId",
          transaction.debt_payment_to_account_id ?? ""
        );
        form.setValue("categoryId", transaction.category_id ?? undefined);
      }
    }
  }, [accountList.data, categoryList.data, dialog, form, mode, transaction]);

  const submit = (data: FormData) => {
    if (mode === "create") {
      createDebtPayment(data);
    } else {
      updateDebtPayment(data);
    }
  };

  const createDebtPayment = async (data: FormData) => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/v1/debt-payment-create", {
        method: "POST",
        body: JSON.stringify({
          debt_payment_amount: data.debtPaymentAmount,
          debt_payment_note: data.debtPaymentNote,
          debt_payment_date: dayjs(data.debtPaymentDate).format(
            "YYYY-MM-DD HH:mm:ss"
          ),
          debt_payment_from_account_id: data.debtPaymentFromAccountId,
          debt_payment_to_account_id: data.debtPaymentToAccountId,
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

  const updateDebtPayment = async (data: FormData) => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/v1/debt-payment-update", {
        method: "PATCH",
        body: JSON.stringify({
          debt_payment_id: transaction?.debt_payment_id,
          debt_payment_amount: data.debtPaymentAmount,
          debt_payment_note: data.debtPaymentNote,
          debt_payment_date: dayjs(data.debtPaymentDate).format(
            "YYYY-MM-DD HH:mm:ss"
          ),
          debt_payment_from_account_id: data.debtPaymentFromAccountId,
          debt_payment_to_account_id: data.debtPaymentToAccountId,
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
                <DialogTitle className="mb-4">ชําระหนี้</DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>
              <div>
                <FormField
                  control={form.control}
                  name="debtPaymentAmount"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>จํานวน</FormLabel>
                      <FormControl>
                        <CurrencyInput
                          placeholder="จํานวน"
                          className="input-currency"
                          decimalsLimit={2}
                          allowNegativeValue={false}
                          value={field.value}
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
                  name="debtPaymentFromAccountId"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>บัญชีต้นทาง</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="เลือกบัญชี" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {!accountList.data && accountList.isFetching && (
                            <SelectItem value="loading" disabled>
                              กำลังโหลด...
                            </SelectItem>
                          )}
                          {accountList.data &&
                            accountList.data.length === 0 && (
                              <SelectItem value="empty" disabled>
                                ไม่พบหมวดหมู่
                              </SelectItem>
                            )}
                          {accountList.data &&
                            accountList.data.map((accountType) => (
                              <SelectGroup key={accountType.account_type_id}>
                                <SelectLabel>
                                  {accountType.account_type_name}
                                </SelectLabel>
                                {accountType.accounts.map((account) => (
                                  <SelectItem
                                    key={account.account_id}
                                    value={account.account_id}
                                    disabled={
                                      account.account_id ===
                                      form.watch("debtPaymentToAccountId")
                                    }
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
                  name="debtPaymentToAccountId"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>บัญชีปลายทาง</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="เลือกบัญชี" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {!accountList.data && accountList.isFetching && (
                            <SelectItem value="loading" disabled>
                              กำลังโหลด...
                            </SelectItem>
                          )}
                          {accountList.data &&
                            accountList.data.length === 0 && (
                              <SelectItem value="empty" disabled>
                                ไม่พบหมวดหมู่
                              </SelectItem>
                            )}
                          {accountList.data &&
                            accountList.data.map((accountType) => (
                              <SelectGroup key={accountType.account_type_id}>
                                <SelectLabel>
                                  {accountType.account_type_name}
                                </SelectLabel>
                                {accountType.accounts.map((account) => (
                                  <SelectItem
                                    key={account.account_id}
                                    value={account.account_id}
                                    disabled={
                                      account.account_id ===
                                      form.watch("debtPaymentFromAccountId")
                                    }
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
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="เลือกหมวดหมู่" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {!categoryList.data && categoryList.isFetching && (
                            <SelectItem value="loading" disabled>
                              กำลังโหลด...
                            </SelectItem>
                          )}
                          {categoryList.data &&
                            categoryList.data.length === 0 && (
                              <SelectItem value="empty" disabled>
                                ไม่พบหมวดหมู่
                              </SelectItem>
                            )}
                          {categoryList.data &&
                            categoryList.data.map((category) => (
                              <SelectItem
                                key={category.category_id}
                                value={category.category_id}
                              >
                                <span>{category.category_name}</span>
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
                  name="debtPaymentDate"
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
