import { Google } from "arctic";
import { Lucia, TimeSpan } from "lucia";
import { NodePostgresAdapter } from "@lucia-auth/adapter-postgresql";
import { Pool } from "pg";
import { cookies } from "next/headers";

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  id: string;
  user_name: string;
  user_date: string;
  user_password: string | null;
  user_provider: string;
  user_email: string;
}

export const adapter = new NodePostgresAdapter(
  new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
  {
    user: "user",
    session: "user_session",
  }
);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      name: attributes.user_name,
      email: attributes.user_email,
      provider: attributes.user_provider,
    };
  },
});

export const googleAuth = new Google(
  process.env.AUTH_GOOGLE_CLIENT_ID!,
  process.env.AUTH_GOOGLE_CLIENT_SECRET!,
  process.env.AUTH_GOOGLE_CALLBACK_URL!
);

export async function getSession() {
  const sessionId = cookies().get(lucia.sessionCookieName)?.value;
  if (!sessionId) return undefined;
  const result = await lucia.validateSession(sessionId);
  if (!result.session) return undefined;
  return result;
}
