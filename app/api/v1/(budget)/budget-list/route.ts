import { sql } from "kysely";
import db from "@/lib/db";
import dayjs from "dayjs";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ message: "unauthorized" }, { status: 401 });
    }

    const budget = await db
      .with("budget_all", (db) =>
        db
          .selectFrom("budget")
          .where("budget.user_id", "=", session.user.id)
          .groupBy(["budget.category_id", "budget.user_id"])
          .select(({ fn }) => [
            "budget.user_id",
            "budget.category_id",
            fn.sum("budget.budget_amount").as("budget_total"),
          ])
      )
      .with("budget_spend", (db) =>
        db
          .selectFrom("transactions")
          .where("transactions.transaction_type_id", "=", "1")
          .where("transactions.user_id", "=", session.user.id)
          .where(
            "transaction_date",
            ">=",
            dayjs().startOf("month").hour(0).minute(0).second(0).toDate()
          )
          .where(
            "transaction_date",
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
      .select(() => [
        sql<string>`sum(budget_all.budget_total)`.as("budget_total"),
        sql<string>`sum(budget_spend.budget_spend)`.as("budget_spend"),
        sql<string>`sum(budget_all.budget_total) + sum(budget_spend.budget_spend)`.as(
          "budget_remain"
        ),
      ])
      .executeTakeFirst();

    const budgetList = await db
      .selectFrom("budget")
      .leftJoin("transactions", (join) =>
        join
          .onRef("transactions.category_id", "=", "budget.category_id")
          .on(
            "transactions.transaction_date",
            ">=",
            dayjs().startOf("month").hour(0).minute(0).second(0).toDate()
          )
          .on(
            "transactions.transaction_date",
            "<=",
            dayjs().endOf("month").hour(23).minute(59).second(59).toDate()
          )
      )
      .where("budget.user_id", "=", session.user.id)
      .groupBy("budget.budget_id")
      .orderBy("budget.budget_name")
      .select(({ fn }) => [
        "budget.budget_id",
        "budget.budget_name",
        "budget.budget_amount",
        // fn.sum("transactions.transaction_amount").as("expense"),
        sql<string>`sum(case when transactions.transaction_type_id = '1' then transactions.transaction_amount else 0 end)`.as(
          "expense"
        ),
        sql<string>`budget.budget_amount + sum(case when transactions.transaction_type_id = '1' then transactions.transaction_amount else 0 end)`.as(
          "remain"
        ),
        "budget.category_id",
      ])
      .execute();

    return Response.json({
      budget: {
        budget_total: budget?.budget_total || "0.00",
        budget_spend: budget?.budget_spend || "0.00",
        budget_remain: budget?.budget_remain || "0.00",
      },
      budgetList: budgetList,
    });
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 500 });
  }
}
