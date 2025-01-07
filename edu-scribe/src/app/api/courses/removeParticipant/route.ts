import { NextResponse } from "next/server";
import { RemoveCourseParticipant } from "../../../../lib/api";
import { cookies } from "next/headers";

export async function PATCH(request: Request) {
  const { courseId, id } = await request.json();
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (token) {
    try {
      await RemoveCourseParticipant(token.value, id, courseId);
      return NextResponse.json(
        { message: "Participant remove successful" },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        { message: "Could not remove participant" },
        { status: 400 }
      );
    }
  }
}
