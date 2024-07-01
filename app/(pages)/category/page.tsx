"use client";

import SkeletonLoading from "@/components/SkeletonLoading";
import CategoryHeader from "@/components/category/CategoryHeader";
import CategoryRow from "@/components/category/CategoryRow";
import useCategoryList, {
  CategoryType,
} from "@/services/category/useCategoryList";
import { Tabs, Tab } from "@nextui-org/react";
import React, { useState } from "react";

export default function CategoryPage() {
  const [tab, setTab] = useState<any>("expense");

  const categoryList = useCategoryList({
    enable: true,
    categoryType:
      tab === "expense" ? CategoryType.expense : CategoryType.income,
  });

  return (
    <>
      <CategoryHeader />

      <Tabs
        selectedKey={tab}
        onSelectionChange={setTab}
        aria-label="category"
        fullWidth
      >
        <Tab key="expense" title="รายจ่าย">
          <SkeletonLoading
            isLoading={categoryList.isLoading}
            dataLength={categoryList.data?.length}
          />

          {categoryList.data?.map((category) => (
            <CategoryRow
              key={category.category_id}
              category={category}
              amountColor="text-red-600"
              onUpdated={() => categoryList.refetch()}
            />
          ))}
        </Tab>
        <Tab key="income" title="รายรับ">
          <SkeletonLoading
            isLoading={categoryList.isLoading}
            dataLength={categoryList.data?.length}
          />

          {categoryList.data?.map((category) => (
            <CategoryRow
              key={category.category_id}
              category={category}
              amountColor="text-green-600"
              onUpdated={() => categoryList.refetch()}
            />
          ))}
        </Tab>
      </Tabs>
    </>
  );
}
