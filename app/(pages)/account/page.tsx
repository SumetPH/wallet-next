"use client";

import useAccountList from "@/services/account/useAccountList";
import React from "react";
import AccountList from "@/components/account/AccountList";

export default function AccountPage() {
  const accountList = useAccountList({
    enable: true,
  });

  return (
    <AccountList
      accountTypeList={accountList.data ?? []}
      isLoading={accountList.isLoading}
      onSuccess={() => accountList.refetch()}
    />
  );
}
