import React from "react";
import { Category } from "@/services/category/useCategoryList";
import SkeletonLoading from "../SkeletonLoading";
import CategoryRow from "./CategoryRow";

type Props = {
  categoryList: Category[];
  isFetching: boolean;
  onSuccess: () => void;
};

export default function CategoryList({
  categoryList,
  isFetching,
  onSuccess,
}: Props) {
  return (
    <>
      <SkeletonLoading
        isLoading={isFetching}
        dataLength={categoryList.length}
      />

      {!isFetching &&
        categoryList.length > 0 &&
        categoryList.map((category) => (
          <CategoryRow
            key={category.category_id}
            category={category}
            onSuccess={onSuccess}
          />
        ))}
    </>
  );
}
