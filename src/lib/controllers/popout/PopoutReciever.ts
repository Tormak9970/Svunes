import { backgroundColorPopout, currentSongPopout, isFavoritedPopout, isPausedPopout, repeatPlayedPopout, shufflePopout } from "@stores/Popout";
import { themePrimaryColor } from "@stores/State";
import { getCurrentWindow, LogicalPosition, primaryMonitor } from "@tauri-apps/api/window";
import { PopoutChannelEventType, type PopoutChannelEvent } from "@types";
import type { Unsubscriber } from "svelte/store";

/**
 * Handles updates to the Popout window's state.
 */
export class PopoutReciever {
  private static channel: BroadcastChannel;

  private static shuffleUnsub: Unsubscriber;
  private static isPausedUnsub: Unsubscriber;
  private static loopTrackUnsub: Unsubscriber;
  private static favoriteUnsub: Unsubscriber;

  private static initialLoad = true;
  private static popoutWindow = getCurrentWindow();
  
  /**
   * Initializes the PopoutReciever.
   */
  static init() {
    this.channel = new BroadcastChannel("popout-channel");

    this.registerSubs();
    this.registerMessageHandlers();
  }

  /**
   * Tells the main window to skip the current song.
   */
  static skip() {
    this.channel.postMessage({
      "label": PopoutChannelEventType.SKIP,
      "data": true
    });
  }

  /**
   * Tells the main window to skip to the last played song.
   */
  static skipBack() {
    this.channel.postMessage({
      "label": PopoutChannelEventType.SKIP,
      "data": false
    });
  }

  static closeWindow() {
    this.channel.postMessage({
      "label": PopoutChannelEventType.TOGGLE_VISIBILITY,
      "data": false
    });

    this.popoutWindow.hide();
  }

  private static registerSubs() {
    this.isPausedUnsub = isPausedPopout.subscribe((paused) => {
      this.channel.postMessage({
        "label": PopoutChannelEventType.PAUSE,
        "data": paused
      });
    });

    this.shuffleUnsub = shufflePopout.subscribe((enabled) => {
      this.channel.postMessage({
        "label": PopoutChannelEventType.SHUFFLE,
        "data": enabled
      });
    });

    this.loopTrackUnsub = repeatPlayedPopout.subscribe((enabled) => {
      this.channel.postMessage({
        "label": PopoutChannelEventType.LOOP,
        "data": enabled
      });
    });

    this.favoriteUnsub = isFavoritedPopout.subscribe((enabled) => {
      this.channel.postMessage({
        "label": PopoutChannelEventType.FAVORITE,
        "data": enabled
      });
    });
  }

  private static registerMessageHandlers() {
    this.channel.onmessage = async (event: MessageEvent<PopoutChannelEvent>) => {
      const data = event.data;
      
      switch (data.label) {
        case PopoutChannelEventType.TOGGLE_VISIBILITY:
          if (data.data) {
            if (this.initialLoad) {
              this.initialLoad = false;
              const monitor = (await primaryMonitor())!;
              const monitorRight = monitor.position.x + monitor.size.width - 25;
              const monitorBottom = monitor.position.y + monitor.size.height - 75;

              this.popoutWindow.setPosition(new LogicalPosition(monitorRight - 300, monitorBottom - 150))
                .then(() => {
                  this.popoutWindow.show();
                });
            } else {
              this.popoutWindow.show();
            }
          } else {
            this.popoutWindow.hide();
          }
          break;
        case PopoutChannelEventType.SONG_DATA:
          currentSongPopout.set(data.data.song);
          backgroundColorPopout.set(data.data.color);
          break;
        case PopoutChannelEventType.SHUFFLE:
          shufflePopout.set(data.data);
          break;
        case PopoutChannelEventType.PAUSE:
          isPausedPopout.set(data.data);
          break;
        case PopoutChannelEventType.LOOP:
          repeatPlayedPopout.set(data.data);
          break;
        case PopoutChannelEventType.FAVORITE:
          isFavoritedPopout.set(data.data);
          break;
        case PopoutChannelEventType.THEME_COLOR:
          themePrimaryColor.set(data.data);
          break;
        default:
          break;
      }
    }
  }

  /**
   * Destroys the PopoutReciever.
   */
  static destroy() {
    this.channel.close();
    
    if (this.shuffleUnsub) this.shuffleUnsub();
    if (this.isPausedUnsub) this.isPausedUnsub();
    if (this.loopTrackUnsub) this.loopTrackUnsub();
    if (this.favoriteUnsub) this.favoriteUnsub();
  }
}