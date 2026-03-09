import * as d3 from "d3";
import type { NodeDatum } from "./graphTypes";

// ── Typography constants ───────────────────────────────────────────────────────
const CIRCLE_FONT_SIZE = 9;
const CIRCLE_LINE_HEIGHT = 12;
const CIRCLE_PX_PER_CHAR = 5.4; // at font-size 9

const RECT_FONT_SIZE = 11;
const RECT_LINE_HEIGHT = 15;
const RECT_PX_PER_CHAR = 6.2; // at font-size 11

export function drawNodeShape(
  group: d3.Selection<SVGGElement, NodeDatum, SVGGElement, unknown>,
) {
  group.each(function (d) {
    const sel = d3.select(this) as d3.Selection<
      SVGGElement,
      NodeDatum,
      any,
      any
    >;
    if (d.shape === "rect") drawRectNode(sel, d);
    else drawCircleNode(sel, d);
  });
}

export function applyHoverHighlight(
  sel: d3.Selection<SVGGElement, NodeDatum, any, any>,
  entering: boolean,
) {
  sel.each(function (d) {
    const shape = d3.select(this).select(".node-shape");
    if (entering) {
      shape.attr("stroke", "#60A5FA").attr("stroke-width", 3);
    } else {
      const stroke =
        d.shape === "rect" ? (d.isSelected ? d.color : "#1e293b") : "#fff";
      shape.attr("stroke", stroke).attr("stroke-width", d.isSelected ? 3 : 2);
    }
  });
}

// ── Node renderers ────────────────────────────────────────────────────────────

function drawCircleNode(
  sel: d3.Selection<SVGGElement, NodeDatum, any, any>,
  d: NodeDatum,
) {
  // Wrap the full untruncated name to fit the circle's inner chord (~70% of diameter)
  const maxChars = Math.floor((d.size * 1.4) / CIRCLE_PX_PER_CHAR);
  const lines = wrapText(splitCamelCase(d.label), maxChars);

  // Grow radius if the wrapped text is taller than the base size
  const r = Math.max(d.size, (lines.length * CIRCLE_LINE_HEIGHT) / 2 + 8);

  if (d.isSelected) {
    sel
      .append("circle")
      .attr("r", r + 7)
      .attr("fill", d.color)
      .attr("opacity", 0.2)
      .attr("class", "glow-ring");
  }

  sel
    .append("circle")
    .attr("r", r)
    .attr("fill", d.color)
    .attr("stroke", "#fff")
    .attr("stroke-width", d.isSelected ? 3 : 2)
    .attr("class", "node-shape");

  appendWrappedText(sel, lines, CIRCLE_LINE_HEIGHT, CIRCLE_FONT_SIZE, {
    fill: "rgba(255,255,255,0.95)",
    fontWeight: "600",
  });

  // Write actual radius back so edgeHelpers and forceCollide use the real size
  d.size = r;
}

function drawRectNode(
  sel: d3.Selection<SVGGElement, NodeDatum, any, any>,
  d: NodeDatum,
) {
  const rw = d.width ?? 220;
  const padX = 5;
  const padY = 10;

  const maxChars = Math.floor((rw - padX * 2) / RECT_PX_PER_CHAR);
  const lines = wrapText(d.description ?? "", maxChars);

  const textBlockH = lines.length * RECT_LINE_HEIGHT;
  const rh = textBlockH + padY * 2;

  sel
    .append("rect")
    .attr("width", rw)
    .attr("height", rh)
    .attr("x", -rw / 2)
    .attr("y", -rh / 2)
    .attr("rx", 8)
    .attr("ry", 8)
    .attr("fill", "#ffffff")
    .attr("stroke", d.isSelected ? d.color : "#1e293b")
    .attr("stroke-width", d.isSelected ? 3 : 1.5)
    .attr("class", "node-shape");

  appendWrappedText(sel, lines, RECT_LINE_HEIGHT, RECT_FONT_SIZE, {
    fill: "#1e293b",
  });

  // Write actual height back so edgeHelpers uses the real size
  d.height = rh;
}

// ── Shared helpers ────────────────────────────────────────────────────────────

/** Renders pre-wrapped lines as tspan elements, vertically centred on (0,0). */
function appendWrappedText(
  sel: d3.Selection<SVGGElement, NodeDatum, any, any>,
  lines: string[],
  lineHeight: number,
  fontSize: number,
  style: { fill: string; fontWeight?: string },
) {
  if (!lines.length) return;

  const totalH = lines.length * lineHeight;
  const startY = -(totalH / 2) + lineHeight * 0.5;

  const textEl = sel
    .append("text")
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .attr("fill", style.fill)
    .attr("font-size", fontSize)
    .attr("font-weight", style.fontWeight ?? "400")
    .attr("pointer-events", "none");

  lines.forEach((line, i) => {
    textEl
      .append("tspan")
      .text(line)
      .attr("x", 0)
      .attr("y", startY + i * lineHeight);
  });
}

/** Breaks text into lines that fit within maxChars, splitting on word boundaries. */
function wrapText(text: string, maxChars: number): string[] {
  if (!text) return [];

  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxChars) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      // Hard-break single words that exceed the limit
      current =
        word.length > maxChars ? word.slice(0, maxChars - 1) + "…" : word;
    }
  }

  if (current) lines.push(current);
  return lines;
}

function splitCamelCase(text: string): string {
  return text
    .replace(/([A-Z][a-z]+)/g, " $1")
    .replace(/([A-Z]{2,})(?=[A-Z][a-z]|\d|\s|$)/g, " $1")
    .replace(/(\d+)/g, " $1")
    .trim();
}
