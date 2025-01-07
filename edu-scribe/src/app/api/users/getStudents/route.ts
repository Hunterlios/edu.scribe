import { NextResponse } from "next/server";
import { GetAllStudentsWithCourses } from "../../../../lib/api";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  if (token) {
    try {
      const res = await GetAllStudentsWithCourses(token.value);
      return NextResponse.json(res);
    } catch (error) {
      return NextResponse.json(
        { message: "Could not get students" },
        { status: 400 }
      );
    }
  }
}
