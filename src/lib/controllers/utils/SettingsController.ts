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
import { Playlist, Song, type Album, type Artist } from "@models";
import { hasShownHelpTranslate, selectedLanguage, t, t as translate } from "@stores/Locale";
import { albumGridSize, albums, albumSortOrder, artistGridSize, artistGridStyle, artists, artistSortOrder, audioBalance, autoPlayOnConnect, blacklistedFolders, currentEq, currentProfile, debugModeEnabled, dismissMiniPlayerWithSwipe, equalizers, extraControl, filterSongDuration, musicDirectories, nowPlayingBackgroundType, nowPlayingList, nowPlayingTheme, nowPlayingType, palette, playingSongId, playlistGridSize, playlists, playlistSortOrder, profiles, queue, repeatPlayed, selectedView, showErrorSnackbar, showExtraSongInfo, showInfoSnackbar, showVolumeControls, shuffle, songGridSize, songProgress, songs, songSortOrder, themePrimaryColor, useAlbumColors, useArtistColors, useOledPalette, viewIndices, viewsToRender, volumeLevel } from "@stores/State";
import { exists, readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import * as process from "@tauri-apps/plugin-process";
import { load as loadStore, Store } from '@tauri-apps/plugin-store';
import { DEFAULT_EQUALIZER, DEFAULT_PROFILE, DEFAULT_SETTINGS, GridSize, GridStyle, NowPlayingBackgroundType, NowPlayingTheme, View, type AlbumMetadata, type ArtistMetadata, type Equalizer, type NowPlayingExtraControl, type NowPlayingType, type Palette, type Settings, type SongMetadata, type UserProfile } from "@types";
import { debounce } from "@utils";
import { get, type Unsubscriber } from "svelte/store";
import { DialogController } from "./DialogController";
import { LogController } from "./LogController";
import { RustInterop } from "./RustInterop";

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
  private static readonly STORE_NAME = "settings.dat";
  private static store: Store;
  private static settings: Settings;
  private static profile: UserProfile;

  private static promptRestartOnProfileChange = false;

  private static paletteUnsub: Unsubscriber;
  private static useOledPaletteUnsub: Unsubscriber;
  private static themePrimaryColorUnsub: Unsubscriber;
  private static currentProfileUnsub: Unsubscriber;

  private static hasShownHelpTranslateUnsub: Unsubscriber;

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

  private static autoPlayOnConnectUnsub: Unsubscriber;
  private static balanceUnsub: Unsubscriber;
  private static equalizersUnsub: Unsubscriber;
  private static currentEqUnsub: Unsubscriber;

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

  private static debugModeUnsub: Unsubscriber;

  private static async loadSettings(): Promise<Settings> {
    const defaultEntries = Object.entries(DEFAULT_SETTINGS);

    const storeEntries = await this.store.entries<any>();
    let currentSettings = Object.fromEntries(storeEntries);
    currentSettings = this.migrateSettingsStructure(currentSettings as Settings);

    let settings = {} as Settings;

    for (const [key, value] of defaultEntries) {
      let currentValue = currentSettings[key];

      if (!currentValue) {
        currentValue = value;
      } else if (typeof currentValue === "object") {
        currentValue = setIfNotExist(currentValue, value);
      }
      
      // @ts-expect-error key will always index settings because DEFAULT_SETTINGS is of type Settings.
      settings[key] = currentValue;
    }

    const settingKeys = Object.keys(settings);
    for (const [key] of storeEntries) {
      if (!settingKeys.includes(key)) {
        this.store.delete(key);
      }
    }

    settings.version = APP_VERSION;

    LogController.log("Finished checking settings for new app version and/or migration.");

    return settings;
  }

  private static async saveSettings() {
    const entries = Object.entries(this.settings);
    const savePromises = entries.map(async ([key, value]) => {
      return await this.store.set(key, value);
    });

    await Promise.all(savePromises);
    await this.store.save();
  }
  private static debouncedSave = debounce(this.saveSettings.bind(this), 1000) as () => Promise<void>;

  private static async save() {
    await this.debouncedSave();
  }

  /**
   * Initializes the SettingsController.
   */
  static async init() {
    this.store = await loadStore(this.STORE_NAME);
    this.settings = await this.loadSettings();
    this.profile = this.settings.profiles[this.settings.currentProfile];

    this.save();

    await this.setStores();

    LogController.log("Initialized Settings.");
  }

  /**
   * Migrate the settings structure to account for changes in the structure.
   */
  private static migrateSettingsStructure(settings: Settings): Settings {
    if (!settings.currentProfile) {
      const old = settings as Settings & UserProfile;
      const defaultProfile: UserProfile = {
        palette: old.palette,
        useOledPalette: old.useOledPalette,
        themePrimaryColor: old.themePrimaryColor,
        musicDirectories: old.musicDirectories,
        selectedView: old.selectedView,

        nowPlaying: old.nowPlaying,
        audio: old.audio,
        personalization: old.personalization,

        playlists: old.playlists,
        queue: old.queue,

        blacklistedFolders:old.blacklistedFolders,
        filterSongDuration: old.filterSongDuration,
        selectedLanguage: old.selectedLanguage,

        cache: old.cache,

        playlistsView: old.playlistsView,
        albumsView: old.albumsView,
        songsView: old.songsView,
        artistsView: old.artistsView,
      }

      settings = {
        FILE_SIG_DO_NOT_EDIT: settings.FILE_SIG_DO_NOT_EDIT,
        version: settings.version,

        currentProfile: "Default",
        profiles: {
          "Default": defaultProfile,
        },

        hasShownHelpTranslate: settings.hasShownHelpTranslate,
        debugModeEnabled: settings.debugModeEnabled,
      }
    }

    return settings;
  }

  /**
   * Gets the given settings field.
   * @param field The settings property to get.
   * @param isProfileField Whether the field is scoped to profiles.
   * @returns The given setting, or its default value if it does not exist.
   */
  static getSetting<T>(field: string, isProfileField = true): T {
    const settings: any = structuredClone(isProfileField ? this.profile : this.settings);
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
   * @param isProfileField Whether the field is scoped to profiles.
   */
  private static updateSetting<T>(field: string, val: T, isProfileField = true): void {
    const settings = structuredClone(isProfileField ? this.profile : this.settings);
    const fieldPath = field.split(".");
    let parentObject = settings;

    for (let i = 0; i < fieldPath. length - 1; i++) {
      // @ts-ignore
      parentObject = parentObject[fieldPath[i]];
    }

    // @ts-ignore
    parentObject[fieldPath[fieldPath.length - 1]] = val;

    if (isProfileField) {
      this.profile = settings as UserProfile;
      this.settings.profiles[this.settings.currentProfile] = settings as UserProfile;
    } else {
      this.settings = settings as Settings;
    }
    this.save();

    const stringified = JSON.stringify(val);
    LogController.log(stringified.length < 100 ? `Updated setting ${field} to ${stringified}.` : `Updated setting ${field}.`);
  }

  /**
   * Returns a function that updates the given setting if the value has changed.
   * @param field The setting to update.
   * @param isProfileField Whether the field is scoped to profiles.
   * @returns A function that updates the given setting if the value has changed.
   */
  private static updateStoreIfChanged<T>(field: string, isProfileField = true): (val: T) => void {
    return (val: T) => {
      const original = this.getSetting<T>(field);

      if (original !== val) {
        this.updateSetting(field, val, isProfileField);
      }
    }
  }

  /**
   * Applies the settings from a backup file.
   * @param filePath The filepath of the backup.
   */
  static async applyBackup(filePath: string) {
    const t = get(translate);
    const contents = await readTextFile(filePath);
    if (contents === "") {
      get(showInfoSnackbar)({ message: t("BACKUP_FILE_EMPTY_MESSAGE") });
      LogController.error("Backup was empty.");
    }

    let currentContents: any = JSON.parse(contents);
    if (currentContents.FILE_SIG_DO_NOT_EDIT !== "dev.travislane.svunes") {
      get(showErrorSnackbar)({ message: t("INVALID_BACKUP_FILE_MESSAGE"), faster: true });
      LogController.error("Backup did not contain the FILE_SIG.");
    }

    let settings: Settings = currentContents;
  
    const defaultSettings = structuredClone(DEFAULT_SETTINGS);

    settings = this.migrateSettingsStructure(settings);
    settings = setIfNotExist(settings, defaultSettings);

    settings.version = APP_VERSION;
    this.settings = settings;
    this.profile = settings.profiles[settings.currentProfile];

    await this.save();

    get(showInfoSnackbar)({ message: "Success!" });
    LogController.log("Successfully restored backup.");
  }

  /**
   * Resets the app's settings.
   */
  static async resetSettings() {
    const t = get(translate);
    const settings = structuredClone(DEFAULT_SETTINGS);
    this.settings = settings;
    this.profile = settings.profiles[settings.currentProfile];
    await this.save();

    get(showInfoSnackbar)({ message: t("SUCCESS_MESSAGE") });
    LogController.log("Successfully reset settings.");
  }

  /**
   * Sets the Svelte stores associated with the settings.
   */
  private static async setStores(): Promise<void> {
    currentProfile.set(this.settings.currentProfile);
    profiles.set(Object.keys(this.settings.profiles));
    palette.set(this.profile.palette);
    useOledPalette.set(this.profile.useOledPalette);
    themePrimaryColor.set(this.profile.themePrimaryColor);

    debugModeEnabled.set(this.settings.debugModeEnabled);
    if (this.settings.debugModeEnabled) await RustInterop.toggleDevTools(true);

    hasShownHelpTranslate.set(this.settings.hasShownHelpTranslate);

    const existencePromises = this.profile.musicDirectories.map(async (dir: string) => {
      return await RustInterop.addPathToScope(dir).then(async (success: boolean) => success && await exists(dir));
    });
    await Promise.all(existencePromises).then((exists: boolean[]) => {
      this.profile.musicDirectories = this.profile.musicDirectories.filter((_, i) => exists[i]);
      musicDirectories.set(this.profile.musicDirectories);
    });

    selectedView.set(this.profile.selectedView);


    const nowPlaying = this.profile.nowPlaying;
    showExtraSongInfo.set(nowPlaying.songInfo);
    nowPlayingTheme.set(nowPlaying.layout);
    nowPlayingBackgroundType.set(nowPlaying.backgroundType);

    const controls = nowPlaying.controls;
    dismissMiniPlayerWithSwipe.set(controls.dismissMiniWithSwipe);
    showVolumeControls.set(controls.volumeControls);
    extraControl.set(controls.extralControl);


    const personalization = this.profile.personalization;
    viewsToRender.set(personalization.viewsToRender);
    viewIndices.set(personalization.viewIndices);

    const playlistList = this.profile.playlists.map((playlist) => Playlist.fromJSON(playlist));
    const songMetadata: Record<string, SongMetadata> = this.profile.cache.songsMetadata;

    for (const playlist of playlistList) {
      for (const id of playlist.songIds) {
        if (!songMetadata[id]) {
          const index = playlist.songIds.indexOf(id);
          playlist.songIds.splice(index, 1);
        }
      }

    }

    playlists.set(playlistList);
    queue.set(this.profile.queue.filter((id) => !!this.profile.cache.songsMetadata[id]));


    const audio = this.profile.audio;
    autoPlayOnConnect.set(audio.autoPlay);
    audioBalance.set(audio.balance);
    equalizers.set(audio.equalizers);
    currentEq.set(audio.currentEq);

    blacklistedFolders.set(this.profile.blacklistedFolders);
    filterSongDuration.set(this.profile.filterSongDuration);
    selectedLanguage.set(this.profile.selectedLanguage);


    const cache = this.profile.cache;
    songProgress.set(cache.songProgress);
    shuffle.set(cache.shuffle);
    repeatPlayed.set(cache.repeat);
    if (cache.volume > 1) cache.volume = 1;
    volumeLevel.set(cache.volume);
    nowPlayingList.set(cache.nowPlayingList);
    nowPlayingType.set(cache.nowPlayingType);


    const playlistsView = this.profile.playlistsView;
    playlistGridSize.set(playlistsView.gridSize);
    playlistSortOrder.set(playlistsView.sortOrder);


    const albumsView = this.profile.albumsView;
    albumGridSize.set(albumsView.gridSize);
    albumSortOrder.set(albumsView.sortOrder);
    useAlbumColors.set(albumsView.useAlbumColors);


    const songsView = this.profile.songsView;
    songGridSize.set(songsView.gridSize);
    songSortOrder.set(songsView.sortOrder);


    const artistsView = this.profile.artistsView;
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

    this.currentProfileUnsub = currentProfile.subscribe((profile) => {
      let updatePromise: Promise<void> | null = null;
      if (this.settings.currentProfile !== profile) {
        this.settings.currentProfile = profile;
        updatePromise = this.save();
      }

      if (!SettingsController.promptRestartOnProfileChange) {
        SettingsController.promptRestartOnProfileChange = true;
        return;
      }

      if (updatePromise) {
        const translate = get(t);
        updatePromise.then(() => {
          DialogController.message(
            translate("SVUNES_RESTART_TITLE"),
            translate("SVUNES_RESTART_MESSAGE"),
            translate("OK_ACTION")
          ).then(() => {
            process.relaunch();
          });
        });
      }
    });

    this.hasShownHelpTranslateUnsub = hasShownHelpTranslate.subscribe(this.updateStoreIfChanged<boolean>("hasShownHelpTranslate", false));

    this.musicDirectoriesUnsub = musicDirectories.subscribe(this.updateStoreIfChanged<string[]>("musicDirectories"));
    this.selectedViewUnsub = selectedView.subscribe((view: View) => {
      if (this.profile.personalization.viewsToRender.includes(view) && view !== View.SETTINGS && view !== View.SEARCH) {
        this.updateSetting<View>("selectedView", view);
      }
    });


    this.showExtraSongInfoUnsub = showExtraSongInfo.subscribe(this.updateStoreIfChanged<boolean>("nowPlaying.songInfo"));
    this.nowPlayingThemeUnsub = nowPlayingTheme.subscribe(this.updateStoreIfChanged<NowPlayingTheme>("nowPlaying.layout"));
    this.nowPlayingBackgroundTypeUnsub = nowPlayingBackgroundType.subscribe(this.updateStoreIfChanged<NowPlayingBackgroundType>("nowPlaying.backgroundType"));
    
    this.dismissMiniPlayerWithSwipeUnsub = dismissMiniPlayerWithSwipe.subscribe(this.updateStoreIfChanged<boolean>("nowPlaying.controls.dismissMiniWithSwipe"));
    this.showVolumeControlsUnsub = showVolumeControls.subscribe(this.updateStoreIfChanged<boolean>("nowPlaying.controls.volumeControls"));
    this.extraControlUnsub = extraControl.subscribe(this.updateStoreIfChanged<NowPlayingExtraControl>("nowPlaying.controls.extraControl"));

    this.viewsToRenderUnsub = viewsToRender.subscribe(this.updateStoreIfChanged<View[]>("personalization.viewsToRender"));
    this.viewIndicesUnsub = viewIndices.subscribe(this.updateStoreIfChanged<Record<View, number>>("personalization.viewIndices"));

    this.autoPlayOnConnectUnsub = autoPlayOnConnect.subscribe(this.updateStoreIfChanged<boolean>("audio.autoPlay"));
    this.balanceUnsub = audioBalance.subscribe(this.updateStoreIfChanged<number>("audio.balance"));
    this.equalizersUnsub = equalizers.subscribe(this.updateStoreIfChanged<Record<string, Equalizer>>("audio.equalizers"));
    this.currentEqUnsub = currentEq.subscribe(this.updateStoreIfChanged<string>("audio.currentEq"));


    this.playlistsUnsub = playlists.subscribe(this.updateStoreIfChanged<Playlist[]>("playlists"));

    this.queueUnsub = queue.subscribe(this.updateStoreIfChanged<string[]>("queue"));
    
    this.blacklistedFoldersUnsub = blacklistedFolders.subscribe(this.updateStoreIfChanged<string[]>("blacklistedFolders"));
    this.filterSongDurationUnsub = filterSongDuration.subscribe(this.updateStoreIfChanged<number>("filterSongDuration"));
    this.selectedLanguageUnsub = selectedLanguage.subscribe(this.updateStoreIfChanged<string>("selectedLanguage"));

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
      this.profile.cache.songProgress = progress;
      this.settings.profiles[this.settings.currentProfile] = this.profile as UserProfile;
      this.store.set("profiles", this.settings.profiles);
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

    this.debugModeUnsub = debugModeEnabled.subscribe((enabled: boolean) => {
      this.updateSetting<boolean>("debugModeEnabled", enabled, false);
      RustInterop.toggleDevTools(enabled);
    });
  }

  /**
   * Writes the app's settings to a file.
   * @param filePath The path to save to.
   */
  static async saveSettingsToFile(filePath: string): Promise<void> {
    return await writeTextFile(filePath, JSON.stringify(this.settings));
  }

  /**
   * Creates a new profile with the given name.
   * @param profileName The name of the profile.
   * @param profileToCopy The profile to copy, or null to make it a default.
   */
  static createProfile(profileName: string, profileToCopy: string | null) {
    const template = profileToCopy ? this.settings.profiles[profileToCopy] : DEFAULT_PROFILE;

    this.settings.profiles[profileName] = structuredClone(template);
    
    profiles.set([ ...get(profiles), profileName ]);

    this.save();
  }

  /**
   * Renames the provided profile.
   * @param oldName The profile's old name.
   * @param newName The new name.
   */
  static renameProfile(oldName: string, newName: string) {
    this.settings.currentProfile = newName;
    this.settings.profiles[newName] = this.settings.profiles[oldName];
    delete this.settings.profiles[oldName];

    SettingsController.promptRestartOnProfileChange = false;
    currentProfile.set(newName);

    const currentProfiles = get(profiles);
    currentProfiles.splice(currentProfiles.indexOf(oldName), 1, newName);
    profiles.set([ ...currentProfiles ]);

    this.save();
  }

  /**
   * Creates a new equalizer with the given name.
   * @param equalizerName The name of the equalizer.
   * @param equalizerToCopy The equalizer to copy, or null to make it a default.
   */
  static createEqualizer(equalizerName: string, equalizerToCopy: string | null) {
    const template = equalizerToCopy ? this.profile.audio.equalizers[equalizerToCopy] : DEFAULT_EQUALIZER;

    this.profile.audio.equalizers[equalizerName] = structuredClone(template);
    
    equalizers.set(structuredClone(this.profile.audio.equalizers));

    this.save();
  }

  /**
   * Renames the provided equalizer.
   * @param oldName The equalizer's old name.
   * @param newName The new name.
   */
  static renameEqualizer(oldName: string, newName: string) {
    this.profile.audio.currentEq = newName;
    this.profile.audio.equalizers[newName] = this.profile.audio.equalizers[oldName];
    delete this.profile.audio.equalizers[oldName];

    SettingsController.promptRestartOnProfileChange = false;
    currentEq.set(newName);

    equalizers.set(structuredClone(this.profile.audio.equalizers));

    this.save();
  }

  /**
   * Updates the saved metadata for the provided artist.
   * @param artists The artists to update.
   */
  static updateArtistsMetadata(artists: Artist[]) {
    for (const artist of artists) {
      this.profile.cache.artistsMetadata[artist.name] = {
        "imagePath": artist.imagePath
      }
    }

    this.updateSetting<Record<string, ArtistMetadata>>("cache.artistsMetadata", this.profile.cache.artistsMetadata);
  }

  /**
   * Updates the saved metadata for the provided album.
   * @param albums The albums to update.
   */
  static updateAlbumsMetadata(albums: Album[]) {
    for (const album of albums) {
      this.profile.cache.albumsMetadata[album.name] = {
        "lastPlayedOn": album.lastPlayedOn,
        "numTimesPlayed": album.numTimesPlayed
      }
    }

    this.updateSetting<Record<string, AlbumMetadata>>("cache.albumsMetadata", this.profile.cache.albumsMetadata);
  }

  /**
   * Updates the saved metadata for the provided song.
   * @param song The song to update.
   */
  static updateSongMetadata(song: Song) {
    this.profile.cache.songsMetadata[song.id] = {
      "dateAdded": song.dateAdded,
      "lastPlayedOn": song.lastPlayedOn,
      "numTimesPlayed": song.numTimesPlayed
    }

    this.updateSetting<Record<string, SongMetadata>>("cache.songsMetadata", this.profile.cache.songsMetadata);
  }

  /**
   * Handles destroying the settings.
   */
  static destroy() {
    if (this.paletteUnsub) this.paletteUnsub();
    if (this.useOledPaletteUnsub) this.useOledPaletteUnsub();
    if (this.themePrimaryColorUnsub) this.themePrimaryColorUnsub();
    if (this.currentProfileUnsub) this.currentProfileUnsub();

    if (this.hasShownHelpTranslateUnsub) this.hasShownHelpTranslateUnsub();
    
    if (this.musicDirectoriesUnsub) this.musicDirectoriesUnsub();
    if (this.selectedViewUnsub) this.selectedViewUnsub();

    if (this.showExtraSongInfoUnsub) this.showExtraSongInfoUnsub();
    if (this.nowPlayingThemeUnsub) this.nowPlayingThemeUnsub();
    if (this.nowPlayingBackgroundTypeUnsub) this.nowPlayingBackgroundTypeUnsub();

    if (this.dismissMiniPlayerWithSwipeUnsub) this.dismissMiniPlayerWithSwipeUnsub();
    if (this.showVolumeControlsUnsub) this.showVolumeControlsUnsub();
    if (this.extraControlUnsub) this.extraControlUnsub();
    
    if (this.viewsToRenderUnsub) this.viewsToRenderUnsub();
    if (this.viewIndicesUnsub) this.viewIndicesUnsub();

    if (this.autoPlayOnConnectUnsub) this.autoPlayOnConnectUnsub();
    if (this.balanceUnsub) this.balanceUnsub();
    if (this.equalizersUnsub) this.equalizersUnsub();
    if (this.currentEqUnsub) this.currentEqUnsub();

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

    if (this.debugModeUnsub) this.debugModeUnsub();
  }
}