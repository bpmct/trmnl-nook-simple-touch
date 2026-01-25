package com.bpmct.trmnl_nook_simple_touch;

import android.content.Context;
import android.content.SharedPreferences;

public class ApiPrefs {
    private static final String PREFS_NAME = "trmnl_prefs";
    private static final String KEY_API_ID = "api_id";
    private static final String KEY_API_TOKEN = "api_token";
    private static final String KEY_API_BASE_URL = "api_base_url";

    public static boolean hasCredentials(Context context) {
        return getApiId(context) != null && getApiToken(context) != null;
    }

    public static String getApiId(Context context) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        String value = prefs.getString(KEY_API_ID, null);
        if (value == null || value.trim().length() == 0) return null;
        return value.trim();
    }

    public static String getApiToken(Context context) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        String value = prefs.getString(KEY_API_TOKEN, null);
        if (value == null || value.trim().length() == 0) return null;
        return value.trim();
    }

    public static void saveCredentials(Context context, String apiId, String apiToken) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        prefs.edit()
                .putString(KEY_API_ID, apiId != null ? apiId.trim() : "")
                .putString(KEY_API_TOKEN, apiToken != null ? apiToken.trim() : "")
                .commit();
    }

    public static String getApiBaseUrl(Context context) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        String value = prefs.getString(KEY_API_BASE_URL, null);
        if (value == null || value.trim().length() == 0) {
            return ApiConfig.API_BASE_URL;
        }
        String normalized = normalizeBaseUrl(value);
        if (!normalized.equals(value.trim())) {
            prefs.edit().putString(KEY_API_BASE_URL, normalized).commit();
        }
        return normalized;
    }

    public static void saveApiBaseUrl(Context context, String baseUrl) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        String value = normalizeBaseUrl(baseUrl);
        prefs.edit()
                .putString(KEY_API_BASE_URL, value)
                .commit();
    }

    private static String normalizeBaseUrl(String baseUrl) {
        String value = baseUrl != null ? baseUrl.trim() : "";
        if (value.length() == 0) {
            return ApiConfig.API_BASE_URL;
        }
        while (value.endsWith("/")) {
            value = value.substring(0, value.length() - 1);
        }
        while (value.endsWith("/api/api")) {
            value = value.substring(0, value.length() - 4);
        }
        if (!value.endsWith("/api")) {
            value = value + "/api";
        }
        return value;
    }
}
