import { useQuery } from "@tanstack/react-query";

export const CategoryType = {
  expense: "1",
  income: "2",
};

type CategoryTypeRes = {
  category_type_id: string;
  category_type_name: string;
};

type Props = {
  enable: boolean;
};

export default function useCategoryTypeList({ enable = true }: Props) {
  const categoryTypeList = useQuery({
    enabled: enable,
    queryKey: ["/category-type-list"],
    queryFn: async () => {
      const res = await fetch(`/api/v1/category-type-list`);
      const json: CategoryTypeRes[] = await res.json();
      return json;
    },
  });

  return categoryTypeList;
}
