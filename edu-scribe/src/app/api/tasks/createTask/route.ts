import { NextResponse } from "next/server";
import { AddTask } from "../../../../lib/api";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const { courseId, contents, deadline } = await request.json();
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (token) {
    try {
      await AddTask(token.value, courseId, deadline, contents);
      return NextResponse.json(
        { message: "Task add successful" },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        { message: "Could not add task" },
        { status: 400 }
      );
    }
  }
}
