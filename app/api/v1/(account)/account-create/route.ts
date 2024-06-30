import type { NextRequest } from "next/server";
import { v4 as uuid } from "uuid";
import db from "@/configs/db";
import { z } from "zod";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const userId = req.cookies.get("user_id")?.value;
    if (!userId) return Response.json("user_id not found", { status: 404 });

    const bodySchema = z.object({
      account_name: z.string().min(1),
      account_type_id: z.string().min(1),
      account_balance: z.string().min(1),
      account_start_date: z.string().min(1),
    });

    const body = await bodySchema.parseAsync(await req.json());

    const newAccount = await db
      .insertInto("wallet_account")
      .values({
        account_id: uuid(),
        account_name: body.account_name,
        account_type_id: body.account_type_id,
        user_id: userId,
        account_balance: body.account_balance,
        account_created_at: body.account_start_date,
      })
      .executeTakeFirstOrThrow();

    return Response.json(newAccount);
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 500 });
  }
}
