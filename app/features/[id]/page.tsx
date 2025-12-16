import { notFound } from "next/navigation";
import FeatureDetailClient from "@/components/FeatureDetailClient";
import { getGlobalFeatureRepo } from "@/lib/features/globalRepo";

export const dynamic = "force-dynamic";

type PageProps = { params: { id: string } | Promise<{ id: string }> };

export default async function FeatureDetailPage({ params }: PageProps) {
  const { id } = await Promise.resolve(params);
  const repo = await getGlobalFeatureRepo();
  const feature = repo.getById(id);
  if (!feature) {
    return notFound();
  }

  return <FeatureDetailClient feature={feature} />;
}
