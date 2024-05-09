/**
 * Steam Art Manager is a tool for setting the artwork of your Steam library.
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
import { type Settings, DEFAULT_SETTINGS } from "../../types/Settings";
import { LogController } from "../controllers/LogController";

/**
 * The controller for settings.
 */
export class SettingsController {
  private static settings: Settings;

  /**
   * Initializes the SettingsController.
   */
  static init() {
    this.settings = this.loadSettings();
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
   * Gets the default value for the given settings field.
   * @param field The settings property to get.
   * @returns The default value for the field.
   */
  static getDefault<T>(field: string): T {
    const settings: any = structuredClone(DEFAULT_SETTINGS);
    const fieldPath = field.split(".");
    let parentObject = settings;

    for (let i = 0; i < fieldPath. length - 1; i++) {
      parentObject = parentObject[fieldPath[i]];
    }

    return parentObject[fieldPath[fieldPath.length - 1]];
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
      
      if (Object.keys(parentObject).includes(key)) {
        parentObject = parentObject[key];
      } else {
        const defaultValue = this.getDefault<T>(field);
        LogController.log(`Field ${field} didn't exist. Returning default value ${defaultValue}.`);
        return defaultValue;
      }
    }

    const finalKey = fieldPath[fieldPath.length - 1];
    if (Object.keys(parentObject).includes(finalKey)) {
      return parentObject[finalKey];
    } else {
      const defaultValue = this.getDefault<T>(field);
      LogController.log(`Field ${field} didn't exist. Returning default value ${defaultValue}.`);
      return defaultValue;
    }
  }

  /**
   * Updates the given settings field with the provided data.
   * @param field The setting to update.
   * @param val The new value.
   */
  static async updateSetting<T>(field: string, val: T): Promise<void> {
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
   * Loads the settings.
   */
  private static loadSettings(): Settings {
    const currentSettings: any = JSON.parse(localStorage.getItem("tunistic-settings") ?? JSON.stringify(DEFAULT_SETTINGS));

    let settings: Settings = { ...currentSettings };
    
    const defaultSettings = structuredClone(DEFAULT_SETTINGS);

    const curKeys = Object.keys(currentSettings);
    const defEntries = Object.entries(defaultSettings);
    const defKeys = Object.keys(defaultSettings);

    for (const [ key, val ] of defEntries) {
      if (!curKeys.includes(key)) {
        // @ts-ignore
        settings[key] = val;
      }
    }

    for (const key in currentSettings) {
      if (!defKeys.includes(key)) {
        // @ts-ignore
        delete settings[key];
      }
    }
    
    settings = this.migrateSettingsStructure(settings);

    settings.version = APP_VERSION;

    this.save();

    LogController.log("Finished checking settings for new app version and/or migration.");

    return settings;
  }

  /**
   * Registers the subscriptions to stores.
   */
  private static registerSubs() {

  }

  /**
   * Saves the settings object.
   */
  private static async save() {
    localStorage.setItem("tunistic-settings", JSON.stringify(this.settings));
  }

  /**
   * Handles destroying the settings.
   */
  static destroy() {
    this.save();

    // TODO: unregister subscriptions
  }
}