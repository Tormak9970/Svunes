mod windows;

use tauri::AppHandle;

/// Handles initializing any platform specific tasks for Svunes.
pub fn init_platform_specifics(app_handle: AppHandle) {
  #[cfg(target_os = "windows")]
  {
    
  }

  #[cfg(target_os = "linux")]
  {

  }
}