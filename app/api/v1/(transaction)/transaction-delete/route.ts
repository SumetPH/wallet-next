import { type NextRequest } from "next/server";
import { z } from "zod";
import db from "@/lib/db";

export const dynamic = "force-dynamic";

export async function DELETE(req: NextRequest) {
  try {
    const schema = z.object({
      transaction_id: z.string().min(1),
    });

    const body = await schema.parseAsync(await req.json());

    await db
      .deleteFrom("wallet_transaction")
      .where("transaction_id", "=", body.transaction_id)
      .executeTakeFirstOrThrow();

    return Response.json({ message: "deleted successfully" });
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 500 });
  }
}
