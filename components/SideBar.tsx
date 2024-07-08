"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  MdOutlineHome,
  MdOutlineAccountBalance,
  MdOutlineLogout,
  MdOutlinePieChartOutline,
  MdOutlineCategory,
} from "react-icons/md";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useToast } from "./ui/use-toast";
import jsCookie from "js-cookie";

export default function Sidebar() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();

  const logout = async () => {
    try {
      const res = await fetch("/api/auth/logout");
      const json: { message: string } = await res.json();

      if (res.status === 200) {
        toast({
          title: "ออกจากระบบสําเร็จ",
        });
        router.push("/login");
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

  return (
    <div className="p-4 h-full flex flex-col justify-between">
      <div>
        <h1 className="text-white text-xl font-medium text-center my-4">
          Money Wallet
        </h1>
        <hr className="my-4" />
        <div className="flex flex-col gap-3">
          <Button
            className="justify-start  gap-2 "
            onClick={() => router.push("/transaction")}
          >
            <MdOutlineHome size={22} />
            <span className="text-base font-medium">หน้าแรก</span>
          </Button>
          <Button
            className="justify-start gap-2"
            onClick={() => router.push("/account")}
          >
            <MdOutlineAccountBalance size={22} />
            <span className="text-base font-medium">บัญชี</span>
          </Button>
          <Button
            className="justify-start gap-2"
            onClick={() => router.push("/category")}
          >
            <MdOutlineCategory size={22} />
            <span className="text-base font-medium">หมวดหมู่</span>
          </Button>
          <Button
            className="justify-start gap-2"
            onClick={() => router.push("/budget")}
          >
            <MdOutlinePieChartOutline size={22} />
            <span className="text-base font-medium">งบประมาณ</span>
          </Button>
        </div>
      </div>
      <div>
        <Button className="w-full" disabled>
          {jsCookie.get("username")}
        </Button>
        <hr className="my-6" />
        <Button
          className="justify-start gap-2 w-full mb-3"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="capitalize">{theme}</span>
        </Button>
        <Button className="justify-start gap-2 w-full" onClick={logout}>
          <MdOutlineLogout size={22} />
          <span className="text-base font-medium">ออกจากระบบ</span>
        </Button>
      </div>
    </div>
  );
}
