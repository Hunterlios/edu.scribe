import { NextResponse } from "next/server";
import { UpdateUserProfile } from "../../../../lib/api";
import { cookies } from "next/headers";

export async function PATCH(request: Request) {
  const { id, firstName, lastName, email, profilePictureVersion } =
    await request.json();
  const cookieStore = await cookies();
  const token = cookieStore.get("token");

  if (token) {
    try {
      await UpdateUserProfile(
        token.value,
        id,
        firstName,
        lastName,
        email,
        profilePictureVersion
      );
      return NextResponse.json(
        { message: "Update successful" },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        { message: "Could not update user" },
        { status: 400 }
      );
    }
  }
}
