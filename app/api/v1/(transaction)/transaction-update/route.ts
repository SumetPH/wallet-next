import { type NextRequest } from "next/server";
import { z } from "zod";
import db from "@/lib/db";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ message: "unauthorized" }, { status: 401 });
    }

    const schema = z.object({
      transaction_id: z.string().min(1),
      transaction_amount: z.string().min(1).optional(),
      transaction_note: z.string().optional(),
      transaction_date: z.string().min(1).optional(),
      transaction_type_id: z.string().min(1),
      account_id: z.string().min(1).optional(),
      category_id: z.string().min(1).optional(),
    });

    const body = await schema.parseAsync(await req.json());

    const updateTransaction = await db
      .updateTable("transaction")
      .where("user_id", "=", session.user.id)
      .where("transaction_id", "=", body.transaction_id)
      .set({
        transaction_amount: body.transaction_amount,
        transaction_note: body.transaction_note,
        transaction_date: body.transaction_date,
        transaction_type_id: body.transaction_type_id,
        account_id: body.account_id,
        category_id: body.category_id,
      })
      .executeTakeFirstOrThrow();

    return Response.json(updateTransaction);
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 500 });
  }
}
