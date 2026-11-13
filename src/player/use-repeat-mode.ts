import TrackPlayer, { RepeatMode } from "@rntp/player";
import { useState } from "react";

export const useRepeatMode = () => {
  const [repeatStatus, setRepeatStatus] = useState<RepeatMode>(() => TrackPlayer.getRepeatMode());

  const cycleRepeatMode = () => {
    setRepeatStatus((current) => {
      const nextMode =
        current === RepeatMode.Off
          ? RepeatMode.One
          : current === RepeatMode.One
            ? RepeatMode.All
            : RepeatMode.Off;
      TrackPlayer.setRepeatMode(nextMode);
      return nextMode;
    });
  };

  return { repeatMode: repeatStatus, cycleRepeatMode };
};
