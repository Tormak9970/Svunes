// playback::ipc::get_audio_devices,
// playback::ipc::set_audio_device,

import { autoPlayOnConnect, isPaused, playingSongId, shouldPauseOnEnd, songProgress, songsMap, volumeLevel } from "@stores/State";
import { window } from "@tauri-apps/api";
import { invoke } from "@tauri-apps/api/core";
import type { UnlistenFn } from "@tauri-apps/api/event";
import { get, type Unsubscriber } from "svelte/store";
import { QueueController } from "./QueueController";

export class AudioPlayer {
  private static songEndUnsub: Promise<UnlistenFn>;
  private static timestampUnsub: Promise<UnlistenFn>;
  private static backendPlayingUnsub: Promise<UnlistenFn>;
  private static backendPausedUnsub: Promise<UnlistenFn>;

  private static playingSongIdUnsub: Unsubscriber;
  private static isPausedUnsub: Unsubscriber;
  private static songProgressUnsub: Unsubscriber;
  private static volumeLevelUnsub: Unsubscriber;

  private static oldNumAudioDevices: number;

  // TODO: recreate these subscriptions
  // ! <audio style="display: none;" bind:this={audioPlayer} bind:currentTime={$songProgress} bind:volume={$volumeLevel} on:ended={QueueController.skip} />

  /**
   * Initializes the Audio Player.
   */
  static init() {
    const currentWindow = window.getCurrentWindow();
    this.songEndUnsub = currentWindow.listen("ended", (event) => {
      console.log("ended:", event);
      QueueController.skip();
    });

    this.timestampUnsub = currentWindow.listen("timestamp", (event) => {
      console.log("timestamp:", event);
      songProgress.setFromBackend(event.payload as number);
    });

    this.backendPlayingUnsub = currentWindow.listen("playing", (event) => {
      isPaused.set(false);
    });
    
    this.backendPausedUnsub = currentWindow.listen("paused", (event) => {
      isPaused.set(true);
    });

    this.playingSongIdUnsub = playingSongId.subscribe((id) => {
      if (id !== "") {
        const song = get(songsMap)[id];

        let loadPromise = AudioPlayer.loadFile(song.filePath);

        if (get(shouldPauseOnEnd)) {
          isPaused.set(true);
          return;
        }

        if (!get(isPaused)) {
          loadPromise.then(() => AudioPlayer.play());
        }
      }
    });

    this.isPausedUnsub = isPaused.subscribe((paused) => {
      if (paused) {
        this.pause();
      } else {
        this.play();
      }
    });

    this.songProgressUnsub = songProgress.subscribe((position) => {
      console.log("seek occured");
      invoke<void>("seek", { position: position });
    });

    this.volumeLevelUnsub = volumeLevel.subscribe((level) => {
      invoke<void>("set_volume", { level: level });
    });
    

    this.handleMediaDeviceChange();
    navigator.mediaDevices.ondevicechange = this.handleMediaDeviceChange;
  }

  /**
   * Destroys the Audio Player.
   */
  static async destroy() {
    const endUnlisten = await this.songEndUnsub;
    if (endUnlisten) endUnlisten();

    const timestampUnlisten = await this.timestampUnsub;
    if (timestampUnlisten) timestampUnlisten();
    
    const playingUnlisten = await this.backendPlayingUnsub;
    if (playingUnlisten) playingUnlisten();

    const pausedUnlisten = await this.backendPausedUnsub;
    if (pausedUnlisten) pausedUnlisten();

    if (this.playingSongIdUnsub) this.playingSongIdUnsub();
    if (this.isPausedUnsub) this.isPausedUnsub();
    if (this.songProgressUnsub) this.songProgressUnsub();
    if (this.volumeLevelUnsub) this.volumeLevelUnsub();
  }

  static handleMediaDeviceChange() {
    navigator.mediaDevices.enumerateDevices().then((devices: MediaDeviceInfo[]) => {
      const numAudioDevices = devices.filter((device) => device.kind.includes("audio")).length;

      if (this.oldNumAudioDevices && get(autoPlayOnConnect)) {
        if (numAudioDevices > this.oldNumAudioDevices && get(isPaused)) {
          isPaused.set(true);
        } else if (numAudioDevices < this.oldNumAudioDevices && !get(isPaused)) {
          isPaused.set(false);
        }
      }

      this.oldNumAudioDevices = numAudioDevices;
    });
  }

  static async loadFile(filePath: string) {
    return invoke<void>("load_file", { filePath: filePath });
  }

  static play() {
    invoke<void>("resume_playback", {})
  }

  static pause() {
    invoke<void>("pause_playback", {});
  }
}