import { sql } from "kysely";
import db from "@/lib/db";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ message: "unauthorized" }, { status: 401 });
    }

    const accounts = await db
      .selectFrom("account")
      .leftJoin(
        "account_type",
        "account_type.account_type_id",
        "account.account_type_id"
      )
      .leftJoin(
        (eb) =>
          eb
            .selectFrom("transactions")
            .select([
              "transactions.account_id",
              sql<string>`sum(
                case 
                  when transaction_type_id = '1' then transaction_amount 
                  else 0 
                end)`.as("expense"),
              sql<string>`sum(
                case 
                  when transaction_type_id = '2' then transaction_amount 
                  else 0 
                end)`.as("income"),
              sql<string>`sum(transaction_amount)`.as("total"),
            ])
            .groupBy("transactions.account_id")
            .as("t"),
        (join) => join.onRef("t.account_id", "=", "account.account_id")
      )
      .groupBy("account_type.account_type_id")
      .orderBy("account_type.account_type_id")
      .select([
        "account_type.account_type_id",
        "account_type.account_type_name",
        sql<string>`sum(coalesce(t.total, 0) + coalesce(account.account_balance, 0))`.as(
          "account_type_balance"
        ),
        sql`
        json_agg(
          json_build_object(
              'account_id', account.account_id,
              'account_name', account.account_name,
              'account_date', TO_CHAR(account.account_date, 'YYYY-MM-DD HH24:MI:SS'),
              'account_type_id', account_type.account_type_id,
              'account_type_name', account_type.account_type_name,
              'account_balance', account.account_balance::text,
              'expense', coalesce(t.expense, 0)::text,
              'income', coalesce(t.income, 0)::text,
              'net_balance', (coalesce(account.account_balance,0) + coalesce(t.total,0))::text
          ) order by account.account_name
      )
      `.as("accounts"),
      ])
      .where("user_id", "=", session.user.id)
      .execute();

    return Response.json(accounts);
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 500 });
  }
}
