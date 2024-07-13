import { googleAuth, lucia } from "@/lib/auth";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import db from "@/lib/db";
import { v4 as uuid } from "uuid";
import dayjs from "dayjs";

interface GoogleUser {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
}

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (!code || !state) {
      return Response.redirect(new URL("/login", req.url));
    }

    const tokens = await googleAuth.validateAuthorizationCode(
      code,
      process.env.SECRET_KEY!
    );
    const googleUserResponse = await fetch(
      "https://openidconnect.googleapis.com/v1/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );
    const googleUser: GoogleUser = await googleUserResponse.json();

    const existingUser = await db
      .selectFrom("user")
      .where("user_email", "=", googleUser.email)
      .selectAll()
      .executeTakeFirst();

    if (existingUser) {
      const session = await lucia.createSession(existingUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
      cookies().set("username", existingUser.user_name, {
        expires: dayjs().add(1, "years").toDate(),
      });
    } else {
      const userId = uuid();
      await db
        .insertInto("user")
        .values({
          id: userId,
          user_email: googleUser.email,
          user_name: googleUser.name,
          user_provider: "google",
        })
        .executeTakeFirstOrThrow();
      const session = await lucia.createSession(userId, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
      cookies().set("username", googleUser.name, {
        expires: dayjs().add(1, "years").toDate(),
      });
    }

    return Response.redirect(new URL("/transaction", req.url));
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 500 });
  }
}
