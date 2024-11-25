// playback::ipc::get_audio_devices,
// playback::ipc::set_audio_device,

import { autoPlayOnConnect, connectedDevices, isPaused, playingSongId, selectedDevice, shouldPauseOnEnd, songProgress, songsMap, volumeLevel } from "@stores/State";
import { window } from "@tauri-apps/api";
import { invoke } from "@tauri-apps/api/core";
import type { UnlistenFn } from "@tauri-apps/api/event";
import { get, type Unsubscriber } from "svelte/store";
import { QueueController } from "./QueueController";

type AudioDevices = {
  devices: { name: string }[],
  default: { name: string }
}

export class AudioPlayer {
  private static songEndUnsub: Promise<UnlistenFn>;
  private static timestampUnsub: Promise<UnlistenFn>;
  private static backendPlayingUnsub: Promise<UnlistenFn>;
  private static backendPausedUnsub: Promise<UnlistenFn>;
  private static deviceChangesUnsub: Promise<UnlistenFn>;

  private static playingSongIdUnsub: Unsubscriber;
  private static isPausedUnsub: Unsubscriber;
  private static volumeLevelUnsub: Unsubscriber;
  private static selectedDeviceUnsub: Unsubscriber;

  private static oldNumAudioDevices: number;

  private static skipBackendPauseUpdate = false;

  /**
   * Initializes the Audio Player.
   */
  static init() {
    const currentWindow = window.getCurrentWindow();
    this.songEndUnsub = currentWindow.listen("ended", () => {
      QueueController.skip();
    });

    this.timestampUnsub = currentWindow.listen("timestamp", (event) => {
      console.log("seeked to:", event.payload);
      songProgress.set(event.payload as number, false);
    });

    this.backendPlayingUnsub = currentWindow.listen("playing", () => {
      AudioPlayer.skipBackendPauseUpdate = true;
      isPaused.set(false);
    });
    
    this.backendPausedUnsub = currentWindow.listen("paused", () => {
      AudioPlayer.skipBackendPauseUpdate = true;
      isPaused.set(true);
    });

    this.playingSongIdUnsub = playingSongId.subscribe((id) => {
      if (id !== "") {
        const song = get(songsMap)[id];
        const loadPromise = AudioPlayer.loadFile(song.filePath, get(songProgress));

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
      if (AudioPlayer.skipBackendPauseUpdate) return;
      
      if (paused) {
        AudioPlayer.pause();
      } else {
        AudioPlayer.play();
      }
    });

    this.volumeLevelUnsub = volumeLevel.subscribe((level) => {
      invoke<void>("set_volume", { level: level });
    });
    
    this.selectedDeviceUnsub = selectedDevice.subscribe((device) => {
      invoke<void>("set_audio_device", { deviceName: device });
    });

    this.getAudioDevices().then((devices) => this.handleConnectedDeviceChange(devices));
    
    this.deviceChangesUnsub = currentWindow.listen("attached_devices_change", (event) => {
      const devices = event.payload as AudioDevices;
      AudioPlayer.handleConnectedDeviceChange(devices);
    });
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

    const deviceChangeUnlisten = await this.deviceChangesUnsub;
    if (deviceChangeUnlisten) deviceChangeUnlisten();

    if (this.playingSongIdUnsub) this.playingSongIdUnsub();
    if (this.isPausedUnsub) this.isPausedUnsub();
    if (this.volumeLevelUnsub) this.volumeLevelUnsub();
    if (this.selectedDeviceUnsub) this.selectedDeviceUnsub();
  }

  static async loadFile(filePath: string, position?: number) {
    return invoke<void>("load_file", { filePath: filePath, position: position ?? 0 });
  }

  static play() {
    console.log("resuming playback...");
    invoke<void>("resume_playback", {});
  }

  static pause() {
    invoke<void>("pause_playback", {});
  }

  /**
   * Gets the currently connected audio devices.
   * @returns The currently connected audio devices.
   */
  private static async getAudioDevices(): Promise<AudioDevices> {
    return await invoke<AudioDevices>("get_audio_devices", {});
  }

  /**
   * Handles when the connected audio devices change.
   * @param devices The connected devices.
   */
  private static handleConnectedDeviceChange(devices: AudioDevices) {
    let selected = get(selectedDevice);

    if (selected === "") {
      selectedDevice.set(devices.default.name);
      selected = devices.default.name;
    }

    const currentDevices = devices.devices.map((dev) => dev.name);
    connectedDevices.set(currentDevices);

    if (this.oldNumAudioDevices && get(autoPlayOnConnect)) {
      if (currentDevices.length > this.oldNumAudioDevices && get(isPaused)) {
        isPaused.set(false);
      } else if (!currentDevices.includes(selected) && !get(isPaused)) {
        isPaused.set(true);
        selectedDevice.set(devices.default.name);
      }
    }

    this.oldNumAudioDevices = currentDevices.length;
  }
}