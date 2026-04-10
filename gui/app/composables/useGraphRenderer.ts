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

export function useGraphRenderer(
  containerRef: Ref<HTMLDivElement | null>,
  nodesRef: Ref<NodeDatum[]>,
  linksRef: Ref<LinkDatum[]>,
) {
  const showLabels = ref(true);
  const clickedNode = ref<NodeDatum | null>(null);

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

  function build(nodes: NodeDatum[], links: LinkDatum[]) {
    if (!containerRef.value || !nodes.length) {
      return;
    }
    const { width, height } = containerRef.value.getBoundingClientRect();
    svgEl = d3
      .select(containerRef.value)
      .append("svg")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("viewBox", `0 0 ${width} ${height}`);

    const g = svgEl.append("g").attr("class", "graph-root");

    zoomBehavior = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 8])
      .on("zoom", (e) => g.attr("transform", e.transform));

    svgEl.call(zoomBehavior); // allow zoom scroll with mouse wheel
    // Arrow maker
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

    // Links (drawn first so nodes render on top)
    const link = g
      .append("g")
      .attr("class", "links")
      .selectAll<SVGLineElement, LinkDatum>("path")
      .data(links)
      .join("path")
      .attr("stroke", "#CBD5E1")
      .attr("stroke-width", 1.5)
      .attr("stroke-opacity", 0.7)
      .attr("fill", "none")
      .attr("marker-end", "url(#arrowhead)");

    const linkLabel = g
      .append("g")
      .attr("class", "link-labels")
      .selectAll<SVGTextElement, LinkDatum>("text")
      .data(links)
      .join("text")
      .text((d) => d.label ?? "")
      .attr("font-size", 12)
      .attr("font-weight", "600")
      .attr("fill", "#64748b")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("pointer-events", "none")
      .attr("paint-order", "stroke")
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 3)
      .attr("stroke-linejoin", "round");

    // Node groups
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

    // Click open info panel
    nodeGroup.on("click", (e, d) => {
      e.stopPropagation();
      clickedNode.value = d;
    });
    svgEl.on("click", () => {
      clickedNode.value = null;
    });

    // External labels
    labelSel = g
      .append("g")
      .attr("class", "labels")
      .selectAll<SVGTextElement, NodeDatum>("text")
      .data(nodes.filter((n) => n.shape === "rect"))
      .join("text")
      .text((d) => d.label)
      .attr("font-size", 12)
      .attr("font-weight", (d) => (d.isSelected ? "700" : "400"))
      .attr("fill", getLabelColor())
      .attr("text-anchor", "middle")
      .attr("dy", (d) => getLabelDy(d))
      .attr("pointer-events", "none")
      .attr("display", showLabels.value ? null : "none");

    // Force simulation
    simulation = d3
      .forceSimulation<NodeDatum>(nodes)
      // force distance entre les edges
      .force(
        "link",
        d3
          .forceLink<NodeDatum, LinkDatum>(links)
          .id((d) => d.id)
          .distance((link) => {
            const target = link.target as NodeDatum;
            return target.shape === "rect" ? 380 : 250;
          }),
      )
      // force de répulsion entre les nodes
      .force("charge", d3.forceManyBody().strength(-5000))
      //force pour centrer le graphe dans le svg
      .force("center", d3.forceCenter(width / 2, height / 2))
      //force pour éviter que les nodes ne se chevauchent quand on deplace un noeud sur un noeud
      .force(
        "collision",
        d3.forceCollide<NodeDatum>().radius(getCollisionRadius),
      )

      .force("x", d3.forceX(width / 2).strength(0.05))
      .force("y", d3.forceY(height / 2).strength(0.05))

      .on("tick", () => {
        link.attr("d", (d) => {
          const sx = (d.source as NodeDatum).x ?? 0;
          const sy = (d.source as NodeDatum).y ?? 0;
          const { x: ex, y: ey } = getEdgeEnd(d);
          // Midpoint + perpendicular offset for the control point
          const mx = (sx + ex) / 2;
          const my = (sy + ey) / 2;
          const dx = ex - sx;
          const dy = ey - sy;
          const len = Math.sqrt(dx * dx + dy * dy) || 1;
          const curvature = 40; // px increase for more arc
          const cx = mx - (dy / len) * curvature;
          const cy = my + (dx / len) * curvature;
          return `M ${sx},${sy} Q ${cx},${cy} ${ex},${ey}`;
        });

        linkLabel
          .attr("x", (d) => {
            const sx = (d.source as NodeDatum).x ?? 0;
            const ex = (d.target as NodeDatum).x ?? 0;
            const dx = ex - sx;
            const sy = (d.source as NodeDatum).y ?? 0;
            const ey = (d.target as NodeDatum).y ?? 0;
            const dy = ey - sy;
            const len = Math.sqrt(dx * dx + dy * dy) || 1;
            return (sx + ex) / 2 - (dy / len) * 40 * 0.5; // offset toward control point
          })
          .attr("y", (d) => {
            const sx = (d.source as NodeDatum).x ?? 0;
            const ex = (d.target as NodeDatum).x ?? 0;
            const sy = (d.source as NodeDatum).y ?? 0;
            const ey = (d.target as NodeDatum).y ?? 0;
            const dx = ex - sx;
            const dy = ey - sy;
            const len = Math.sqrt(dx * dx + dy * dy) || 1;
            return (sy + ey) / 2 + (dx / len) * 40 * 0.5;
          });

        nodeGroup.attr(
          "transform",
          (d) => `translate(${d.x ?? 0},${d.y ?? 0})`,
        );
        labelSel?.attr(
          "transform",
          (d) => `translate(${d.x ?? 0},${d.y ?? 0})`,
        );
      });

    // Dark mode observer
    themeObserver = new MutationObserver(() =>
      labelSel?.attr("fill", getLabelColor()),
    );
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
  }

  onMounted(() => build(nodesRef.value, linksRef.value));

  // Rebuild whenever the store pushes new graph data
  watch([nodesRef, linksRef], ([nodes, links]) => {
    teardown();
    clickedNode.value = null;
    build(nodes as NodeDatum[], links as LinkDatum[]);
  });

  onBeforeUnmount(teardown);

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
