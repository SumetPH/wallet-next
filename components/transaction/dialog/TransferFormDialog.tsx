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
import { toast } from "@/components/ui/use-toast";
import useLoadingStore from "@/stores/useLoading";
import numeral from "numeral";

type Props = {
  dialog: boolean;
  setDialog: React.Dispatch<React.SetStateAction<boolean>>;
  mode: "create" | "edit";
  transaction?: Transaction;
  onSuccess?: () => void;
};

const schema = z.object({
  transferAmount: z
    .string({ required_error: "กรุณากรอกจํานวนเงิน" })
    .min(1, { message: "กรุณากรอกจํานวนเงิน" }),
  transferNote: z.string().optional(),
  transferDate: z.date({ required_error: "กรุณาเลือกวันที่" }),
  transferFromAccountId: z
    .string({ required_error: "กรุณาเลือกบัญชีต้นทาง" })
    .min(1, { message: "กรุณาเลือกบัญชีต้นทาง" }),
  transferToAccountId: z
    .string({ required_error: "กรุณาเลือกบัญชีปลายทาง" })
    .min(1, { message: "กรุณาเลือกบัญชีปลายทาง" }),
});

type FormData = z.infer<typeof schema>;

export default function TransferFormDialog({
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
      transferAmount: "",
      transferNote: "",
      transferDate: dayjs().toDate(),
      transferFromAccountId: "",
      transferToAccountId: "",
    },
  });

  const accountList = useAccountList({
    enable: dialog,
  });

  useEffect(() => {
    if (dialog && accountList.data) {
      if (mode === "create") {
        form.setValue("transferDate", dayjs().toDate());
      }

      if (transaction && mode === "edit") {
        form.setValue("transferAmount", transaction.transfer_amount ?? "");
        form.setValue("transferNote", transaction.transfer_note ?? "");
        form.setValue(
          "transferDate",
          dayjs(transaction.transfer_date).toDate()
        );
        form.setValue(
          "transferFromAccountId",
          transaction.transfer_from_account_id ?? ""
        );
        form.setValue(
          "transferToAccountId",
          transaction.transfer_to_account_id ?? ""
        );
      }
    }
  }, [accountList.data, dialog, form, mode, transaction]);

  const submit = (data: FormData) => {
    if (mode === "create") {
      createTransfer(data);
    } else {
      updateTransfer(data);
    }
  };

  const createTransfer = async (data: FormData) => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/v1/transfer-create", {
        method: "POST",
        body: JSON.stringify({
          transfer_amount: data.transferAmount,
          transfer_note: data.transferNote,
          transfer_date: dayjs(data.transferDate).format("YYYY-MM-DD HH:mm:ss"),
          transfer_from_account_id: data.transferFromAccountId,
          transfer_to_account_id: data.transferToAccountId,
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

  const updateTransfer = async (data: FormData) => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/v1/transfer-update", {
        method: "PATCH",
        body: JSON.stringify({
          transfer_id: transaction?.transfer_id,
          transfer_amount: data.transferAmount,
          transfer_note: data.transferNote,
          transfer_date: dayjs(data.transferDate).format("YYYY-MM-DD HH:mm:ss"),
          transfer_from_account_id: data.transferFromAccountId,
          transfer_to_account_id: data.transferToAccountId,
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
                <DialogTitle className="mb-4">โอนเงิน</DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>
              <div>
                <FormField
                  control={form.control}
                  name="transferAmount"
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
                  name="transferFromAccountId"
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
                                      form.watch("transferToAccountId")
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
                  name="transferToAccountId"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>บัญชีปลายทาง</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
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
                                      form.watch("transferFromAccountId")
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
                  name="transferDate"
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
