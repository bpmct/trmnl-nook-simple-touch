package com.bpmct.trmnl_nook_simple_touch;

import android.app.Activity;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.TextView;
import android.view.ViewGroup;

public class GiftModeSettingsActivity extends Activity {
    private static final int APP_ROTATION_DEGREES = 90;
    private EditText deviceCodeField;
    private EditText fromNameField;
    private EditText toNameField;
    private CheckBox webSetupCheckbox;

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        getWindow().setFlags(
                WindowManager.LayoutParams.FLAG_FULLSCREEN,
                WindowManager.LayoutParams.FLAG_FULLSCREEN);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        FrameLayout root = new FrameLayout(this);
        root.setLayoutParams(new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.FILL_PARENT,
                ViewGroup.LayoutParams.FILL_PARENT));

        ScrollView scroll = new ScrollView(this);
        scroll.setBackgroundColor(0xFFFFFFFF);

        LinearLayout inner = new LinearLayout(this);
        inner.setOrientation(LinearLayout.VERTICAL);
        inner.setPadding(24, 24, 24, 24);

        TextView title = new TextView(this);
        title.setText("Gift Mode");
        title.setTextSize(20);
        title.setTextColor(0xFF000000);
        inner.addView(title);

        TextView desc = new TextView(this);
        desc.setText("Show setup instructions on the display for whoever receives this device. " +
                "Great for gifting a BYOD device from shop.trmnl.com.");
        desc.setTextSize(12);
        desc.setTextColor(0xFF333333);
        LinearLayout.LayoutParams descParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.FILL_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT);
        descParams.topMargin = 12;
        inner.addView(desc, descParams);

        // Your name (optional)
        inner.addView(createLabel("Your name (optional)"));
        fromNameField = createTextField(ApiPrefs.getGiftFromName(this));
        inner.addView(fromNameField, createFieldParams());

        // Recipient name (optional)
        inner.addView(createLabel("Recipient's name (optional)"));
        toNameField = createTextField(ApiPrefs.getGiftToName(this));
        inner.addView(toNameField, createFieldParams());

        // Device code
        inner.addView(createLabel("Device Code"));
        deviceCodeField = createTextField(ApiPrefs.getFriendlyDeviceCode(this));
        inner.addView(deviceCodeField, createFieldParams());

        final TextView hint = new TextView(this);
        hint.setText("Find your code at: trmnl.com/claim-a-device");
        hint.setTextSize(10);
        hint.setTextColor(0xFF888888);
        LinearLayout.LayoutParams hintParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT,
                ViewGroup.LayoutParams.WRAP_CONTENT);
        hintParams.topMargin = 4;
        inner.addView(hint, hintParams);

        // Web setup checkbox
        webSetupCheckbox = new CheckBox(this);
        webSetupCheckbox.setText("Web code setup");
        webSetupCheckbox.setTextSize(13);
        webSetupCheckbox.setTextColor(0xFF000000);
        webSetupCheckbox.setChecked(ApiPrefs.isGiftWebSetup(this));
        LinearLayout.LayoutParams cbParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.FILL_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT);
        cbParams.topMargin = 14;
        inner.addView(webSetupCheckbox, cbParams);

        TextView webSetupHint = new TextView(this);
        webSetupHint.setText("When enabled, the display instructs the recipient to visit a web URL to set up the device instead of manual steps.");
        webSetupHint.setTextSize(10);
        webSetupHint.setTextColor(0xFF888888);
        LinearLayout.LayoutParams webHintParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.FILL_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT);
        webHintParams.topMargin = 4;
        inner.addView(webSetupHint, webHintParams);

        LinearLayout actions = new LinearLayout(this);
        actions.setOrientation(LinearLayout.HORIZONTAL);
        LinearLayout.LayoutParams actionsParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT,
                ViewGroup.LayoutParams.WRAP_CONTENT);
        actionsParams.topMargin = 20;
        inner.addView(actions, actionsParams);

        Button saveButton = new Button(this);
        saveButton.setText("Save");
        saveButton.setTextColor(0xFF000000);
        actions.addView(saveButton);

        Button backButton = new Button(this);
        backButton.setText("Back");
        backButton.setTextColor(0xFF000000);
        LinearLayout.LayoutParams backParams = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT,
                ViewGroup.LayoutParams.WRAP_CONTENT);
        backParams.leftMargin = 16;
        actions.addView(backButton, backParams);

        saveButton.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                ApiPrefs.saveFriendlyDeviceCode(GiftModeSettingsActivity.this, 
                        deviceCodeField.getText().toString().trim());
                ApiPrefs.saveGiftFromName(GiftModeSettingsActivity.this,
                        fromNameField.getText().toString().trim());
                ApiPrefs.saveGiftToName(GiftModeSettingsActivity.this,
                        toNameField.getText().toString().trim());
                ApiPrefs.setGiftWebSetup(GiftModeSettingsActivity.this,
                        webSetupCheckbox.isChecked());
                // Go back to main display
                android.content.Intent intent = new android.content.Intent(GiftModeSettingsActivity.this, DisplayActivity.class);
                intent.setFlags(android.content.Intent.FLAG_ACTIVITY_CLEAR_TOP);
                startActivity(intent);
                finish();
            }
        });

        backButton.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                finish();
            }
        });

        scroll.addView(inner);
        
        // No rotation - keep native orientation for keyboard compatibility
        root.addView(scroll, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.FILL_PARENT,
                ViewGroup.LayoutParams.FILL_PARENT));
        setContentView(root);
    }

    private TextView createLabel(String text) {
        TextView label = new TextView(this);
        label.setText(text);
        label.setTextSize(12);
        label.setTextColor(0xFF000000);
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT,
                ViewGroup.LayoutParams.WRAP_CONTENT);
        params.topMargin = 14;
        label.setLayoutParams(params);
        return label;
    }

    private EditText createTextField(String value) {
        EditText field = new EditText(this);
        field.setTextColor(0xFF000000);
        field.setBackgroundColor(0xFFEEEEEE);
        field.setPadding(12, 8, 12, 8);
        field.setSingleLine(true);
        if (value != null) field.setText(value);
        return field;
    }

    private LinearLayout.LayoutParams createFieldParams() {
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.FILL_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT);
        params.topMargin = 4;
        return params;
    }
}
