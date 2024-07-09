import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  children: React.ReactNode;
};

export default async function AuthLayout({ children }: Props) {
  // check authentication
  const session = await getSession();
  if (session) return redirect("/transaction");

  return children;
}
