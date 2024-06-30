import { axiosWithToken } from "@/services/axiosWithToken";
import { Account } from "@/services/account/useAccountList";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import React, { forwardRef, useImperativeHandle } from "react";

export type AccountDeleteModalRef = {
  openModal: () => void;
};

type Props = {
  account: Account;
  onUpdated?: () => void;
};

export const AccountDeleteModal = forwardRef<AccountDeleteModalRef, Props>(
  ({ account, onUpdated }, ref) => {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    const openModal = () => {
      onOpen();
    };

    useImperativeHandle(ref, () => ({
      openModal,
    }));

    const deleteAccount = async () => {
      try {
        await axiosWithToken({
          url: "/account-delete",
          method: "DELETE",
          data: {
            account_id: account.account_id,
          },
        });
      } catch (error) {
        console.error(error);
      } finally {
        onClose();
        if (onUpdated) onUpdated();
      }
    };

    return (
      <>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} hideCloseButton>
          <ModalContent>
            <ModalHeader></ModalHeader>
            <ModalBody>
              <section className="text-center text-lg font-medium mt-3">
                ลบบัญชี : {account.account_name}
              </section>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" variant="light" onClick={onClose}>
                ยกเลิก
              </Button>
              <Button color="danger" onClick={deleteAccount}>
                ยืนยัน
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  }
);

AccountDeleteModal.displayName = "AccountDeleteModal";
