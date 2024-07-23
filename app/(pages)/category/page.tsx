"use client";

import CategoryHeader from "@/components/category/CategoryHeader";
import CategoryList from "@/components/category/CategoryList";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useCategoryList from "@/services/category/useCategoryList";
import { CategoryType } from "@/services/categoryType/useCategoryType";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function CategoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<string | undefined>(undefined);

  useEffect(() => {
    const tabPrevious = searchParams.get("tab");
    if (tabPrevious) {
      setTab(tabPrevious);
    } else {
      setTab("expense");
    }
  }, [searchParams]);

  const categoryList = useCategoryList({
    enable: !!tab,
    categoryType:
      tab === "expense" ? CategoryType.expense : CategoryType.income,
  });

  const changeTab = (value: string) => {
    setTab(value);
    router.replace(`/category?tab=${value}`, { scroll: false });
  };

  return (
    <>
      <CategoryHeader onSuccess={categoryList.refetch} />

      <Tabs
        className="w-full"
        value={tab}
        onValueChange={(value) => changeTab(value)}
      >
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
