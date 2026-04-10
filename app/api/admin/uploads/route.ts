import { NextResponse } from "next/server";
import { UploadApiErrorResponse, UploadApiResponse } from "cloudinary";
import { requireAdmin } from "@/lib/admin";
import { cloudinary } from "@/lib/cloudinary";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const auth = await requireAdmin();

  if (!auth.authorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const files = formData.getAll("files") as File[];

  if (!files.length) {
    return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
  }

  const folder =
    process.env.CLOUDINARY_UPLOAD_FOLDER || "brand2brands/products";

  const uploaded: {
    url: string;
    public_id: string;
    width: number;
    height: number;
    original_filename: string;
  }[] = [];

  for (const file of files) {
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: `Invalid file type: ${file.name}` },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "image"
        },
        (
          error: UploadApiErrorResponse | undefined,
          result: UploadApiResponse | undefined
        ) => {
          if (error) {
            reject(error);
            return;
          }

          if (!result) {
            reject(new Error("Cloudinary upload failed: no result returned"));
            return;
          }

          resolve(result);
        }
      );

      stream.end(buffer);
    });

    uploaded.push({
      url: result.secure_url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      original_filename: result.original_filename
    });
  }

  return NextResponse.json({
    success: true,
    files: uploaded
  });
}