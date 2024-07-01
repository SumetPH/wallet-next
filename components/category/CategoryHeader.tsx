import React, { useRef } from "react";
import { MdOutlineMoreHoriz } from "react-icons/md";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { CategoryFormModal, CategoryFormModalRef } from "./CategoryFormModal";
import { useQueryClient } from "@tanstack/react-query";

export default function CategoryHeader() {
  const categoryFormModalRef = useRef<CategoryFormModalRef>(null);
  const queryClient = useQueryClient();

  return (
    <>
      <div className="flex justify-between gap-2 mb-2">
        <section className="text-lg font-medium">หมวดหมู่</section>
        <section>
          <Dropdown>
            <DropdownTrigger>
              <button>
                <MdOutlineMoreHoriz size={24} />
              </button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem
                key="accountAdd"
                onPress={() => categoryFormModalRef.current?.openModal()}
              >
                เพิ่มหมวดหมู่
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </section>
      </div>

      <CategoryFormModal
        ref={categoryFormModalRef}
        onUpdated={() =>
          queryClient.invalidateQueries({ queryKey: ["/category-list"] })
        }
      />
    </>
  );
}
