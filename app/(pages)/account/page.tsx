"use client";

import useAccountList from "@/services/account/useAccountList";
import React from "react";
import AccountList from "@/components/account/AccountList";
import AccountHeader from "@/components/account/AccountHeader";

export default function AccountPage() {
  const accountList = useAccountList({
    enable: true,
  });

  return (
    <>
      <AccountHeader onSuccess={accountList.refetch} />

      <AccountList
        accountTypeList={accountList.data ?? []}
        isFetching={accountList.isFetching}
        onSuccess={() => accountList.refetch()}
      />
    </>
  );
}
