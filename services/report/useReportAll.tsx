"use client";

import { useQuery } from "@tanstack/react-query";

export interface Annual {
  year: string;
  expense: string;
  income: string;
}

export interface Monthly {
  month: number;
  expense: string;
  income: string;
}

export interface Wealth {
  date: string;
  value: string;
}

export interface ReportAll {
  annual: Annual[];
  monthly: Monthly[];
  wealth: Wealth[];
}

export default function useReportAll() {
  const reportAll = useQuery({
    queryKey: ["/report-all"],
    queryFn: async () => {
      const res = await fetch(`/api/v1/report-all`);
      const json: ReportAll = await res.json();
      return json;
    },
  });

  return reportAll;
}
