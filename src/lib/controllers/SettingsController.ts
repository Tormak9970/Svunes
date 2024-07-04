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
import { albumGridSize, albums, albumSortOrder, artistGridSize, artistGridStyle, artists, artistSortOrder, autoDetectCarMode, autoPlayOnConnect, blacklistedFolders, dismissMiniPlayerWithSwipe, extraControl, filterSongDuration, musicDirectories, nowPlayingBackgroundType, nowPlayingList, nowPlayingTheme, nowPlayingType, palette, playingSongId, playlistGridSize, playlists, playlistSortOrder, queue, repeatPlayed, selectedLanguage, selectedView, showErrorSnackbar, showExtraSongInfo, showInfoSnackbar, showVolumeControls, shuffle, songGridSize, songProgress, songs, songSortOrder, themePrimaryColor, useAlbumColors, useArtistColors, useOledPalette, viewIndices, viewsToRender, volumeLevel } from "@stores/State";
import { fs, path } from "@tauri-apps/api";
import { get, type Unsubscriber } from "svelte/store";
import { AppLanguage, DEFAULT_SETTINGS, GridSize, GridStyle, NowPlayingBackgroundType, NowPlayingTheme, type AlbumMetadata, type ArtistMetadata, type NowPlayingExtraControl, type NowPlayingType, type Palette, type Settings, type SongMetadata } from "../../types/Settings";
import { View } from "../../types/View";
import type { Album } from "../models/Album";
import type { Artist } from "../models/Artist";
import { Playlist } from "../models/Playlist";
import { Song } from "../models/Song";
import { debounce } from "../utils/Utils";
import { LogController } from "./utils/LogController";

/**
 * Sets settings to defaults if they do not exist.
 * @param object The settings object.
 * @param defaults The corresponding default values.
 * @returns The updated settings.
 */
function setIfNotExist(object: any, defaults: any): any {
  if (object?.length || object?.length === 0) return object;

  const currentKeys = Object.keys(object);
  const defaultEntries = Object.entries(defaults);
  const defaultKeys = Object.keys(object);

  for (const key in object) {
    // @ts-ignore
    if (!defaultKeys.includes(key)) delete object[key];
  }

  for (const [ key, val ] of defaultEntries) {
    // @ts-ignore
    if (!currentKeys.includes(key)) object[key] = val;

    if (typeof defaults[key] === "object") object[key] = setIfNotExist(object[key], defaults[key]);
  }

  return object;
}

/**
 * The controller for settings.
 */
export class SettingsController {
  static settingsHaveChanged = false;
  private static settingsPath = "";
  private static settings: Settings;

  private static paletteUnsub: Unsubscriber;
  private static useOledPaletteUnsub: Unsubscriber;
  private static themePrimaryColorUnsub: Unsubscriber;

  private static musicDirectoriesUnsub: Unsubscriber;
  private static selectedViewUnsub: Unsubscriber;

  private static showExtraSongInfoUnsub: Unsubscriber;
  private static nowPlayingThemeUnsub: Unsubscriber;
  private static nowPlayingBackgroundTypeUnsub: Unsubscriber;

  private static viewsToRenderUnsub: Unsubscriber;
  private static viewIndicesUnsub: Unsubscriber;

  private static dismissMiniPlayerWithSwipeUnsub: Unsubscriber;
  private static showVolumeControlsUnsub: Unsubscriber;
  private static extraControlUnsub: Unsubscriber;
  private static autoDetectCarModeUnsub: Unsubscriber;

  private static autoPlayOnConnectUnsub: Unsubscriber;

  private static playlistsUnsub: Unsubscriber;

  private static queueUnsub: Unsubscriber;

  private static blacklistedFoldersUnsub: Unsubscriber;
  private static filterSongDurationUnsub: Unsubscriber;
  private static selectedLanguageUnsub: Unsubscriber;

