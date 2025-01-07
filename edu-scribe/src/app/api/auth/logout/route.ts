import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (token) {
    try {
      cookieStore.set("token", "", { expires: new Date(0) });
      return NextResponse.json(
        { message: "Logout successful" },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json({ message: "Logout failed" }, { status: 500 });
    }
  }
}
