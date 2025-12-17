import { NextResponse } from "next/server";
import { getGlobalFeatureRepo } from "@/lib/features/globalRepo";
import type { Feature } from "@/lib/features/types";

const badRequest = (message: string) =>
  NextResponse.json({ error: message }, { status: 400 });

export async function GET() {
  const repo = await getGlobalFeatureRepo();
  const features = await repo.getAllAsync();
  return NextResponse.json({ features });
}

export async function POST(req: Request) {
  let feature: Feature;
  try {
    feature = (await req.json()) as Feature;
  } catch {
    return badRequest("Invalid JSON payload");
  }

  const repo = await getGlobalFeatureRepo();
  await repo.add(feature);

  const features = await repo.getAllAsync();
  return NextResponse.json({ feature, features });
}

export async function PUT(req: Request) {
  let feature: Feature;
  try {
    feature = (await req.json()) as Feature;
  } catch {
    return badRequest("Invalid JSON payload");
  }

  if (!feature.id) {
    return badRequest("Feature id is required");
  }

  const repo = await getGlobalFeatureRepo();
  await repo.update(feature);

  const features = await repo.getAllAsync();
  return NextResponse.json({ feature, features });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return badRequest("Feature id is required");
  }

  const repo = await getGlobalFeatureRepo();
  const deleted = await repo.delete(id);

  if (!deleted) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const features = await repo.getAllAsync();
  return NextResponse.json({ features });
}
