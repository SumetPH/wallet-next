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
      transfer_id: z.string().min(1),
    });

    const body = await schema.parseAsync(await req.json());

    const deleteTransfer = await db.transaction().execute(async (trx) => {
      await trx
        .deleteFrom("transfer")
        .where("user_id", "=", session.user.id)
        .where("transfer_id", "=", body.transfer_id)
        .executeTakeFirstOrThrow();

      return await trx
        .deleteFrom("transaction")
        .where("user_id", "=", session.user.id)
        .where("transfer_id", "=", body.transfer_id)
        .executeTakeFirstOrThrow();
    });

    return Response.json(deleteTransfer);
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 500 });
  }
}
