import Link from "next/link";
import { notFound } from "next/navigation";
import { features } from "@/lib/features/data";
import type { Feature } from "@/lib/features/types";
import { colors } from "@/lib/theme";
import FeatureDetailClient from "@/components/FeatureDetailClient";

const statusLabel = (status: Feature["status"]) =>
  status === "released" ? "Released" : "In Progress";

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const getFeatureById = (id: string): Feature | undefined =>
  features.find((feature) => feature.id === id);

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function FeatureDetailPage({ params }: PageProps) {
  const { id } = await params;
  const feature = getFeatureById(id);

  if (!feature) {
    return notFound();
  }

  return <FeatureDetailClient feature={feature} />;
}
