import { type NextRequest } from "next/server";
import { z } from "zod";
import { v4 as uuid } from "uuid";
import db from "@/lib/db";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ message: "unauthorized" }, { status: 401 });
    }

    const schema = z.object({
      transfer_amount: z.string().min(1),
      transfer_note: z.string().optional(),
      transfer_date: z.string().min(1),
      transfer_from_account_id: z.string().min(1),
      transfer_to_account_id: z.string().min(1),
    });

    const body = await schema.parseAsync(await req.json());

    const createTransfer = await db.transaction().execute(async (trx) => {
      const transfer = await trx
        .insertInto("transfer")
        .values({
          user_id: session.user.id,
          transfer_id: uuid(),
          transfer_amount: body.transfer_amount,
          transfer_note: body.transfer_note,
          transfer_date: body.transfer_date,
          transfer_from_account_id: body.transfer_from_account_id,
          transfer_to_account_id: body.transfer_to_account_id,
        })
        .returningAll()
        .executeTakeFirstOrThrow();

      await trx
        .insertInto("transaction")
        .values({
          user_id: session.user.id,
          transaction_id: uuid(),
          transaction_type_id: "3", // transfer out
          transaction_amount: Number(body.transfer_amount) * -1,
          transaction_note: body.transfer_note,
          transaction_date: body.transfer_date,
          account_id: body.transfer_from_account_id,
          transfer_id: transfer.transfer_id,
        })
        .executeTakeFirstOrThrow();

      return await trx
        .insertInto("transaction")
        .values({
          user_id: session.user.id,
          transaction_id: uuid(),
          transaction_type_id: "4", // transfer in
          transaction_amount: body.transfer_amount,
          transaction_note: body.transfer_note,
          transaction_date: body.transfer_date,
          transfer_id: transfer.transfer_id,
          account_id: body.transfer_to_account_id,
        })
        .executeTakeFirstOrThrow();
    });

    return Response.json(createTransfer);
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 500 });
  }
}
