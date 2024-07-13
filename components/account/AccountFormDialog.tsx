import { Account } from "@/services/account/useAccountList";
import React, { useState } from "react";
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
  SelectItem,
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
import { useForm } from "react-hook-form";
import dayjs from "dayjs";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import useAccountTypeList from "@/services/accountType/useAccountTypeList";
import CurrencyInput from "react-currency-input-field";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import { TimePicker } from "../ui/time-picker/time-picker";
import { toast } from "../ui/use-toast";
import useLoadingStore from "@/stores/useLoading";

type Props = {
  children: ({ openDialog }: { openDialog: () => void }) => React.ReactNode;
  account?: Account;
  mode: "create" | "edit";
  onSuccess?: () => void;
};

const schema = z.object({
  accountName: z
    .string({ required_error: "กรุณากรอกชื่อบัญชี" })
    .min(1, { message: "กรุณากรอกชื่อบัญชี" }),
  accountTypeId: z
    .string({ required_error: "กรุณาเลือกประเภทบัญชี" })
    .min(1, { message: "กรุณาเลือกประเภทบัญชี" }),
  balance: z
    .string({ required_error: "กรุณากรอกจํานวนเงิน" })
    .min(1, { message: "กรุณากรอกจํานวนเงิน" }),
  createdAt: z.date({ required_error: "กรุณาเลือกวันที่" }),
});

type FormData = z.infer<typeof schema>;

export default function AccountFormDialog({
  children,
  mode,
  account,
  onSuccess,
}: Props) {
  const [dialog, setDialog] = useState(false);
  const { setIsLoading } = useLoadingStore();
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      accountName: "",
      accountTypeId: "",
      balance: "",
      createdAt: dayjs().toDate(),
    },
  });

  const accountTypeList = useAccountTypeList({ enable: dialog });

  const openDialog = () => {
    setDialog(true);

    if (account && mode === "edit") {
      form.setValue("accountName", account.account_name);
      form.setValue("accountTypeId", account.account_type_id);
      form.setValue("balance", account.account_balance);
      form.setValue("createdAt", dayjs(account.account_date).toDate());
    }
  };

  const submit = (data: FormData) => {
    if (mode === "create") {
      createAccount(data);
    } else {
      updateAccount(data);
    }
  };

  const createAccount = async (data: FormData) => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/v1/account-create", {
        method: "POST",
        body: JSON.stringify({
          account_name: data.accountName,
          account_type_id: data.accountTypeId,
          account_balance: data.balance,
          account_start_date: dayjs(data.createdAt).format(
            "YYYY-MM-DD HH:mm:ss"
          ),
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

  const updateAccount = async (data: FormData) => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/v1/account-update", {
        method: "PUT",
        body: JSON.stringify({
          account_id: account!.account_id,
          account_name: data.accountName,
          account_type_id: data.accountTypeId,
          account_balance: data.balance,
          account_start_date: dayjs(data.createdAt).format(
            "YYYY-MM-DD HH:mm:ss"
          ),
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
      {children({ openDialog })}
      <Dialog open={dialog} onOpenChange={(value) => setDialog(value)}>
        <DialogContent
          onEscapeKeyDown={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(submit)}>
              <DialogHeader>
                <DialogTitle className="mb-4" data-testid="dialog-title">
                  {mode === "create" ? "เพิ่มบัญชี" : "แก้ไขบัญชี"}
                </DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>
              <div>
                <FormField
                  control={form.control}
                  name="accountName"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>ชื่อบัญชี</FormLabel>
                      <FormControl>
                        <Input
                          data-testid="input-account-name"
                          defaultValue={field.value}
                          onChange={field.onChange}
                          placeholder="ชื่อบัญชี"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="accountTypeId"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>ประเภทบัญชี</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger data-testid="select-account-type">
                            <SelectValue placeholder="เลือกประเภทบัญชี" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {accountTypeList.isFetching && (
                            <SelectItem value="loading" disabled>
                              กำลังโหลด...
                            </SelectItem>
                          )}
                          {accountTypeList.data?.length === 0 && (
                            <SelectItem value="empty" disabled>
                              ไม่พบหมวดหมู่
                            </SelectItem>
                          )}
                          {accountTypeList.data?.map((accountType) => (
                            <SelectItem
                              key={accountType.account_type_id}
                              value={accountType.account_type_id}
                            >
                              {accountType.account_type_name}
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
                  name="balance"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>ยอดเริ่มต้น</FormLabel>
                      <FormControl>
                        <CurrencyInput
                          data-testid="input-account-balance"
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
                  name="createdAt"
                  render={({ field }) => (
                    <FormItem className="mb-4 flex flex-col">
                      <FormLabel className="text-left">วันที่</FormLabel>
                      <Popover>
                        <FormControl>
                          <PopoverTrigger asChild data-testid="date-picker">
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
                <Button data-testid="button-submit" type="submit">
                  บันทึก
                </Button>
                <Button
                  data-testid="button-cancel"
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
