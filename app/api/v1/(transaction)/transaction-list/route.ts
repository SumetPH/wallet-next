import { type NextRequest } from "next/server";
import { z } from "zod";
import { sql } from "kysely";
import db from "@/lib/db";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ message: "unauthorized" }, { status: 401 });
    }

    const schema = z.object({
      account_id: z.string().optional(),
      category_id: z.string().optional(),
      start_date: z.string().optional(),
      end_date: z.string().optional(),
    });

    const searchParams = req.nextUrl.searchParams;
    const query = await schema.parseAsync({
      account_id: searchParams.get("account_id") || undefined,
      category_id: searchParams.get("category_id") || undefined,
      start_date: searchParams.get("start_date") || undefined,
      end_date: searchParams.get("end_date") || undefined,
    });

    let querySql = db
      .selectFrom("transactions as t")
      .where("t.user_id", "=", session.user.id)
      .select([
        sql<string>`to_char(date(transaction_date), 'YYYY-MM-DD')`.as("date"),
        sql<string>`sum(
          case
            when transaction_type_id = '1' then transaction_amount
            else 0
          end
        )`.as("expense"),
        sql<string>`sum(
          case
            when transaction_type_id = '2' then transaction_amount
            else 0
          end
        )`.as("income"),
        sql<string>`sum(
          case
            when transaction_type_id = '1' then transaction_amount
            when transaction_type_id = '2' then transaction_amount
            else 0
          end
        )`.as("total"),
        sql<{ transaction_amount: string }[]>`
              JSON_AGG(
                JSON_BUILD_OBJECT(
                    'transaction_id', t.transaction_id,
                    'transaction_amount', t.transaction_amount::text,
                    'transaction_note', t.transaction_note,
                    'transaction_date', to_char(t.transaction_date, 'YYYY-MM-DD HH24:MI:SS'),
                    'transaction_type_id', t.transaction_type_id,
                    'transaction_type_name', t.transaction_type_name,
                    'category_id', t.category_id,
                    'category_name', t.category_name,
                    'category_type_id', t.category_type_id,
                    'category_type_name', t.category_type_name,
                    'account_id', t.account_id,
                    'account_name', t.account_name,
                    'transfer_id', t.transfer_id,
                    'transfer_amount', t.transfer_amount::text,
                    'transfer_note', t.transfer_note,
                    'transfer_date', to_char(t.transfer_date, 'YYYY-MM-DD HH24:MI:SS'),
                    'transfer_from_account_id', t.transfer_from_account_id,
                    'transfer_to_account_id', t.transfer_to_account_id,
                    'debt_payment_id', t.debt_payment_id,
                    'debt_payment_amount', t.debt_payment_amount::text,
                    'debt_payment_note', t.debt_payment_note,
                    'debt_payment_date', to_char(t.debt_payment_date, 'YYYY-MM-DD HH24:MI:SS'),
                    'debt_payment_from_account_id', t.debt_payment_from_account_id,
                    'debt_payment_to_account_id', t.debt_payment_to_account_id
                ) order by t.transaction_date desc
              )
            `.as("transactions"),
      ])
      .groupBy("date")
      .orderBy("date desc");
    if (query.account_id) {
      querySql = querySql.where("account_id", "=", query.account_id);
    }
    if (query.category_id) {
      querySql = querySql.where("category_id", "=", query.category_id);
    }
    if (query.start_date) {
      querySql = querySql.where(
        "transaction_date",
        ">=",
        new Date(query.start_date)
      );
    }
    if (query.end_date) {
      querySql = querySql.where(
        "transaction_date",
        "<=",
        new Date(query.end_date)
      );
    }

    const transactions = await querySql.execute();

    return Response.json(transactions);
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 500 });
  }
}
