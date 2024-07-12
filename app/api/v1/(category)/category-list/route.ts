import { getSession } from "@/lib/auth";
import db from "@/lib/db";
import { sql } from "kysely";
import { NextRequest } from "next/server";
import { z } from "zod";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ message: "unauthorized" }, { status: 401 });
    }

    const schema = z.object({
      category_type_id: z.string().min(1),
    });

    const searchParams = req.nextUrl.searchParams;

    const query = await schema.parseAsync({
      category_type_id: searchParams.get("category_type_id") || undefined,
    });

    const category = await db
      .selectFrom("category")
      .where("category.user_id", "=", session.user.id)
      .where("category.category_type_id", "=", query.category_type_id)
      .leftJoin(
        "transactions",
        "transactions.category_id",
        "category.category_id"
      )
      .groupBy("category.category_id")
      .select([
        "category.category_type_id",
        "category.user_id",
        "category.category_date",
        "category.category_id",
        "category.category_name",
        sql<string>`sum(coalesce(transaction_amount, 0.00))`.as("total"),
      ])
      .orderBy("category.category_name")
      .execute();

    return Response.json(category);
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 500 });
  }
}
