export type Feature = {
  id: string;
  title: string;
  webUrl: string;
  statsigFlags: StatsigFlagRef[];
  dateCreated: string;
  dateReleased?: string;
  description: string;
  owner: string;
  team: string;
  status: "In Discovery" | "In Experiment" | "Released";
  pillar: Pillar;
};

export type StatsigFlagRef = {
  name: string;
  isExperiment: boolean;
  isFeatureGate: boolean;
  url?: string;
};

export type Pillar =
  | "Pillar 0"
  | "Pillar 1"
  | "Pillar 2"
  | "Pillar Growth";
