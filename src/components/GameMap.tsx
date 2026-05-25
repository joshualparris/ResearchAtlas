import { useEffect, useMemo, useRef, useState } from "react";
import type { PlayerPosition, ResearchDocument, ResearchCategory } from "../types";
import { DocumentObject } from "./DocumentObject";
import { Player } from "./Player";

export const WORLD_WIDTH = 1800;
export const WORLD_HEIGHT = 1200;

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
  { category: "Archive", region: "Archive Caverns", x: 380, y: 900, width: 1030, height: 240 }
];

type GameMapProps = {
  documents: ResearchDocument[];
  player: PlayerPosition;
  nearestDocumentId: string | null;
  discoveredIds: Set<string>;
  onInspectDocument: (document: ResearchDocument) => void;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function GameMap({
  documents,
  player,
  nearestDocumentId,
  discoveredIds,
  onInspectDocument
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
    return () => resizeObserver.disconnect();
  }, []);

  const camera = useMemo(() => {
    const maxX = Math.max(0, WORLD_WIDTH - viewport.width);
    const maxY = Math.max(0, WORLD_HEIGHT - viewport.height);
    return {
      x: clamp(player.x - viewport.width / 2, 0, maxX),
      y: clamp(player.y - viewport.height / 2, 0, maxY)
    };
  }, [player.x, player.y, viewport.height, viewport.width]);

  return (
    <section className="game-map" aria-label="Research Atlas map">
      <div className="map-prompt" aria-live="polite">
        {nearestDocumentId ? "Press E to inspect" : "Explore the atlas"}
      </div>
      <div className="map-viewport" ref={viewportRef}>
        <div
          className="map-world"
          style={{
            width: WORLD_WIDTH,
            height: WORLD_HEIGHT,
            transform: `translate3d(${-camera.x}px, ${-camera.y}px, 0)`
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
