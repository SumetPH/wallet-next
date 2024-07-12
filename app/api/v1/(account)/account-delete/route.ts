import type { NextRequest } from "next/server";
import db from "@/lib/db";
import { z } from "zod";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ message: "unauthorized" }, { status: 401 });
    }

    const bodySchema = z.object({
      account_id: z.string().min(1),
    });
    const body = await bodySchema.parseAsync(await req.json());

    const deleteAccount = await db.transaction().execute(async (trx) => {
      await trx
        .deleteFrom("transaction")
        .where("account_id", "=", body.account_id)
        .execute();

      return await trx
        .deleteFrom("account")
        .where("account_id", "=", body.account_id)
        .where("user_id", "=", session.user.id)
        .executeTakeFirstOrThrow();
    });

    return Response.json(deleteAccount);
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 500 });
  }
}
