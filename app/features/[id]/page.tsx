import { notFound } from "next/navigation";
import FeatureDetailClient from "@/components/FeatureDetailClient";
import type { Feature } from "@/lib/features/types";
import { getGlobalFeatureRepo } from "@/lib/features/globalRepo";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

type PageProps = { params: { id: string } | Promise<{ id: string }> };

export default async function FeatureDetailPage({ params }: PageProps) {
  const { id } = await Promise.resolve(params);

  let feature: Feature | undefined;

  // Resolve from in-process repo (loads from Blob-backed persistence in create()).
  try {
    const repo = await getGlobalFeatureRepo();
    feature = repo.getById(id);
  } catch (err) {
    console.error("Failed to load feature from repo", err);
  }

  // Fallback: fetch via API using a safe absolute base URL (prefer deployed host).
  if (!feature) {
    const baseUrl =
      (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ??
      process.env.NEXT_PUBLIC_BASE_URL;

    if (baseUrl) {
      try {
        const res = await fetch(`${baseUrl}/api/features`, { cache: "no-store" });
        if (res.ok) {
          const data = (await res.json()) as { features?: Feature[] };
          feature = data.features?.find((f) => f.id === id);
        } else {
          console.error(`Detail API fetch failed: ${res.status} ${res.statusText}`);
        }
      } catch (err) {
        console.error("Failed to load feature via API for detail page", err);
      }
    }
  }

  if (!feature) {
    return notFound();
  }

  return <FeatureDetailClient feature={feature} />;
}
