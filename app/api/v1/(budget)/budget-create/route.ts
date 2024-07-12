import type { NextRequest } from "next/server";
import { v4 as uuid } from "uuid";
import db from "@/lib/db";
import { z } from "zod";
import dayjs from "dayjs";
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
      budget_created_at: z.string().min(1),
      category_id: z.string().min(1),
    });

    const body = await schema.parseAsync(await req.json());

    await db
      .insertInto("budget")
      .values({
        budget_id: uuid(),
        budget_amount: body.budget_amount,
        budget_name: body.budget_name,
        budget_created_at: body.budget_created_at,
        category_id: body.category_id,
        user_id: session.user.id,
        budget_updated_at: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      })
      .executeTakeFirstOrThrow();

    return Response.json({ message: "created successfully" });
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 500 });
  }
}
