"use client";

import React, { useMemo } from "react";
import useReportAll from "@/services/report/useReportAll";
import numeral from "numeral";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  Area,
  AreaChart,
  YAxis,
} from "recharts";

export default function ReportPage() {
  const reportAll = useReportAll();

  const currentWealth = useMemo(() => {
    return Number(reportAll.data?.wealth.at(-1)?.value);
  }, [reportAll.data?.wealth]);

  const monthlyChartConfig = {
    expense: {
      label: "รายจ่าย",
      color: "#DC2626",
    },
    income: {
      label: "รายรับ",
      color: "#16A34A",
    },
  } satisfies ChartConfig;

  const monthlyChartData = useMemo(() => {
    const monthName = [
      "ม.ค.",
      "ก.พ.",
      "มี.ค.",
      "เม.ย.",
      "พ.ค.",
      "มิ.ย.",
      "ก.ค.",
      "ส.ค.",
      "ก.ย.",
      "ต.ค.",
      "พ.ย.",
      "ธ.ค.",
    ];

    return reportAll.data?.monthly.map((item) => ({
      month: monthName[item.month - 1],
      expense: Math.abs(Number(item.expense)),
      income: Math.abs(Number(item.income)),
    }));
  }, [reportAll.data?.monthly]);

  const wealthChartConfig = {
    minus: {
      label: "ติดลบ",
      color: "#DC2626",
    },
    plus: {
      label: "เป็นบวก",
      color: "#16A34A",
    },
  } satisfies ChartConfig;

  const wealthChartData = useMemo(() => {
    return reportAll.data?.wealth.map((item) => ({
      date: item.date,
      value: Number(item.value),
    }));
  }, [reportAll.data?.wealth]);

  const yearChartConfig = {
    expense: {
      label: "รายจ่าย",
      color: "#DC2626",
    },
    income: {
      label: "รายรับ",
      color: "#16A34A",
    },
  } satisfies ChartConfig;

  const yearChartData = useMemo(() => {
    return reportAll.data?.annual.map((item) => ({
      year: item.year,
      expense: Math.abs(Number(item.expense)),
      income: Math.abs(Number(item.income)),
    }));
  }, [reportAll.data?.annual]);

  return (
    <>
      <div className="flex justify-between gap-2 mb-2 sticky top-0 bg-background z-50">
        <div>
          <section className="text-lg font-medium">รายงาน</section>
        </div>
      </div>
      <div className="text-base font-medium mb-6">
        ทรัพย์สินสุทธิ : {numeral(currentWealth).format("0,0.00")} บาท
      </div>

      <div className="mb-6">
        <ChartContainer
          config={monthlyChartConfig}
          className="min-h-[200px] w-full"
        >
          <BarChart accessibilityLayer data={monthlyChartData}>
            <CartesianGrid vertical={false} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => numeral(value).format("0,0")}
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="expense" fill="var(--color-expense)" radius={4} />
            <Bar dataKey="income" fill="var(--color-income)" radius={4} />
          </BarChart>
        </ChartContainer>
      </div>

      <div>
        <div className="text-base font-medium"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2">
          <ChartContainer
            config={wealthChartConfig}
            className="min-h-[200px] w-full"
          >
            <AreaChart accessibilityLayer data={wealthChartData}>
              <CartesianGrid vertical={false} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => numeral(value).format("0,0")}
              />
              <XAxis
                dataKey="date"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Area
                dataKey="value"
                type="natural"
                fill={
                  currentWealth > 0 ? "var(--color-plus)" : "var(--color-minus)"
                }
                fillOpacity={0.4}
                stroke={
                  currentWealth > 0 ? "var(--color-plus)" : "var(--color-minus)"
                }
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>

          <ChartContainer
            config={yearChartConfig}
            className="min-h-[200px] w-full"
          >
            <BarChart accessibilityLayer data={yearChartData}>
              <CartesianGrid vertical={false} />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => numeral(value).format("0,0")}
              />
              <XAxis
                dataKey="year"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="expense" fill="var(--color-expense)" radius={4} />
              <Bar dataKey="income" fill="var(--color-income)" radius={4} />
            </BarChart>
          </ChartContainer>
        </div>
      </div>
    </>
  );
}
