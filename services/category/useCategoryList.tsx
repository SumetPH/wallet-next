"use client";

import { useQuery } from "@tanstack/react-query";

export type Category = {
  category_id: string;
  category_name: string;
  category_type_id: string;
  category_created_at: string;
  category_updated_at: string;
  user_id: string;
  total: string;
};

export enum CategoryType {
  expense = "1",
  income = "2",
}

type Props = {
  enable: boolean;
  categoryType: CategoryType;
};

export default function useCategoryList({
  enable = true,
  categoryType = CategoryType.expense,
}: Props) {
  const searchParams = new URLSearchParams();
  if (categoryType) searchParams.append("category_type_id", categoryType);
  const query = searchParams.toString() ? `?${searchParams.toString()}` : "";

  const categoryList = useQuery({
    enabled: enable,
    queryKey: ["/category-list", query],
    queryFn: async () => {
      const res = await fetch(`/api/v1/category-list${query}`);
      const json: Category[] = await res.json();
      return json;
    },
  });

  return categoryList;
}
