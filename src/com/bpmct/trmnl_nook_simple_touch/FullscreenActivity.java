package com.bpmct.trmnl_nook_simple_touch;

import android.app.Activity;
import android.os.Bundle;
import android.os.AsyncTask;
import android.util.Log;
import android.view.WindowManager;
import android.widget.ScrollView;
import android.widget.TextView;

import java.io.InputStream;
import java.lang.ref.WeakReference;
import java.net.HttpURLConnection;
import java.net.URL;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSocketFactory;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import java.security.cert.X509Certificate;

public class FullscreenActivity extends Activity {
    private static final String TAG = "TRMNLAPI";
    private TextView contentView;
    private static final String API_URL = "https://api.restful-api.dev/objects/7";
    private static final String API_URL_HTTP = "http://api.restful-api.dev/objects/7"; // Fallback if HTTPS fails
    private static SSLSocketFactory trustAllSocketFactory = null;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // NOOK Simple Touch is API 7 (no nav bar); keep this deterministic.
        getWindow().setFlags(
                WindowManager.LayoutParams.FLAG_FULLSCREEN,
                WindowManager.LayoutParams.FLAG_FULLSCREEN);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        // Simple layout: ScrollView with TextView for API response
        ScrollView scrollView = new ScrollView(this);
        contentView = new TextView(this);
        contentView.setPadding(20, 20, 20, 20);
        contentView.setTextColor(0xFF000000); // Black text for e-ink
        contentView.setTextSize(16);
        contentView.setText("Loading...");
        scrollView.addView(contentView);
        setContentView(scrollView);

