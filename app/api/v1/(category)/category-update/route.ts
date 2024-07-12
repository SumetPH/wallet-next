import db from "@/lib/db";
import { NextRequest } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ message: "unauthorized" }, { status: 401 });
    }

    const schema = z.object({
      category_id: z.string().min(1),
      category_name: z.string().min(1),
      category_type_id: z.string().min(1),
      category_date: z.string().min(1),
    });

    const body = await schema.parseAsync(await req.json());

    const updateCategory = await db
      .updateTable("category")
      .where("user_id", "=", session.user.id)
      .where("category_id", "=", body.category_id)
      .set({
        category_name: body.category_name,
        category_type_id: body.category_type_id,
        category_date: body.category_date,
      })
      .executeTakeFirstOrThrow();

    return Response.json(updateCategory);
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 500 });
  }
}
