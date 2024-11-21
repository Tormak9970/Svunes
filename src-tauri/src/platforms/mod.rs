mod windows;

use tauri::AppHandle;

#[cfg(target_os = "windows")]
use windows::init_windows;

/// Handles initializing any platform specific tasks for Svunes.
pub fn init_platform_specifics(app_handle: AppHandle) {
  #[cfg(target_os = "windows")]
  {
    init_windows(app_handle);
  }

  #[cfg(target_os = "linux")]
  {

  }
}