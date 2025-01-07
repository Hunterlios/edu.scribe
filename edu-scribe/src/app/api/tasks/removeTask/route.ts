import { NextResponse } from "next/server";
import { RemoveTask } from "../../../../lib/api";
import { cookies } from "next/headers";

export async function DELETE(request: Request) {
  const { taskId } = await request.json();
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (token) {
    try {
      await RemoveTask(token.value, taskId);
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
