import { NextResponse } from "next/server";
import { UpdateTask } from "../../../../lib/api";
import { cookies } from "next/headers";

export async function PATCH(request: Request) {
  const { id, content, deadline } = await request.json();
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (token) {
    try {
      await UpdateTask(token.value, id, content, deadline);
      return NextResponse.json(
        { message: "Update successful" },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        { message: "Could not update task" },
        { status: 400 }
      );
    }
  }
}
