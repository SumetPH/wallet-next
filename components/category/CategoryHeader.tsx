import React, { useRef } from "react";
import { MdOutlineMoreHoriz } from "react-icons/md";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { CategoryFormModal, CategoryFormModalRef } from "./CategoryFormModal";

export default function CategoryHeader() {
  const categoryFormModalRef = useRef<CategoryFormModalRef>(null);

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

      <CategoryFormModal ref={categoryFormModalRef} />
    </>
  );
}
