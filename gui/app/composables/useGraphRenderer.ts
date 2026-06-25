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
  onNodeDblClick?: (node: NodeDatum) => void,
) {
  const showLabels = ref(true);
  const clickedNode = ref<NodeDatum | null>(null);

  let svgEl: d3.Selection<SVGSVGElement, unknown, null, undefined> | null =
    null;
  let zoomBehavior: d3.ZoomBehavior<SVGSVGElement, unknown> | null = null;
  let simulation: d3.Simulation<NodeDatum, LinkDatum> | null = null;
  let themeObserver: MutationObserver | null = null;

  let linkSel: d3.Selection<
    SVGPathElement,
    LinkDatum,
    SVGGElement,
    unknown
  > | null = null;
  let linkLabelSel: d3.Selection<
    SVGTextElement,
    LinkDatum,
    SVGGElement,
    unknown
  > | null = null;
  let nodeSel: d3.Selection<
    SVGGElement,
    NodeDatum,
    SVGGElement,
    unknown
  > | null = null;
  let labelSel: d3.Selection<
    SVGTextElement,
    NodeDatum,
    SVGGElement,
    unknown
  > | null = null;

  const getLabelColor = () =>
    document.documentElement.classList.contains("dark") ? "#D1D5DB" : "#374151";

  function teardown() {
    simulation?.stop();
    if (containerRef.value)
      d3.select(containerRef.value).select("svg").remove();
    themeObserver?.disconnect();

    svgEl = null;
    simulation = null;
    zoomBehavior = null;
    themeObserver = null;
    linkSel = null;
    linkLabelSel = null;
    nodeSel = null;
    labelSel = null;
  }

  function initGraph() {
    if (!containerRef.value) return;
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
      .scaleExtent([0.1, 15])
      .on("zoom", (e) => g.attr("transform", e.transform));

    svgEl.call(zoomBehavior);
    svgEl.on("click", () => {
      clickedNode.value = null;
    });

    /*************************** ARROW ****************** */
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

    // Establish persistent DOM layers to preserve perfect Z-indexing
    g.append("g").attr("class", "links-layer");
    g.append("g").attr("class", "link-labels-layer");
    g.append("g").attr("class", "nodes-layer");
    g.append("g").attr("class", "labels-layer");

    // Initialize simulation frame (without data)
    simulation = d3
      .forceSimulation<NodeDatum>()
      .force("charge", d3.forceManyBody().strength(-5000))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force(
        "collision",
        d3.forceCollide<NodeDatum>().radius(getCollisionRadius),
      )
      .force("x", d3.forceX(width / 2).strength(0.05))
      .force("y", d3.forceY(height / 2).strength(0.05))
      .on("tick", handleTick);

    // Dark mode observer
    themeObserver = new MutationObserver(() =>
      labelSel?.attr("fill", getLabelColor()),
    );
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
  }

  function updateGraph(newNodes: NodeDatum[], newLinks: LinkDatum[]) {
    if (!svgEl || !simulation) {
      initGraph();
    }

    const g = svgEl!.select<SVGGElement>(".graph-root");

    const posMap = new Map<
      string,
      { x: number; y: number; fx: number | null; fy: number | null }
    >();
    for (const n of simulation!.nodes()) {
      posMap.set(n.id, {
        x: n.x ?? 0,
        y: n.y ?? 0,
        fx: n.fx ?? null,
        fy: n.fy ?? null,
      });
    }
    for (const n of newNodes) {
      const prev = posMap.get(n.id);
      if (prev) {
        n.x = prev.x;
        n.y = prev.y;
        n.fx = prev.fx;
        n.fy = prev.fy;
      }
    }

    // Synchronize datasets to forces
    simulation!.nodes(newNodes);
    const linkForce = d3
      .forceLink<NodeDatum, LinkDatum>(newLinks)
      .id((d) => d.id)
      .distance((link) =>
        (link.target as NodeDatum).shape === "rect" ? 380 : 250,
      );
    simulation!.force("link", linkForce);

    // Render Links
    linkSel = g
      .select<SVGGElement>(".links-layer")
      .selectAll<SVGPathElement, LinkDatum>("path")
      .data(
        newLinks,
        (d: any) => `${d.source.id ?? d.source}-${d.target.id ?? d.target}`,
      )
      .join("path")
      .attr("stroke", "#CBD5E1")
      .attr("stroke-width", 1.5)
      .attr("stroke-opacity", 0.7)
      .attr("fill", "none")
      .attr("marker-end", "url(#arrowhead)");

    linkLabelSel = g
      .select<SVGGElement>(".link-labels-layer")
      .selectAll<SVGTextElement, LinkDatum>("text")
      .data(newLinks)
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

    // Render Node Group
    let clickTimer: ReturnType<typeof setTimeout> | null = null;

    nodeSel = g
      .select<SVGGElement>(".nodes-layer")
      .selectAll<SVGGElement, NodeDatum>("g.node")
      .data(newNodes, (d) => d.id)
      .join((enter) => {
        const grp = enter
          .append("g")
          .attr("class", "node")
          .style("cursor", "pointer");

        drawNodeShape(grp);

        // Attach interaction listeners exclusively to new elements
        grp.call(
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

        grp
          .on("mouseenter", function () {
            applyHoverHighlight(d3.select(this) as any, true);
          })
          .on("mouseleave", function () {
            applyHoverHighlight(d3.select(this) as any, false);
          });

        grp.on("click", (e, d) => {
          e.stopPropagation();
          clickTimer = setTimeout(() => {
            clickedNode.value = d;
            clickTimer = null;
          }, 200);
        });

        grp.on("dblclick", (e, d) => {
          e.stopPropagation();
          if (clickTimer) {
            clearTimeout(clickTimer);
            clickTimer = null;
          }
          onNodeDblClick?.(d);
        });

        return grp;
      });

    labelSel = g
      .select<SVGGElement>(".labels-layer")
      .selectAll<SVGTextElement, NodeDatum>("text")
      .data(
        newNodes.filter((n) => n.shape === "rect"),
        (d) => d.id,
      )
      .join("text")
      .text((d) => d.label)
      .attr("font-size", 12)
      .attr("font-weight", (d) => (d.isSelected ? "700" : "400"))
      .attr("fill", getLabelColor())
      .attr("text-anchor", "middle")
      .attr("dy", (d) => getLabelDy(d))
      .attr("pointer-events", "none")
      .attr("display", showLabels.value ? null : "none");

    simulation!.alpha(0.3).restart();
  }

  function handleTick() {
    if (linkSel) {
      linkSel.attr("d", (d) => {
        const sx = (d.source as NodeDatum).x ?? 0;
        const sy = (d.source as NodeDatum).y ?? 0;
        const { x: ex, y: ey } = getEdgeEnd(d);
        const mx = (sx + ex) / 2;
        const my = (sy + ey) / 2;
        const dx = ex - sx;
        const dy = ey - sy;
        const len = Math.sqrt(dx * dx + dy * dy) || 1;
        const curvature = 40;
        const cx = mx - (dy / len) * curvature;
        const cy = my + (dx / len) * curvature;
        return `M ${sx},${sy} Q ${cx},${cy} ${ex},${ey}`;
      });
    }

    if (linkLabelSel) {
      linkLabelSel
        .attr("x", (d) => {
          const sx = (d.source as NodeDatum).x ?? 0;
          const ex = (d.target as NodeDatum).x ?? 0;
          const sy = (d.source as NodeDatum).y ?? 0;
          const ey = (d.target as NodeDatum).y ?? 0;
          const dx = ex - sx;
          const dy = ey - sy;
          const len = Math.sqrt(dx * dx + dy * dy) || 1;
          return (sx + ex) / 2 - (dy / len) * 40 * 0.5;
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
    }

    nodeSel?.attr("transform", (d) => `translate(${d.x ?? 0},${d.y ?? 0})`);
    labelSel?.attr("transform", (d) => `translate(${d.x ?? 0},${d.y ?? 0})`);
  }

  watch([nodesRef, linksRef], ([newNodes, newLinks]) => {
    const simNodeIds = new Set(simulation?.nodes().map((n) => n.id) ?? []);
    const isFullReplacement = (newNodes as NodeDatum[]).every(
      (n) => !simNodeIds.has(n.id),
    );

    if (isFullReplacement || !simulation) {
      teardown();
      clickedNode.value = null;
    }

    updateGraph(newNodes as NodeDatum[], newLinks as LinkDatum[]);
  });

  onMounted(() => updateGraph(nodesRef.value, linksRef.value));
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
      .duration(300)
      .call(zoomBehavior!.transform, d3.zoomIdentity);
  const toggleLabels = () => {
    showLabels.value = !showLabels.value;
    labelSel?.attr("display", showLabels.value ? null : "none");
  };

  return { showLabels, clickedNode, zoomIn, zoomOut, resetView, toggleLabels };
}
