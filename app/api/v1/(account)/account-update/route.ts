import type { NextRequest } from "next/server";
import dayjs from "dayjs";
import db from "@/lib/db";
import { z } from "zod";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ message: "unauthorized" }, { status: 401 });
    }

    const bodySchema = z.object({
      account_id: z.string().min(1),
      account_name: z.string().min(1),
      account_type_id: z.string().min(1),
      account_balance: z.string().min(1),
      account_date: z.string().min(1),
    });
    const body = await bodySchema.parseAsync(await req.json());
    const updateAccount = await db
      .updateTable("account")
      .where("user_id", "=", session.user.id)
      .where("account_id", "=", body.account_id)
      .set({
        account_name: body.account_name,
        account_type_id: body.account_type_id,
        account_balance: body.account_balance,
        account_date: body.account_date,
      })
      .executeTakeFirstOrThrow();

    return Response.json(updateAccount);
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 500 });
  }
}
