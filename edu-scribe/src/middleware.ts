import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function middleware(request: any) {
  const token = await request.cookies.get("token")?.value;
  if (token) {
    try {
      const decodedToken = jwt.decode(token);

      if (
        !decodedToken ||
        typeof decodedToken === "string" ||
        !decodedToken.exp
      ) {
        throw new Error("Invalid token");
      }
      const isExpired = decodedToken.exp * 1000 < Date.now();
      if (isExpired) {
        return NextResponse.redirect(
          new URL("http://localhost:3000/login", request.url)
        );
      }
      if (request.url === "http://localhost:3000/login" && !isExpired) {
        return NextResponse.redirect("http://localhost:3000/platform");
      }
      return NextResponse.next();
    } catch (error) {
      console.error("Error decoding token:", error);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
  if (!token) {
    if (request.url !== "http://localhost:3000/login") {
      return NextResponse.redirect("http://localhost:3000/login");
    }
    return NextResponse.rewrite(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// Apply this middleware to specific routes that require authentication (e.g., `/platform`)
export const config = {
  matcher: [
    "/platform/:path*",
    "/login",
    "/api/courses/:path*",
    "/api/invitations/:path*",
    "/api/tasks/:path*",
    "/api/users/:path*",
    "/api/resources/:path*",
    "/api/auth/decline",
    "/api/auth/logout",
    "/api/auth/registerNewStudent",
    "/api/auth/registerNewTeacher",
    "/api/auth/requests",
  ], // Protect `/platform` and its sub-routes /platform/:path*
};
