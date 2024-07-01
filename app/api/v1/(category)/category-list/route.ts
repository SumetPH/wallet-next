import db from "@/configs/db";
import { sql } from "kysely";
import { NextRequest } from "next/server";
import { z } from "zod";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const userId = req.cookies.get("user_id")?.value;
    if (!userId) return Response.json("user_id not found", { status: 404 });

    const schema = z.object({
      category_type_id: z.string().min(1),
    });

    const searchParams = req.nextUrl.searchParams;

    const query = await schema.parseAsync({
      category_type_id: searchParams.get("category_type_id") || undefined,
    });

    const category = await db
      .selectFrom("wallet_category")
      .where("wallet_category.user_id", "=", userId)
      .where("wallet_category.category_type_id", "=", query.category_type_id)
      .leftJoin(
        "transactions",
        "transactions.category_id",
        "wallet_category.category_id"
      )
      .groupBy("wallet_category.category_id")
      .select([
        "wallet_category.category_type_id",
        "wallet_category.user_id",
        "wallet_category.category_created_at",
        "wallet_category.category_id",
        "wallet_category.category_name",
        "wallet_category.category_updated_at",
        sql<string>`sum(coalesce(transaction_amount, 0))`.as("total"),
      ])
      .orderBy("wallet_category.category_name")
      .execute();

    return Response.json(category);
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 500 });
  }
}
