import { NextResponse } from "next/server";
import { LoginUser } from "../../../../lib/api";
import { serialize } from "cookie";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  try {
    const token = await LoginUser(email, password);

    const serialized = serialize("token", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 4 * 1000,
      expires: new Date(Date.now() + 60 * 60 * 4 * 1000),
    });
    const response = { message: "Login successful" };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "Set-Cookie": serialized,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }
}
