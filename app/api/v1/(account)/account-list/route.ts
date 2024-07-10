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
      .selectFrom("wallet_account")
      .leftJoin(
        "wallet_account_type",
        "wallet_account_type.account_type_id",
        "wallet_account.account_type_id"
      )
      .leftJoin(
        (eb) =>
          eb
            .selectFrom("transactions")
            .select([
              "transactions.account_id",
              sql<string>`sum(
                case 
                  when category_type_id = '1' then transaction_amount 
                  when transfer_type_id = '1' then transaction_amount 
                  else 0 
                end)`.as("expense"),
              sql<string>`sum(
                case 
                  when category_type_id = '2' then transaction_amount 
                  when transfer_type_id = '2' then transaction_amount 
                  else 0 
                end)`.as("income"),
            ])
            .groupBy("transactions.account_id")
            .as("t"),
        (join) => join.onRef("t.account_id", "=", "wallet_account.account_id")
      )
      .groupBy("wallet_account_type.account_type_id")
      .orderBy("wallet_account_type.account_type_id")
      .select([
        "wallet_account_type.account_type_id",
        "wallet_account_type.account_type_name",
        "wallet_account_type.account_type_created_at",
        "wallet_account_type.account_type_updated_at",
        sql<string>`sum((coalesce(wallet_account.account_balance,0) + coalesce(t.income,0) - coalesce(t.expense,0)))`.as(
          "account_type_balance"
        ),
        sql`
        json_agg(
          json_build_object(
              'account_id', wallet_account.account_id,
              'account_name', wallet_account.account_name,
              'account_created_at', TO_CHAR(wallet_account.account_created_at, 'YYYY-MM-DD HH24:MI:SS'),
              'account_updated_at', TO_CHAR(wallet_account.account_updated_at, 'YYYY-MM-DD HH24:MI:SS'),
              'account_type_id', wallet_account_type.account_type_id,
              'account_type_name', wallet_account_type.account_type_name,
              'account_balance', wallet_account.account_balance::text,
              'expense', coalesce(t.expense, 0)::text,
              'income', coalesce(t.income, 0)::text,
              'net_balance', (coalesce(wallet_account.account_balance,0) + coalesce(t.income,0) - coalesce(t.expense,0))::text
          ) order by wallet_account.account_name
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
