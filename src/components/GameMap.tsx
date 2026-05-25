import { useEffect, useMemo, useRef, useState } from "react";
import type { PlayerPosition, ResearchDocument, ResearchCategory, TeleportGate } from "../types";
import { DocumentObject } from "./DocumentObject";
import { Player } from "./Player";
import { teleportGates } from "../data/teleportGates";
import { memoryShrines } from "../data/memoryShrines";

export const WORLD_WIDTH = 2200;
export const WORLD_HEIGHT = 2400;

type RegionZone = {
  category: ResearchCategory;
  region: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export const regionZones: RegionZone[] = [
  { category: "Health", region: "Health Highlands", x: 60, y: 70, width: 500, height: 360 },
  { category: "Mind", region: "Mind Forest", x: 590, y: 70, width: 500, height: 360 },
  { category: "Tech", region: "Tech Citadel", x: 1120, y: 70, width: 520, height: 390 },
  { category: "Family", region: "Family Grove", x: 90, y: 510, width: 500, height: 350 },
  { category: "Faith", region: "Faith Chapel", x: 630, y: 500, width: 500, height: 370 },
  { category: "Life", region: "Life Observatory", x: 1160, y: 510, width: 530, height: 370 },
  { category: "Archive", region: "Archive Caverns", x: 380, y: 900, width: 1030, height: 240 },
  { category: "Health", region: "Body Systems Lab", x: 60, y: 1200, width: 1050, height: 300 },
  { category: "Mind", region: "ADHD Focus Grove", x: 60, y: 1530, width: 1050, height: 150 },
  { category: "Family", region: "Parenting Haven", x: 60, y: 1710, width: 1050, height: 180 },
  { category: "Family", region: "Marriage & Connection Garden", x: 60, y: 1920, width: 1050, height: 180 },
  { category: "Tech", region: "Tech & AI Citadel Expansion", x: 1150, y: 1200, width: 600, height: 300 },
  { category: "Life", region: "Life Analytics Observatory", x: 1150, y: 1530, width: 600, height: 300 },
  { category: "Life", region: "Work & Vocation Guildhall", x: 1150, y: 1920, width: 950, height: 180 },
  { category: "Life", region: "Places & Calling Map", x: 60, y: 2130, width: 1350, height: 200 }
];

type GameMapProps = {
  documents: ResearchDocument[];
  player: PlayerPosition;
  nearestDocumentId: string | null;
  nearestGateId: string | null;
  nearestShrineId: string | null;
  discoveredIds: Set<string>;
  onInspectDocument: (document: ResearchDocument) => void;
  onInspectShrine: (shrineId: string) => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  trackingDocument: ResearchDocument | null;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function GameMap({
  documents,
  player,
  nearestDocumentId,
  nearestGateId,
  nearestShrineId,
  discoveredIds,
  onInspectDocument,
  onInspectShrine,
  zoom,
  onZoomChange,
  trackingDocument
}: GameMapProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [viewport, setViewport] = useState({ width: 900, height: 640 });

  useEffect(() => {
    const node = viewportRef.current;
    if (!node) return;

    const resizeObserver = new ResizeObserver(([entry]) => {
      setViewport({
        width: entry.contentRect.width,
        height: entry.contentRect.height
      });
    });

    resizeObserver.observe(node);

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        onZoomChange(clamp(zoom + delta, 0.5, 2.0));
      }
    };

    node.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      resizeObserver.disconnect();
      node.removeEventListener("wheel", handleWheel);
    };
  }, [onZoomChange, zoom]);

  const camera = useMemo(() => {
    const visibleWidth = viewport.width / zoom;
    const visibleHeight = viewport.height / zoom;
    const maxX = Math.max(0, WORLD_WIDTH - visibleWidth);
    const maxY = Math.max(0, WORLD_HEIGHT - visibleHeight);
    return {
      x: clamp(player.x - visibleWidth / 2, 0, maxX),
      y: clamp(player.y - visibleHeight / 2, 0, maxY)
    };
  }, [player.x, player.y, viewport.height, viewport.width, zoom]);

  return (
    <section className="game-map" aria-label="Research Atlas map">
      <div className="map-controls">
        <button onClick={() => onZoomChange(clamp(zoom + 0.1, 0.5, 2.0))} title="Zoom In">+</button>
        <button onClick={() => onZoomChange(clamp(zoom - 0.1, 0.5, 2.0))} title="Zoom Out">-</button>
        <button onClick={() => onZoomChange(1.0)} title="Reset Zoom">1:1</button>
        <button
          onClick={() => {
            const fitZoom = Math.min(viewport.width / WORLD_WIDTH, viewport.height / WORLD_HEIGHT);
            onZoomChange(clamp(fitZoom, 0.5, 2.0));
          }}
          title="Fit World"
        >
          Fit
        </button>
      </div>
      <div className="map-prompt" aria-live="polite">
        {nearestDocumentId && "Press E to inspect"}
        {nearestGateId && "Press T to teleport"}
        {nearestShrineId && "Press E to visit shrine"}
        {!nearestDocumentId && !nearestGateId && !nearestShrineId && "Explore the atlas"}
      </div>
      <div className="map-viewport" ref={viewportRef}>
        <div
          className="map-world"
          style={{
            width: WORLD_WIDTH,
            height: WORLD_HEIGHT,
            transform: `scale(${zoom}) translate3d(${-camera.x}px, ${-camera.y}px, 0)`,
            transformOrigin: "0 0"
          }}
        >
          <div className="map-grid" />
          {regionZones.map((zone) => (
            <div
              key={zone.region}
              className={`region-zone region-zone--${zone.category.toLowerCase()}`}
              style={{
                left: zone.x,
                top: zone.y,
                width: zone.width,
                height: zone.height
              }}
            >
              <span>{zone.region}</span>
            </div>
          ))}
          <div className="atlas-road atlas-road--one" />
          <div className="atlas-road atlas-road--two" />
          <div className="atlas-road atlas-road--three" />

          {trackingDocument && (
            <svg
              className="tracking-line"
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: WORLD_WIDTH,
                height: WORLD_HEIGHT,
                pointerEvents: "none",
                zIndex: 2
              }}
            >
              <line
                x1={player.x}
                y1={player.y}
                x2={trackingDocument.x}
                y2={trackingDocument.y}
                stroke="var(--color-primary)"
                strokeWidth="2"
                strokeDasharray="5,5"
                opacity="0.6"
              />
            </svg>
          )}

          {teleportGates.map((gate) => (
            <div
              key={gate.id}
              className={`teleport-gate ${nearestGateId === gate.id ? "is-near" : ""}`}
              style={{ left: gate.x, top: gate.y }}
              title={gate.name}
            >
              <div className="teleport-gate__glow" />
              <div className="teleport-gate__core" />
            </div>
          ))}

          {memoryShrines.map((shrine) => (
            <div
              key={shrine.id}
              className={`memory-shrine ${nearestShrineId === shrine.id ? "is-near" : ""}`}
              style={{ left: shrine.x, top: shrine.y }}
              title={shrine.description}
              onClick={() => onInspectShrine(shrine.id)}
            >
              <div className="memory-shrine__base" />
              <div className="memory-shrine__gem" />
            </div>
          ))}

          {documents.map((document) => (
            <DocumentObject
              key={document.id}
              document={document}
              discovered={discoveredIds.has(document.id)}
              near={nearestDocumentId === document.id}
              onInspect={onInspectDocument}
            />
          ))}
          <Player position={player} />
        </div>
      </div>
    </section>
  );
}
