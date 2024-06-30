"use client";

import React, { forwardRef, useImperativeHandle } from "react";
import dayjs from "dayjs";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Select,
  SelectItem,
  DatePicker,
} from "@nextui-org/react";
import { I18nProvider } from "@react-aria/i18n";
import { parseAbsoluteToLocal } from "@internationalized/date";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { axiosWithToken } from "@/services/axiosWithToken";
import { Category } from "@/services/category/useCategoryList";

const schema = z.object({
  categoryName: z.string().min(1, { message: "กรุณากรอกชื่อหมวดหมู่" }),
  categoryTypeId: z
    .set(z.string())
    .min(1, { message: "กรุณาเลือกประเภทหมวดหมู่" }),
  startDate: z.string().datetime(),
});

type FormData = z.infer<typeof schema>;

type Props = {
  category?: Category;
  mode?: "create" | "edit";
};

export type CategoryFormModalRef = {
  openModal: () => void;
};

export const CategoryFormModal = forwardRef<CategoryFormModalRef, Props>(
  ({ category, mode = "create" }, ref) => {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    const openModal = () => {
      form.reset({
        categoryName: category?.category_name || "",
        categoryTypeId: category?.category_type_id
          ? new Set([category?.category_type_id])
          : new Set([]),
        startDate: category?.category_created_at
          ? new Date(category?.category_created_at).toISOString()
          : new Date().toISOString(),
      });
      onOpen();
    };

    useImperativeHandle(ref, () => ({
      openModal,
    }));

    const form = useForm<FormData>({
      resolver: zodResolver(schema),
    });

    const categoryTypeList = [
      { id: "1", name: "รายจ่าย" },
      { id: "2", name: "รายรับ" },
    ];

    const submit = (data: FormData) => {
      if (mode === "create") {
        // createAccount(data);
      } else {
        // updateAccount(data);
      }
    };

    // const createAccount = async (data: FormData) => {
    //   try {
    //     const res = await axiosWithToken({
    //       url: "/account-create",
    //       method: "POST",
    //       data: {
    //         account_name: data.accountName,
    //         account_type_id: [...data.accountTypeId][0],
    //         account_balance: data.balance,
    //         account_start_date: dayjs(data.startDate).format(
    //           "YYYY-MM-DD HH:mm:ss"
    //         ),
    //       },
    //     });
    //     if (res.status === 200) {
    //       onOpenChange();
    //     }
    //   } catch (error) {
    //     console.error(error);
    //   }
    // };

    // const updateAccount = async (data: FormData) => {
    //   try {
    //     const res = await axiosWithToken({
    //       url: "/account-update",
    //       method: "PUT",
    //       data: {
    //         account_id: account?.account_id,
    //         account_name: data.accountName,
    //         account_type_id: [...data.accountTypeId][0],
    //         account_balance: data.balance,
    //         account_start_date: dayjs(data.startDate).format(
    //           "YYYY-MM-DD HH:mm:ss"
    //         ),
    //       },
    //     });
    //     if (res.status === 200) {
    //       onOpenChange();
    //     }
    //   } catch (error) {
    //     console.error(error);
    //   }
    // };

    return (
      <>
        <Modal
          className="overflow-visible"
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          isDismissable={false}
          hideCloseButton
        >
          <ModalContent>
            {(onClose) => (
              <form onSubmit={form.handleSubmit(submit)}>
                <ModalHeader className="flex flex-col gap-1">
                  เพิ่มหมวดหมู่ใหม่
                </ModalHeader>
                <ModalBody>
                  <Input
                    {...form.register("categoryName")}
                    type="text"
                    label="ชื่อหมวดหมู่"
                    isInvalid={
                      form.formState.errors.categoryName?.message ? true : false
                    }
                    errorMessage={form.formState.errors.categoryName?.message}
                  />

                  <Controller
                    control={form.control}
                    name="categoryTypeId"
                    render={({ field, formState }) => (
                      <Select
                        label="ชนิดหมวดหมู่"
                        placeholder="เลือก"
                        items={categoryTypeList ?? []}
                        selectionMode="single"
                        selectedKeys={field.value}
                        onSelectionChange={field.onChange}
                        // isLoading={accountTypeList.isLoading}
                        isInvalid={
                          form.formState.errors.categoryTypeId?.message
                            ? true
                            : false
                        }
                        errorMessage={
                          form.formState.errors.categoryTypeId?.message
                        }
                      >
                        {(item) => (
                          <SelectItem key={item.id}>{item.name}</SelectItem>
                        )}
                      </Select>
                    )}
                  />

                  <Controller
                    control={form.control}
                    name="startDate"
                    render={({ field, formState }) => (
                      <I18nProvider locale="en-UK">
                        <DatePicker
                          label="วันเริ่มต้น"
                          hideTimeZone
                          hourCycle={24}
                          value={parseAbsoluteToLocal(field.value)}
                          onChange={(value) =>
                            field.onChange(value.toAbsoluteString())
                          }
                          onKeyDown={(e) => e.preventDefault()}
                        />
                      </I18nProvider>
                    )}
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    ยกเลิก
                  </Button>
                  <Button type="submit" color="primary">
                    บันทึก
                  </Button>
                </ModalFooter>
              </form>
            )}
          </ModalContent>
        </Modal>
      </>
    );
  }
);

CategoryFormModal.displayName = "CategoryFormModal";
