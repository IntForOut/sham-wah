<template>
  <div
    class="relative w-full h-full bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden"
  >
    <div class="absolute top-4 right-4 z-10 flex flex-col gap-2">
      <!-- Zoom Controls card -->
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-1"
      >
        <button
          @click="zoomIn"
          class="block w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          title="Zoom in"
        >
          <svg
            class="w-5 h-5 text-gray-700 dark:text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
        <div class="h-px bg-gray-200 dark:bg-gray-700 mx-1"></div>
        <button
          @click="zoomOut"
          class="block w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          title="Zoom out"
        >
          <svg
            class="w-5 h-5 text-gray-700 dark:text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20 12H4"
            />
          </svg>
        </button>
        <div class="h-px bg-gray-200 dark:bg-gray-700 mx-1"></div>
        <button
          @click="resetView"
          class="block w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          title="Reset view"
        >
          <svg
            class="w-5 h-5 text-gray-700 dark:text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>

      <!-- View Options card -->
      <div
        class="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-1"
      >
        <button
          @click="toggleLabels"
          class="block w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          :class="{ 'bg-blue-50 dark:bg-blue-900/20': showLabels }"
          title="Toggle labels"
        >
          <svg
            class="w-5 h-5 text-gray-700 dark:text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- ── Info Node Panel ── -->
    <div
      v-if="selectedNode"
      class="absolute top-4 left-4 z-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 max-w-xs"
    >
      <div class="flex items-start justify-between mb-2">
        <h3 class="font-semibold text-gray-900 dark:text-white">
          {{ selectedNode.label }}
        </h3>
        <button
          @click="selectedNode = null"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 ml-2"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
        <p>
          <span class="font-medium">Connections:</span>
          {{ selectedNode.degree }}
        </p>
        <p><span class="font-medium">Type:</span> {{ selectedNode.type }}</p>
      </div>
    </div>

    <div ref="graphContainer" class="w-full h-full"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import * as d3 from "d3";

// ─── TypeScript Interfaces ────────────────────────────────────────────────────

interface NodeDatum extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  description?: string; // optional second line shown inside rect nodes
  color: string;
  size: number;
  shape?: "circle" | "rect";
  width?: number;
  height?: number;
  type?: string;
}

interface LinkDatum extends d3.SimulationLinkDatum<NodeDatum> {
  source: string | NodeDatum;
  target: string | NodeDatum;
}

const graphContainer = ref<HTMLDivElement | null>(null);
const showLabels = ref(true);
const selectedNode = ref<{
  label: string;
  degree: number;
  type: string;
} | null>(null);

let svgEl: d3.Selection<SVGSVGElement, unknown, null, undefined> | null = null;
let zoomBehavior: d3.ZoomBehavior<SVGSVGElement, unknown> | null = null;
let simulation: d3.Simulation<NodeDatum, LinkDatum> | null = null;
let labelSelection: d3.Selection<
  SVGTextElement,
  NodeDatum,
  SVGGElement,
  unknown
> | null = null;
let themeObserver: MutationObserver | null = null;

// ─── Dark Mode Helper ─────────────────────────────────────────────────────────

const getLabelColor = (): string =>
  document.documentElement.classList.contains("dark") ? "#D1D5DB" : "#374151";

// ─── Arrow Endpoint Helpers ───────────────────────────────────────────────────

function getEdgeEnd(d: LinkDatum): { x: number; y: number } {
  const source = d.source as NodeDatum;
  const target = d.target as NodeDatum;
  const sx = source.x ?? 0;
  const sy = source.y ?? 0;
  const tx = target.x ?? 0;
  const ty = target.y ?? 0;
  const dx = tx - sx;
  const dy = ty - sy;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist === 0) return { x: tx, y: ty };

  if (target.shape === "rect") {
    // Intersect the line with the rectangle border
    const hw = (target.width ?? 80) / 2;
    const hh = (target.height ?? 30) / 2;
    const scaleX = Math.abs(dx) > 0 ? hw / Math.abs(dx) : Infinity;
    const scaleY = Math.abs(dy) > 0 ? hh / Math.abs(dy) : Infinity;
    const scale = Math.min(scaleX, scaleY);
    return {
      x: tx - dx * scale,
      y: ty - dy * scale,
    };
  } else {
    // Stop at the circle's circumference (+ stroke-width of 2)
    const r = target.size + 2;
    return {
      x: tx - (dx / dist) * r,
      y: ty - (dy / dist) * r,
    };
  }
}

