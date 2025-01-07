import { NextResponse } from "next/server";
import { RegisterUser } from "../../../../lib/api";

export async function POST(request: Request) {
  const { firstName, lastName, email } = await request.json();
  try {
    await RegisterUser(firstName, lastName, email);
    return NextResponse.json(
      { message: "Registration successful" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Could not register user" },
      { status: 400 }
    );
  }
}
