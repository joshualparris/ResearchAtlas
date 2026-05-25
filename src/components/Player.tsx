import type { PlayerPosition } from "../types";

type PlayerProps = {
  position: PlayerPosition;
};

export function Player({ position }: PlayerProps) {
  return (
    <div
      className="player-token"
      style={{ left: position.x, top: position.y }}
      aria-label="Player position"
    >
      <div className="player-token__core" />
    </div>
  );
}

