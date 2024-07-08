import db from "@/lib/db";
import { NextRequest } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ message: "unauthorized" }, { status: 401 });
    }

    const schema = z.object({
      category_id: z.string().min(1),
    });

    const body = await schema.parseAsync(await req.json());

    const deleteCategory = await db
      .deleteFrom("wallet_category")
      .where("category_id", "=", body.category_id)
      .where("user_id", "=", session.user.id)
      .executeTakeFirstOrThrow();

    return Response.json(deleteCategory);
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 500 });
  }
}
