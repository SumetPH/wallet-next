"use client";

import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import useReportAll from "@/services/report/useReportAll";
import numeral from "numeral";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function ReportPage() {
  const reportAll = useReportAll();

  const monthly = useMemo(() => {
    const options: ApexOptions = {
      chart: {
        toolbar: {
          show: false,
        },
      },
      xaxis: {
        categories: [
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
        ],
      },
      yaxis: {
        labels: {
          formatter(val, opts) {
            return numeral(val).format("0,0.00");
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      tooltip: {
        y: {
          formatter(val, opts) {
            return numeral(val).format("0,0.00");
          },
        },
      },
    };
    const series: ApexOptions["series"] = [
      {
        name: "รายจ่าย",
        data:
          reportAll.data?.monthly.map((item) =>
            Math.abs(Number(item.expense))
          ) ?? [],
        color: "#DC2626",
      },
      {
        name: "รายรับ",
        data: reportAll.data?.monthly.map((item) => Number(item.income)) ?? [],
        color: "#16A34A",
      },
    ];
    return { options, series };
  }, [reportAll.data?.monthly]);

  const annual = useMemo(() => {
    const options: ApexOptions = {
      chart: {
        toolbar: {
          show: false,
        },
      },
      xaxis: {
        categories: reportAll.data?.annual.map((item) => item.year) ?? [],
      },
      yaxis: {
        labels: {
          formatter(val, opts) {
            return numeral(val).format("0,0.00");
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      tooltip: {
        y: {
          formatter(val, opts) {
            return numeral(val).format("0,0.00");
          },
        },
      },
    };
    const series: ApexOptions["series"] = [
      {
        name: "รายจ่าย",
        data:
          reportAll.data?.annual.map((item) =>
            Math.abs(Number(item.expense))
          ) ?? [],
        color: "#DC2626",
      },
      {
        name: "รายรับ",
        data: reportAll.data?.annual.map((item) => Number(item.income)) ?? [],
        color: "#16A34A",
      },
    ];
    return { options, series };
  }, [reportAll.data?.annual]);

  const currentWealth = useMemo(() => {
    return Number(reportAll.data?.wealth.at(-1)?.value);
  }, [reportAll.data?.wealth]);

  const wealth = useMemo(() => {
    const options: ApexOptions = {
      chart: {
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
      },
      xaxis: {
        categories: reportAll.data?.wealth.map((item) => item.date) ?? [],
      },
      yaxis: {
        labels: {
          formatter(val, opts) {
            return numeral(val).format("0,0.00");
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      tooltip: {
        y: {
          formatter(val, opts) {
            return numeral(val).format("0,0.00");
          },
        },
      },
    };

    const series: ApexOptions["series"] = [
      {
        name: "มูลค่า",
        data: reportAll.data?.wealth.map((item) => Number(item.value)) ?? [],
        color: currentWealth > 0 ? "#16A34A" : "#DC2626",
      },
    ];
    return { options, series };
  }, [currentWealth, reportAll.data?.wealth]);

  return (
    <>
      <div className="flex justify-between gap-2 mb-2 sticky top-0 bg-background z-50">
        <div>
          <section className="text-lg font-medium">รายงาน</section>
        </div>
      </div>

      <div>
        <div className="text-base font-medium">การใช้จ่าย</div>
        <Chart options={monthly.options} series={monthly.series} type="bar" />
      </div>

      <div>
        <div className="text-base font-medium">
          ทรัพย์สินสุทธิ : {numeral(currentWealth).format("0,0.00")} บาท
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2">
          <Chart options={wealth.options} series={wealth.series} type="line" />
          <Chart options={annual.options} series={annual.series} type="bar" />
        </div>
      </div>
    </>
  );
}
