import type { NextRequest } from "next/server";
import db from "@/lib/db";
import { z } from "zod";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ message: "unauthorized" }, { status: 401 });
    }

    const budget = z.object({
      budget_id: z.string().min(1),
      budget_order: z.number(),
    });
    const schema = z.object({
      budget_list: z.array(budget),
    });

    const body = await schema.parseAsync(await req.json());

    for (const item of body.budget_list) {
      await db
        .updateTable("budget")
        .where("user_id", "=", session.user.id)
        .where("budget.budget_id", "=", item.budget_id)
        .set({
          budget_order: item.budget_order,
        })
        .executeTakeFirstOrThrow();
    }

    return Response.json({ message: "update order success" });
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 500 });
  }
}
