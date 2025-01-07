import { NextResponse } from "next/server";
import { DeclineAddUserToCourse } from "../../../../lib/api";
import { cookies } from "next/headers";

export async function DELETE(request: Request) {
  const { id } = await request.json();
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (token) {
    try {
      await DeclineAddUserToCourse(token.value, id);
      return NextResponse.json(
        { message: "Decline successful" },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        { message: "Could not decline user" },
        { status: 400 }
      );
    }
  }
}
