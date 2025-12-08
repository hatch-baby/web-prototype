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
};

export type StatsigFlagRef = {
  name: string;
  isExperiment: boolean;
  isFeatureGate: boolean;
  url?: string;
};
