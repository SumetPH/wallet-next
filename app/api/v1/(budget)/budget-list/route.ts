import type { NextRequest } from "next/server";
import { sql } from "kysely";
import db from "@/configs/db";
import dayjs from "dayjs";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const userId = req.cookies.get("user_id")?.value;
    if (!userId) return Response.json("user_id not found", { status: 404 });

    const budget = await db
      .with("budget_all", (db) =>
        db
          .selectFrom("wallet_budget")
          .where("wallet_budget.user_id", "=", userId)
          .groupBy(["wallet_budget.category_id", "wallet_budget.user_id"])
          .select(({ fn }) => [
            "wallet_budget.user_id",
            "wallet_budget.category_id",
            fn.sum("wallet_budget.budget_amount").as("budget_total"),
          ])
      )
      .with("budget_spend", (db) =>
        db
          .selectFrom("transactions")
          .where("transactions.category_type_id", "=", "1")
          .where("transactions.user_id", "=", userId)
          .where(
            "transaction_created_at",
            ">=",
            dayjs().startOf("month").hour(0).minute(0).second(0).toDate()
          )
          .where(
            "transaction_created_at",
            "<=",
            dayjs().endOf("month").hour(23).minute(59).second(59).toDate()
          )
          .groupBy(["transactions.category_id", "transactions.user_id"])
          .select(({ fn }) => [
            "transactions.user_id",
            "transactions.category_id",
            fn.sum("transactions.transaction_amount").as("budget_spend"),
          ])
      )
      .selectFrom("budget_all")
      .leftJoin(
        "budget_spend",
        "budget_spend.category_id",
        "budget_all.category_id"
      )
      .groupBy("budget_all.user_id")
      .select(({ fn }) => [
        sql<string>`sum(budget_all.budget_total)`.as("budget_total"),
        sql<string>`sum(budget_spend.budget_spend)`.as("budget_spend"),
        sql<string>`sum(budget_all.budget_total) - sum(budget_spend.budget_spend)`.as(
          "budget_remain"
        ),
      ])
      .executeTakeFirst();

    const budgetList = await db
      .selectFrom("wallet_budget")
      .leftJoin("transactions", (join) =>
        join
          .onRef("transactions.category_id", "=", "wallet_budget.category_id")
          .on(
            "transactions.transaction_created_at",
            ">=",
            dayjs().startOf("month").hour(0).minute(0).second(0).toDate()
          )
          .on(
            "transactions.transaction_created_at",
            "<=",
            dayjs().endOf("month").hour(23).minute(59).second(59).toDate()
          )
      )
      .where("wallet_budget.user_id", "=", userId)
      .groupBy("wallet_budget.budget_id")
      .orderBy("wallet_budget.budget_name")
      .select(({ fn }) => [
        "wallet_budget.budget_id",
        "wallet_budget.budget_name",
        "wallet_budget.budget_amount",
        fn.sum("transactions.transaction_amount").as("expense"),
        sql<string>`wallet_budget.budget_amount - sum(transactions.transaction_amount)`.as(
          "remain"
        ),
        "wallet_budget.category_id",
      ])
      .execute();

    return Response.json({
      budget: {
        budget_total: budget?.budget_total || 0,
        budget_spend: budget?.budget_spend || 0,
        budget_remain: budget?.budget_remain || 0,
      },
      budgetList: budgetList,
    });
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 500 });
  }
}
