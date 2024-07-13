"use client";

import { useQuery } from "@tanstack/react-query";

export type Category = {
  category_id: string;
  category_name: string;
  category_type_id: string;
  category_date: string;
  user_id: string;
  total: string;
};

type Props = {
  enable: boolean;
  categoryType: string;
};

export default function useCategoryList({ enable, categoryType }: Props) {
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
