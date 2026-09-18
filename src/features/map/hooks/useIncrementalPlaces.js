import { useEffect, useRef, useState } from "react";

export default function useIncrementalPlaces(places, resetKey) {
  const listRef = useRef(null);
  const [windowState, setWindowState] = useState(null);
  const count = windowState?.places === places && windowState?.key === resetKey
    ? windowState.count : 10;
  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = 0;
  }, [places, resetKey]);
  const onScroll = (event) => {
    const list = event.currentTarget;
    if (count < places.length && list.scrollHeight - list.scrollTop - list.clientHeight < 80) {
      setWindowState({ places, key: resetKey, count: count + 10 });
    }
  };
  return { listRef, onScroll, visiblePlaces: places.slice(0, count), hasMore: count < places.length };
}

