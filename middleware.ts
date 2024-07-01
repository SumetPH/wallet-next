import { NextRequest } from "next/server";
import AuthMiddleware from "./middlewares/authMiddleware";

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.includes("/api")) {
    // api middleware
    // list of api routes protected
    const routes = [
      "/api/v1/auth/user",
      "/api/v1/account-list",
      "/api/v1/account-create",
      "/api/v1/account-update",
      "/api/v1/account-delete",
      "/api/v1/transaction-list",
      "/api/v1/transaction-create",
      "/api/v1/transaction-update",
      "/api/v1/transaction-delete",
      "/api/v1/budget-list",
      "/api/v1/budget-create",
      "/api/v1/budget-update",
      "/api/v1/budget-delete",
      "/api/v1/category-list",
      "/api/v1/category-create",
      "/api/v1/category-update",
      "/api/v1/category-delete",
    ];

    if (routes.includes(req.nextUrl.pathname)) {
      const auth = await AuthMiddleware(req);
      if (!auth.status) {
        return Response.json(auth, { status: 401 });
      }

      return auth.res;
    }
  } else {
    // front-end middleware
    // check if user is logged in
    const user = req.cookies.get("user")?.value;

    if (!user && !req.nextUrl.pathname.startsWith("/login")) {
      return Response.redirect(new URL("/login", req.url));
    }

    if (user && req.nextUrl.pathname.startsWith("/login")) {
      return Response.redirect(new URL("/transaction", req.url));
    }
  }
}
