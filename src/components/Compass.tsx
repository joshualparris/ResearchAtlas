import type { PlayerPosition, ResearchDocument } from "../types";

type CompassProps = {
  player: PlayerPosition;
  target: ResearchDocument | null;
  onTrack: (id: string | null) => void;
  isTracking: boolean;
};

export function Compass({ player, target, onTrack, isTracking }: CompassProps) {
  if (!target) return null;

  const dx = target.x - player.x;
  const dy = target.y - player.y;
  const distance = Math.round(Math.hypot(dx, dy));
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  return (
    <div className="compass">
      <div className="compass-header">
        <strong>Nearest Undiscovered</strong>
      </div>
      <div className="compass-body">
        <div className="compass-direction">
          <div className="compass-arrow" style={{ transform: `rotate(${angle}deg)` }}>
            ↑
          </div>
          <span>{distance}m</span>
        </div>
        <p className="compass-target-title">{target.title}</p>
        <button
          className={`secondary-button ${isTracking ? "is-tracking" : ""}`}
          onClick={() => onTrack(isTracking ? null : target.id)}
        >
          {isTracking ? "Stop Tracking" : "Track This"}
        </button>
      </div>
    </div>
  );
}
