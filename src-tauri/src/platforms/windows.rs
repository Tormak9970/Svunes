use tauri::{AppHandle, Manager};

use webview2_com::Microsoft::Web::WebView2::Win32::{ICoreWebView2, ICoreWebView2Settings, ICoreWebView2Settings3, ICoreWebView2Settings4};
use windows_core::Interface;

fn disable_webview_shortcuts(app_handle: &AppHandle) {
  let window = app_handle.get_webview_window("main").expect("Should have been able to get the main window.");

  let _ = window.with_webview(| webview | unsafe {
    let core_webview: ICoreWebView2 = webview.controller().CoreWebView2().unwrap();
    let settings: ICoreWebView2Settings = core_webview.Settings().unwrap();
    
    let settings3: ICoreWebView2Settings3 = settings.cast::<ICoreWebView2Settings3>().unwrap();
    settings3.SetAreBrowserAcceleratorKeysEnabled(false).unwrap();

    let settings4: ICoreWebView2Settings4 = settings.cast::<ICoreWebView2Settings4>().unwrap();
    settings4.SetIsGeneralAutofillEnabled(false).unwrap();
    settings4.SetIsPasswordAutosaveEnabled(false).unwrap();
  });
}

pub fn init_windows(app_handle: AppHandle) {
  disable_webview_shortcuts(&app_handle);
}