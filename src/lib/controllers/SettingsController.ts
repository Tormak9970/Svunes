/**
 * Copyright (C) 2023 Travis Lane (Tormak)
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>
 */
import { fs, path } from "@tauri-apps/api";
import { type Settings, DEFAULT_SETTINGS, GridSize, GridStyle, NowPlayingAlbumTheme, NowPlayingLayout } from "../../types/Settings";
import { LogController } from "../controllers/LogController";
import { albumGridSize, albums, albumSortOrder, artistGridSize, artistGridStyle, artists, artistSortOrder, autoPlayOnBluetooth, autoPlayOnConnect, circularPlayButton, dismissMiniPlayerWithSwipe, fadeAudioOnPause, musicDirectories, nowPlayingAlbumTheme, nowPlayingLayout, playlistGridSize, playlists, playlistSortOrder, queue, selectedView, showExtraControls, showSongInfo, showVolumeControls, songGridSize, songProgress, songs, songSortOrder, themePrimaryColor } from "../../stores/State";
import type { View } from "../../types/View";
import type { Playlist } from "../models/Playlist";
import type { Song } from "../models/Song";
import type { Artist } from "../models/Artist";
import type { Album } from "../models/Album";
import type { Unsubscriber } from "svelte/store";
import { showEditMusicFolders } from "../../stores/Overlays";

function setIfNotExist(object: any, defaults: any): any {
  const currentKeys = Object.keys(object);
  const defaultEntries = Object.entries(defaults);
  const defaultKeys = Object.keys(object);

  for (const key in object) {
    if (!defaultKeys.includes(key)) {
      // @ts-ignore
      delete object[key];
    }
  }

  for (const [ key, val ] of defaultEntries) {
    if (!currentKeys.includes(key)) {
      // @ts-ignore
      object[key] = val;
    }

    if (typeof object[key] === "object") {
      object[key] = setIfNotExist(object[key], defaults[key])
    }
  }

  return object;
}

/**
 * The controller for settings.
 */
export class SettingsController {
  private static settingsPath = "";
  private static settings: Settings;

  private static themePrimaryColorUnsub: Unsubscriber;
  private static musicDirectoriesUnsub: Unsubscriber;
  private static selectedViewUnsub: Unsubscriber;

  private static songProgressUnsub: Unsubscriber;
  private static showSongInfoUnsub: Unsubscriber;
  private static circularPlayButtonUnsub: Unsubscriber;
  private static nowPlayingLayoutUnsub: Unsubscriber;
  private static nowPlayingAlbumThemeUnsub: Unsubscriber;

  private static dismissMiniPlayerWithSwipeUnsub: Unsubscriber;
  private static showExtraControlsUnsub: Unsubscriber;
  private static showVolumeControlsUnsub: Unsubscriber;

  private static fadeAudioOnPauseUnsub: Unsubscriber;
  private static autoPlayOnConnectUnsub: Unsubscriber;
  private static autoPlayOnBluetoothUnsub: Unsubscriber;

  private static playlistsUnsub: Unsubscriber;
  private static queueUnsub: Unsubscriber;

  private static albumsUnsub: Unsubscriber;
  private static songsUnsub: Unsubscriber;
  private static artistsUnsub: Unsubscriber;

  private static playlistGridSizeUnsub: Unsubscriber;
  private static playlistSortOrderUnsub: Unsubscriber;

  private static albumGridSizeUnsub: Unsubscriber;
  private static albumSortOrderUnsub: Unsubscriber;

  private static songGridSizeUnsub: Unsubscriber;
  private static songSortOrderUnsub: Unsubscriber;

  private static artistGridSizeUnsub: Unsubscriber;
  private static artistGridStyleUnsub: Unsubscriber;
  private static artistSortOrderUnsub: Unsubscriber;

