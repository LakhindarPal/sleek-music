import TrackPlayer from "@rntp/player";
import { useState } from "react";

export const SPEED_OPTIONS = [0.75, 1, 1.25, 1.5, 2, 3, 4] as const;
export type PlaybackSpeed = (typeof SPEED_OPTIONS)[number];

export function usePlaybackSpeed() {
  const [speed, setSpeedState] = useState<PlaybackSpeed>(1);

  const cycleSpeed = () => {
    setSpeedState((current) => {
      const idx = SPEED_OPTIONS.indexOf(current);
      const next = SPEED_OPTIONS[(idx + 1) % SPEED_OPTIONS.length];
      TrackPlayer.setPlaybackSpeed(next);
      return next;
    });
  };

  const setSpeed = (newSpeed: PlaybackSpeed) => {
    TrackPlayer.setPlaybackSpeed(newSpeed);
    setSpeedState(newSpeed);
  };

  return {
    speed,
    cycleSpeed,
    setSpeed,
  };
}
