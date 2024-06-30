import React, { useRef } from "react";
import { MdOutlineMoreHoriz } from "react-icons/md";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { AccountFormModalRef } from "@/components/account/AccountFormModal";
import { AccountFormModal } from "@/components/account/AccountFormModal";
import { useQueryClient } from "@tanstack/react-query";

export default function AccountHeader() {
  const AccountFormModalRef = useRef<AccountFormModalRef>(null);
  const queryClient = useQueryClient();

  return (
    <>
      <div className="flex justify-between gap-2 mb-2">
        <section className="text-lg font-medium">บัญชี</section>
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
                onPress={() => AccountFormModalRef.current?.openModal()}
              >
                เพิ่มบัญชี
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </section>
      </div>

      <AccountFormModal
        ref={AccountFormModalRef}
        onUpdated={() =>
          queryClient.invalidateQueries({ queryKey: ["/account-list"] })
        }
      />
    </>
  );
}
