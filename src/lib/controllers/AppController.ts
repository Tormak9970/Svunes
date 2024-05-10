import { SettingsController } from "./SettingsController";
import { ThemeController } from "./ThemeController";

/**
 * The core app controller.
 */
export class AppController {
  /**
   * Initializes the app.
   */
  static async init() {
    SettingsController.init();
    ThemeController.init();
  }

  /**
   * Function to run on cleanup.
   */
  static destroy() {
    SettingsController.destroy();
  }
}