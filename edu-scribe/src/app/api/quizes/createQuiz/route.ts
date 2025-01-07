import { NextResponse } from "next/server";
import { AddQuiz } from "../../../../lib/api";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const { courseId, name } = await request.json();
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (token) {
    try {
      await AddQuiz(token.value, courseId, name);
      return NextResponse.json(
        { message: "Quiz add successful" },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        { message: "Could not add quiz" },
        { status: 400 }
      );
    }
  }
}