  private static albumsUnsub: Unsubscriber;
  private static songsUnsub: Unsubscriber;
  private static artistsUnsub: Unsubscriber;
  private static songProgressUnsub: Unsubscriber;
  private static playingSongIdUnsub: Unsubscriber;
  private static shuffleUnsub: Unsubscriber;
  private static volumeLevelUnsub: Unsubscriber;
  private static repeatPlayedUnsub: Unsubscriber;
  private static nowPlayingListUnsub: Unsubscriber;
  private static nowPlayingTypeUnsub: Unsubscriber;

  private static playlistGridSizeUnsub: Unsubscriber;
  private static playlistSortOrderUnsub: Unsubscriber;

  private static albumGridSizeUnsub: Unsubscriber;
  private static albumSortOrderUnsub: Unsubscriber;
  private static useAlbumColorsUnsub: Unsubscriber;

  private static songGridSizeUnsub: Unsubscriber;
  private static songSortOrderUnsub: Unsubscriber;

  private static artistGridSizeUnsub: Unsubscriber;
  private static artistGridStyleUnsub: Unsubscriber;
  private static artistSortOrderUnsub: Unsubscriber;
  private static useArtistColorsUnsub: Unsubscriber;

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

    LogController.log("Initialized Settings.");
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
  static getSetting<T>(field: string): T {
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
  private static updateSetting<T>(field: string, val: T): void {
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
    this.save()

    const stringified = JSON.stringify(val);
    LogController.log(stringified.length < 200 ? `Updated setting ${field} to ${stringified}.` : `Updated setting ${field}.`);
  }

  /**
   * Returns a function that updates the given setting if the value has changed.
   * @param field The setting to update.
   * @returns A function that updates the given setting if the value has changed.
   */
  private static updateStoreIfChanged<T>(field: string): (val: T) => void {
    return (val: T) => {
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
    const contents = await fs.readTextFile(this.settingsPath);
    let currentSettings: any;

    try {
      currentSettings = contents !== "" ? JSON.parse(contents) : structuredClone(DEFAULT_SETTINGS);
    } catch(e) {
      currentSettings = structuredClone(DEFAULT_SETTINGS);
      LogController.error("Settings were corrupted.");
    }

    let settings: Settings = structuredClone(currentSettings);
    
    const defaultSettings = structuredClone(DEFAULT_SETTINGS);

    settings = setIfNotExist(settings, defaultSettings);
    settings = this.migrateSettingsStructure(settings);

    settings.version = APP_VERSION;

    await this.save();

    LogController.log("Finished checking settings for new app version and/or migration.");

    return settings;
  }

  /**
   * Applies the settings from a backup file.
   * @param filePath The filepath of the backup.
   */
  static async applyBackup(filePath: string) {
    const contents = await fs.readTextFile(filePath);
    if (contents === "") {
      get(showInfoSnackbar)({ message: "Backup file was empty" });
      LogController.error("Backup was empty.");
    }

    let currentContents: any = JSON.parse(contents);
    if (currentContents.FILE_SIG_DO_NOT_EDIT !== "dev.travislane.tunistic") {
      get(showErrorSnackbar)({ message: "Invalid backup file", faster: true });
      LogController.error("Backup did not contain the FILE_SIG.");
    }

    let settings: Settings = currentContents;
  
    const defaultSettings = structuredClone(DEFAULT_SETTINGS);

    settings = setIfNotExist(settings, defaultSettings);
    settings = this.migrateSettingsStructure(settings);

    settings.version = APP_VERSION;
    this.settings = settings;

    await this.save();

    get(showInfoSnackbar)({ message: "Success!" });
    LogController.log("Successfully restored backup.");
  }

  /**
   * Resets the app's settings.
   */
  static async resetSettings() {
    this.settings = structuredClone(DEFAULT_SETTINGS);
    await this.save();

    get(showInfoSnackbar)({ message: "Success!" });
    LogController.log("Successfully reset settings.");
  }

  /**
   * Sets the Svelte stores associated with the settings.
   */
  private static setStores(): void {
    palette.set(this.settings.palette);
    useOledPalette.set(this.settings.useOledPalette);
    themePrimaryColor.set(this.settings.themePrimaryColor);

    musicDirectories.set(this.settings.musicDirectories);
    selectedView.set(this.settings.selectedView);


    const nowPlaying = this.settings.nowPlaying;
    showExtraSongInfo.set(nowPlaying.songInfo);
    nowPlayingTheme.set(nowPlaying.layout);
    nowPlayingBackgroundType.set(nowPlaying.backgroundType);
    autoDetectCarMode.set(nowPlaying.autoDetectCarMode);

    const controls = nowPlaying.controls;
    dismissMiniPlayerWithSwipe.set(controls.dismissMiniWithSwipe);
    showVolumeControls.set(controls.volumeControls);
    extraControl.set(controls.extralControl);


    const personalization = this.settings.personalization;
    viewsToRender.set(personalization.viewsToRender);
    viewIndices.set(personalization.viewIndices);

    const playlistList = this.settings.playlists.map((playlist) => Playlist.fromJSON(playlist));
    const songMetadata: Record<string, SongMetadata> = this.settings.cache.songsMetadata;

    for (const playlist of playlistList) {
      for (const id of playlist.songIds) {
        if (!songMetadata[id]) {
          const index = playlist.songIds.indexOf(id);
          playlist.songIds.splice(index, 1);
        }
      }

    }

    playlists.set(playlistList);
    queue.set(this.settings.queue.filter((id) => !!this.settings.cache.songsMetadata[id]));


    const audio = this.settings.audio;
    autoPlayOnConnect.set(audio.autoPlay);

    blacklistedFolders.set(this.settings.blacklistedFolders);
    filterSongDuration.set(this.settings.filterSongDuration);
    selectedLanguage.set(this.settings.selectedLanguage);


    const cache = this.settings.cache;
    songProgress.set(cache.songProgress);
    shuffle.set(cache.shuffle);
    repeatPlayed.set(cache.repeat);
    if (cache.volume > 1) cache.volume = 1;
    volumeLevel.set(cache.volume);
    nowPlayingList.set(cache.nowPlayingList);
    nowPlayingType.set(cache.nowPlayingType);


    const playlistsView = this.settings.playlistsView;
    playlistGridSize.set(playlistsView.gridSize);
    playlistSortOrder.set(playlistsView.sortOrder);


    const albumsView = this.settings.albumsView;
    albumGridSize.set(albumsView.gridSize);
    albumSortOrder.set(albumsView.sortOrder);
    useAlbumColors.set(albumsView.useAlbumColors);


    const songsView = this.settings.songsView;
    songGridSize.set(songsView.gridSize);
    songSortOrder.set(songsView.sortOrder);


    const artistsView = this.settings.artistsView;
    artistGridSize.set(artistsView.gridSize);
    artistGridStyle.set(artistsView.gridStyle);
    artistSortOrder.set(artistsView.sortOrder);
    useArtistColors.set(artistsView.useArtistColors);
  }

  /**
   * Registers the subscriptions to stores.
   */
  static registerSubs() {
    this.paletteUnsub = palette.subscribe(this.updateStoreIfChanged<Palette>("palette"));
    this.useOledPaletteUnsub = useOledPalette.subscribe(this.updateStoreIfChanged<boolean>("useOledPalette"));
    this.themePrimaryColorUnsub = themePrimaryColor.subscribe(this.updateStoreIfChanged<string>("themePrimaryColor"));

    this.musicDirectoriesUnsub = musicDirectories.subscribe(this.updateStoreIfChanged<string[]>("musicDirectories"));
    this.selectedViewUnsub = selectedView.subscribe((view: View) => {
      if (this.settings.personalization.viewsToRender.includes(view) && view !== View.SETTINGS && view !== View.SEARCH) {
        this.updateSetting<View>("selectedView", view);
      }
    });


    this.showExtraSongInfoUnsub = showExtraSongInfo.subscribe(this.updateStoreIfChanged<boolean>("nowPlaying.songInfo"));
    this.nowPlayingThemeUnsub = nowPlayingTheme.subscribe(this.updateStoreIfChanged<NowPlayingTheme>("nowPlaying.layout"));
    this.nowPlayingBackgroundTypeUnsub = nowPlayingBackgroundType.subscribe(this.updateStoreIfChanged<NowPlayingBackgroundType>("nowPlaying.backgroundType"));
    this.autoDetectCarModeUnsub = autoDetectCarMode.subscribe(this.updateStoreIfChanged<boolean>("nowPlaying.autoDetectCarMode"));

    this.dismissMiniPlayerWithSwipeUnsub = dismissMiniPlayerWithSwipe.subscribe(this.updateStoreIfChanged<boolean>("nowPlaying.controls.dismissMiniWithSwipe"));
    this.showVolumeControlsUnsub = showVolumeControls.subscribe(this.updateStoreIfChanged<boolean>("nowPlaying.controls.volumeControls"));
    this.extraControlUnsub = extraControl.subscribe(this.updateStoreIfChanged<NowPlayingExtraControl>("nowPlaying.controls.extraControl"));

    this.viewsToRenderUnsub = viewsToRender.subscribe(this.updateStoreIfChanged<View[]>("personalization.viewsToRender"));
    this.viewIndicesUnsub = viewIndices.subscribe(this.updateStoreIfChanged<Record<View, number>>("personalization.viewIndices"));

    this.autoPlayOnConnectUnsub = autoPlayOnConnect.subscribe(this.updateStoreIfChanged<boolean>("audio.autoPlay"));


    this.playlistsUnsub = playlists.subscribe(this.updateStoreIfChanged<Playlist[]>("playlists"));

    this.queueUnsub = queue.subscribe(this.updateStoreIfChanged<string[]>("queue"));
    
    this.blacklistedFoldersUnsub = blacklistedFolders.subscribe(this.updateStoreIfChanged<string[]>("blacklistedFolders"));
    this.filterSongDurationUnsub = filterSongDuration.subscribe(this.updateStoreIfChanged<number>("filterSongDuration"));
    this.selectedLanguageUnsub = selectedLanguage.subscribe(this.updateStoreIfChanged<AppLanguage>("selectedLanguage"));

    this.albumsUnsub = albums.subscribe((newAlbums) => {
      this.updateSetting<Record<string, AlbumMetadata>>("cache.albumsMetadata", Object.fromEntries(newAlbums.map((album) => {
        return [
          album.name,
          {
            "lastPlayedOn": album.lastPlayedOn,
            "numTimesPlayed": album.numTimesPlayed
          }
        ]
      })));
    });
    this.songsUnsub = songs.subscribe((newSongs) => {
      this.updateSetting<number>("cache.numSongs", newSongs.length);
      this.updateSetting<Record<string, SongMetadata>>("cache.songsMetadata", Object.fromEntries(newSongs.map((song) => {
        return [
          song.id,
          {
            "dateAdded": song.dateAdded,
            "lastPlayedOn": song.lastPlayedOn,
            "numTimesPlayed": song.numTimesPlayed
          }
        ]
      })));
    });
    this.artistsUnsub = artists.subscribe((newArtists) => {
      this.updateSetting<Record<string, ArtistMetadata>>("cache.artistsMetadata", Object.fromEntries(newArtists.map((artist) => {
        return [
          artist.name,
          {
            "imagePath": artist.imagePath
          }
        ]
      })));
    });

    this.songProgressUnsub = songProgress.subscribe((progress) => {
      this.settings.cache.songProgress = progress;
      this.settingsHaveChanged = true;
    });
    this.playingSongIdUnsub = playingSongId.subscribe(this.updateStoreIfChanged<string>("cache.playingSongId"));
    this.shuffleUnsub = shuffle.subscribe(this.updateStoreIfChanged<boolean>("cache.shuffle"));
    this.repeatPlayedUnsub = repeatPlayed.subscribe(this.updateStoreIfChanged<boolean>("cache.repeat"));
    this.volumeLevelUnsub = volumeLevel.subscribe(this.updateStoreIfChanged<number>("cache.volume"));
    this.nowPlayingListUnsub = nowPlayingList.subscribe(this.updateStoreIfChanged<string>("cache.nowPlayingList"));
    this.nowPlayingTypeUnsub = nowPlayingType.subscribe(this.updateStoreIfChanged<NowPlayingType>("cache.nowPlayingType"));


    this.playlistGridSizeUnsub = playlistGridSize.subscribe(this.updateStoreIfChanged<GridSize>("playlistsView.gridSize"));
    this.playlistSortOrderUnsub = playlistSortOrder.subscribe(this.updateStoreIfChanged<string>("playlistsView."));


    this.albumGridSizeUnsub = albumGridSize.subscribe(this.updateStoreIfChanged<GridSize>("albumsView.gridSize"));
    this.albumSortOrderUnsub = albumSortOrder.subscribe(this.updateStoreIfChanged<string>("albumsView.sortOrder"));
    this.useAlbumColorsUnsub = useAlbumColors.subscribe(this.updateStoreIfChanged<boolean>("albumsView.useAlbumColors"));


    this.songGridSizeUnsub = songGridSize.subscribe(this.updateStoreIfChanged<GridSize>("songsView.gridSize"));
    this.songSortOrderUnsub = songSortOrder.subscribe(this.updateStoreIfChanged<string>("songsView.sortOrder"));


    this.artistGridSizeUnsub = artistGridSize.subscribe(this.updateStoreIfChanged<GridSize>("artistsView.gridSize"));
    this.artistGridStyleUnsub = artistGridStyle.subscribe(this.updateStoreIfChanged<GridStyle>("artistsView.gridStyle"));
    this.artistSortOrderUnsub = artistSortOrder.subscribe(this.updateStoreIfChanged<string>("artistsView.sortOrder"));
    this.useArtistColorsUnsub = useArtistColors.subscribe(this.updateStoreIfChanged<boolean>("artistsView.useArtistColors"));
  }

  private static saveCallback = (value?: unknown) => {};
  private static async saveSettingsToDevice() {
    await fs.writeFile({
      path: this.settingsPath,
      contents: JSON.stringify(this.settings),
    }).then(SettingsController.saveCallback.bind(this));
  }
  private static debouncedSave = debounce(SettingsController.saveSettingsToDevice.bind(SettingsController), 500);

  /**
   * Saves the settings object.
   */
  static async save() {
    this.settingsHaveChanged = true;
    return new Promise<void>((resolve, reject) => {
      this.saveCallback = () => {
        this.settingsHaveChanged = false;
        resolve();
      };
      this.debouncedSave();
    })
  }

  /**
   * Writes the app's settings to a file.
   * @param filePath The path to save to.
   */
  static async saveSettingsToFile(filePath: string) {
    await fs.writeFile({
      path: filePath,
      contents: JSON.stringify(this.settings),
    });
  }

  /**
   * Updates the saved metadata for the provided artist.
   * @param artists The artists to update.
   */
  static updateArtistsMetadata(artists: Artist[]) {
    for (const artist of artists) {
      this.settings.cache.artistsMetadata[artist.name] = {
        "imagePath": artist.imagePath
      }
    }

    this.updateSetting<Record<string, ArtistMetadata>>("cache.artistsMetadata", this.settings.cache.artistsMetadata);
  }

  /**
   * Updates the saved metadata for the provided album.
   * @param albums The albums to update.
   */
  static updateAlbumsMetadata(albums: Album[]) {
    for (const album of albums) {
      this.settings.cache.albumsMetadata[album.name] = {
        "lastPlayedOn": album.lastPlayedOn,
        "numTimesPlayed": album.numTimesPlayed
      }
    }

    this.updateSetting<Record<string, AlbumMetadata>>("cache.albumsMetadata", this.settings.cache.albumsMetadata);
  }

  /**
   * Updates the saved metadata for the provided song.
   * @param song The song to update.
   */
  static updateSongMetadata(song: Song) {
    this.settings.cache.songsMetadata[song.id] = {
      "dateAdded": song.dateAdded,
      "lastPlayedOn": song.lastPlayedOn,
      "numTimesPlayed": song.numTimesPlayed
    }

    this.updateSetting<Record<string, SongMetadata>>("cache.songsMetadata", this.settings.cache.songsMetadata);
  }

  /**
   * Handles destroying the settings.
   */
  static destroy() {
    if (this.paletteUnsub) this.paletteUnsub();
    if (this.useOledPaletteUnsub) this.useOledPaletteUnsub();
    if (this.themePrimaryColorUnsub) this.themePrimaryColorUnsub();
    
    if (this.musicDirectoriesUnsub) this.musicDirectoriesUnsub();
    if (this.selectedViewUnsub) this.selectedViewUnsub();

    if (this.showExtraSongInfoUnsub) this.showExtraSongInfoUnsub();
    if (this.nowPlayingThemeUnsub) this.nowPlayingThemeUnsub();
    if (this.nowPlayingBackgroundTypeUnsub) this.nowPlayingBackgroundTypeUnsub();
    if (this.autoDetectCarModeUnsub) this.autoDetectCarModeUnsub();

    if (this.dismissMiniPlayerWithSwipeUnsub) this.dismissMiniPlayerWithSwipeUnsub();
    if (this.showVolumeControlsUnsub) this.showVolumeControlsUnsub();
    if (this.extraControlUnsub) this.extraControlUnsub();
    
    if (this.viewsToRenderUnsub) this.viewsToRenderUnsub();
    if (this.viewIndicesUnsub) this.viewIndicesUnsub();

    if (this.autoPlayOnConnectUnsub) this.autoPlayOnConnectUnsub();

    if (this.playlistsUnsub) this.playlistsUnsub();

    if (this.queueUnsub) this.queueUnsub();
    
    if (this.blacklistedFoldersUnsub) this.blacklistedFoldersUnsub();
    if (this.filterSongDurationUnsub) this.filterSongDurationUnsub();
    if (this.selectedLanguageUnsub) this.selectedLanguageUnsub();

    if (this.albumsUnsub) this.albumsUnsub();
    if (this.songsUnsub) this.songsUnsub();
    if (this.artistsUnsub) this.artistsUnsub();
    if (this.songProgressUnsub) this.songProgressUnsub();
    if (this.playingSongIdUnsub) this.playingSongIdUnsub();
    if (this.shuffleUnsub) this.shuffleUnsub();
    if (this.volumeLevelUnsub) this.volumeLevelUnsub();
    if (this.repeatPlayedUnsub) this.repeatPlayedUnsub();
    if (this.nowPlayingListUnsub) this.nowPlayingListUnsub();
    if (this.nowPlayingTypeUnsub) this.nowPlayingTypeUnsub();

    if (this.playlistGridSizeUnsub) this.playlistGridSizeUnsub();
    if (this.playlistSortOrderUnsub) this.playlistSortOrderUnsub();

    if (this.albumGridSizeUnsub) this.albumGridSizeUnsub();
    if (this.albumSortOrderUnsub) this.albumSortOrderUnsub();
    if (this.useAlbumColorsUnsub) this.useAlbumColorsUnsub();

    if (this.songGridSizeUnsub) this.songGridSizeUnsub();
    if (this.songSortOrderUnsub) this.songSortOrderUnsub();

    if (this.artistGridSizeUnsub) this.artistGridSizeUnsub();
    if (this.artistGridStyleUnsub) this.artistGridStyleUnsub();
    if (this.artistSortOrderUnsub) this.artistSortOrderUnsub();
    if (this.useArtistColorsUnsub) this.useArtistColorsUnsub();
  }
}