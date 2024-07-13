import { cleanup, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import TransactionHeader from "./TransactionHeader";
import ReactQueryProvider from "../provider/ReactQueryProvider";
import * as mockRouter from "next-router-mock";

describe("render TransactionHeader", () => {
  beforeEach(() => {
    cleanup();
  });

  test('should show "รายการ" when title is null', () => {
    render(<TransactionHeader onSuccess={() => {}} />, {
      wrapper: ReactQueryProvider,
    });

    expect(screen.getByTestId("title").innerHTML).toBe("รายการ");
  });

  test('should show "รายการ : KTC" when title is KTC', () => {
    mockRouter.default.push("/account/1?title=KTC");

    render(<TransactionHeader onSuccess={() => {}} />, {
      wrapper: ReactQueryProvider,
    });

    expect(screen.getByTestId("title").innerHTML).toBe("รายการ : KTC");
  });
});
