import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import clsx from "clsx";
import React, { useRef } from "react";
import { MdOutlineMoreVert } from "react-icons/md";
import { useRouter } from "next/navigation";
import numeral from "numeral";
import { Category } from "@/services/category/useCategoryList";
import { CategoryFormModal, CategoryFormModalRef } from "./CategoryFormModal";
import {
  CategoryDeleteModal,
  CategoryDeleteModalRef,
} from "./CategoryDeleteModal";

type Props = {
  category: Category;
  amountColor?: string;
  onUpdated?: () => void;
};

export default function CategoryRow({
  category,
  amountColor,
  onUpdated,
}: Props) {
  const router = useRouter();
  const categoryFormModalRef = useRef<CategoryFormModalRef>(null);
  const categoryDeleteModalRef = useRef<CategoryDeleteModalRef>(null);

  return (
    <>
      <CategoryFormModal
        ref={categoryFormModalRef}
        category={category}
        mode="edit"
        onUpdated={onUpdated}
      />

      <CategoryDeleteModal
        ref={categoryDeleteModalRef}
        category={category}
        onUpdated={onUpdated}
      />

      <div
        key={category.category_id}
        className="p-2 border-b last:border-none flex justify-between items-center cursor-pointer"
        onClick={() => router.push(`/category/${category.category_id}`)}
      >
        <div className="flex gap-3 items-center">
          <Avatar name={category.category_name} />
          <div>
            <section>{category.category_name}</section>
            <section className={clsx("font-medium", amountColor)}>
              {numeral(category?.total).format("0,0.00")} บาท
              <br />
            </section>
          </div>
        </div>
        <div>
          <Dropdown>
            <DropdownTrigger>
              <button>
                <MdOutlineMoreVert />
              </button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem
                color="primary"
                onPress={() => categoryFormModalRef.current?.openModal()}
              >
                แก้ไข
              </DropdownItem>
              <DropdownItem
                className="text-danger"
                color="danger"
                onPress={() => categoryDeleteModalRef.current?.openModal()}
              >
                ลบ
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </>
  );
}
