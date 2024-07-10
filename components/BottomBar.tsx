"use client";

import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { House, Notebook, LogOut, PieChart, Layers } from "lucide-react";
import clsx from "clsx";
import { toast } from "./ui/use-toast";

export default function BottomBar() {
  const router = useRouter();
  const pathname = usePathname();

  const logout = async () => {
    try {
      const res = await fetch("/api/auth/logout");
      const json: { message: string } = await res.json();

      if (res.status === 200) {
        toast({
          title: "ออกจากระบบสําเร็จ",
        });
        window.location.href = "/transaction";
      } else {
        toast({
          title: "ข้อผิดพลาด",
          description: json.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "ข้อผิดพลาด",
        description: "เกิดข้อผิดพลาด",
        variant: "destructive",
      });
    }
  };

  const activeMenu = (path: string) => {
    if (pathname.startsWith(path)) {
      return "text-white";
    }
    return "text-stone-600";
  };

  return (
    <div className="sticky bottom-0 bg-stone-300 dark:bg-stone-800 p-3 lg:hidden z-10">
      <div className="bg-stone-400 dark:bg-stone-900 rounded-xl h-full">
        <div className="grid grid-cols-5 h-10">
          <button
            className="flex justify-center items-center"
            onClick={() => router.push("/transaction")}
          >
            <House className={clsx(activeMenu("/transaction"))} size={20} />
          </button>
          <button
            className="flex justify-center items-center"
            onClick={() => router.push("/account")}
          >
            <Notebook className={clsx(activeMenu("/account"))} size={20} />
          </button>
          <button
            className="flex justify-center items-center"
            onClick={() => router.push("/category")}
          >
            <Layers className={clsx(activeMenu("/category"))} size={20} />
          </button>
          <button
            className="flex justify-center items-center"
            onClick={() => router.push("/budget")}
          >
            <PieChart className={clsx(activeMenu("/budget"))} size={20} />
          </button>
          <button className="flex justify-center items-center" onClick={logout}>
            <LogOut className="text-stone-600" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
