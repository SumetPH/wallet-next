import { beforeEach, describe, expect, test } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import SkeletonLoading from "./SkeletonLoading";

describe("render SkeletonLoading", () => {
  beforeEach(() => {
    cleanup();
  });

  test("should show loading", () => {
    render(<SkeletonLoading isLoading={true} dataLength={0} />);
    expect(screen.getByTestId("loading")).toBeDefined();
  });

  test("should show not found", () => {
    render(<SkeletonLoading isLoading={false} dataLength={0} />);
    expect(screen.getByText("ไม่พบข้อมูล")).toBeDefined();
  });

  test("should not show loading when dataLength is greater than 0", async () => {
    render(<SkeletonLoading isLoading={false} dataLength={1} />);
    expect(screen.queryByTestId("loading")).toBeNull();
    expect(screen.queryByText("ไม่พบข้อมูล")).toBeNull();
  });
});
