import { z } from "zod";
import { v4 as uuid } from "uuid";
import * as jose from "jose";
import bcrypt from "bcrypt";
import db from "@/configs/db";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const schema = z.object({
      username: z.string().min(1),
      password: z.string().min(6),
    });
    const body = await schema.parseAsync(await req.json());

    const newUser = await db
      .insertInto("wallet_user")
      .values({
        user_id: uuid(),
        user_name: body.username,
        user_password: await bcrypt.hash(body.password, 10),
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    const userData = {
      user_id: newUser.user_id,
      user_name: newUser.user_name,
    };

    const token = await new jose.SignJWT(userData)
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("30d")
      .sign(new TextEncoder().encode(process.env.SECRET_KEY || ""));

    return Response.json({
      token: token,
      user: userData,
    });
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 500 });
  }
}
