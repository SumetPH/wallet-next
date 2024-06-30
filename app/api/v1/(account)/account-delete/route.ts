import type { NextRequest } from "next/server";
import db from "@/configs/db";
import { z } from "zod";

export const dynamic = "force-dynamic";

export async function DELETE(req: NextRequest) {
  try {
    const userId = req.cookies.get("user_id")?.value;
    if (!userId) return Response.json("user_id not found", { status: 404 });

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
      .where("user_id", "=", userId)
      .executeTakeFirstOrThrow();

    return Response.json({ message: "deleted successfully" });
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 500 });
  }
}
