"use client";

import CurrencyInput from "react-currency-input-field";
import dayjs from "dayjs";
import React, { useCallback, useEffect } from "react";
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
  SelectItem,
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
import { BudgetList } from "@/services/budget/useBudgetList";
import { CategoryType } from "@/services/categoryType/useCategoryTypeList";
import { Input } from "@/components/ui/input";

type Props = {
  dialog: boolean;
  setDialog: React.Dispatch<React.SetStateAction<boolean>>;
  mode: "create" | "edit";
  budget?: BudgetList;
  onSuccess?: () => void;
};

const schema = z.object({
  budgetName: z
    .string({ required_error: "กรุณากรอกชื่องบประมาณ" })
    .min(1, { message: "กรุณากรอกชื่องบประมาณ" }),
  budgetAmount: z
    .string({ required_error: "กรุณากรอกจํานวนเงิน" })
    .min(1, { message: "กรุณากรอกจํานวนเงิน" }),
  budgetDate: z.date({ required_error: "กรุณาเลือกวันที่" }),
  categoryId: z
    .string({ required_error: "กรุณาเลือกหมวดหมู่" })
    .min(1, { message: "กรุณาเลือกหมวดหมู่" }),
});

type FormData = z.infer<typeof schema>;

export default function BudgetFormDialog({
  dialog,
  setDialog,
  mode,
  budget,
  onSuccess,
}: Props) {
  const { setIsLoading } = useLoadingStore();
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      budgetName: "",
      budgetAmount: "",
      budgetDate: dayjs().toDate(),
      categoryId: "",
    },
  });

  const categoryList = useCategoryList({
    enable: dialog,
    categoryType: CategoryType.expense,
  });

  useEffect(() => {
    if (dialog && categoryList.data) {
      if (mode === "create") {
        form.setValue("budgetDate", dayjs().toDate());
      }

      if (budget && mode === "edit") {
        form.setValue("budgetName", budget.budget_name ?? "");
        form.setValue("budgetAmount", budget.budget_amount);
        form.setValue("categoryId", budget.category_id ?? "");
        form.setValue("budgetDate", dayjs(budget.budget_date).toDate());
      }
    }
  }, [budget, categoryList.data, dialog, form, mode]);

  const submit = (data: FormData) => {
    if (mode === "create") {
      createBudget(data);
    } else {
      updateBudget(data);
    }
  };

  const createBudget = async (data: FormData) => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/v1/budget-create", {
        method: "POST",
        body: JSON.stringify({
          budget_name: data.budgetName,
          budget_amount: data.budgetAmount,
          budget_date: dayjs(data.budgetDate).format("YYYY-MM-DD HH:mm:ss"),
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

  const updateBudget = async (data: FormData) => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/v1/budget-update", {
        method: "PATCH",
        body: JSON.stringify({
          budget_id: budget?.budget_id,
          budget_name: data.budgetName,
          budget_amount: data.budgetAmount,
          budget_date: dayjs(data.budgetDate).format("YYYY-MM-DD HH:mm:ss"),
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
                  <span>งบประมาณ</span>
                </DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>
              <div>
                <FormField
                  control={form.control}
                  name="budgetName"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>ชื่องบประมาณ</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="ชื่องบประมาณ"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="budgetAmount"
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
                  name="budgetDate"
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
