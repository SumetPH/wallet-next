import { type NextRequest } from "next/server";
import { sql } from "kysely";
import db from "@/lib/db";
import { getSession } from "@/lib/auth";
import dayjs from "dayjs";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ message: "unauthorized" }, { status: 401 });
    }

    const annual = await db
      .selectFrom("transactions")
      .where("transactions.user_id", "=", session.user.id)
      .select([
        sql`extract(year from transaction_date)`.as("year"),
        sql`coalesce(sum(
          case
            when transaction_type_id = '1' then transaction_amount
            else 0
          end
        ),0.00)`.as("expense"),
        sql`coalesce(sum(
          case
            when transaction_type_id = '2' then transaction_amount
            else 0
          end
        ),0.00)`.as("income"),
      ])
      .groupBy("year")
      .orderBy("year asc")
      .execute();

    const monthly = await db
      .with("months", (qb) =>
        qb
          .selectFrom(
            sql<{ month: number }>`generate_series(1, 12)`.as("month")
          )
          .select(["month"])
      )
      .with("transactions_month", (qb) =>
        qb
          .selectFrom("transactions")
          .where("transactions.user_id", "=", session.user.id)
          .where("transaction_date", ">=", dayjs().startOf("year").toDate())
          .where("transaction_date", "<=", dayjs().endOf("year").toDate())
          .select([
            "transaction_amount",
            "transaction_type_id",
            sql`extract(month from transactions.transaction_date)`.as("month"),
          ])
      )
      .selectFrom("months")
      .leftJoin(
        "transactions_month",
        "transactions_month.month",
        "months.month"
      )
      .select([
        "months.month",
        sql`coalesce(sum(
          case 
            when transaction_type_id = '1' then transaction_amount
            else 0
          end
        ),0.00)`.as("expense"),
        sql`coalesce(sum(
          case 
            when transaction_type_id = '2' then transaction_amount
            else 0
          end
        ),0.00)`.as("income"),
      ])
      .groupBy("months.month")
      .orderBy("months.month asc")
      .execute();

    const wealth = await db
      .with("months", (qb) =>
        qb
          .selectFrom("transactions")
          .where("user_id", "=", session.user.id)
          .select([sql`to_char(transaction_date, 'YYYY-MM')`.as("date")])
          .groupBy("date")
          .orderBy("date asc")
      )
      .selectFrom("months")
      .select([
        "months.date",
        sql`
          (
            select sum(account_balance) from account
          ) + 
          (
            select sum(transaction_amount) from transactions
            where to_char(transaction_date, 'YYYY-MM') <= months.date
          )
        `.as("value"),
      ])
      .execute();

    return Response.json({ annual, monthly, wealth });
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 500 });
  }
}
