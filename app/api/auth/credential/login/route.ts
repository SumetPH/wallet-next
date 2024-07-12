import { lucia } from "@/lib/auth";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import db from "@/lib/db";
import { z } from "zod";
import bcrypt from "bcrypt";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    });
    const body = await schema.parseAsync(await req.json());

    const existingUser = await db
      .selectFrom("user")
      .selectAll()
      .where("user.user_provider", "=", "credential")
      .where("user.user_email", "=", body.email)
      .executeTakeFirst();

    if (!existingUser) {
      return Response.json({ message: "email not found" }, { status: 404 });
    }

    const passwordValid = await bcrypt.compare(
      body.password,
      existingUser.user_password!
    );

    if (!passwordValid) {
      return Response.json({ message: "password invalid" }, { status: 401 });
    }

    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    cookies().set("username", existingUser.user_name);

    return Response.json({ message: "login success" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 500 });
  }
}
