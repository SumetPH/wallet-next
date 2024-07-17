import type { NextRequest } from "next/server";
import dayjs from "dayjs";
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

    const schema = z.object({
      budget_id: z.string().min(1),
      budget_name: z.string().min(1).optional(),
      budget_amount: z.string().min(1).optional(),
      budget_date: z.string().min(1).optional(),
      category_id: z.string().min(1).optional(),
    });

    const body = await schema.parseAsync(await req.json());

    const updateBudget = await db
      .updateTable("budget")
      .where("user_id", "=", session.user.id)
      .where("budget.budget_id", "=", body.budget_id)
      .set({
        budget_amount: body.budget_amount,
        budget_name: body.budget_name,
        budget_date: body.budget_date,
        category_id: body.category_id,
      })
      .executeTakeFirstOrThrow();

    return Response.json(updateBudget);
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 500 });
  }
}
