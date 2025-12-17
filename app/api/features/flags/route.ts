import { NextResponse } from "next/server";
import { getGlobalFeatureRepo } from "@/lib/features/globalRepo";
import type { StatsigFlagRef } from "@/lib/features/types";

const badRequest = (message: string) =>
  NextResponse.json({ error: message }, { status: 400 });

type Payload = {
  featureId: string;
  flag: StatsigFlagRef;
};

export async function POST(req: Request) {
  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return badRequest("Invalid JSON payload");
  }

  const { featureId, flag } = body ?? {};

  if (!featureId || !flag) {
    return badRequest("featureId and flag are required");
  }

  const repo = await getGlobalFeatureRepo();
  const feature = await repo.addStatsigFlag(featureId, flag);

  if (!feature) {
    return NextResponse.json({ error: "Feature not found" }, { status: 404 });
  }

  const features = await repo.getAllAsync();
  return NextResponse.json({ feature, features });
}
