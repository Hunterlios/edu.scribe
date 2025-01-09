import { NextResponse } from "next/server";
import { GetMyUrgentTasks } from "../../../../lib/api";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  if (token) {
    try {
      const res = await GetMyUrgentTasks(token.value);
      return NextResponse.json(res);
    } catch (error) {
      return NextResponse.json(
        { message: "Could not get urgent tasks" },
        { status: 400 }
      );
    }
  }
}
