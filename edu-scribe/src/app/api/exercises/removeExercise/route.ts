import { NextResponse } from "next/server";
import { RemoveExercise } from "../../../../lib/api";
import { cookies } from "next/headers";

export async function DELETE(request: Request) {
  const { id } = await request.json();
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (token) {
    try {
      await RemoveExercise(token.value, id);
      return NextResponse.json(
        { message: "Exercise remove successful" },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        { message: "Could not remove exercise" },
        { status: 400 }
      );
    }
  }
}
