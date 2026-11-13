import TrackPlayer from "@rntp/player";
import { useState } from "react";

export const useShuffleMode = () => {
  const [shuffleStatus, setShuffleStatus] = useState<boolean>(() => TrackPlayer.isShuffleEnabled());

  const toggleShuffleMode = () => {
    setShuffleStatus((current) => {
      const next = !current;
      TrackPlayer.setShuffleEnabled(next);
      return next;
    });
  };

  return {
    shuffleMode: shuffleStatus,
    toggleShuffleMode,
  };
};
