import type { LinkDatum, NodeDatum } from "./graphTypes";

/**
 * Computes the x2/y2 endpoint of a link so the line stops at the target
 * node's visible edge rather than its center — works for both circles and rects.
 */
export function getEdgeEnd(d: LinkDatum): { x: number; y: number } {
  const source = d.source as NodeDatum;
  const target = d.target as NodeDatum;
  const tx = target.x ?? 0;
  const ty = target.y ?? 0;
  const dx = tx - (source.x ?? 0);
  const dy = ty - (source.y ?? 0);
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist === 0) return { x: tx, y: ty };

  if (target.shape === "rect") {
    // Intersect the line with the rectangle border
    const hw = (target.width ?? 140) / 2;
    const hh = (target.height ?? 56) / 2;
    const scaleX = Math.abs(dx) > 0 ? hw / Math.abs(dx) : Infinity;
    const scaleY = Math.abs(dy) > 0 ? hh / Math.abs(dy) : Infinity;
    const scale = Math.min(scaleX, scaleY);
    return { x: tx - dx * scale, y: ty - dy * scale };
  }

  // Circle: stop at circumference + stroke-width
  const r = target.size + 2;
  return { x: tx - (dx / dist) * r, y: ty - (dy / dist) * r };
}

/** Vertical offset for the external floating label below each node */
export function getLabelDy(d: NodeDatum): number {
  return d.shape === "rect" ? -((d.height ?? 56) / 2 + 8) : d.size + 14;
}

/** Collision radius used by forceCollide */
export function getCollisionRadius(d: NodeDatum): number {
  if (d.shape === "rect") {
    return (
      Math.sqrt(
        Math.pow((d.width ?? 140) / 2, 2) + Math.pow((d.height ?? 56) / 2, 2),
      ) + 10
    );
  }
  return d.size + 10;
}
