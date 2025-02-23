import type { NDKEvent } from "@nostr-dev-kit/ndk";
import { get, writable } from "svelte/store";

export default function createEventpool() {
  const raw = writable<Map<string, NDKEvent>>(new Map<string, NDKEvent>());
  const { subscribe, set, update } = raw;
  return {
    subscribe,
    push: (e: NDKEvent): void => {
      update((m) => {
        m.set(e.id, e);
        return m;
      });
    },
    fetch: (id: string): NDKEvent | undefined => {
      return get(raw).get(id);
    },
    pop: (id: string): NDKEvent | undefined => {
      let val = get(raw).get(id);
      if (val) {
        update((m) => {
          m.delete(id);
          return m;
        });
      }
      return val;
    },
    singleIterator: (): NDKEvent[] => {
      let list: NDKEvent[] = [];
      get(raw).forEach((e) => {
        list.push(e);
      });
      return list;
    },
    length: (): number => {
      return get(raw).size;
    },
  };
}
