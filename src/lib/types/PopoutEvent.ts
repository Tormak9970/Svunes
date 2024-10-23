
export enum PopoutChannelEventType {
  TOGGLE_VISIBILITY,
  PROGRESS,
  SONG_DATA,
  SHUFFLE,
  SKIP,
  PAUSE,
  LOOP,
  FAVORITE,
  THEME_COLOR
}

export type PopoutChannelEvent = {
  label: PopoutChannelEventType;
  data: any;
}