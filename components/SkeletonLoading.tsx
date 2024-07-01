import { Skeleton } from "@nextui-org/react";
import React from "react";

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
        <div className="my-6">
          <Skeleton className="h-6 w-full rounded-lg my-4" />
          <Skeleton className="h-36 w-full rounded-lg my-4" />
        </div>
      )}

      {!isLoading && dataLength === 0 && (
        <div className="my-6 text-center">ไม่พบข้อมูล</div>
      )}
    </>
  );
}
