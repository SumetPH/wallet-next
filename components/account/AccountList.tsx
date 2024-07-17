"use client";

import React from "react";
import SkeletonLoading from "../SkeletonLoading";
import { amountColor, cn } from "@/lib/utils";
import numeral from "numeral";
import { AccountType } from "@/services/account/useAccountList";
import AccountRow from "./AccountRow";

type Props = {
  accountTypeList: AccountType[];
  isFetching: boolean;
  onSuccess: () => void;
};

export default function AccountList({
  accountTypeList,
  isFetching,
  onSuccess,
}: Props) {
  return (
    <>
      <SkeletonLoading
        isLoading={isFetching}
        dataLength={accountTypeList.length}
      />

      {!isFetching &&
        accountTypeList.length > 0 &&
        accountTypeList.map((accountType) => (
          <div key={accountType.account_type_id}>
            <div className="flex justify-between gap-2 p-1 bg-gray-100 dark:bg-gray-800">
              <span data-testid="account-type-name">
                {accountType.account_type_name}
              </span>
              <span
                data-testid="account-type-balance"
                className={cn(
                  "font-medium",
                  amountColor(accountType.account_type_balance)
                )}
              >
                {numeral(accountType.account_type_balance).format("0,0.00")} บาท
              </span>
            </div>

            {accountType.accounts.map((account) => (
              <AccountRow
                key={account.account_id}
                account={account}
                onSuccess={onSuccess}
              />
            ))}
          </div>
        ))}
    </>
  );
}