  /**
   * Initializes the SettingsController.
   */
  static async init() {
    const appDir = await path.appConfigDir();
    if (!(await fs.exists(appDir))) await fs.createDir(appDir);

    const setsPath = await path.join(appDir, "settings.json");
    if (!(await fs.exists(setsPath))) {
      await fs.writeTextFile(setsPath, JSON.stringify(DEFAULT_SETTINGS, null, "\t"));
    }

    this.settingsPath = setsPath;
    
    this.settings = await this.loadSettingsFromDevice();
    this.setStores();
    this.registerSubs();
  }

  /**
   * Migrate the settings structure to account for changes in the structure.
   */
  private static migrateSettingsStructure(oldSettings: Settings): Settings {
    // ? Handle any changes to settings from version to version here. Ex:
    // if (oldSettings?.filters) {
    //   oldSettings.windowSettings.main.filters = oldSettings.filters ?? DEFAULT_SETTINGS.windowSettings.main.filters;
    //   delete oldSettings.filters;
    // }

    return oldSettings;
  }

  /**
   * Gets the given settings field.
   * @param field The settings property to get.
   * @returns The given setting, or its default value if it does not exist.
   */
  private static getSetting<T>(field: string): T {
    const settings: any = structuredClone(this.settings);
    const fieldPath = field.split(".");
    let parentObject = settings;

    for (let i = 0; i < fieldPath. length - 1; i++) {
      const key = fieldPath[i];
      
      parentObject = parentObject[key];
    }

    const finalKey = fieldPath[fieldPath.length - 1];
    return parentObject[finalKey];
  }

  /**
   * Updates the given settings field with the provided data.
   * @param field The setting to update.
   * @param val The new value.
   */
  private static async updateSetting<T>(field: string, val: T): Promise<void> {
    const settings = structuredClone(this.settings);
    const fieldPath = field.split(".");
    let parentObject = settings;

    for (let i = 0; i < fieldPath. length - 1; i++) {
      // @ts-ignore
      parentObject = parentObject[fieldPath[i]];
    }

    // @ts-ignore
    parentObject[fieldPath[fieldPath.length - 1]] = val;

    this.settings = settings;
    this.save();

    LogController.log(`Updated setting ${field} to ${JSON.stringify(val)}.`);
  }

  /**
   * Returns a function that updates the given setting if the value has changed.
   * @param field The setting to update.
   * @returns A function that updates the given setting if the value has changed.
   */
  private static updateStoreIfChanged<T>(field: string): (val: T) => void {
    return (val: T) => {
      console.log("updating", field);
      const original = this.getSetting<T>(field);

      if (original !== val) {
        this.updateSetting(field, val);
      }
    }
  }

  /**
   * Loads the settings from the device.
   */
  private static async loadSettingsFromDevice(): Promise<Settings> {
    const currentSettings: any = JSON.parse(await fs.readTextFile(this.settingsPath));

    let settings: Settings = { ...currentSettings };
    
    const defaultSettings = structuredClone(DEFAULT_SETTINGS);

    settings = setIfNotExist(settings, defaultSettings);
    settings = this.migrateSettingsStructure(settings);

    settings.version = APP_VERSION;

    this.save();

    LogController.log("Finished checking settings for new app version and/or migration.");

    return settings;
  }

