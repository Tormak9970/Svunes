// playback::ipc::get_audio_devices,
// playback::ipc::set_audio_device,

import { activeEq, audioBalance, autoPlayOnConnect, connectedDevices, equalizers, isPaused, playingSongId, selectedDevice, selectedEq, shouldPauseOnEnd, songProgress, songsMap, volumeLevel } from "@stores/State";
import { window } from "@tauri-apps/api";
import { invoke } from "@tauri-apps/api/core";
import type { UnlistenFn } from "@tauri-apps/api/event";
import type { Equalizer } from "@types";
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
  private static equalizerUnsub: Unsubscriber;
  private static balanceUnsub: Unsubscriber;

  private static oldNumAudioDevices: number;

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
      isPaused.set(false);
    });
    
    this.backendPausedUnsub = currentWindow.listen("paused", () => {
      isPaused.set(true);
    });

    this.playingSongIdUnsub = playingSongId.subscribe((id) => {
      if (id !== "") {
        const song = get(songsMap)[id];

        const equalizer = get(equalizers)[get(selectedEq)];

        const loadPromise = AudioPlayer.loadFile(song.filePath, get(volumeLevel), equalizer, get(songProgress));

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
        AudioPlayer.pause();
      } else {
        AudioPlayer.play();
      }
    });

    this.balanceUnsub = audioBalance.subscribe((balance) => {
      invoke<void>("set_audio_balance", { balance: balance });
    });


    this.equalizerUnsub = activeEq.subscribe((equalizer) => {
      if (equalizer) invoke<void>("set_equalizer", { equalizer: equalizer });
    });
    

    this.volumeLevelUnsub = volumeLevel.subscribe((level) => {
      invoke<void>("set_volume", { level: level });
    });
    
    this.selectedDeviceUnsub = selectedDevice.subscribe((device) => {
      invoke<void>("set_audio_device", { deviceName: device, balance: get(audioBalance) });
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
    if (this.balanceUnsub) this.balanceUnsub();
    if (this.equalizerUnsub) this.equalizerUnsub();
  }

  static async loadFile(filePath: string, volumeLevel: number, eq: Equalizer, position?: number) {
    return invoke<void>("load_file", { filePath: filePath, position: position ?? 0, level: volumeLevel, eq: eq });
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