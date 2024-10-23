import { PlaybackController, QueueController } from "@controllers";
import { showPopoutPlayer } from "@stores/Layout";
import { isPaused, playingSongId, playlists, repeatPlayed, shuffle, songProgress, songsMap, themePrimaryColor } from "@stores/State";
import { PopoutChannelEventType, type PopoutChannelEvent } from "@types";
import { hash64 } from "@utils";
import { derived, get, type Readable, type Unsubscriber } from "svelte/store";

/**
 * Handles updating the Popout window when the main window's state changes.
 */
export class PopoutSender {
  private static channel: BroadcastChannel;

  private static progressUnsub: Unsubscriber;
  private static playingIdUnsub: Unsubscriber;
  private static shuffleUnsub: Unsubscriber;
  private static isPausedUnsub: Unsubscriber;
  private static loopTrackUnsub: Unsubscriber;
  private static favoriteUnsub: Unsubscriber;
  private static showPopoutPlayerUnsub: Unsubscriber;
  private static themeUnsub: Unsubscriber;

  private static isFavorited: Readable<boolean>;
  
  /**
   * Initializes the PopoutSender.
   */
  static init() {
    this.channel = new BroadcastChannel("popout-channel");

    this.registerSubs();
    this.registerMessageHandlers();
  }

  private static registerSubs() {
    this.progressUnsub = songProgress.subscribe((progress) => {
      this.channel.postMessage({
        "label": PopoutChannelEventType.PROGRESS,
        "data": progress
      });
    });

    this.playingIdUnsub = playingSongId.subscribe((id) => {
      this.channel.postMessage({
        "label": PopoutChannelEventType.SONG_DATA,
        "data": !!id ? get(songsMap)[id] : null
      });
    });

    this.shuffleUnsub = shuffle.subscribe((enabled) => {
      this.channel.postMessage({
        "label": PopoutChannelEventType.SHUFFLE,
        "data": enabled
      });
    });

    this.isPausedUnsub = isPaused.subscribe((enabled) => {
      this.channel.postMessage({
        "label": PopoutChannelEventType.PAUSE,
        "data": enabled
      });
    });

    this.loopTrackUnsub = repeatPlayed.subscribe((enabled) => {
      this.channel.postMessage({
        "label": PopoutChannelEventType.LOOP,
        "data": enabled
      });
    });

    this.isFavorited = derived([playlists, playingSongId], ([$playlists, $songId]) => {
      const favoritesPlaylist = $playlists?.find((playlist) => playlist.id === hash64("Favorites"));
  
      return ($songId && !!favoritesPlaylist) ? favoritesPlaylist.songIds.includes($songId) : false;
    });

    this.favoriteUnsub = this.isFavorited.subscribe((enabled) => {
      this.channel.postMessage({
        "label": PopoutChannelEventType.FAVORITE,
        "data": enabled
      });
    });

    this.showPopoutPlayerUnsub = showPopoutPlayer.subscribe((show) => {
      this.channel.postMessage({
        "label": PopoutChannelEventType.TOGGLE_VISIBILITY,
        "data": show
      });
    });

    this.themeUnsub = themePrimaryColor.subscribe((color) => {
      this.channel.postMessage({
        "label": PopoutChannelEventType.THEME_COLOR,
        "data": color
      });
    });
  }

  private static registerMessageHandlers() {
    this.channel.onmessage = (event: MessageEvent<PopoutChannelEvent>) => {
      const data = event.data;
      
      switch (data.label) {
        case PopoutChannelEventType.TOGGLE_VISIBILITY:
          showPopoutPlayer.set(data.data);
          break;
        case PopoutChannelEventType.PROGRESS:
          songProgress.set(data.data);
          break;
        case PopoutChannelEventType.SHUFFLE:
          shuffle.set(data.data);
          break;
        case PopoutChannelEventType.SKIP:
          if (data.data) {
            QueueController.skip();
          } else {
            QueueController.skipBack();
          }
          break;
        case PopoutChannelEventType.PAUSE:
          if (data.data) {
            PlaybackController.pause();
          } else {
            PlaybackController.resume();
          }
          break;
        case PopoutChannelEventType.LOOP:
          repeatPlayed.set(data.data);
          break;
        case PopoutChannelEventType.FAVORITE:
          const songId = get(playingSongId);
          const song = get(songsMap)[songId];

          const playlistsRef = get(playlists);
          const favoritesPlaylist = playlistsRef.find((playlist) => playlist.id === hash64("Favorites"))!;
          const isFavorited = favoritesPlaylist.songIds.includes(song.id);

          if (isFavorited) {
            const index = favoritesPlaylist.songIds.indexOf(song.id);
            favoritesPlaylist.songIds.splice(index, 1);
          } else {
            favoritesPlaylist.songIds.push(song.id);
          }
          
          playlists.set([ ...playlistsRef ]);
          break;
        default:
          break;
      }
    }
  }

  /**
   * Destroys the PopoutSender.
   */
  static destroy() {
    this.channel.close();

    if (this.progressUnsub) this.progressUnsub();
    if (this.playingIdUnsub) this.playingIdUnsub();
    if (this.shuffleUnsub) this.shuffleUnsub();
    if (this.isPausedUnsub) this.isPausedUnsub();
    if (this.loopTrackUnsub) this.loopTrackUnsub();
    if (this.favoriteUnsub) this.favoriteUnsub();
    if (this.showPopoutPlayerUnsub) this.showPopoutPlayerUnsub();
    if (this.themeUnsub) this.themeUnsub();
  }
}