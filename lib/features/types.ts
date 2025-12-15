export type Feature = {
  id: string;
  title: string;
  webUrl: string;
  statsigFlags: StatsigFlagRef[];
  dateCreated: string;
  dateReleased?: string;
  description: string;
  owner: string;
  team: Team;
  status: FeatureStatus;
  pillar: Pillar;
};

export type StatsigFlagRef = {
  name: string;
  isExperiment: boolean;
  isFeatureGate: boolean;
  url?: string;
};

export type FeatureStatus = "in_progress" | "released";

export type Team =
  | "Activation"
  | "Client Experience"
  | "Platform"
  | "Growth"
  | "Experiments"
  | "Kids";

export type Pillar =
  | "Pillar 0"
  | "Pillar 1"
  | "Pillar 2"
  | "Pillar Growth";