  /**
   * Sets the Svelte stores associated with the settings.
   */
  private static setStores(): void {
    themePrimaryColor.set(this.settings.themePrimaryColor);
    musicDirectories.set(this.settings.musicDirectories);
    if (this.settings.musicDirectories.length === 0) showEditMusicFolders.set(true);
    selectedView.set(this.settings.selectedView);


    const nowPlaying = this.settings.nowPlaying;
    songProgress.set(nowPlaying.songProgress);
    showSongInfo.set(nowPlaying.songInfo);
    circularPlayButton.set(nowPlaying.circularPlayButton);
    nowPlayingLayout.set(nowPlaying.layout);
    nowPlayingAlbumTheme.set(nowPlaying.albumTheme);

    const controls = nowPlaying.controls;
    dismissMiniPlayerWithSwipe.set(controls.dismissMiniWithSwipe);
    showExtraControls.set(controls.extraControls);
    showVolumeControls.set(controls.volumeControls);


    const audio = this.settings.audio;
    fadeAudioOnPause.set(audio.fade);
    autoPlayOnConnect.set(audio.autoPlay);
    autoPlayOnBluetooth.set(audio.autoPlayBluetooth);


    playlists.set(this.settings.playlists);

    queue.set(this.settings.queue);


    const cache = this.settings.cache;
    albums.set(cache.albums);
    songs.set(cache.songs);
    artists.set(cache.artists);


    const playlistsView = this.settings.playlistsView;
    playlistGridSize.set(playlistsView.gridSize);
    playlistSortOrder.set(playlistsView.sortOrder);


    const albumsView = this.settings.albumsView;
    albumGridSize.set(albumsView.gridSize);
    albumSortOrder.set(albumsView.sortOrder);


    const songsView = this.settings.songsView;
    songGridSize.set(songsView.gridSize);
    songSortOrder.set(songsView.sortOrder);


    const artistsView = this.settings.artistsView;
    artistGridSize.set(artistsView.gridSize);
    artistGridStyle.set(artistsView.gridStyle);
    artistSortOrder.set(artistsView.sortOrder);
  }

  /**
   * Registers the subscriptions to stores.
   */
  private static registerSubs() {
    this.themePrimaryColorUnsub = themePrimaryColor.subscribe(this.updateStoreIfChanged<string>("themePrimaryColor"));
    this.musicDirectoriesUnsub = musicDirectories.subscribe(this.updateStoreIfChanged<string[]>("musicDirectories"));
    this.selectedViewUnsub = selectedView.subscribe(this.updateStoreIfChanged<View>("selectedView"));


    this.songProgressUnsub = songProgress.subscribe(this.updateStoreIfChanged<number>("nowPlaying.songProgress"));
    this.showSongInfoUnsub = showSongInfo.subscribe(this.updateStoreIfChanged<boolean>("nowPlaying.songInfo"));
    this.circularPlayButtonUnsub = circularPlayButton.subscribe(this.updateStoreIfChanged<boolean>("nowPlaying.circularPlayButton"));
    this.nowPlayingLayoutUnsub = nowPlayingLayout.subscribe(this.updateStoreIfChanged<NowPlayingLayout>("nowPlaying.layout"));
    this.nowPlayingAlbumThemeUnsub = nowPlayingAlbumTheme.subscribe(this.updateStoreIfChanged<NowPlayingAlbumTheme>("nowPlaying.albumTheme"));

    this.dismissMiniPlayerWithSwipeUnsub = dismissMiniPlayerWithSwipe.subscribe(this.updateStoreIfChanged<boolean>("nowPlaying.controls.dismissMiniWithSwipe"));
    this.showExtraControlsUnsub = showExtraControls.subscribe(this.updateStoreIfChanged<boolean>("nowPlaying.controls.extraControls"));
    this.showVolumeControlsUnsub = showVolumeControls.subscribe(this.updateStoreIfChanged<boolean>("nowPlaying.controls.volumeControls"));


    this.fadeAudioOnPauseUnsub = fadeAudioOnPause.subscribe(this.updateStoreIfChanged<boolean>("audio.fade"));
    this.autoPlayOnConnectUnsub = autoPlayOnConnect.subscribe(this.updateStoreIfChanged<boolean>("audio.autoPlay"));
    this.autoPlayOnBluetoothUnsub = autoPlayOnBluetooth.subscribe(this.updateStoreIfChanged<boolean>("audio.autoPlayBluetooth"));


    this.playlistsUnsub = playlists.subscribe(this.updateStoreIfChanged<Playlist[]>("playlists"));

    this.queueUnsub = queue.subscribe(this.updateStoreIfChanged<Song[]>("queue"));


    this.albumsUnsub = albums.subscribe(this.updateStoreIfChanged<Album[]>("cache.albums"));
    this.songsUnsub = songs.subscribe(this.updateStoreIfChanged<Song[]>("cache.songs"));
    this.artistsUnsub = artists.subscribe(this.updateStoreIfChanged<Artist[]>("cache.artists"));


    this.playlistGridSizeUnsub = playlistGridSize.subscribe(this.updateStoreIfChanged<GridSize>("playlistsView.gridSize"));
    this.playlistSortOrderUnsub = playlistSortOrder.subscribe(this.updateStoreIfChanged<string>("playlistsView."));


    this.albumGridSizeUnsub = albumGridSize.subscribe(this.updateStoreIfChanged<GridSize>("albumsView.gridSize"));
    this.albumSortOrderUnsub = albumSortOrder.subscribe(this.updateStoreIfChanged<string>("albumsView.sortOrder"));


    this.songGridSizeUnsub = songGridSize.subscribe(this.updateStoreIfChanged<GridSize>("songsView.gridSize"));
    this.songSortOrderUnsub = songSortOrder.subscribe(this.updateStoreIfChanged<string>("songsView.sortOrder"));


    this.artistGridSizeUnsub = artistGridSize.subscribe(this.updateStoreIfChanged<GridSize>("artistsView.gridSize"));
    this.artistGridStyleUnsub = artistGridStyle.subscribe(this.updateStoreIfChanged<GridStyle>("artistsView.gridStyle"));
    this.artistSortOrderUnsub = artistSortOrder.subscribe(this.updateStoreIfChanged<string>("artistsView.sortOrder"));
  }

