import { beforeEach, describe, expect, test } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import AccountList from "./AccountList";
import ReactQueryProvider from "@/components/provider/ReactQueryProvider";
import { AccountType } from "@/services/account/useAccountList";

const mockData: AccountType[] = [
  {
    account_type_id: "2",
    account_type_name: "ธนาคาร",
    account_type_balance: "300.00",
    accounts: [
      {
        account_id: "2",
        account_name: "KPlus Main",
        account_date: "2024-07-06 17:52:19",
        account_type_id: "2",
        account_type_name: "ธนาคาร",
        account_balance: "100.00",
        expense: "0",
        income: "0",
        net_balance: "100.00",
      },
    ],
  },
];

describe("render AccountList", () => {
  beforeEach(() => {
    cleanup();
  });

  test("should show loading", () => {
    render(
      <AccountList
        accountTypeList={[]}
        isFetching={true}
        onSuccess={() => {}}
      />,
      {
        wrapper: ReactQueryProvider,
      }
    );

    expect(screen.getByTestId("loading")).toBeDefined();
  });

  test("should show not found", () => {
    render(
      <AccountList
        accountTypeList={[]}
        isFetching={false}
        onSuccess={() => {}}
      />,
      {
        wrapper: ReactQueryProvider,
      }
    );

    expect(screen.getByText("ไม่พบข้อมูล")).toBeDefined();
  });

  test("should show account list", () => {
    render(
      <AccountList
        accountTypeList={mockData}
        isFetching={false}
        onSuccess={() => {}}
      />,
      {
        wrapper: ReactQueryProvider,
      }
    );

    expect(screen.getByTestId("account-type-name").innerHTML).toBe("ธนาคาร");
    expect(screen.getByTestId("account-type-balance").innerHTML).toBe(
      "300.00 บาท"
    );
    expect(screen.getByTestId("account-name").innerHTML).toBe("KPlus Main");
    expect(screen.getByTestId("account-balance").innerHTML).toBe("100.00 บาท");
  });
});
