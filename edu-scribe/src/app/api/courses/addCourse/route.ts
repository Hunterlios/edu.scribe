import { NextResponse } from "next/server";
import { AddCourse } from "../../../../lib/api";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const { name, zoomLink, zoomPasscode, date } = await request.json();
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (token) {
    try {
      await AddCourse(token.value, name, zoomLink, zoomPasscode, date);
      return NextResponse.json(
        { message: "Course add successful" },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        { message: "Could not add course" },
        { status: 400 }
      );
    }
  }
}
