import type { DigitalAsset } from "~/stores/query-result-store";
import type { RawEdge } from "./graphAdapter";

export const MOCK_ASSETS: DigitalAsset[] = [
  {
    id: "https://intforout.github.io/outdoorPressure#KerouantonSurveyFieldCampaignTracksGNSS20142015",
    type: "Dataset",
    name: "Data Phd Kerouanton",
    comment:
      "Field survey questionnaires and GNSS tracks focusing on hiking in the Massif des Bauges Regional Nature Park",
    publisher: "LECA et l’EDYTEM",
    location: ["Parc naturel régional du Massif des Bauges"],
  },
  {
    id: "https://intforout.github.io/outdoorPressure#OVRecreationalUserMapService",
    type: "DataService",
    name: "Recreational User Map Service",
    comment:
      "This data feed enables the Outdoorvision app to display aggregated GPS tracks from services and connected devices used by outdoor sports and recreation enthusiasts. The aggregation of these feeds is based solely on GPS tracks and does not take into account spatial constraints such as the road network. This allows for an accurate visualization of sports activities and the routes taken, which may include off-trail paths.",
    publisher: "",
    location: [],
  },
  {
    id: "https://intforout.github.io/outdoorPressure#StravaRecreationalUserMapService",
    type: "DataService",
    name: "Strava Global Heatmap",
    comment:
      "Displays the aggregated public activities recorded in Strava over the past year",
    publisher: "",
    location: [],
  },
  {
    id: "https://intforout.github.io/outdoorPressure#OVTracksMontBlancBauges2024",
    type: "Dataset",
    name: "OutdoorVision export in Bauges and Mont Blanc in 2024",
    comment:
      "A set of tracks issued from Outdoorvision. GPS traces from outdoorvison are cleaned and filtered",
    publisher: "",
    location: [],
  },
  {
    id: "https://intforout.github.io/outdoorPressure#SkiLiftCountersMontBlanc2008To2024",
    type: "Dataset",
    name: "Ski Lift Ridership Counts in the CMB Area.",
    comment:
      "Counting data for each ski lift, including their locations (start and end points), over a 10-year period (one file per year).",
    publisher: "",
    location: [],
  },
  {
    id: "https://intforout.github.io/outdoorPressure#MOUSLSTracksMultiSensorsVincennesForest",
    type: "Dataset",
    name: "MOUSLS Tracks Multi Sensors Vincennes Forest",
    comment:
      "This dataset was collected by two researchers by following the data colection protocol and using five sensors Garmin watch, Polar watch, Visorando mobile phone application, Keymaza GPS, Ublox GPS. The study area covers dense forect in Vincennes forest (Paris).",
    publisher: "",
    location: [],
  },
  {
    id: "https://intforout.github.io/outdoorPressure#StravaMetroTracksMontBlanc2024",
    type: "Dataset",
    name: "Strava Metro Tracks Mont Blanc2024",
    comment: "",
    publisher: "",
    location: [],
  },
  {
    id: "https://intforout.github.io/outdoorPressure#StravaTracksBauges2014",
    type: "Dataset",
    name: "Strava Tracks Bauges2014",
    comment: "",
    publisher: "",
    location: [],
  },
];

