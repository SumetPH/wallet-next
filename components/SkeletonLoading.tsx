import React from "react";
import { Skeleton } from "./ui/skeleton";

type Props = {
  isLoading: boolean;
  dataLength: number | undefined;
};

export default function SkeletonLoading({
  isLoading = false,
  dataLength = 0,
}: Props) {
  return (
    <>
      {isLoading && (
        <div data-testid="loading" className="my-6">
          <Skeleton className="h-6 w-full my-4" />
          <Skeleton className="h-6 w-full my-4" />
          <Skeleton className="h-24 w-full my-4" />
        </div>
      )}

      {!isLoading && dataLength === 0 && (
        <div className="my-6 text-center">ไม่พบข้อมูล</div>
      )}
    </>
  );
}
