import { NextResponse } from "next/server";
import { RemoveCourse } from "../../../../lib/api";
import { cookies } from "next/headers";

export async function DELETE(request: Request) {
  const { id } = await request.json();
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (token) {
    try {
      await RemoveCourse(token.value, id);
      return NextResponse.json(
        { message: "Course remove successful" },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        { message: "Could not remove course" },
        { status: 400 }
      );
    }
  }
}
