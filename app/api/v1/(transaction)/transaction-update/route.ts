import { type NextRequest } from "next/server";
import { z } from "zod";
import db from "@/configs/db";
import dayjs from "dayjs";

export const dynamic = "force-dynamic";

export async function PUT(req: NextRequest) {
  try {
    const schema = z.object({
      transaction_id: z.string().min(1),
      transaction_amount: z.string().min(1).optional(),
      account_id: z.string().min(1).optional(),
      category_id: z.string().min(1).optional(),
      transaction_note: z.string().optional(),
      transaction_created_at: z.string().min(1).optional(),
    });

    const body = await schema.parseAsync(await req.json());

    await db
      .updateTable("wallet_transaction")
      .where("transaction_id", "=", body.transaction_id)
      .set({
        transaction_amount: body.transaction_amount,
        account_id: body.account_id,
        category_id: body.category_id,
        transaction_note: body.transaction_note,
        transaction_created_at: body.transaction_created_at,
        transaction_updated_at: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      })
      .executeTakeFirstOrThrow();

    return Response.json({ message: "updated successfully" });
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 500 });
  }
}
