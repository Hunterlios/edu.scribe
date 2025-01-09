import { NextResponse } from "next/server";
import { CreateExercise } from "../../../../lib/api";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const { exerciseData } = await request.json();
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  if (token) {
    try {
      const res = await CreateExercise(token.value, exerciseData);
      return NextResponse.json(
        { message: "Created exercise" },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        { message: "Could not create exercise" },
        { status: 400 }
      );
    }
  }
}
