import db from "@/configs/db";
import { NextRequest } from "next/server";
import { z } from "zod";
import { v4 as uuid } from "uuid";
import dayjs from "dayjs";

export const dynamic = "force-dynamic";

export async function DELETE(req: NextRequest) {
  try {
    const userId = req.cookies.get("user_id")?.value;
    if (!userId) return Response.json("user_id not found", { status: 404 });

    const schema = z.object({
      category_id: z.string().min(1),
    });

    const body = await schema.parseAsync(await req.json());

    const deleteCategory = await db
      .deleteFrom("wallet_category")
      .where("category_id", "=", body.category_id)
      .where("user_id", "=", userId)
      .executeTakeFirstOrThrow();

    return Response.json(deleteCategory);
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 500 });
  }
}
