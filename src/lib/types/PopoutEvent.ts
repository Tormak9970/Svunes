
export enum PopoutChannelEventType {
  TOGGLE_VISIBILITY,
  PROGRESS,
  SONG_DATA,
  SHUFFLE,
  SKIP,
  PAUSE,
  LOOP,
  FAVORITE
}

export type PopoutChannelEvent = {
  label: PopoutChannelEventType;
  data: any;
}