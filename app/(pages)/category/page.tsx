"use client";

import CategoryHeader from "@/components/category/CategoryHeader";
import CategoryList from "@/components/category/CategoryList";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useCategoryList from "@/services/category/useCategoryList";
import { CategoryType } from "@/services/categoryType/useCategoryType";
import React, { useState } from "react";

export default function CategoryPage() {
  const [tab, setTab] = useState("expense");

  const categoryList = useCategoryList({
    enable: true,
    categoryType:
      tab === "expense" ? CategoryType.expense : CategoryType.income,
  });

  return (
    <>
      <CategoryHeader />

      <Tabs className="w-full" value={tab} onValueChange={setTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="expense">รายจ่าย</TabsTrigger>
          <TabsTrigger value="income">รายรับ</TabsTrigger>
        </TabsList>
      </Tabs>

      <CategoryList
        categoryList={categoryList.data ?? []}
        isFetching={categoryList.isFetching}
        onSuccess={categoryList.refetch}
      />
    </>
  );
}
