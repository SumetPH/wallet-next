import db from "@/lib/db";
import { NextRequest } from "next/server";
import { z } from "zod";
import { v4 as uuid } from "uuid";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ message: "unauthorized" }, { status: 401 });
    }

    const schema = z.object({
      category_name: z.string().min(1),
      category_type_id: z.string().min(1),
      category_date: z.string().min(1),
    });

    const body = await schema.parseAsync(await req.json());

    const createCategory = await db
      .insertInto("category")
      .values({
        user_id: session.user.id,
        category_id: uuid(),
        category_name: body.category_name,
        category_type_id: body.category_type_id,
        category_date: body.category_date,
      })
      .executeTakeFirstOrThrow();

    return Response.json(createCategory);
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 500 });
  }
}
