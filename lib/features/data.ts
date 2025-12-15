import { Feature } from "./types";

// Sample entry
  // {
  //   id: "onboarding-flow-v2",
  //   title: "New Onboarding Flow",
  //   description:
  //     "Segment-aware onboarding with progressive disclosure and survey gates driven by Statsig targeting.",
  //   webUrl: "/prototypes/onboarding-flow-v2",
  //   statsigFlags: [
  //     {
  //       name: "enable_new_registration",
  //       isExperiment: false,
  //       isFeatureGate: true,
  //       url: "https://console.statsig.com/0JEh0qdbLTd3W81GsLZa4/gates/enable_new_registration",
  //     },
  //     {
  //       name: "web_dev_test",
  //       isExperiment: true,
  //       isFeatureGate: false,
  //       url: "https://console.statsig.com/0JEh0qdbLTd3W81GsLZa4/experiments/web_dev_test/results",
  //     },
  //     {
  //       name: "survey_gate_enabled",
  //       isExperiment: false,
  //       isFeatureGate: true,
  //     },
  //   ],
  //   dateCreated: "2024-01-22",
  //   dateReleased: "2024-02-26",
  //   owner: "Jason Zurita",
  //   team: "Activation",
  //   status: "released",
  //   pillar: "Pillar Growth",
  // },

export const features: Feature[] = [
  {
    id: "raz-sleep-journal",
    title: "Raz Sleep Journal",
    description:
      "Foundational sleep journal experience with phased rollout and form refinements.",
    webUrl: "https://raz-web-prototype.vercel.app/",
    statsigFlags: [],
    dateCreated: "2025-12-15",
    owner: "Raz Papissian",
    team: "Kids",
    status: "in_progress",
    pillar: "Pillar 2",
  },
  {
    id: "web-library",
    title: "Web Library",
    description:
      "Unified web library for browsing and validating prototypes across teams and pillars.",
    webUrl: "https://thad-vercel-test-d84y.vercel.app/",
    statsigFlags: [],
    dateCreated: "2024-05-12",
    owner: "Team Web",
    team: "Platform",
    status: "in_progress",
    pillar: "Pillar 2",
  },
  {
    id: "catherine-sleep-tracker-proto",
    title: "Catherine Sleep Tracker Proto",
    description:
      "In-app module for sleep logging with timer or manual data entry. No real data hookups",
    webUrl: "https://catherine-test-prototype.vercel.app/",
    statsigFlags: [],
    dateCreated: "2025-12-15",
    owner: "Catherine Hoffman Hammill",
    team: "Kids",
    status: "in_progress",
    pillar: "Pillar 2",
  },
  {
    id: "chat_as_the_primary_interface",
    title: "Chat as the primary interface",
    description:
      "Using chat to change schedule, play favorites and seek information. No real data hookups.",
    webUrl: "https://hatch-ai-chat-poc.vercel.app/experiment",
    statsigFlags: [],
    dateCreated: "2025-12-15",
    owner: "Anoushka Garg",
    team: "Kids",
    status: "in_progress",
    pillar: "Pillar 2",
  },
];
