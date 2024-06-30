import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    return Response.json("user_id: " + req.cookies.get("user_id")?.value);
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 500 });
  }
}
