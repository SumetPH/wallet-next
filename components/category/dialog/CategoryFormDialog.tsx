import React, { useCallback, useEffect } from "react";
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
import { useForm } from "react-hook-form";
import dayjs from "dayjs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { TimePicker } from "@/components/ui/time-picker/time-picker";
import { toast } from "@/components/ui/use-toast";
import useLoadingStore from "@/stores/useLoading";
import { Category } from "@/services/category/useCategoryList";
import useCategoryTypeList from "@/services/categoryType/useCategoryType";

type Props = {
  dialog: boolean;
  setDialog: React.Dispatch<React.SetStateAction<boolean>>;
  category?: Category;
  mode: "create" | "edit";
  onSuccess?: () => void;
};

const schema = z.object({
  categoryName: z
    .string({ required_error: "กรุณากรอกชื่อหมวดหมู่" })
    .min(1, { message: "กรุณากรอกชื่อหมวดหมู่" }),
  categoryTypeId: z
    .string({ required_error: "กรุณาเลือกประเภทหมวดหมู่" })
    .min(1, { message: "กรุณาเลือกประเภทหมวดหมู่" }),
  date: z.date({ required_error: "กรุณาเลือกวันที่" }),
});

type FormData = z.infer<typeof schema>;

export default function CategoryFormDialog({
  dialog,
  setDialog,
  mode,
  category,
  onSuccess,
}: Props) {
  const { setIsLoading } = useLoadingStore();
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      categoryName: "",
      categoryTypeId: "",
      date: dayjs().toDate(),
    },
  });

  const categoryTypeList = useCategoryTypeList({ enable: dialog });

  useEffect(() => {
    if (dialog && categoryTypeList.data) {
      if (mode === "create") {
        form.setValue("date", dayjs().toDate());
      }

      if (category && mode === "edit") {
        form.setValue("categoryName", category.category_name);
        form.setValue("categoryTypeId", category.category_type_id);
        form.setValue("date", dayjs(category.category_date).toDate());
      }
    }
  }, [category, categoryTypeList.data, dialog, form, mode]);

  const submit = (data: FormData) => {
    if (mode === "create") {
      createCategory(data);
    } else {
      updateCategory(data);
    }
  };

  const createCategory = async (data: FormData) => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/v1/category-create", {
        method: "POST",
        body: JSON.stringify({
          category_name: data.categoryName,
          category_type_id: data.categoryTypeId,
          category_date: dayjs(data.date).format("YYYY-MM-DD HH:mm:ss"),
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

  const updateCategory = async (data: FormData) => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/v1/category-update", {
        method: "PATCH",
        body: JSON.stringify({
          category_id: category!.category_id,
          category_name: data.categoryName,
          category_type_id: data.categoryTypeId,
          category_date: dayjs(data.date).format("YYYY-MM-DD HH:mm:ss"),
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
                <DialogTitle className="mb-4" data-testid="dialog-title">
                  {mode === "create" ? "เพิ่มหมวดหมู่" : "แก้ไขหมวดหมู่"}
                </DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>
              <div>
                <FormField
                  control={form.control}
                  name="categoryName"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>ชื่อบัญชี</FormLabel>
                      <FormControl>
                        <Input
                          data-testid="input-category-name"
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="ชื่อหมวดหมู่"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categoryTypeId"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>ประเภทบัญชี</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger data-testid="select-category-type">
                            <SelectValue placeholder="เลือกประเภทหมวดหมู่" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {!categoryTypeList.data &&
                            categoryTypeList.isFetching && (
                              <SelectItem value="loading" disabled>
                                กำลังโหลด...
                              </SelectItem>
                            )}
                          {categoryTypeList.data &&
                            categoryTypeList.data.length === 0 && (
                              <SelectItem value="empty" disabled>
                                ไม่พบหมวดหมู่
                              </SelectItem>
                            )}
                          {categoryTypeList.data &&
                            categoryTypeList.data.map((categoryType) => (
                              <SelectItem
                                key={categoryType.category_type_id}
                                value={categoryType.category_type_id}
                              >
                                {categoryType.category_type_name}
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
                  name="date"
                  render={({ field }) => (
                    <FormItem className="mb-4 ">
                      <FormLabel className="text-left">วันที่</FormLabel>
                      <Popover>
                        <FormControl>
                          <PopoverTrigger asChild data-testid="date-picker">
                            <Button
                              className={cn(
                                "flex justify-start font-normal w-full",
                                !field.value && "text-muted-foreground"
                              )}
                              variant="outline"
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
                <Button
                  data-testid="button-submit"
                  className="bg-sky-600"
                  type="submit"
                >
                  บันทึก
                </Button>
                <Button
                  data-testid="button-cancel"
                  type="reset"
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