const GRAPH_ONLY_ASSETS: DigitalAsset[] = [
  {
    id: "https://intforout.github.io/outdoorPressure#ProfilageDataPhDKerouanton.pdf",
    type: "Dataset",
    name: "Profilage Data PhD Kerouanton.pdf",
    comment: "",
    publisher: "",
    pdfUrl:
      "https://github.com/IntForOut/outdoorPressure/blob/main/expertsfeedback/reports/ProfilageDataPhDKerouanton.pdf",
    location: [],
  },
  {
    id: "https://intforout.github.io/outdoorPressure#ProfilageDonneesKerouantonANaciri",
    type: "UserFeedback",
    name: "Profilage Donnees PhD Kerouanton",
    author: "Abdessalam Naciri",
    comment:
      "Analysis (profiling) of the research data produced by Colin Kerouanton, including the distribution of values (target 1). The results of the analysis are presented in a report (target 2)",
    publisher: "",
    location: [],
  },
  {
    id: "https://intforout.github.io/outdoorPressure#OVRecreationalUserMapService",
    type: "DataService",
    name: "Recreational User Map Service",
    comment:
      "This data stream allows users to visualize aggregated GPS tracks from Outdoorvision. The aggregation is based solely on GPS traces and does not consider spatial constraints such as road networks. This enables precise visualization of outdoor activities, including routes that may be off-trail.",
    publisher: "",
    location: [],
  },
  {
    id: "https://intforout.github.io/outdoorPressure#QualityOfOVRecreationalUserMapService",
    type: "UserFeedback",
    name: "Quality Of OV Recreational User Map Service",
    comment:
      "Artifacts exist in dense urban areas above a certain zoom level. This is because the accuracy of GPS tracks is lower in these areas, making the spatial information displayed less relevant.",
    publisher: "",
    location: [],
  },
  {
    id: "https://intforout.github.io/outdoorPressure#OVTracksMontBlancBauges2024",
    type: "Dataset",
    name: "OutdoorVision export in Bauges and Mont Blanc in 2024",
    comment:
      "A set of tracks issued from Outdoorvision. GPS traces from outdoorvison are cleaned and filtered",
    publisher: "",
    location: [],
  },
  {
    id: "https://intforout.github.io/outdoorPressure#TrackCollectionMergeForReplicability",
    type: "UserFeedback",
    name: "Track Collection Merge For Replicability",
    comment:
      "The process proposed in this paper can probably be reproduced to generate HikersFootprint in Les Bauges and MontBlanc, using OutdoorVision data as an input",
    publisher: "",
    location: [],
  },
  {
    id: "https://intforout.github.io/outdoorPressure#outdoorvision",
    type: "Catalog",
    name: "OutdoorVision Catalog",
    comment:
      "Outdoorvision https://outdoorvision.fr/; is a service to gather GPS tracks voluntarily shared by human during their outdoor activity through their accounts on their mobile device Garmin Connect™ / Polar Flow / Suunto APP / Decathlon. The data are anonymized and published for a list of authorised users. It is offered by the French National Resource Centre for Ecological Transition and Outdoor Sports.",
    publisher: "",
    location: [],
  },
  {
    id: "https://intforout.github.io/outdoorPressure#OVTracksMontBlancBauges2024",
    type: "Dataset",
    name: "OutdoorVision export in Bauges and Mont Blanc in 2024",
    comment:
      "A set of tracks issued from Outdoorvision. GPS traces from outdoorvison are cleaned and filtered",
    publisher: "",
    location: [],
  },
  {
    id: "https://intforout.github.io/outdoorPressure#SIGSPATIAL24VanDammeEtAl2024",
    type: "ScientificPaper",
    name: "A metrological analysis of a modular and iterative aggregation algorithm of GNSS trajectories",
    comment: "",
    publisher: "",
    location: [],
  },
  {
    id: "https://intforout.github.io/outdoorPressure#MOUSLS",
    type: "Dataset",
    name: "MOUSLS: Multi-sensors and Ground Truth Tracks in Vincennes (2025)",
    comment:
      "The goal of this dataset is to provide in-situ ground truth data to validate an algorithm for fusing GNSS tracks. This is a dataset series composed by two linked datasets. The first was (file tracks_multi_sensors_vincennes_forest.gpkg) contains GNSS tracks and was collected by two researchers using a strict data collection protocol, following the same path at times precisely and at other times with slight deviations. The second (file ground_truth_dense_forest_path.txt) was collected by a group of students and represents ground truth data for the same path in dense forest. English (2025)",
    publisher: "",
    location: [],
  },
  {
    id: "https://intforout.github.io/outdoorPressure#MOUSLSGroundTruthDenseForestPath",
    type: "Dataset",
    name: "MOUSLS Ground Truth Dense Forest Path",
    comment:
      "This dataset was collected on-site by a group of students using a defined methodology. It contains precise station locations along a real-world path through dense forest, after reordering in the south–north direction of travel. The goal of these reference data is to obtain a very precise ground truth in order to assess the accuracy of GNSS tracks produced by following exactly the same path with five sensors: a Garmin watch, a Polar watch, the Visorando mobile application, a Keymaza GPS, and a Ublox GPS.",
    publisher: "",
    location: [],
  },
  {
    id: "https://intforout.github.io/outdoorPressure#EntrepotRechercheIntForOut",
    type: "Catalog",
    name: "IntForOut published Dataverse",
    comment:
      "Dataverse dedicated to the IntForOut project. This catalog is integrated into the multidisciplinary data warehouse platform, Recherche Data Gouv.",
    publisher: "",
    location: [],
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
  "https://intforout.github.io/outdoorPressure#KerouantonSurveyFieldCampaignTracksGNSS20142015":
    {
      nodeIds: [
        "https://intforout.github.io/outdoorPressure#ProfilageDonneesKerouantonANaciri",
        "https://intforout.github.io/outdoorPressure#ProfilageDataPhDKerouanton.pdf",
      ],
      edges: [
        {
          source:
            "https://intforout.github.io/outdoorPressure#ProfilageDonneesKerouantonANaciri",
          target:
            "https://intforout.github.io/outdoorPressure#KerouantonSurveyFieldCampaignTracksGNSS20142015",
          label: "ns6__target",
        },
        {
          source:
            "https://intforout.github.io/outdoorPressure#ProfilageDonneesKerouantonANaciri",
          target:
            "https://intforout.github.io/outdoorPressure#ProfilageDataPhDKerouanton.pdf",
          label: "ns6_target",
        },
      ],
    },
  "https://intforout.github.io/outdoorPressure#OVRecreationalUserMapService": {
    nodeIds: [
      "https://intforout.github.io/outdoorPressure#QualityOfOVRecreationalUserMapService",
      "https://intforout.github.io/outdoorPressure#outdoorvision",
      "https://intforout.github.io/outdoorPressure#OVTracksMontBlancBauges2024",
    ],
    edges: [
      {
        source:
          "https://intforout.github.io/outdoorPressure#QualityOfOVRecreationalUserMapService",
        target:
          "https://intforout.github.io/outdoorPressure#OVRecreationalUserMapService",
        label: "ns6__target",
      },
      {
        source: "https://intforout.github.io/outdoorPressure#outdoorvision",
        target:
          "https://intforout.github.io/outdoorPressure#OVRecreationalUserMapService",
        label: "ns1__service",
      },
      {
        source: "https://intforout.github.io/outdoorPressure#outdoorvision",
        target:
          "https://intforout.github.io/outdoorPressure#OVTracksMontBlancBauges2024",
        label: "ns1__dataset",
      },
    ],
  },

  "https://intforout.github.io/outdoorPressure#OVTracksMontBlancBauges2024": {
    nodeIds: [
      "https://intforout.github.io/outdoorPressure#TrackCollectionMergeForReplicability",
      "https://intforout.github.io/outdoorPressure#SIGSPATIAL24VanDammeEtAl2024",
      "https://intforout.github.io/outdoorPressure#outdoorvision",
      "https://intforout.github.io/outdoorPressure#OVRecreationalUserMapService",
    ],
    edges: [
      {
        source:
          "https://intforout.github.io/outdoorPressure#TrackCollectionMergeForReplicability",
        target:
          "https://intforout.github.io/outdoorPressure#OVTracksMontBlancBauges2024",
        label: "ns6__target",
      },
      {
        source:
          "https://intforout.github.io/outdoorPressure#TrackCollectionMergeForReplicability",
        target:
          "https://intforout.github.io/outdoorPressure#SIGSPATIAL24VanDammeEtAl2024",
        label: "ns6__target",
      },
      {
        source: "https://intforout.github.io/outdoorPressure#outdoorvision",
        target:
          "https://intforout.github.io/outdoorPressure#OVTracksMontBlancBauges2024",
        label: "ns1__dataset",
      },
      {
        source: "https://intforout.github.io/outdoorPressure#outdoorvision",
        target:
          "https://intforout.github.io/outdoorPressure#OVRecreationalUserMapService",
        label: "ns1__service",
      },
    ],
  },
  "https://intforout.github.io/outdoorPressure#MOUSLSTracksMultiSensorsVincennesForest":
    {
      nodeIds: [
        "https://intforout.github.io/outdoorPressure#MOUSLS",
        "https://intforout.github.io/outdoorPressure#MOUSLSGroundTruthDenseForestPath",
        "https://intforout.github.io/outdoorPressure#SIGSPATIAL24VanDammeEtAl2024",
        "https://intforout.github.io/outdoorPressure#EntrepotRechercheIntForOut",
      ],
      edges: [
        {
          source:
            "https://intforout.github.io/outdoorPressure#MOUSLSTracksMultiSensorsVincennesForest",
          target: "https://intforout.github.io/outdoorPressure#MOUSLS",
          label: "ns1__inSeries",
        },
        {
          source:
            "https://intforout.github.io/outdoorPressure#MOUSLSGroundTruthDenseForestPath",
          target: "https://intforout.github.io/outdoorPressure#MOUSLS",
          label: "ns1__inSeries",
        },
        {
          source:
            "https://intforout.github.io/outdoorPressure#SIGSPATIAL24VanDammeEtAl2024",
          target: "https://intforout.github.io/outdoorPressure#MOUSLS",
          label: "ns3__quotedAs",
        },
        {
          source:
            "https://intforout.github.io/outdoorPressure#EntrepotRechercheIntForOut",
          target: "https://intforout.github.io/outdoorPressure#MOUSLS",
          label: "ns1__dataset",
        },
        {
          source: "https://intforout.github.io/outdoorPressure#MOUSLS",
          target:
            "https://intforout.github.io/outdoorPressure#SIGSPATIAL24VanDammeEtAl2024",
          label: "ns3__wasQuotedFrom",
        },
        {
          source:
            "https://intforout.github.io/outdoorPressure#SIGSPATIAL24VanDammeEtAl2024",
          target: "https://intforout.github.io/outdoorPressure#MOUSLS",
          label: "ns4__hasPart",
        },
        {
          source:
            "https://intforout.github.io/outdoorPressure#EntrepotRechercheIntForOut",
          target:
            "https://intforout.github.io/outdoorPressure#MOUSLSTracksMultiSensorsVincennesForest",
          label: "ns1__dataset",
        },
        {
          source:
            "https://intforout.github.io/outdoorPressure#EntrepotRechercheIntForOut",
          target:
            "https://intforout.github.io/outdoorPressure#MOUSLSGroundTruthDenseForestPath",
          label: "ns1__dataset",
        },
      ],
    },
};
