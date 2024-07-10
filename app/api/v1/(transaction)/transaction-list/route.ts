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
      .selectFrom("transactions")
      .where("transactions.user_id", "=", session.user.id)
      .select([
        sql<string>`to_char(date(transaction_created_at), 'YYYY-MM-DD')`.as(
          "date"
        ),
        sql<string>`coalesce(sum(case when category_type_id = '1' then transaction_amount else 0 end), 0)`.as(
          "expense"
        ),
        sql<string>`coalesce(sum(case when category_type_id = '2' then transaction_amount else 0 end), 0)`.as(
          "income"
        ),
        sql<string>`
              coalesce(sum(case when category_type_id = '2' then transaction_amount else 0 end), 0) - 
              coalesce(sum(case when category_type_id = '1' then transaction_amount else 0 end), 0)
            `.as("total"),
        sql<{ transaction_amount: string }[]>`
              JSON_AGG(
                JSON_BUILD_OBJECT(
                    'transaction_id', transaction_id,
                    'transaction_amount', 
                      case 
                        when category_type_id = '1' then '-' || transaction_amount::text 
                        when transfer_type_id = '1' then '-' || transaction_amount::text 
                        else transaction_amount::text 
                      end,
                    'transaction_note', transaction_note,
                    'transaction_created_at', to_char(transaction_created_at, 'YYYY-MM-DD HH24:MI:SS'),
                    'category_id', category_id,
                    'category_name', category_name,
                    'category_type_id', category_type_id,
                    'category_type_name', category_type_name,
                    'account_id', account_id,
                    'account_name', account_name,
                    'transfer_type_id', transfer_type_id,
                    'transfer_type_name', transfer_type_name
                ) order by transaction_created_at desc
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
        "transaction_created_at",
        ">=",
        new Date(query.start_date)
      );
    }
    if (query.end_date) {
      querySql = querySql.where(
        "transaction_created_at",
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