// Returns the label vertical offset depending on node shape
function getLabelDy(d: NodeDatum): number {
  if (d.shape === "rect") return (d.height ?? 30) / 2 + 14;
  return d.size + 14;
}

onMounted(() => {
  if (!graphContainer.value) return;

  const nodes: NodeDatum[] = [
    { id: "n1", label: "Node 1", color: "#3B82F6", size: 10 },
    {
      id: "n2",
      label: "Node 2",
      color: "#8B5CF6",
      size: 10,
      type: "Secondary",
    },
    { id: "n3", label: "Node 3", color: "#10B981", size: 24, type: "Hub" },
    { id: "n4", label: "Node 4", color: "#F59E0B", size: 8 },
    {
      id: "n5",
      label: "Rectangle Node",
      description: "Custom description text",
      color: "#EF4444",
      size: 8,
      shape: "rect",
      width: 140,
      height: 56,
    },
  ];

  const links: LinkDatum[] = [
    { source: "n1", target: "n2" },
    { source: "n1", target: "n3" },
    { source: "n2", target: "n3" },
    { source: "n3", target: "n4" },
    { source: "n4", target: "n5" },
  ];

  const { width, height } = graphContainer.value.getBoundingClientRect();

  svgEl = d3
    .select(graphContainer.value)
    .append("svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", `0 0 ${width} ${height}`);

  const g = svgEl.append("g").attr("class", "graph-root");

  // ── ZOOM & PAN ─────────────────────────────────────────────────────────

  zoomBehavior = d3
    .zoom<SVGSVGElement, unknown>()
    .scaleExtent([0.1, 8])
    .on("zoom", (event) => {
      g.attr("transform", event.transform);
    });

  svgEl.call(zoomBehavior);

  // ── ARROWHEAD MARKER ───────────────────────────────────────────────────

  svgEl
    .append("defs")
    .append("marker")
    .attr("id", "arrowhead")
    .attr("viewBox", "-0 -5 10 10")
    .attr("refX", 10) // ← tip of the "M 0,-5 L 10,0 L 0,5" path
    .attr("refY", 0)
    .attr("orient", "auto")
    .attr("markerWidth", 6)
    .attr("markerHeight", 6)
    .append("path")
    .attr("d", "M 0,-5 L 10,0 L 0,5")
    .attr("fill", "#94A3B8");

  // ── LINKS (edges) ──────────────────────────────────────────────────────

  const link = g
    .append("g")
    .attr("class", "links")
    .selectAll<SVGLineElement, LinkDatum>("line")
    .data(links)
    .join("line")
    .attr("stroke", "#CBD5E1")
    .attr("stroke-width", 1.5)
    .attr("stroke-opacity", 0.8)
    .attr("marker-end", "url(#arrowhead)");

  // ── NODE GROUPS ────────────────────────────────────────────────────────

  const nodeGroup = g
    .append("g")
    .attr("class", "nodes")
    .selectAll<SVGGElement, NodeDatum>("g")
    .data(nodes)
    .join("g")
    .attr("class", "node")
    .style("cursor", "pointer")
    .call(
      d3
        .drag<SVGGElement, NodeDatum>()
        .on("start", (event, d) => {
          if (!event.active) simulation?.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) simulation?.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }),
    );

  nodeGroup.each(function (d) {
    const sel = d3.select(this);
    if (d.shape === "rect") {
      const rw = d.width ?? 140;
      const rh = d.height ?? 56;

      // Background rect
      sel
        .append("rect")
        .attr("width", rw)
        .attr("height", rh)
        .attr("x", -rw / 2)
        .attr("y", -rh / 2)
        .attr("rx", 6)
        .attr("ry", 6)
        .attr("fill", d.color)
        .attr("stroke", "#fff")
        .attr("stroke-width", 2);

      // description text centered inside the rect
      sel
        .append("text")
        .text(d.description ?? "")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("fill", "white")
        .attr("font-size", 12)
        .attr("pointer-events", "none");
    } else {
      sel
        .append("circle")
        .attr("r", d.size)
        .attr("fill", d.color)
        .attr("stroke", "#fff")
        .attr("stroke-width", 2);
    }
  });

  // ── HOVER HIGHLIGHT ────────────────────────────────────────────────────

  nodeGroup
    .on("mouseenter", function (_, d) {
      const sel = d3.select(this);
      if (d.shape === "rect") {
        sel.select("rect").attr("stroke", "#60A5FA").attr("stroke-width", 3);
      } else {
        sel.select("circle").attr("stroke", "#60A5FA").attr("stroke-width", 3);
      }
    })
    .on("mouseleave", function (_, d) {
      const sel = d3.select(this);
      if (d.shape === "rect") {
        sel.select("rect").attr("stroke", "#fff").attr("stroke-width", 2);
      } else {
        sel.select("circle").attr("stroke", "#fff").attr("stroke-width", 2);
      }
    });

  // ── NODE CLICK → INFO PANEL ────────────────────────────────────────────

  nodeGroup.on("click", (event, d) => {
    event.stopPropagation();
    const degree = links.filter(
      (l) =>
        (l.source as NodeDatum).id === d.id ||
        (l.target as NodeDatum).id === d.id,
    ).length;
    selectedNode.value = { label: d.label, degree, type: d.type ?? "Default" };
  });

  svgEl.on("click", () => {
    selectedNode.value = null;
  });

  // ── LABELS ─────────────────────────────────────────────────────────────

  labelSelection = g
    .append("g")
    .attr("class", "labels")
    .selectAll<SVGTextElement, NodeDatum>("text")
    .data(nodes)
    .join("text")
    .text((d) => d.label)
    .attr("font-size", 11)
    .attr("fill", getLabelColor())
    .attr("text-anchor", "middle")
    .attr("dy", (d) => getLabelDy(d))
    .attr("pointer-events", "none")
    .attr("display", showLabels.value ? null : "none");

  // ── SIMULATION ─────────────────────────────────────────────────────────

  simulation = d3
    .forceSimulation<NodeDatum>(nodes)
    .force(
      "link",
      d3
        .forceLink<NodeDatum, LinkDatum>(links)
        .id((d) => d.id)
        .distance(120),
    )
    .force("charge", d3.forceManyBody().strength(-300))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force(
      "collision",
      d3.forceCollide().radius((d) => {
        const nd = d as NodeDatum;
        if (nd.shape === "rect") {
          return (
            Math.sqrt(
              Math.pow((nd.width ?? 80) / 2, 2) +
                Math.pow((nd.height ?? 30) / 2, 2),
            ) + 10
          );
        }
        return nd.size + 10;
      }),
    )
    .on("tick", () => {
      link
        .attr("x1", (d) => (d.source as NodeDatum).x ?? 0)
        .attr("y1", (d) => (d.source as NodeDatum).y ?? 0)
        .attr("x2", (d) => getEdgeEnd(d).x)
        .attr("y2", (d) => getEdgeEnd(d).y);

      nodeGroup.attr("transform", (d) => `translate(${d.x ?? 0},${d.y ?? 0})`);

      labelSelection?.attr(
        "transform",
        (d) => `translate(${d.x ?? 0},${d.y ?? 0})`,
      );
    });

  // ── DARK MODE OBSERVER ─────────────────────────────────────────────────

  themeObserver = new MutationObserver(() => {
    labelSelection?.attr("fill", getLabelColor());
  });

  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
});

onBeforeUnmount(() => {
  simulation?.stop();
  svgEl?.remove();
  themeObserver?.disconnect();
});

const zoomIn = () => {
  if (!svgEl || !zoomBehavior) return;
  svgEl.transition().duration(300).call(zoomBehavior.scaleBy, 1.4);
};

const zoomOut = () => {
  if (!svgEl || !zoomBehavior) return;
  svgEl
    .transition()
    .duration(300)
    .call(zoomBehavior.scaleBy, 1 / 1.4);
};

const resetView = () => {
  if (!svgEl || !zoomBehavior) return;
  svgEl
    .transition()
    .duration(500)
    .call(zoomBehavior.transform, d3.zoomIdentity);
};

const toggleLabels = () => {
  showLabels.value = !showLabels.value;
  labelSelection?.attr("display", showLabels.value ? null : "none");
};
</script>
