import authConfig from "@/lib/auth.config";
import NextAuth from "next-auth";
import { privateRoutes } from "./route";

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  // Your custom middleware logic goes here
  //   console.log("Middleware executed", req.nextUrl.pathname);
  //   console.log(req.auth);

  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;
  const url = "http://localhost:3000";

  const isPrivateRoute = privateRoutes.includes(nextUrl.pathname);
  const isAuthRoute = nextUrl.pathname.includes("/auth"); //  all routes under auth folder
  const isApiRoute = nextUrl.pathname.includes("/api");

  if (isApiRoute) return;

  if (isLoggedIn && isAuthRoute) return Response.redirect(`${url}/dashboard`);

  if (isAuthRoute && !isLoggedIn) return;

  if (!isLoggedIn && isPrivateRoute) {
    return Response.redirect(`${url}/auth/login`);
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
