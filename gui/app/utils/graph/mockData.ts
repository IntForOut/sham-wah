import type { DigitalAsset } from "~/stores/query-result-store";
import type { RawEdge } from "./graphAdapter";

export const MOCK_ASSETS: DigitalAsset[] = [
  {
    id: "ov-tracks-2024",
    type: "Dataset",
    name: "OVTracksMontBlancBauges2024",
    comment:
      "A set of tracks issued from Outdoorvision. GPS traces from Outdoorvision are cleaned and filtered.",
    publisher: "Pôle ressources national sports de nature (PRNSN)",
    location: [
      "La Réserve nationale de chasse et de faune sauvage des Bauges",
      "Massif du Mont Blanc, côté France",
    ],
  },
  {
    id: "strava-tracks-2014",
    type: "Dataset",
    name: "StravaTracksBauges2014",
    comment: "No description available.",
    publisher: "Strava",
  },
  {
    id: "ov-map-service",
    type: "DataService",
    name: "Recreational User Map Service",
    comment:
      "This data feed enables visualization in the Outdoorvision application of aggregated GPS tracks obtained from services and connected devices used by outdoor sports and recreational users. The aggregation is based exclusively on GPS traces and does not account for spatial constraints, such as the road network. It provides a precise representation of sports activity and the paths taken, including off-trail routes.",
    publisher: "Pôle ressources national sports de nature (PRNSN)",
    location: [
      "La Réserve nationale de chasse et de faune sauvage des Bauges",
      "Massif du Mont Blanc, côté France",
    ],
  },
  {
    id: "strava-map-service",
    type: "DataService",
    name: "Strava Global Heatmap",
    comment:
      "Displays the aggregated public activities recorded in Strava over the past year",
    publisher: "Strava",
  },
  {
    id: "c2c-routes-2025",
    type: "Dataset",
    name: "CampToCampRoutesBauges2025",
    comment: "A set of routes issued from Camptocamp.org API.",
    publisher: "Camptocamp",
  },
  {
    id: "altirando-2025",
    type: "Dataset",
    name: "AltitudeRandoRoutesBauges2025",
    comment:
      "A set of routes issued from altituderando.com in 2025 in the Bauges area.",
    publisher: "altituderando",
  },
  {
    id: "c2c-poi-2025",
    type: "Dataset",
    name: "Camptocamp.org-waypoints",
    comment: "A set of waypoints issued from Camptocamp.org API.",
    publisher: "Camptocamp",
  },
  {
    id: "skilift-counters",
    type: "Dataset",
    name: "Ski Lift Ridership Counts in the CMB Area",
    comment:
      "Counting data for each ski lift, including their locations (start and end points), over a 10-year period (one file per year).",
  },
  {
    id: "bdtopo-2025",
    type: "Dataset",
    name: "Trails from the BDTOPO dataset in the Bauges Massif (2025 edition)",
    comment:
      "This dataset is extracted from the BDTOPO database, under the Transportation theme, from the Road Segment feature class, applying a filter on the “nature” attribute corresponding to the value “trail”.",
  },
  {
    id: "paper-marchand-2025",
    type: "ScientificPaper",
    name: "Disturbance by massive sporting events in mountain areas: When and where matters for the protected Alpine ibex Capra ibex",
    comment: "No description available",
  },
  {
    id: "paper-vandamme-2024",
    type: "ScientificPaper",
    name: "A metrological analysis of a modular and iterative aggregation algorithm of GNSS trajectories",
    comment: "No description available",
  },
];

const GRAPH_ONLY_ASSETS: DigitalAsset[] = [
  {
    id: "outdoorvision-catalog",
    type: "Catalog",
    name: "OutdoorVision",
    comment:
      "Outdoorvision https://outdoorvision.fr/; is a service to gather GPS tracks voluntarily shared by human during their outdoor activity through their accounts on their mobile device Garmin Connect™ / Polar Flow / Suunto APP (Appli Suunto) / Decathlon. The data are anonymized and published for a list of authorised users. It is offered by the French National Resource Centre for Ecological Transition and Outdoor Sports, a support mission of the Ministry of Sport. It results from a partnership between local authorities, sports federations and brands united around a non-profit programme.",
    publisher: "Pôle ressources national sports de nature (PRNSN)",
  },
  {
    id: "feedback-hikersfoot",
    type: "UserFeedback",
    name: "TrackCollectionMergeForReplicability",
    comment:
      "The process in this paper can probably be reproduced to generate HikersFootprint in Les Bauges and MontBlanc, using OutdoorVision data as an input",
  },
  {
    id: "feedback-artifacts",
    type: "UserFeedback",
    name: "QualityOfOVRecreationalUserMapService",
    comment:
      "Artifacts exist in dense urban areas above a certain zoom level. This is because the accuracy of GPS tracks is lower in these areas, making the spatial information displayed less relevant.",
  },
];

export const ASSET_BY_ID: Record<string, DigitalAsset> = Object.fromEntries(
  [...MOCK_ASSETS, ...GRAPH_ONLY_ASSETS].map((a) => [a.id, a]),
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
        label: "SERVICE",
      },
      {
        source: "outdoorvision-catalog",
        target: "ov-tracks-2024",
        label: "DATASET",
      },
      {
        source: "feedback-hikersfoot",
        target: "paper-vandamme-2024",
        label: "TARGET",
      },
      {
        source: "feedback-hikersfoot",
        target: "ov-tracks-2024",
        label: "TARGET",
      },
      {
        source: "feedback-artifacts",
        target: "ov-map-service",
        label: "TARGET",
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
        label: "TARGET",
      },
    ],
  },
};
