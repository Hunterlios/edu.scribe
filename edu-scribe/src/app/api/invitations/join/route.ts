import { NextResponse } from "next/server";
import { JoinCourse } from "../../../../lib/api";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const { id } = await request.json();
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  if (token) {
    try {
      await JoinCourse(token.value, id);
      return NextResponse.json(
        { message: "Join request to course successful" },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        { message: "Could not send join request to course" },
        { status: 400 }
      );
    }
  }
}
