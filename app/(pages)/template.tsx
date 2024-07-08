"use client";

import SideBar from "@/components/SideBar";
import React from "react";
import BottomBar from "@/components/BottomBar";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="hidden lg:block w-[280px] bg-stone-400 dark:bg-stone-900 fixed inset-0">
        <SideBar />
      </div>
      <div className="lg:pl-[280px] bg-stone-300 dark:bg-stone-800 min-h-dvh pb-12 lg:pb-0">
        <div className="container mx-auto p-6 ">
          <div className="bg-card rounded-xl p-6">{children}</div>
        </div>
      </div>
      <BottomBar />
    </>
  );
}
