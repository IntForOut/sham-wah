import * as d3 from "d3";
import type { NodeDatum } from "./graphTypes";

export function drawNodeShape(
  group: d3.Selection<SVGGElement, NodeDatum, SVGGElement, unknown>,
) {
  group.each(function (d) {
    const sel = d3.select(this);
    if (d.shape === "rect") {
      drawRectNode(sel as d3.Selection<SVGGElement, NodeDatum, any, any>, d);
    } else {
      drawCircleNode(sel as d3.Selection<SVGGElement, NodeDatum, any, any>, d);
    }
  });
}

function drawCircleNode(
  sel: d3.Selection<SVGGElement, NodeDatum, any, any>,
  d: NodeDatum,
) {
  if (d.isSelected) {
    sel
      .append("circle")
      .attr("r", d.size + 7)
      .attr("fill", d.color)
      .attr("opacity", 0.2)
      .attr("class", "glow-ring");
  }

  sel
    .append("circle")
    .attr("r", d.size)
    .attr("fill", d.color)
    .attr("stroke", "#fff")
    .attr("stroke-width", d.isSelected ? 3 : 2)
    .attr("class", "node-shape");

  const innerW = d.size * 1.4;
  const fontSize = 9;
  const lineHeight = 12;
  // ~5.4px per char at font-size 9
  const maxChars = Math.floor(innerW / 5.4);
  const lines = wrapText(d.label, maxChars, 3); // max 3 lines

  if (lines.length) {
    const totalH = lines.length * lineHeight;
    const startY = -(totalH / 2) + lineHeight * 0.5;

    const textEl = sel
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", "rgba(255,255,255,0.95)")
      .attr("font-size", fontSize)
      .attr("font-weight", "600")
      .attr("pointer-events", "none");

    lines.forEach((line, i) => {
      textEl
        .append("tspan")
        .text(line)
        .attr("x", 0)
        .attr("y", startY + i * lineHeight);
    });
  }
}
function drawRectNode(
  sel: d3.Selection<SVGGElement, NodeDatum, any, any>,
  d: NodeDatum,
) {
  // ── Layout constants ────────────────────────────────────────────────────
  const rw = d.width ?? 220; // card width in px
  const padX = 5; // horizontal inner padding
  const padY = 10; // vertical inner padding
  const lineHeight = 15; // px between tspan baselines
  const fontSize = 11;
  const maxTextW = rw - padX * 2;

  // ── Word-wrap the full description ──────────────────────────────────────
  // ~6.2px per character at font-size 11 is a reliable SVG estimate
  const maxChars = Math.floor(maxTextW / 6.2);
  const lines = wrapText(d.fullDescription ?? d.description ?? "", maxChars);

  // ── Auto-size rect height to fit content ────────────────────────────────
  const textBlockH = lines.length * lineHeight;
  const rh = textBlockH + padY * 2;

  // ── Background ─────────────────────────────────────────────────────────
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

  // ── Wrapped text ────────────────────────────────────────────────────────
  if (lines.length) {
    const textStartY = -(textBlockH / 2) + lineHeight * 0.5;

    const textEl = sel
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", "#1e293b")
      .attr("font-size", fontSize)
      .attr("pointer-events", "none");

    lines.forEach((line, i) => {
      textEl
        .append("tspan")
        .text(line)
        .attr("x", 0)
        .attr("y", textStartY + i * lineHeight);
    });
  }

  // Write computed height back to datum so getEdgeEnd() and getLabelDy()
  // use the real size, not the initial placeholder
  d.height = rh;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function wrapText(
  text: string,
  maxChars: number,
  maxLines = Infinity,
): string[] {
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
      if (lines.length >= maxLines - 1) {
        current = word.slice(0, maxChars - 1) + "…";
        break;
      }
      current =
        word.length > maxChars ? word.slice(0, maxChars - 1) + "…" : word;
    }
  }

  if (current) lines.push(current);
  return lines;
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
      const defaultStroke =
        d.shape === "rect" ? (d.isSelected ? d.color : "#1e293b") : "#fff";
      shape
        .attr("stroke", defaultStroke)
        .attr("stroke-width", d.isSelected ? 3 : 2);
    }
  });
}

function typeAbbrev(type: string): string {
  return type.slice(0, 2).toUpperCase();
}
