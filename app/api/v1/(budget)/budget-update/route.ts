import type { NextRequest } from "next/server";
import dayjs from "dayjs";
import db from "@/lib/db";
import { z } from "zod";

export const dynamic = "force-dynamic";

export async function PUT(req: NextRequest) {
  try {
    const schema = z.object({
      budget_id: z.string().min(1),
      budget_name: z.string().min(1).optional(),
      budget_amount: z.string().min(1).optional(),
      budget_created_at: z.string().min(1).optional(),
      category_id: z.string().min(1).optional(),
    });

    const body = await schema.parseAsync(await req.json());

    await db
      .updateTable("wallet_budget")
      .where("wallet_budget.budget_id", "=", body.budget_id)
      .set({
        budget_amount: body.budget_amount,
        budget_name: body.budget_name,
        budget_created_at: body.budget_created_at,
        budget_updated_at: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        category_id: body.category_id,
      })
      .executeTakeFirstOrThrow();

    return Response.json({ message: "updated successfully" });
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 500 });
  }
}
