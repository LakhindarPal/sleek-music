import TrackPlayer from "@rntp/player";
import { useRef, useState } from "react";

export function usePlayerVolume() {
  const [volume, setVolumeState] = useState(() => {
    try {
      return TrackPlayer.getVolume();
    } catch {
      return 1;
    }
  });

  const previousVolume = useRef(volume > 0 ? volume : 1);

  const updateVolume = (val: number) => {
    const clamped = Math.max(0, Math.min(1, val));
    TrackPlayer.setVolume(clamped);
    setVolumeState(clamped);
    if (clamped > 0) {
      previousVolume.current = clamped;
    }
  };

  const toggleMute = () => {
    if (volume > 0) {
      previousVolume.current = volume;
      TrackPlayer.setVolume(0);
      setVolumeState(0);
    } else {
      const restored = previousVolume.current || 1;
      TrackPlayer.setVolume(restored);
      setVolumeState(restored);
    }
  };

  return {
    volume,
    setVolume: updateVolume,
    toggleMute,
    isMuted: volume === 0,
  };
}
