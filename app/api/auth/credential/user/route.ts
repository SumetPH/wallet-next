import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ message: "unauthorized" }, { status: 401 });
    }

    return Response.json(
      { user: session.user, message: "success" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 500 });
  }
}
