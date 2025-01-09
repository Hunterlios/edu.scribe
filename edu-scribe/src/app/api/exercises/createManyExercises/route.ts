import { NextResponse } from "next/server";
import { CreateManyExercises } from "../../../../lib/api";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const { createManyExercise } = await request.json();
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  if (token) {
    try {
      const res = await CreateManyExercises(token.value, createManyExercise);
      return NextResponse.json(
        { message: "Created many exercises" },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        { message: "Could not create many exercises" },
        { status: 400 }
      );
    }
  }
}
