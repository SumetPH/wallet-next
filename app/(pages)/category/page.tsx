"use client";

import CategoryHeader from "@/components/category/CategoryHeader";
import CategoryRow from "@/components/category/CategoryRow";
import useCategoryList, {
  CategoryType,
} from "@/services/category/useCategoryList";
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import React, { Key, useState } from "react";

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
          {categoryList.data?.map((category) => (
            <CategoryRow
              key={category.category_id}
              category={category}
              amountColor="text-red-600"
            />
          ))}
        </Tab>
        <Tab key="income" title="รายรับ">
          {categoryList.data?.map((category) => (
            <CategoryRow
              key={category.category_id}
              category={category}
              amountColor="text-green-600"
            />
          ))}
        </Tab>
      </Tabs>
    </>
  );
}
