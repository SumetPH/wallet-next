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

    const schema = z.object({
      budget_id: z.string().min(1),
    });

    const body = await schema.parseAsync(await req.json());

    const deleteBudget = await db
      .deleteFrom("budget")
      .where("user_id", "=", session.user.id)
      .where("budget.budget_id", "=", body.budget_id)
      .executeTakeFirstOrThrow();

    return Response.json(deleteBudget);
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 500 });
  }
}