        // Fetch API (try HTTPS first, fallback to HTTP if SSL fails)
        ApiFetchTask.start(this, API_URL, API_URL_HTTP);
    }

    @Override
    protected void onResume() {
        super.onResume();
        // Re-apply fullscreen flags in case system UI appeared
        getWindow().setFlags(
                WindowManager.LayoutParams.FLAG_FULLSCREEN,
                WindowManager.LayoutParams.FLAG_FULLSCREEN);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
    }

    /**
     * Fetches JSON from API and displays as text.
     */
    private static class ApiFetchTask extends AsyncTask {
        private final WeakReference activityRef;
        private final String httpsUrl;
        private final String httpUrl;

        private ApiFetchTask(FullscreenActivity activity, String httpsUrl, String httpUrl) {
            this.activityRef = new WeakReference(activity);
            this.httpsUrl = httpsUrl;
            this.httpUrl = httpUrl;
        }

        public static void start(FullscreenActivity activity, String httpsUrl, String httpUrl) {
            if (activity == null || httpsUrl == null) return;
            try {
                new ApiFetchTask(activity, httpsUrl, httpUrl).execute(new Object[] { httpsUrl, httpUrl });
            } catch (Throwable t) {
                Log.e(TAG, "fetch start failed: " + t);
            }
        }

        protected Object doInBackground(Object[] params) {
            String httpsUrl = (String) params[0];
            String httpUrl = params.length > 1 ? (String) params[1] : null;
            
            // Try HTTPS first
            Object result = fetchUrl(httpsUrl, true);
            
            // If HTTPS fails with SSL error, try HTTP fallback
            if (result != null && result.toString().contains("SSL") && httpUrl != null) {
                Log.w(TAG, "HTTPS failed with SSL error, trying HTTP fallback");
                result = fetchUrl(httpUrl, false);
            }
            
            return result;
        }
        
        private Object fetchUrl(String url, boolean isHttps) {
            HttpURLConnection conn = null;
            try {
                Log.d(TAG, "fetching: " + url + (isHttps ? " (HTTPS)" : " (HTTP)"));
                URL u = new URL(url);
                conn = (HttpURLConnection) u.openConnection();
                
                // Use custom SSL socket factory for API 7 compatibility (HTTPS only)
                if (isHttps && conn instanceof HttpsURLConnection) {
                    HttpsURLConnection https = (HttpsURLConnection) conn;
                    SSLSocketFactory factory = getTrustAllSocketFactory();
                    if (factory != null) {
                        Log.d(TAG, "setting custom SSL socket factory");
                        https.setSSLSocketFactory(factory);
                    } else {
                        Log.w(TAG, "custom SSL socket factory is null, using default");
                    }
                }
                
                conn.setConnectTimeout(15000);
                conn.setReadTimeout(20000);
                conn.setRequestProperty("User-Agent", "TRMNL-Nook/1.0 (Android 2.1)");
                conn.setRequestProperty("Accept", "application/json");

                // Explicit connect for API 7
                try {
                    conn.connect();
                } catch (Throwable t) {
                    String errorMsg = "Error: " + t.getMessage();
                    Log.e(TAG, "connect() failed: " + t, t);
                    return errorMsg;
                }

                int code;
                try {
                    code = conn.getResponseCode();
                } catch (Throwable t) {
                    String errorMsg = "Error: " + t.getMessage();
                    Log.e(TAG, "getResponseCode() failed: " + t, t);
                    // Log full stack trace for SSL errors
                    if (t.getMessage() != null && t.getMessage().contains("SSL")) {
                        Log.e(TAG, "SSL error details:", t);
                    }
                    return errorMsg;
                }
                
                Log.d(TAG, "response code: " + code);
                
                if (code == -1) {
                    String errorMsg = "Error: Connection failed (code=-1)";
                    Log.e(TAG, errorMsg);
                    return errorMsg;
                }

                if (code >= 200 && code < 300) {
                    InputStream is = conn.getInputStream();
                    StringBuilder sb = new StringBuilder();
                    byte[] buf = new byte[8192];
                    int n;
                    while ((n = is.read(buf)) > 0) {
                        sb.append(new String(buf, 0, n, "UTF-8"));
                    }
                    is.close();
                    String json = sb.toString();
                    Log.d(TAG, "got " + json.length() + " chars from " + (isHttps ? "HTTPS" : "HTTP"));
                    return json;
                } else {
                    return "Error: HTTP " + code;
                }
            } catch (Throwable t) {
                String errorMsg = "Error: " + t.getMessage();
                Log.e(TAG, "fetch failed: " + t, t);
                // Log full stack trace for SSL errors
                if (t.getMessage() != null && t.getMessage().contains("SSL")) {
                    Log.e(TAG, "SSL error full stack trace:", t);
                }
                return errorMsg;
            } finally {
                if (conn != null) {
                    try { conn.disconnect(); } catch (Throwable ignored) {}
                }
            }
        }

        protected void onPostExecute(Object result) {
            final FullscreenActivity a = (FullscreenActivity) activityRef.get();
            if (a == null || a.contentView == null) return;
            
            String text = result != null ? result.toString() : "Error: null result";
            a.contentView.setText(text);
            Log.d(TAG, "displayed response");
        }
    }

    /**
     * Creates an SSLSocketFactory that accepts all certificates (testing only).
     * On API 7, we need to use "TLS" or "SSL" protocol, and handle old cipher suites.
     */
    private static synchronized SSLSocketFactory getTrustAllSocketFactory() {
        if (trustAllSocketFactory != null) {
            return trustAllSocketFactory;
        }
        try {
            TrustManager[] trustAllCerts = new TrustManager[] {
                new X509TrustManager() {
                    public X509Certificate[] getAcceptedIssuers() {
                        return new X509Certificate[0];
                    }
                    public void checkClientTrusted(X509Certificate[] chain, String authType) {
                    }
                    public void checkServerTrusted(X509Certificate[] chain, String authType) {
                    }
                }
            };
            
            // Try TLS first, fallback to SSL for API 7
            SSLContext sc = null;
            try {
                sc = SSLContext.getInstance("TLS");
                Log.d(TAG, "using TLS protocol");
            } catch (Throwable t) {
                try {
                    sc = SSLContext.getInstance("SSL");
                    Log.d(TAG, "using SSL protocol (fallback)");
                } catch (Throwable t2) {
                    Log.e(TAG, "failed to get SSLContext: " + t2);
                    return null;
                }
            }
            
            sc.init(null, trustAllCerts, new java.security.SecureRandom());
            trustAllSocketFactory = sc.getSocketFactory();
            Log.d(TAG, "created trust-all socket factory");
            return trustAllSocketFactory;
        } catch (Throwable t) {
            Log.e(TAG, "failed to create trust-all socket factory: " + t, t);
            return null;
        }
    }
}
