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

    await db
      .deleteFrom("wallet_transaction")
      .where("account_id", "=", body.account_id)
      .execute();

    await db
      .deleteFrom("wallet_account")
      .where("account_id", "=", body.account_id)
      .where("user_id", "=", session.user.id)
      .executeTakeFirstOrThrow();

    return Response.json({ message: "deleted successfully" });
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 500 });
  }
}
