import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import numeral from "numeral";

import { Category } from "@/services/category/useCategoryList";
import { useRouter } from "next/navigation";
import CategoryDeleteAlert from "@/components/category/dialog/CategoryDeleteAlert";
import CategoryFormDialog from "@/components/category/dialog/CategoryFormDialog";

type Props = {
  category: Category;
  onSuccess: () => void;
};

export default function CategoryRow({ category, onSuccess }: Props) {
  const router = useRouter();

  const [isShowEditForm, setIsShowEditForm] = useState(false);
  const [isShowDeleteAlert, setIsShowDeleteAlert] = useState(false);

  return (
    <>
      <CategoryFormDialog
        dialog={isShowEditForm}
        setDialog={setIsShowEditForm}
        mode="edit"
        category={category}
        onSuccess={onSuccess}
      />

      <CategoryDeleteAlert
        alert={isShowDeleteAlert}
        setAlert={setIsShowDeleteAlert}
        category={category}
        onSuccess={onSuccess}
      />

      <div
        className="p-2 border-b last:border-none flex justify-between items-center cursor-pointer"
        onClick={() =>
          router.push(
            `/category/${category.category_id}?title=${category.category_name}`
          )
        }
      >
        <div className="flex gap-3 items-center">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <EllipsisVertical />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  setIsShowEditForm(true);
                }}
              >
                แก้ไข
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  setIsShowDeleteAlert(true);
                }}
              >
                ลบ
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Avatar>
            <AvatarFallback className="text-xs">
              {category.category_name}
            </AvatarFallback>
          </Avatar>
          <div>
            <section>{category.category_name}</section>
            <section
              className={cn(
                "font-medium",
                category.category_type_id === "1"
                  ? "text-red-600"
                  : "text-green-600"
              )}
            >
              {numeral(category.total).format("0,0.00")} บาท
              <br />
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
