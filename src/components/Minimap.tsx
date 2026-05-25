import type { PlayerPosition, TeleportGate } from "../types";
import { WORLD_WIDTH, WORLD_HEIGHT, regionZones } from "./GameMap";
import { teleportGates } from "../data/teleportGates";

type MinimapProps = {
  player: PlayerPosition;
  isOpen: boolean;
  onToggle: () => void;
  onTeleport: (gate: TeleportGate) => void;
};

export function Minimap({ player, isOpen, onToggle, onTeleport }: MinimapProps) {
  if (!isOpen) {
    return (
      <button className="minimap-toggle" onClick={onToggle} title="Open Minimap (M)">
        M
      </button>
    );
  }

  const scaleX = 200 / WORLD_WIDTH;
  const scaleY = (200 * (WORLD_HEIGHT / WORLD_WIDTH)) / WORLD_HEIGHT;

  return (
    <div className="minimap">
      <div className="minimap-header">
        <span>Minimap</span>
        <button onClick={onToggle}>_</button>
      </div>
      <div className="minimap-container" style={{ width: 200, height: 200 * (WORLD_HEIGHT / WORLD_WIDTH) }}>
        {regionZones.map((zone) => (
          <div
            key={zone.region}
            className={`minimap-zone minimap-zone--${zone.category.toLowerCase()}`}
            style={{
              left: zone.x * scaleX,
              top: zone.y * scaleY,
              width: zone.width * scaleX,
              height: zone.height * scaleY
            }}
          />
        ))}
        {teleportGates.map((gate) => (
          <button
            key={gate.id}
            className="minimap-gate"
            style={{ left: gate.x * scaleX, top: gate.y * scaleY }}
            onClick={() => onTeleport(gate)}
            title={gate.name}
          />
        ))}
        <div
          className="minimap-player"
          style={{ left: player.x * scaleX, top: player.y * scaleY }}
        />
      </div>
    </div>
  );
}
