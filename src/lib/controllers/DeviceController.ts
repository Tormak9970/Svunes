import { type Event, type UnlistenFn } from "@tauri-apps/api/event";

/**
 * Handles interacting with the device apis.
 */
export class DeviceController {
  private static drivingUnsub: UnlistenFn;

  /**
   * Initializes the controller.
   */
  static init() {
    this.registerListeners();
  }

  /**
   * Registers the device related listeners.
   */
  private static async registerListeners() {
    // this.drivingUnsub = await listen<boolean>("user-driving-state-change", this.handleIsDriving);
  }

  /**
   * Handles when the user's driving state changes.
   * @param isDrivingEvent The isDriving event.
   */
  private static handleIsDriving(isDrivingEvent: Event<boolean>) {
    const isDriving = isDrivingEvent.payload;

  }

  /**
   * Destroys the controller.
   */
  static destroy() {
    if (this.drivingUnsub) this.drivingUnsub();
  }
}