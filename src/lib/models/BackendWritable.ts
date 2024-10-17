import { writable, type Subscriber, type Updater } from "svelte/store";


export function backendWritable<T>(initial: T) {
  let isUpdateFromBackend = false;
  const innerStore = writable<T>(initial);
  const { subscribe, set, update } = innerStore;
  
  return {
    subscribe: (run: Subscriber<T>) => {
      return subscribe((value: T) => {
        if (!isUpdateFromBackend) {
          run(value);
        } else {
          isUpdateFromBackend = false;
        }
      });
    },
    update,
    updateFromBackend: (updater: Updater<T>) => {
      isUpdateFromBackend = true;
      update(updater);
    },
    set,
    setFromBackend: (value: T) => {
      isUpdateFromBackend = true;
      set(value);
    },
  };
}