import type { DigitalAsset } from "~/stores/query-result-store";
import type { RawEdge } from "./graphAdapter";

export const MOCK_ASSETS: DigitalAsset[] = [
  {
    id: "ov-tracks-2024",
    type: "Dataset",
    name: "OVTracksMontBlancBauges2024",
    comment:
      "A set of tracks issued from Outdoorvision. GPS traces from Outdoorvision are cleaned and filtered.",
    concepts: ["Human Activity"],
  },
  {
    id: "strava-tracks-2014",
    type: "Dataset",
    name: "StravaTracksBauges2014",
    comment: "No description available.",
    concepts: ["Human Activity"],
  },
  {
    id: "ov-map-service",
    type: "DataService",
    name: "OVRecreationalUserMapService",
    comment:
      "This data feed enables visualization in the Outdoorvision application of aggregated GPS tracks obtained from services and connected devices used by outdoor sports and recreational users.",
    publisher: "Pôle ressources national sports de nature (PRNSN)",
    location: [
      "La Réserve nationale de chasse et de faune sauvage des Bauges",
      "Massif du Mont Blanc, côté France",
    ],
    concepts: ["Human Activity"],
  },
  {
    id: "strava-map-service",
    type: "DataService",
    name: "StravaRecreationalUserMapService",
    comment: "Shows aggregated public activities from the past year on Strava.",
    concepts: ["Human Activity"],
  },
  {
    id: "c2c-routes-2025",
    type: "Dataset",
    name: "CampToCampRoutesBauges2025",
    comment: "A set of routes issued from Camptocamp.org API.",
    concepts: ["Human Activity"],
  },
  {
    id: "altirando-2025",
    type: "Dataset",
    name: "AltitudeRandoRoutesBauges2025",
    comment: "A set of routes issued from altituderando.com.",
    concepts: ["Human Activity"],
  },
  {
    id: "c2c-poi-2025",
    type: "Dataset",
    name: "CampToCampPOIBauges2025",
    comment: "A set of waypoints issued from Camptocamp.org API.",
    concepts: ["Human Activity"],
  },
  {
    id: "skilift-counters",
    type: "Dataset",
    name: "SkiLiftCountersMontBlanc2008To2024",
    comment:
      "Counting data for each ski lift, including their locations (start and end points), over a 10-year period.",
    concepts: ["Human Activity"],
  },
  {
    id: "bdtopo-2025",
    type: "Dataset",
    name: "BDTopoSentiersBauges2025",
    comment:
      "La BD TOPO® version 3.5 contient une description vectorielle 3D des éléments du territoire.",
    concepts: ["Human Activity"],
  },
  {
    id: "paper-marchand-2025",
    type: "ScientificPaper",
    name: "JournalOfPeopleAndNatureMarchandEtAl2025",
    comment:
      "Disturbance by massive sporting events in mountain areas: When and where matters for the protected Alpine ibex Capra ibex.",
    concepts: ["Human Activity"],
  },
  {
    id: "paper-vandamme-2024",
    type: "ScientificPaper",
    name: "SIGSPATIAL24VandDammeEtAl2024",
    comment:
      "A metrological analysis of a modular and iterative aggregation algorithm of GNSS trajectories.",
    concepts: ["Human Activity"],
  },
  // ── Nodes that appear in graphs but are not query results ─────────────────
  {
    id: "outdoorvision-catalog",
    type: "Catalog",
    name: "OutdoorVision",
    comment:
      "The Outdoorvision platform aggregating GPS traces from connected outdoor apps.",
    concepts: ["Outdoorvision", "Catalog"],
  },
  {
    id: "feedback-hikersfoot",
    type: "UserFeedback",
    name: "User Feedback",
    comment:
      "The process in this paper can probably be reproduced to generate HikersFootprint in Les Bauges and MontBlanc, using OutdoorVision data as an input",
    concepts: [],
  },
  {
    id: "feedback-artifacts",
    type: "UserFeedback",
    name: "User Feedback",
    comment:
      "Artifacts exist in dense urban areas above a certain zoom level due to lower GPS accuracy in those areas",
    concepts: [],
  },
];

// Fast lookup by id — used by graph-store to resolve neighbor ids
export const ASSET_BY_ID: Record<string, DigitalAsset> = Object.fromEntries(
  MOCK_ASSETS.map((a) => [a.id, a]),
);

export interface MockNeighborGraph {
  nodeIds: string[];
  edges: RawEdge[];
}

export const MOCK_NEIGHBOR_GRAPHS: Record<string, MockNeighborGraph> = {
  "ov-map-service": {
    nodeIds: [
      "outdoorvision-catalog",
      "ov-tracks-2024",
      "paper-vandamme-2024",
      "feedback-hikersfoot",
      "feedback-artifacts",
    ],
    edges: [
      {
        source: "outdoorvision-catalog",
        target: "ov-map-service",
        label: "PROVIDES",
      },
      {
        source: "outdoorvision-catalog",
        target: "ov-tracks-2024",
        label: "PROVIDES",
      },
      {
        source: "feedback-hikersfoot",
        target: "paper-vandamme-2024",
        label: "REFERENCES",
      },
      {
        source: "feedback-hikersfoot",
        target: "ov-tracks-2024",
        label: "REFERENCES",
      },
      {
        source: "feedback-artifacts",
        target: "ov-map-service",
        label: "ANNOTATES",
      },
    ],
  },

  "ov-tracks-2024": {
    nodeIds: ["ov-map-service", "paper-vandamme-2024"],
    edges: [
      { source: "ov-tracks-2024", target: "ov-map-service", label: "FEEDS" },
      {
        source: "paper-vandamme-2024",
        target: "ov-tracks-2024",
        label: "REFERENCES",
      },
    ],
  },

  "paper-marchand-2025": {
    nodeIds: ["ov-tracks-2024", "skilift-counters"],
    edges: [
      {
        source: "paper-marchand-2025",
        target: "ov-tracks-2024",
        label: "USES",
      },
      {
        source: "paper-marchand-2025",
        target: "skilift-counters",
        label: "USES",
      },
    ],
  },
};
