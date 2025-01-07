import { NextResponse } from "next/server";
import { Download } from "../../../../lib/api";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const { downloadLink, fileName } = await request.json();
  const cookieStore = await cookies();
  const token = cookieStore.get("token");
  if (token) {
    try {
      const res = await Download(token.value, downloadLink);
      const contentType =
        res.headers.get("content-type") || "application/octet-stream";
      const contentDisposition =
        res.headers.get("content-disposition") ||
        `attachment; filename="${fileName}"`;

      // Create a response with proper headers and stream the file
      const fileStream = res.body;

      return new Response(fileStream, {
        headers: {
          "Content-Type": contentType,
          "Content-Disposition": contentDisposition,
        },
      });
    } catch (error) {
      return NextResponse.json(
        { message: "Could not download file" },
        { status: 400 }
      );
    }
  }
}
