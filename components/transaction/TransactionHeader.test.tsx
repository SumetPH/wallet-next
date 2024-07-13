import { screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import TransactionHeader from "./TransactionHeader";
import * as mockRouter from "next-router-mock";
import { render } from "@/test/test-utils";

describe("render TransactionHeader", () => {
  test('should show "รายการ" when title is null', () => {
    render(<TransactionHeader onSuccess={() => {}} />);

    expect(screen.getByTestId("title").innerHTML).toBe("รายการ");
  });

  test('should show "รายการ : KTC" when title is KTC', () => {
    mockRouter.default.push("/account/1?title=KTC");

    render(<TransactionHeader onSuccess={() => {}} />);

    expect(screen.getByTestId("title").innerHTML).toBe("รายการ : KTC");
  });
});
