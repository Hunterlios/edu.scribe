import { NextResponse } from "next/server";
import { RegisterNewStudent } from "../../../../lib/api";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const { id } = await request.json();
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  if (token) {
    try {
      await RegisterNewStudent(token.value, id);
      return NextResponse.json(
        { message: "Registration successful" },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        { message: "Could not register student" },
        { status: 400 }
      );
    }
  }
}
