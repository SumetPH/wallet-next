import db from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const accountTypes = await db
      .selectFrom("category_type")
      .selectAll()
      .orderBy("category_type_id asc")
      .execute();
    return Response.json(accountTypes, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json(error, { status: 500 });
  }
}
