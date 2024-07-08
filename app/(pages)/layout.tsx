import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  // check authentication
  const session = await getSession();
  if (!session) return redirect("/login");

  return <>{children}</>;
}
