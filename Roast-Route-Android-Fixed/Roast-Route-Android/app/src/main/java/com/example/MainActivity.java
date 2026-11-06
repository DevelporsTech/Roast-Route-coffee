package com.example;

import android.Manifest;
import android.annotation.SuppressLint;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.res.Configuration;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Message;
import android.view.View;
import android.view.WindowInsets;
import android.webkit.GeolocationPermissions;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.Toast;
import androidx.webkit.WebViewAssetLoader;
import androidx.activity.ComponentActivity;
import androidx.activity.OnBackPressedCallback;
import java.io.ByteArrayInputStream;

/** Hosts the original React UI from bundled assets on a secure local origin. */
public class MainActivity extends ComponentActivity {
  private static final String APP_HOST = "appassets.androidplatform.net";
  private static final String APP_URL = "https://" + APP_HOST + "/assets/index.html";
  private static final int LOCATION_REQUEST = 10;
  private WebView webView;
  private GeolocationPermissions.Callback locationCallback;
  private String locationOrigin;

  @SuppressLint("SetJavaScriptEnabled")
  @Override public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    boolean dark = (getResources().getConfiguration().uiMode &
        Configuration.UI_MODE_NIGHT_MASK) == Configuration.UI_MODE_NIGHT_YES;
    int background = Color.parseColor(dark ? "#0E0805" : "#FAF7F2");
    FrameLayout frame = new FrameLayout(this);
    frame.setBackgroundColor(background);
    frame.setOnApplyWindowInsetsListener((view, insets) -> {
      if (Build.VERSION.SDK_INT >= 30) {
        android.graphics.Insets bars = insets.getInsets(
            WindowInsets.Type.systemBars() | WindowInsets.Type.displayCutout() |
            WindowInsets.Type.ime());
        view.setPadding(bars.left, bars.top, bars.right, bars.bottom);
      } else {
        view.setPadding(insets.getSystemWindowInsetLeft(), insets.getSystemWindowInsetTop(),
            insets.getSystemWindowInsetRight(), insets.getSystemWindowInsetBottom());
      }
      return insets;
    });
    setContentView(frame);
    if (Build.VERSION.SDK_INT >= 30) getWindow().setDecorFitsSystemWindows(false);
    int flags = dark ? 0 : View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR;
    if (Build.VERSION.SDK_INT >= 26 && !dark) flags |= View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR;
    getWindow().getDecorView().setSystemUiVisibility(flags);
    getWindow().setStatusBarColor(background);
    getWindow().setNavigationBarColor(background);
    frame.requestApplyInsets();

    webView = new WebView(this);
    webView.setBackgroundColor(background);
    frame.addView(webView, new FrameLayout.LayoutParams(-1, -1));
    WebSettings settings = webView.getSettings();
    settings.setJavaScriptEnabled(true);
    settings.setDomStorageEnabled(true);
    settings.setUserAgentString(settings.getUserAgentString() + " RoastRoute/1.0.1 (+https://roast-route-phi.vercel.app/)");
    settings.setAllowFileAccess(false);
    settings.setAllowContentAccess(false);
    settings.setGeolocationEnabled(true);
    settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
    settings.setSupportMultipleWindows(true);
    settings.setJavaScriptCanOpenWindowsAutomatically(false);
    settings.setMediaPlaybackRequiresUserGesture(true);
    settings.setCacheMode(WebSettings.LOAD_DEFAULT);
    WebView.setWebContentsDebuggingEnabled(BuildConfig.DEBUG);

    WebViewAssetLoader loader = new WebViewAssetLoader.Builder()
        .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this)).build();
    webView.setWebViewClient(new WebViewClient() {
      @Override public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
        WebResourceResponse response = loader.shouldInterceptRequest(request.getUrl());
        if (response == null && APP_HOST.equals(request.getUrl().getHost())) {
          return new WebResourceResponse("text/plain", "UTF-8", 404, "Not Found", null,
              new ByteArrayInputStream(new byte[0]));
        }
        return response;
      }
      @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
        if (isAppUrl(request.getUrl())) return false;
        openExternal(request.getUrl());
        return true;
      }
    });
    webView.setWebChromeClient(new WebChromeClient() {
      @Override public void onGeolocationPermissionsShowPrompt(String origin, GeolocationPermissions.Callback callback) {
        if (!isAppUrl(Uri.parse(origin))) {
          callback.invoke(origin, false, false);
          return;
        }
        if (hasLocationPermission()) {
          callback.invoke(origin, true, false);
          return;
        }
        if (locationCallback != null) locationCallback.invoke(locationOrigin, false, false);
        locationCallback = callback;
        locationOrigin = origin;
        requestPermissions(new String[] {Manifest.permission.ACCESS_FINE_LOCATION,
            Manifest.permission.ACCESS_COARSE_LOCATION}, LOCATION_REQUEST);
      }
      @Override public void onGeolocationPermissionsHidePrompt() {
        if (locationCallback != null) locationCallback.invoke(locationOrigin, false, false);
        locationCallback = null;
        locationOrigin = null;
      }
      @Override public boolean onCreateWindow(WebView view, boolean dialog, boolean userGesture, Message result) {
        if (!userGesture) return false;
        WebView popup = new WebView(MainActivity.this);
        popup.setWebViewClient(new WebViewClient() {
          @Override public boolean shouldOverrideUrlLoading(WebView ignored, WebResourceRequest request) {
            openExternal(request.getUrl());
            popup.destroy();
            return true;
          }
        });
        ((WebView.WebViewTransport) result.obj).setWebView(popup);
        result.sendToTarget();
        return true;
      }
    });
    getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
      @Override public void handleOnBackPressed() { handleBack(); }
    });
    webView.loadUrl(APP_URL);
  }

  private boolean isAppUrl(Uri uri) {
    return "https".equals(uri.getScheme()) && APP_HOST.equals(uri.getHost());
  }

  private boolean hasLocationPermission() {
    return checkSelfPermission(Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED ||
        checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED;
  }

  @Override public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] results) {
    super.onRequestPermissionsResult(requestCode, permissions, results);
    if (requestCode == LOCATION_REQUEST && locationCallback != null) {
      locationCallback.invoke(locationOrigin, hasLocationPermission(), false);
      locationCallback = null;
      locationOrigin = null;
    }
  }

  private void openExternal(Uri uri) {
    String scheme = uri.getScheme();
    if (!("https".equals(scheme) || "http".equals(scheme) || "tel".equals(scheme) ||
        "mailto".equals(scheme) || "geo".equals(scheme))) return;
    try { startActivity(new Intent(Intent.ACTION_VIEW, uri)); }
    catch (ActivityNotFoundException error) {
      Toast.makeText(this, "No app is available to open this link.", Toast.LENGTH_SHORT).show();
    }
  }

  private void handleBack() {
    if (webView == null) { finish(); return; }
    webView.evaluateJavascript("typeof window.__roastRouteBack === 'function' && window.__roastRouteBack()", result -> {
      if ("true".equals(result)) return;
      if (webView.canGoBack()) webView.goBack(); else finish();
    });
  }

  @Override public void onPause() {
    if (webView != null) webView.onPause();
    super.onPause();
  }
  @Override public void onResume() {
    super.onResume();
    if (webView != null) webView.onResume();
  }
  @Override public void onDestroy() {
    if (locationCallback != null) locationCallback.invoke(locationOrigin, false, false);
    if (webView != null) {
      webView.stopLoading();
      ((FrameLayout) webView.getParent()).removeView(webView);
      webView.destroy();
      webView = null;
    }
    super.onDestroy();
  }
}
