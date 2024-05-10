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
import { invoke } from "@tauri-apps/api";

/**
 * The available logging levels.
 */
export enum LogLevel {
  INFO,
  WARN,
  ERROR
}

/**
 * Handles wrapping ipc communication into an easy to use JS bindings.
 * ! Should do no logging here.
 */
export class RustInterop {
  /**
   * Adds the provided path to the file access scope.
   */
  static async addPathToScope(path: string): Promise<boolean> {
    return await invoke<boolean>("add_path_to_scope", { targetPath: path });
  }

  /**
   * Cleans the app's log file.
   */
  static async cleanOutLog(): Promise<void> {
    await invoke("clean_out_log", {});
  }

  /**
   * Logs a message to the log file.
   * @param message The message to log.
   * @param level The log level.
   */
  static async logToFile(message: string, level: LogLevel): Promise<void> {
    await invoke("log_to_file", { message: message, level: level });
  }

  /**
   * Toggles the window dev tools on/off.
   * @param enable Whether to enable or disable the window dev tools.
   */
  static async toggleDevTools(enable: boolean): Promise<void> {
    await invoke("toggle_dev_tools", { enable: enable });
  }

  /**
   * Reads the contents of the provided folders.
   * @param folders The folders to read.
   */
  static async readMusicFolders(folders: string[]): Promise<String> {
    const results = await invoke("read_music_folders", { musicFolderPathsStr: JSON.stringify(folders) });

    console.log(results);
    console.log(JSON.parse(results as string));

    return "";
  }

}