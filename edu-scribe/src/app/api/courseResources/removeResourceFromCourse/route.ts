import { NextResponse } from "next/server";
import { RemoveCourseResource } from "../../../../lib/api";
import { cookies } from "next/headers";

export async function DELETE(request: Request) {
  const { downloadURL } = await request.json();
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (token) {
    try {
      await RemoveCourseResource(token.value, downloadURL);
      return NextResponse.json(
        { message: "Resource remove successful" },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        { message: "Could not remove resource" },
        { status: 400 }
      );
    }
  }
}
