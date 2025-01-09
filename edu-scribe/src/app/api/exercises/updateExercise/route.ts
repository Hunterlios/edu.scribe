import { NextResponse } from "next/server";
import { UpdateExercise } from "../../../../lib/api";
import { cookies } from "next/headers";

export async function PATCH(request: Request) {
  const { id, exerciseData } = await request.json();
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (token) {
    try {
      await UpdateExercise(token.value, id, exerciseData);
      return NextResponse.json(
        { message: "Course update successful" },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        { message: "Could not update course" },
        { status: 400 }
      );
    }
  }
}
