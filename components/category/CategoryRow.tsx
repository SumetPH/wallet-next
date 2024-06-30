import { Account } from "@/services/account/useAccountList";
import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import clsx from "clsx";
import React, { useRef } from "react";
import {
  AccountDeleteModal,
  AccountDeleteModalRef,
} from "@/components/account/AccountDeleteModal";
import { MdOutlineMoreVert } from "react-icons/md";
import { AccountFormModalRef } from "@/components/account/AccountFormModal";
import { AccountFormModal } from "@/components/account/AccountFormModal";
import { useRouter } from "next/navigation";
import numeral from "numeral";
import { Category } from "@/services/category/useCategoryList";

type Props = {
  category: Category;
  amountColor?: string;
};

export default function CategoryRow({ category, amountColor }: Props) {
  const router = useRouter();
  const AccountFormModalRef = useRef<AccountFormModalRef>(null);
  const accountDeleteModalRef = useRef<AccountDeleteModalRef>(null);

  return (
    <>
      {/* <AccountFormModal
        ref={AccountFormModalRef}
        account={account}
        mode="edit"
      />
      <AccountDeleteModal ref={accountDeleteModalRef} account={account} /> */}

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
                onPress={() => AccountFormModalRef.current?.openModal()}
              >
                แก้ไข
              </DropdownItem>
              <DropdownItem
                className="text-danger"
                color="danger"
                onPress={() => accountDeleteModalRef.current?.openModal()}
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
