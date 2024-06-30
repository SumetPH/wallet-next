import { z } from "zod";
import * as jose from "jose";
import bcrypt from "bcrypt";
import db from "@/configs/db";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(res: NextRequest) {
  try {
    const schema = z.object({
      username: z.string().min(1),
      password: z.string().min(6),
    });
    const body = await schema.parseAsync(await res.json());

    const user = await db
      .selectFrom("wallet_user")
      .selectAll()
      .where("wallet_user.user_name", "=", body.username)
      .executeTakeFirst();

    if (!user) {
      return Response.json("User not found", { status: 404 });
    }

    const passwordValid = await bcrypt.compare(
      body.password,
      user.user_password
    );

    if (!passwordValid) {
      return Response.json("Invalid password", { status: 401 });
    }

    const userData = {
      user_id: user.user_id,
      user_name: user.user_name,
    };

    const secret = process.env.SECRET_KEY || "";
    const token = await new jose.SignJWT(userData)
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("30d")
      .sign(new TextEncoder().encode(secret));

    return Response.json(
      {
        token: token,
        user: userData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 500 });
  }
}
