import db from "@/configs/db";
import { NextRequest } from "next/server";
import { z } from "zod";
import dayjs from "dayjs";

export const dynamic = "force-dynamic";

export async function PUT(req: NextRequest) {
  try {
    const userId = req.cookies.get("user_id")?.value;
    if (!userId) return Response.json("user_id not found", { status: 404 });

    const schema = z.object({
      category_id: z.string().min(1),
      category_name: z.string().min(1),
      category_type_id: z.string().min(1),
      category_created_at: z.string().min(1),
    });

    const body = await schema.parseAsync(await req.json());

    const updateCategory = await db
      .updateTable("wallet_category")
      .where("category_id", "=", body.category_id)
      .where("user_id", "=", userId)
      .set({
        category_name: body.category_name,
        category_type_id: body.category_type_id,
        category_created_at: body.category_created_at,
        category_updated_at: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      })
      .executeTakeFirstOrThrow();

    return Response.json(updateCategory);
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 500 });
  }
}
