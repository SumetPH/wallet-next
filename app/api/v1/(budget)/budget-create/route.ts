import type { NextRequest } from "next/server";
import { v4 as uuid } from "uuid";
import db from "@/lib/db";
import { z } from "zod";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ message: "unauthorized" }, { status: 401 });
    }

    const schema = z.object({
      budget_name: z.string().min(1),
      budget_amount: z.string().min(1),
      budget_date: z.string().min(1),
      category_id: z.string().min(1),
    });

    const body = await schema.parseAsync(await req.json());

    const budgetList = await db
      .selectFrom("budget")
      .where("user_id", "=", session.user.id)
      .orderBy("budget.budget_order desc")
      .selectAll()
      .execute();

    const createBudget = await db
      .insertInto("budget")
      .values({
        user_id: session.user.id,
        budget_id: uuid(),
        budget_amount: body.budget_amount,
        budget_name: body.budget_name,
        budget_date: body.budget_date,
        category_id: body.category_id,
        budget_order:
          budgetList.length > 0 ? budgetList[0].budget_order + 1 : 0,
      })
      .executeTakeFirstOrThrow();

    return Response.json(createBudget);
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 500 });
  }
}
