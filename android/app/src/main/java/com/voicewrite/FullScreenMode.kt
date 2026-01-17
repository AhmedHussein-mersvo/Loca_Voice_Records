package com.voicewrite

import android.view.View
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

@Suppress("DEPRECATION")
class FullScreenMode(private val reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String = "FullScreenMode"

  @ReactMethod
  fun enterStickyImmersiveMode() {
    getCurrentDecorView()?.systemUiVisibility =
      (View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
        or View.SYSTEM_UI_FLAG_LAYOUT_STABLE
        or View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
        or View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
        or View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
        or View.SYSTEM_UI_FLAG_FULLSCREEN)
  }

  @ReactMethod
  fun enterImmersiveMode() {
    getCurrentDecorView()?.systemUiVisibility =
      (View.SYSTEM_UI_FLAG_IMMERSIVE
        or View.SYSTEM_UI_FLAG_LAYOUT_STABLE
        or View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
        or View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
        or View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
        or View.SYSTEM_UI_FLAG_FULLSCREEN)
  }

  private fun getCurrentDecorView(): View? {
    // Call the Java getter via reactContext to avoid unresolved reference
    return reactContext.currentActivity?.window?.decorView
  }
}
