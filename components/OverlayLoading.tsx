"use client";

import React from "react";
import { LoadingSpinner } from "@/components/ui/custom/loading-spinner";
import useLoadingStore from "@/stores/useLoading";

export default function OverlayLoading() {
  const { isLoading } = useLoadingStore();

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-background opacity-50">
        <LoadingSpinner size={32} />
      </div>
    );
  }
}
