# THIS FILE IS AUTO-GENERATED. DO NOT MODIFY!!

# Copyright 2020-2023 Tauri Programme within The Commons Conservancy
# SPDX-License-Identifier: Apache-2.0
# SPDX-License-Identifier: MIT

-keep class dev.travislane.tunistic.* {
  native <methods>;
}

-keep class dev.travislane.tunistic.WryActivity {
  public <init>(...);

  void setWebView(dev.travislane.tunistic.RustWebView);
  java.lang.Class getAppClass(...);
  java.lang.String getVersion();
}

-keep class dev.travislane.tunistic.Ipc {
  public <init>(...);

  @android.webkit.JavascriptInterface public <methods>;
}

-keep class dev.travislane.tunistic.RustWebView {
  public <init>(...);

  void loadUrlMainThread(...);
  void loadHTMLMainThread(...);
  void setAutoPlay(...);
  void setUserAgent(...);
  void evalScript(...);
}

-keep class dev.travislane.tunistic.RustWebChromeClient,dev.travislane.tunistic.RustWebViewClient {
  public <init>(...);
}