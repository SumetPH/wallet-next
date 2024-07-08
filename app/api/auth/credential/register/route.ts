import { z } from "zod";
import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";
import db from "@/lib/db";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const schema = z.object({
      email: z.string().email(),
      username: z.string().min(1),
      password: z.string().min(6),
    });
    const body = await schema.parseAsync(await req.json());

    const newUser = await db
      .insertInto("wallet_user")
      .values({
        id: uuid(),
        user_email: body.email,
        user_name: body.username,
        user_password: await bcrypt.hash(body.password, 10),
        user_provider: "credential",
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return Response.json({
      id: newUser.id,
      user_name: newUser.user_name,
    });
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 500 });
  }
}
