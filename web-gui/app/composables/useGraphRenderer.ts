import { ref, watch, onMounted, onBeforeUnmount, type Ref } from "vue";
import * as d3 from "d3";
import type { NodeDatum, LinkDatum } from "~/utils/graph/graphTypes";
import {
  getEdgeEnd,
  getLabelDy,
  getCollisionRadius,
} from "~/utils/graph/edgeHelpers";
import {
  drawNodeShape,
  applyHoverHighlight,
} from "~/utils/graph/nodeRenderers";

/**
 * Encapsulates all d3 imperative logic.
 * GraphCanvas.vue just calls this and binds the returned refs / methods.
 *
 * @param containerRef  - ref to the <div> where the SVG is mounted
 * @param nodesRef      - reactive source of NodeDatum[] (from graphStore)
 * @param linksRef      - reactive source of LinkDatum[] (from graphStore)
 */
export function useGraphRenderer(
  containerRef: Ref<HTMLDivElement | null>,
  nodesRef: Ref<NodeDatum[]>,
  linksRef: Ref<LinkDatum[]>,
) {
  // ── Exposed UI state ────────────────────────────────────────────────────────
  const showLabels = ref(true);
  const clickedNode = ref<NodeDatum | null>(null);

  // ── Internal d3 handles ─────────────────────────────────────────────────────
  let svgEl: d3.Selection<SVGSVGElement, unknown, null, undefined> | null =
    null;
  let zoomBehavior: d3.ZoomBehavior<SVGSVGElement, unknown> | null = null;
  let simulation: d3.Simulation<NodeDatum, LinkDatum> | null = null;
  let labelSel: d3.Selection<
    SVGTextElement,
    NodeDatum,
    SVGGElement,
    unknown
  > | null = null;
  let themeObserver: MutationObserver | null = null;

  const getLabelColor = () =>
    document.documentElement.classList.contains("dark") ? "#D1D5DB" : "#374151";

  // ── Teardown ────────────────────────────────────────────────────────────────

  function teardown() {
    simulation?.stop();
    if (containerRef.value)
      d3.select(containerRef.value).select("svg").remove();
    themeObserver?.disconnect();
    svgEl = null;
    simulation = null;
    labelSel = null;
    zoomBehavior = null;
  }

  // ── Build ───────────────────────────────────────────────────────────────────

  function build(nodes: NodeDatum[], links: LinkDatum[]) {
    if (!containerRef.value || !nodes.length) return;

    const { width, height } = containerRef.value.getBoundingClientRect();

    // ── SVG root
    svgEl = d3
      .select(containerRef.value)
      .append("svg")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", `0 0 ${width} ${height}`);

    const g = svgEl.append("g").attr("class", "graph-root");

    // ── Zoom & pan
    zoomBehavior = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 8])
      .on("zoom", (e) => g.attr("transform", e.transform));

    svgEl.call(zoomBehavior); // allow zoom scroll with mouse wheel

    const initialScale = 1.3;

    const initialTransform = d3.zoomIdentity
      .translate(width / 2, height / 2)
      .scale(initialScale)
      .translate(-width / 2, -height / 2);

    svgEl.call(zoomBehavior.transform, initialTransform);

    // ── Arrowhead marker
    svgEl
      .append("defs")
      .append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "-0 -5 10 10")
      .attr("refX", 10)
      .attr("refY", 0)
      .attr("orient", "auto")
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .append("path")
      .attr("d", "M 0,-5 L 10,0 L 0,5")
      .attr("fill", "#94A3B8");

    // ── Links (drawn first so nodes render on top)
    const link = g
      .append("g")
      .attr("class", "links")
      .selectAll<SVGLineElement, LinkDatum>("line")
      .data(links)
      .join("line")
      .attr("stroke", "#CBD5E1")
      .attr("stroke-width", 1.5)
      .attr("stroke-opacity", 0.7)
      .attr("marker-end", "url(#arrowhead)");

    const linkLabel = g
      .append("g")
      .attr("class", "link-labels")
      .selectAll<SVGTextElement, LinkDatum>("text")
      .data(links)
      .join("text")
      .text((d) => d.label ?? "")
      .attr("font-size", 9)
      .attr("font-weight", "600")
      .attr("fill", "#64748b")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("pointer-events", "none")
      .attr("paint-order", "stroke")
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 3)
      .attr("stroke-linejoin", "round");

    // ── Node groups
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
          .on("start", (e, d) => {
            if (!e.active) simulation?.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on("drag", (e, d) => {
            d.fx = e.x;
            d.fy = e.y;
          })
          .on("end", (e, d) => {
            if (!e.active) simulation?.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          }),
      );

    // Draw shapes into each group
    drawNodeShape(nodeGroup);

    // Hover highlight
    nodeGroup
      .on("mouseenter", function () {
        applyHoverHighlight(d3.select(this) as any, true);
      })
      .on("mouseleave", function () {
        applyHoverHighlight(d3.select(this) as any, false);
      });

    // Click → open info panel
    nodeGroup.on("click", (e, d) => {
      e.stopPropagation();
      clickedNode.value = d;
    });
    svgEl.on("click", () => {
      clickedNode.value = null;
    });

    // ── External labels (below each node, short label)
    labelSel = g
      .append("g")
      .attr("class", "labels")
      .selectAll<SVGTextElement, NodeDatum>("text")
      .data(nodes.filter((n) => n.shape === "rect"))
      .join("text")
      .text((d) => d.label)
      .attr("font-size", 11)
      .attr("font-weight", (d) => (d.isSelected ? "700" : "400"))
      .attr("fill", getLabelColor())
      .attr("text-anchor", "middle")
      .attr("dy", (d) => getLabelDy(d))
      .attr("pointer-events", "none")
      .attr("display", showLabels.value ? null : "none");

    // ── Force simulation
    simulation = d3
      .forceSimulation<NodeDatum>(nodes)
      .force(
        "link",
        d3
          .forceLink<NodeDatum, LinkDatum>(links)
          .id((d) => d.id)
          .distance((link) => {
            const target = link.target as NodeDatum;
            return target.shape === "rect" ? 380 : 280;
          }),
      )
      .force("charge", d3.forceManyBody().strength(-500))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force(
        "collision",
        d3.forceCollide<NodeDatum>().radius(getCollisionRadius),
      )

      .on("tick", () => {
        link
          .attr("x1", (d) => (d.source as NodeDatum).x ?? 0)
          .attr("y1", (d) => (d.source as NodeDatum).y ?? 0)
          .attr("x2", (d) => getEdgeEnd(d).x)
          .attr("y2", (d) => getEdgeEnd(d).y);

        linkLabel
          .attr(
            "x",
            (d) =>
              (((d.source as NodeDatum).x ?? 0) +
                ((d.target as NodeDatum).x ?? 0)) /
              2,
          )
          .attr(
            "y",
            (d) =>
              (((d.source as NodeDatum).y ?? 0) +
                ((d.target as NodeDatum).y ?? 0)) /
              2,
          );
        nodeGroup.attr(
          "transform",
          (d) => `translate(${d.x ?? 0},${d.y ?? 0})`,
        );
        labelSel?.attr(
          "transform",
          (d) => `translate(${d.x ?? 0},${d.y ?? 0})`,
        );
      });

    // ── Dark mode observer
    themeObserver = new MutationObserver(() =>
      labelSel?.attr("fill", getLabelColor()),
    );
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
  }

  // ── Lifecycle ────────────────────────────────────────────────────────────────

  onMounted(() => build(nodesRef.value, linksRef.value));

  // Rebuild whenever the store pushes new graph data
  watch([nodesRef, linksRef], ([nodes, links]) => {
    teardown();
    build(nodes as NodeDatum[], links as LinkDatum[]);
  });

  onBeforeUnmount(teardown);

  // ── Exposed controls ────────────────────────────────────────────────────────

  const zoomIn = () =>
    svgEl?.transition().duration(300).call(zoomBehavior!.scaleBy, 1.4);

  const zoomOut = () =>
    svgEl
      ?.transition()
      .duration(300)
      .call(zoomBehavior!.scaleBy, 1 / 1.4);

  const resetView = () =>
    svgEl
      ?.transition()
      .duration(500)
      .call(zoomBehavior!.transform, d3.zoomIdentity);

  const toggleLabels = () => {
    showLabels.value = !showLabels.value;
    labelSel?.attr("display", showLabels.value ? null : "none");
  };

  return { showLabels, clickedNode, zoomIn, zoomOut, resetView, toggleLabels };
}
