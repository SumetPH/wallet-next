import { axiosWithToken } from "@/services/axiosWithToken";
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
import { Category } from "@/services/category/useCategoryList";

export type CategoryDeleteModalRef = {
  openModal: () => void;
};

type Props = {
  category: Category;
  onUpdated?: () => void;
};

export const CategoryDeleteModal = forwardRef<CategoryDeleteModalRef, Props>(
  ({ category, onUpdated }, ref) => {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    const openModal = () => {
      onOpen();
    };

    useImperativeHandle(ref, () => ({
      openModal,
    }));

    const deleteCategory = async () => {
      try {
        await axiosWithToken({
          url: "/category-delete",
          method: "DELETE",
          data: {
            category_id: category.category_id,
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
                ลบหมวดหมู่ : {category.category_name}
              </section>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" variant="light" onClick={onClose}>
                ยกเลิก
              </Button>
              <Button color="danger" onClick={deleteCategory}>
                ยืนยัน
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  }
);

CategoryDeleteModal.displayName = "CategoryDeleteModal";
