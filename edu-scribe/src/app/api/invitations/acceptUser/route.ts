import { NextResponse } from "next/server";
import { AddUserToCourse } from "../../../../lib/api";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const { id } = await request.json();
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  if (token) {
    try {
      await AddUserToCourse(token.value, id);
      return NextResponse.json(
        { message: "Add user to course successful" },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        { message: "Could not add user to course" },
        { status: 400 }
      );
    }
  }
}
