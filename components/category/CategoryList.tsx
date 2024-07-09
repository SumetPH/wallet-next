import React from "react";
import { useRouter } from "next/navigation";
import numeral from "numeral";
import { Category } from "@/services/category/useCategoryList";
import SkeletonLoading from "../SkeletonLoading";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import CategoryDeleteAlert from "./CategoryDeleteAlert";

type Props = {
  categoryList: Category[];
  isLoading: boolean;
  onSuccess: () => void;
};

export default function CategoryList({
  categoryList,
  isLoading,
  onSuccess,
}: Props) {
  const router = useRouter();

  return (
    <>
      <SkeletonLoading isLoading={isLoading} dataLength={categoryList.length} />

      {categoryList.map((category) => (
        <CategoryDeleteAlert
          key={category.category_id}
          category={category}
          onSuccess={onSuccess}
        >
          {({ openAlert: openAlertDelete }) => (
            <div
              className="p-2 border-b last:border-none flex justify-between items-center cursor-pointer"
              onClick={() => router.push(`/category/${category.category_id}`)}
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
                        // openAlertDelete();
                      }}
                    >
                      แก้ไข
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        openAlertDelete();
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
          )}
        </CategoryDeleteAlert>
      ))}
    </>
  );
}
