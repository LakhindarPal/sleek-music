import TrackPlayer, { Event, type MediaItem } from "@rntp/player";
import { useEffect, useState } from "react";

export const useQueueTracks = () => {
  const [tracks, setTracks] = useState<MediaItem[]>(() => TrackPlayer.getQueue());

  useEffect(() => {
    let isMounted = true;
    const updateQueue = () => {
      if (isMounted) {
        setTracks(TrackPlayer.getQueue());
      }
    };

    const queueSubscription = TrackPlayer.addEventListener(Event.QueueChanged, updateQueue);
    const transitionSubscription = TrackPlayer.addEventListener(
      Event.MediaItemTransition,
      updateQueue,
    );

    return () => {
      isMounted = false;
      queueSubscription.remove();
      transitionSubscription.remove();
    };
  }, []);

  return tracks;
};
