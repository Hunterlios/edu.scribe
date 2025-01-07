import { NextResponse } from "next/server";
import { ChangePassword } from "../../../../lib/api";
import { cookies } from "next/headers";

export async function PATCH(request: Request) {
  const { currentPassword, newPassword } = await request.json();
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (token) {
    try {
      await ChangePassword(token.value, currentPassword, newPassword);
      return NextResponse.json(
        { message: "Password change successful" },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        { message: "Could not change password" },
        { status: 400 }
      );
    }
  }
}
