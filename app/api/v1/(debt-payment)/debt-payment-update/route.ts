import { type NextRequest } from "next/server";
import { z } from "zod";
import { v4 as uuid } from "uuid";
import db from "@/lib/db";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ message: "unauthorized" }, { status: 401 });
    }

    const schema = z.object({
      debt_payment_id: z.string().min(1),
      debt_payment_amount: z.string().min(1),
      debt_payment_note: z.string().optional(),
      debt_payment_date: z.string().min(1),
      debt_payment_from_account_id: z.string().min(1),
      debt_payment_to_account_id: z.string().min(1),
      category_id: z.string().optional(),
    });

    const body = await schema.parseAsync(await req.json());

    const updateDebtPayment = await db.transaction().execute(async (trx) => {
      await trx
        .updateTable("debt_payment")
        .where("user_id", "=", session.user.id)
        .where("debt_payment_id", "=", body.debt_payment_id)
        .set({
          debt_payment_amount: body.debt_payment_amount,
          debt_payment_note: body.debt_payment_note,
          debt_payment_date: body.debt_payment_date,
          debt_payment_from_account_id: body.debt_payment_from_account_id,
          debt_payment_to_account_id: body.debt_payment_to_account_id,
          category_id: body.category_id,
        })
        .returningAll()
        .executeTakeFirstOrThrow();

      await trx
        .deleteFrom("transaction")
        .where("user_id", "=", session.user.id)
        .where("debt_payment_id", "=", body.debt_payment_id)
        .executeTakeFirstOrThrow();

      await trx
        .insertInto("transaction")
        .values({
          user_id: session.user.id,
          transaction_id: uuid(),
          transaction_type_id: "5", // debt payment out
          transaction_amount: Number(body.debt_payment_amount) * -1,
          transaction_note: body.debt_payment_note,
          transaction_date: body.debt_payment_date,
          debt_payment_id: body.debt_payment_id,
          account_id: body.debt_payment_from_account_id,
          category_id: body.category_id,
        })
        .executeTakeFirstOrThrow();

      return await trx
        .insertInto("transaction")
        .values({
          user_id: session.user.id,
          transaction_id: uuid(),
          transaction_type_id: "6", // debt payment in
          transaction_amount: body.debt_payment_amount,
          transaction_note: body.debt_payment_note,
          transaction_date: body.debt_payment_date,
          debt_payment_id: body.debt_payment_id,
          account_id: body.debt_payment_to_account_id,
          category_id: body.category_id,
        })
        .executeTakeFirstOrThrow();
    });

    return Response.json(updateDebtPayment);
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 500 });
  }
}
