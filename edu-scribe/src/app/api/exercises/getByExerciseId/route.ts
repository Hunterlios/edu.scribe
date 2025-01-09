import { NextResponse } from "next/server";
import { GetExerciseById } from "../../../../lib/api";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const { id } = await request.json();
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  if (token) {
    try {
      const res = await GetExerciseById(token.value, id);
      return NextResponse.json(res);
    } catch (error) {
      return NextResponse.json(
        { message: "Could not get the exercise" },
        { status: 400 }
      );
    }
  }
}
