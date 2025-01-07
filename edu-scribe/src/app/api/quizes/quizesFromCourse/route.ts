import { NextResponse } from "next/server";
import { QuizesFromCourse } from "../../../../lib/api";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const { id } = await request.json();
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  if (token) {
    try {
      const res = await QuizesFromCourse(token.value, id);
      return NextResponse.json(res);
    } catch (error) {
      return NextResponse.json(
        { message: "Could not get quizzes" },
        { status: 400 }
      );
    }
  }
}