  /**
   * Saves the settings object.
   */
  private static async save() {
    await fs.writeFile({
      path: this.settingsPath,
      contents: JSON.stringify(this.settings),
    });
  }

  /**
   * Handles destroying the settings.
   */
  static destroy() {
    this.save();

    if (this.themePrimaryColorUnsub) this.themePrimaryColorUnsub();
    if (this.musicDirectoriesUnsub) this.musicDirectoriesUnsub();
    if (this.selectedViewUnsub) this.selectedViewUnsub();

    if (this.songProgressUnsub) this.songProgressUnsub();
    if (this.showSongInfoUnsub) this.showSongInfoUnsub();
    if (this.circularPlayButtonUnsub) this.circularPlayButtonUnsub();
    if (this.nowPlayingLayoutUnsub) this.nowPlayingLayoutUnsub();
    if (this.nowPlayingAlbumThemeUnsub) this.nowPlayingAlbumThemeUnsub();

    if (this.dismissMiniPlayerWithSwipeUnsub) this.dismissMiniPlayerWithSwipeUnsub();
    if (this.showExtraControlsUnsub) this.showExtraControlsUnsub();
    if (this.showVolumeControlsUnsub) this.showVolumeControlsUnsub();

    if (this.fadeAudioOnPauseUnsub) this.fadeAudioOnPauseUnsub();
    if (this.autoPlayOnConnectUnsub) this.autoPlayOnConnectUnsub();
    if (this.autoPlayOnBluetoothUnsub) this.autoPlayOnBluetoothUnsub();

    if (this.playlistsUnsub) this.playlistsUnsub();
    if (this.queueUnsub) this.queueUnsub();

    if (this.albumsUnsub) this.albumsUnsub();
    if (this.songsUnsub) this.songsUnsub();
    if (this.artistsUnsub) this.artistsUnsub();

    if (this.playlistGridSizeUnsub) this.playlistGridSizeUnsub();
    if (this.playlistSortOrderUnsub) this.playlistSortOrderUnsub();

    if (this.albumGridSizeUnsub) this.albumGridSizeUnsub();
    if (this.albumSortOrderUnsub) this.albumSortOrderUnsub();

    if (this.songGridSizeUnsub) this.songGridSizeUnsub();
    if (this.songSortOrderUnsub) this.songSortOrderUnsub();

    if (this.artistGridSizeUnsub) this.artistGridSizeUnsub();
    if (this.artistGridStyleUnsub) this.artistGridStyleUnsub();
    if (this.artistSortOrderUnsub) this.artistSortOrderUnsub();
  }
}