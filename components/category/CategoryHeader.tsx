import React, { useState } from "react";
import CategoryFormDialog from "@/components/category/dialog/CategoryFormDialog";
import { Ellipsis } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = {
  onSuccess: () => void;
};

export default function CategoryHeader({ onSuccess }: Props) {
  const [isShowFormDialog, setIsShowFormDialog] = useState(false);

  return (
    <>
      <CategoryFormDialog
        dialog={isShowFormDialog}
        setDialog={setIsShowFormDialog}
        mode="create"
        onSuccess={onSuccess}
      />

      <div className="flex justify-between gap-2 mb-2">
        <section className="text-lg font-medium">หมวดหมู่</section>
        <section>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Ellipsis />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setIsShowFormDialog(true);
                }}
              >
                เพิ่มหมวดหมู่
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </section>
      </div>
    </>
  );
}
