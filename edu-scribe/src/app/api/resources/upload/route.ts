import { NextResponse } from "next/server";
import { UploadUserTask } from "../../../../lib/api";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (token) {
    try {
      const formData = await request.formData();
      const id = formData.get("id");
      formData.delete("id");

      if (!id) {
        return NextResponse.json(
          { message: "Task ID is missing" },
          { status: 400 }
        );
      }

      const res = await UploadUserTask(token.value, formData, Number(id));
      return NextResponse.json(res);
    } catch (error) {
      console.error("Error uploading resource:", error);
      return NextResponse.json(
        { message: "Could not upload resource" },
        { status: 400 }
      );
    }
  }

  return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
}
