import type { NextRequest } from "next/server";
import db from "@/configs/db";
import { z } from "zod";

export const dynamic = "force-dynamic";

export async function DELETE(req: NextRequest) {
  try {
    const schema = z.object({
      budget_id: z.string().min(1),
    });

    const body = await schema.parseAsync(await req.json());

    await db
      .deleteFrom("wallet_budget")
      .where("wallet_budget.budget_id", "=", body.budget_id)
      .executeTakeFirstOrThrow();

    return Response.json({ message: "deleted successfully" });
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 500 });
  }
}
