import { type NextRequest } from "next/server";
import { z } from "zod";
import { v4 as uuid } from "uuid";
import db from "@/lib/db";
import dayjs from "dayjs";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const schema = z.object({
      transaction_amount: z.string().min(1),
      account_id: z.string().min(1),
      category_id: z.string().min(1),
      transaction_note: z.string().optional(),
      transaction_created_at: z.string().min(1),
    });

    const body = await schema.parseAsync(await req.json());

    await db
      .insertInto("wallet_transaction")
      .values({
        transaction_id: uuid(),
        transaction_amount: body.transaction_amount,
        account_id: body.account_id,
        category_id: body.category_id,
        transaction_note: body.transaction_note,
        transaction_created_at: body.transaction_created_at,
        transaction_updated_at: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      })
      .executeTakeFirstOrThrow();

    return Response.json({ message: "created successfully" });
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 500 });
  }
}
