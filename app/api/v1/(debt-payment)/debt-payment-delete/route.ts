import { type NextRequest } from "next/server";
import { z } from "zod";
import db from "@/lib/db";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ message: "unauthorized" }, { status: 401 });
    }

    const schema = z.object({
      debt_payment_id: z.string().min(1),
    });

    const body = await schema.parseAsync(await req.json());

    const deleteDebtPayment = await db.transaction().execute(async (trx) => {
      await trx
        .deleteFrom("debt_payment")
        .where("user_id", "=", session.user.id)
        .where("debt_payment_id", "=", body.debt_payment_id)
        .executeTakeFirstOrThrow();

      return await trx
        .deleteFrom("transaction")
        .where("user_id", "=", session.user.id)
        .where("debt_payment_id", "=", body.debt_payment_id)
        .executeTakeFirstOrThrow();
    });

    return Response.json(deleteDebtPayment);
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 500 });
  }
}
