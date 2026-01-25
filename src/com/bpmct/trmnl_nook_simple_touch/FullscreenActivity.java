package com.bpmct.trmnl_nook_simple_touch;

import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.view.WindowManager;

public class FullscreenActivity extends Activity {
    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // NOOK Simple Touch is API 7 (no nav bar); keep this deterministic.
        getWindow().setFlags(
                WindowManager.LayoutParams.FLAG_FULLSCREEN,
                WindowManager.LayoutParams.FLAG_FULLSCREEN);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        setContentView(R.layout.activity_fullscreen);

        webView = (WebView) findViewById(R.id.webview);

        WebSettings settings = webView.getSettings();
        // API 7: supported; keep simple for now.
        settings.setJavaScriptEnabled(true);

        // Keep navigation inside the app (API 7 docs: WebViewClient#shouldOverrideUrlLoading).
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                view.loadUrl(url);
                return true;
            }
        });

        // Prefer HTTP for maximum compatibility on very old TLS stacks.
        webView.loadUrl("http://example.com/");
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
            return;
        }
        super.onBackPressed();
    }

    @Override
    protected void onDestroy() {
        if (webView != null) {
            webView.stopLoading();
            webView.setWebViewClient(null);
            webView.destroy();
            webView = null;
        }
        super.onDestroy();
    }
}
