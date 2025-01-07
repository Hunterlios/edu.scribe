import { NextResponse } from "next/server";
import { UpdateQuiz } from "../../../../lib/api";
import { cookies } from "next/headers";

export async function PATCH(request: Request) {
  const { id, name } = await request.json();
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (token) {
    try {
      await UpdateQuiz(token.value, id, name);
      return NextResponse.json(
        { message: "Update successful" },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        { message: "Could not update quiz" },
        { status: 400 }
      );
    }
  }
}
