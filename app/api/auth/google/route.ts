import { googleAuth } from "@/lib/auth";
import { generateState } from "arctic";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const state = generateState();
    const url = await googleAuth.createAuthorizationURL(
      state,
      process.env.SECRET_KEY!,
      {
        scopes: ["profile", "email"],
      }
    );

    return Response.json({ url }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 500 });
  }
}
