import TrackPlayer from "@rntp/player";
import { useEffect, useState } from "react";

export type SleepTimerOption = 15 | 30 | 45 | 60 | "track" | null;

export function useSleepTimer() {
  const [activeTimer, setActiveTimer] = useState<SleepTimerOption>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);

  useEffect(() => {
    if (!activeTimer || activeTimer === "track") {
      return;
    }

    const interval = setInterval(() => {
      const state = TrackPlayer.getSleepTimer() as
        | { type: "time"; remainingSeconds: number }
        | { type: "mediaItem"; index: number }
        | null;
      if (state && state.type === "time") {
        setRemainingSeconds(state.remainingSeconds);
      } else {
        setActiveTimer(null);
        setRemainingSeconds(null);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTimer]);

  const setTimer = (option: SleepTimerOption) => {
    if (option === null) {
      TrackPlayer.cancelSleepTimer();
      setActiveTimer(null);
      setRemainingSeconds(null);
      return;
    }

    if (option === "track") {
      TrackPlayer.sleepAfterMediaItemAtIndex();
      setActiveTimer("track");
      setRemainingSeconds(null);
      return;
    }

    const seconds = option * 60;
    TrackPlayer.sleepAfterTime(seconds, { fadeOutSeconds: 5 });
    setActiveTimer(option);
    setRemainingSeconds(seconds);
  };

  const clearTimer = () => {
    TrackPlayer.cancelSleepTimer();
    setActiveTimer(null);
    setRemainingSeconds(null);
  };

  return {
    activeTimer,
    remainingSeconds,
    setTimer,
    clearTimer,
  };
}
