import { Feature } from "./types";

export const features: Feature[] = [
  {
    id: "sleep-logging-brief",
    title: "Sleep Logging Brief Prototype",
    description:
      "Streamlined nightly logging flow capturing bedtime routine, latency, and disturbances for better insights.",
    webUrl: "/prototypes/sleep-logging-brief",
    statsigFlags: [
      {
        name: "sleep_logging_brief_enabled",
        isExperiment: false,
        isFeatureGate: true,
        url: "https://console.statsig.com/0JEh0qdbLTd3W81GsLZa4/gates/sleep_logging_brief_enabled",
      },
      {
        name: "sleep_logging_form_refine",
        isExperiment: true,
        isFeatureGate: false,
        url: "https://console.statsig.com/0JEh0qdbLTd3W81GsLZa4/experiments/sleep_logging_form_refine/results",
      },
    ],
    dateCreated: "2024-02-05",
    dateReleased: "2024-03-04",
    owner: "Lorraine",
    team: "Health Insights",
    status: "Released",
    pillar: "Pillar 1",
  },
  {
    id: "onboarding-flow-v2",
    title: "New Onboarding Flow",
    description:
      "Segment-aware onboarding with progressive disclosure and survey gates driven by Statsig targeting.",
    webUrl: "/prototypes/onboarding-flow-v2",
    statsigFlags: [
      {
        name: "enable_new_registration",
        isExperiment: false,
        isFeatureGate: true,
        url: "https://console.statsig.com/0JEh0qdbLTd3W81GsLZa4/gates/enable_new_registration",
      },
      {
        name: "web_dev_test",
        isExperiment: true,
        isFeatureGate: false,
        url: "https://console.statsig.com/0JEh0qdbLTd3W81GsLZa4/experiments/web_dev_test/results",
      },
      {
        name: "survey_gate_enabled",
        isExperiment: false,
        isFeatureGate: true,
      },
    ],
    dateCreated: "2024-01-22",
    dateReleased: "2024-02-26",
    owner: "Jason Zurita",
    team: "Activation",
    status: "Released",
    pillar: "Pillar Growth",
  },
  {
    id: "client-dashboard-v2",
    title: "Client Dashboard v2",
    description:
      "Revamped dashboard with live health signals, usage insights, and configurable tiles.",
    webUrl: "/prototypes/client-dashboard-v2",
    statsigFlags: [
      {
        name: "dashboard_v2_rollout",
        isExperiment: false,
        isFeatureGate: true,
        url: "https://console.statsig.com/0JEh0qdbLTd3W81GsLZa4/gates/dashboard_v2_rollout",
      },
      {
        name: "live_health_widget",
        isExperiment: true,
        isFeatureGate: false,
        url: "https://console.statsig.com/0JEh0qdbLTd3W81GsLZa4/experiments/live_health_widget/results",
      },
    ],
    dateCreated: "2024-03-04",
    dateReleased: "2024-04-08",
    owner: "Priya Raman",
    team: "Client Experience",
    status: "Released",
    pillar: "Pillar 0",
  },
  {
    id: "media-collage-editor",
    title: "Media Collage Editor",
    description:
      "Drag-and-drop collage workspace with live previews, layout presets, and export profiles.",
    webUrl: "/prototypes/media-collage-editor",
    statsigFlags: [
      {
        name: "collage_editor_alpha",
        isExperiment: false,
        isFeatureGate: true,
      },
      {
        name: "render_pipeline_upgrade",
        isExperiment: true,
        isFeatureGate: false,
        url: "https://console.statsig.com/0JEh0qdbLTd3W81GsLZa4/experiments/render_pipeline_upgrade/results",
      },
    ],
    dateCreated: "2024-03-18",
    dateReleased: "2024-04-15",
    owner: "Cam Nguyen",
    team: "Creation",
    status: "In Experiment",
    pillar: "Pillar 2",
  },
  {
    id: "activation-journey-experiments",
    title: "Activation Journey Experiments",
    description:
      "Multi-variant activation paths to raise week-one engagement and milestone completion.",
    webUrl: "/prototypes/activation-journey-experiments",
    statsigFlags: [
      {
        name: "activation_journey_multivariate",
        isExperiment: true,
        isFeatureGate: false,
        url: "https://console.statsig.com/0JEh0qdbLTd3W81GsLZa4/experiments/activation_journey_multivariate/results",
      },
      {
        name: "milestone_notifications",
        isExperiment: false,
        isFeatureGate: true,
        url: "https://console.statsig.com/0JEh0qdbLTd3W81GsLZa4/gates/milestone_notifications",
      },
      {
        name: "activation_checklist_refine",
        isExperiment: true,
        isFeatureGate: false,
      },
    ],
    dateCreated: "2024-02-10",
    dateReleased: "2024-03-22",
    owner: "Mina Patel",
    team: "Activation",
    status: "Released",
    pillar: "Pillar Growth",
  },
  {
    id: "prototype-playground-tab",
    title: "Prototype Playground Tab",
    description:
      "Central sandbox tab for rapid prototyping, gated for internal QA demos.",
    webUrl: "/prototypes/playground-tab",
    statsigFlags: [
      {
        name: "prototype_playground_tab",
        isExperiment: false,
        isFeatureGate: true,
        url: "https://console.statsig.com/0JEh0qdbLTd3W81GsLZa4/gates/prototype_playground_tab",
      },
      {
        name: "qa_demo_mode",
        isExperiment: false,
        isFeatureGate: true,
      },
    ],
    dateCreated: "2024-04-02",
    dateReleased: "2024-04-26",
    owner: "Diego Alvarez",
    team: "Platform",
    status: "In Experiment",
    pillar: "Pillar 1",
  },
  {
    id: "insights-digest-email",
    title: "Insights Digest Email",
    description:
      "Weekly digest summarizing key metrics, experiment readouts, and anomaly alerts.",
    webUrl: "/prototypes/insights-digest-email",
    statsigFlags: [
      {
        name: "insights_digest_rollout",
        isExperiment: false,
        isFeatureGate: true,
      },
      {
        name: "anomaly_alerts_enabled",
        isExperiment: true,
        isFeatureGate: false,
        url: "https://console.statsig.com/0JEh0qdbLTd3W81GsLZa4/experiments/anomaly_alerts_enabled/results",
      },
    ],
    dateCreated: "2024-01-08",
    dateReleased: "2024-02-05",
    owner: "Noor Hassan",
    team: "Insights",
    status: "Released",
    pillar: "Pillar 0",
  },
];
