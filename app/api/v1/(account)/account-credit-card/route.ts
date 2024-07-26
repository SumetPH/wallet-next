import { sql } from "kysely";
import db from "@/lib/db";
import { getSession } from "@/lib/auth";
import dayjs from "dayjs";
import { z } from "zod";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ message: "unauthorized" }, { status: 401 });
    }

    const schema = z.object({
      account_id: z.string().min(1),
      account_date: z.string().min(1),
    });

    const searchParams = req.nextUrl.searchParams;
    const query = await schema.parseAsync({
      account_id: searchParams.get("account_id") || undefined,
      account_date: searchParams.get("account_date") || undefined,
    });

    const user_id = session.user.id;
    const account_id = query.account_id;
    const account_date = dayjs(query.account_date)
      .date(20)
      .subtract(1, "month")
      .format("YYYY-MM-DD");

    const result = await sql<{
      start_date: string;
      end_date: string;
      expense: string;
      income: string;
      balance: string;
    }>`
         with month_list as (
            select
                gs as start_date,
                gs + interval '1 month - 1 day' as end_date
            from 
                generate_series(${account_date}, current_date, '1 month') as gs
        )
        select
            to_char(ml.start_date, 'YYYY-MM-DD') as start_date,
            to_char(ml.end_date, 'YYYY-MM-DD') as end_date,
            sum(
                case 
                    when t.transaction_type_id = '1' 
                        then t.transaction_amount
                    when t.transaction_type_id = '5' 
                        then t.transaction_amount
                    else 0
                end
            ) as expense,
            coalesce(
                (
                    select 
                        sum(transaction_amount) 
                    from 
                        transactions 
                    where
                        user_id = ${user_id}
                        and transaction_type_id = '6' 
                        and transaction_date >= to_char(ml.end_date, 'YYYY-MM-05')::date
                        and transaction_date <= to_char(ml.end_date, 'YYYY-MM-05')::date + interval '1 month'
                        and account_type_id = '3'
                ), 0
            ) as income,
            (
                sum(
                    case 
                        when t.transaction_type_id = '1' 
                            then t.transaction_amount
                        when t.transaction_type_id = '5' 
                            then t.transaction_amount
                        else 0
                    end
                )
                +
                coalesce(
                    (
                        select 
                            sum(transaction_amount) 
                        from 
                            transactions 
                        where 
                            user_id = ${user_id}
                            and transaction_type_id = '6' 
                            and transaction_date >= to_char(ml.end_date, 'YYYY-MM-05')::date
                            and transaction_date <= to_char(ml.end_date, 'YYYY-MM-05')::date + interval '1 month'
                            and account_type_id = '3'
                    ), 0
                )
            ) as balance
        from 
            month_list ml
        left join transactions t 
            on t.transaction_date >= ml.start_date
            and t.transaction_date <= ml.end_date
        where 
            t.account_type_id = '3'
            and t.account_id = ${account_id}
            and t.user_id = ${user_id}
            or t.account_type_id is null
        group by 
            ml.start_date, ml.end_date
        order by 
            ml.start_date
    `.execute(db);

    return Response.json(result.rows);
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 500 });
  }
}
