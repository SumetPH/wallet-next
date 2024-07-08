"use client";

import React from "react";
import ThemeProvider from "@/components/provider/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import ReactQueryProvider from "@/components/provider/ReactQueryProvider";

type Props = {
  children: React.ReactNode;
};

export default function Provider({ children }: Props) {
  return (
    <ReactQueryProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <Toaster />
        {children}
      </ThemeProvider>
    </ReactQueryProvider>
  );
}
