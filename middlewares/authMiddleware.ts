import { NextResponse, type NextRequest } from "next/server";
import * as jose from "jose";

export default async function AuthMiddleware(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return { status: false, message: "token not found" };
  }

  const secret = process.env.SECRET_KEY || "";
  try {
    const data: any = await jose.jwtVerify(
      token,
      new TextEncoder().encode(secret)
    );

    const res = NextResponse.next();
    res.cookies.set("user_id", data.payload.user_id);

    return { status: true, res };
  } catch (error) {
    return { status: false, message: "invalid token" };
  }
}
