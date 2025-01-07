import { NextResponse } from "next/server";
import { UpdateCourse } from "../../../../lib/api";
import { cookies } from "next/headers";

export async function PATCH(request: Request) {
  const { id, name, zoomLink, zoomPasscode, date } = await request.json();
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (token) {
    try {
      await UpdateCourse(token.value, id, name, zoomLink, zoomPasscode, date);
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
