import db from "@/configs/db";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const accountTypes = await db
      .selectFrom("wallet_account_type")
      .selectAll()
      .orderBy("account_type_id asc")
      .execute();
    return Response.json(accountTypes, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 500 });
  }
}
