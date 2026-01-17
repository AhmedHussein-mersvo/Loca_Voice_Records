package com.voicewrite

import android.os.Handler
import android.view.View
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

@Suppress("DEPRECATION") // systemUiVisibility flags are deprecated but fine for RN usage
class ImmersiveMode(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  private val uiHandler: Handler = Handler(reactContext.mainLooper)

  override fun getName(): String = "ImmersiveMode"

  /* React Methods */
  @ReactMethod
  fun enterLeanBackMode() {
    uiHandler.post(runnableEnterLeanBackMode)
  }

  @ReactMethod
  fun enterImmersiveMode() {
    uiHandler.post(runnableEnterImmersiveMode)
  }

  @ReactMethod
  fun enterStickyImmersiveMode() {
    uiHandler.post(runnableEnterStickyImmersiveMode)
  }

  @ReactMethod
  fun exitImmersiveMode() {
    uiHandler.post(runnableExitImmersiveMode)
  }

  /* System UI Methods */
  private val runnableEnterLeanBackMode = Runnable {
    setSystemUIFlags(
      View.SYSTEM_UI_FLAG_FULLSCREEN or
        View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
    )
  }

  private val runnableEnterImmersiveMode = Runnable {
    setSystemUIFlags(
      View.SYSTEM_UI_FLAG_IMMERSIVE or
        View.SYSTEM_UI_FLAG_LAYOUT_STABLE or
        View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION or
        View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN or
        View.SYSTEM_UI_FLAG_HIDE_NAVIGATION or
        View.SYSTEM_UI_FLAG_FULLSCREEN
    )
  }

  private val runnableEnterStickyImmersiveMode = Runnable {
    setSystemUIFlags(
      View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY or
        View.SYSTEM_UI_FLAG_LAYOUT_STABLE or
        View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION or
        View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN or
        View.SYSTEM_UI_FLAG_HIDE_NAVIGATION or
        View.SYSTEM_UI_FLAG_FULLSCREEN
    )
  }

  private val runnableExitImmersiveMode = Runnable {
    setSystemUIFlags(
      View.SYSTEM_UI_FLAG_LAYOUT_STABLE or
        View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION or
        View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
    )
  }

  /* Private Methods */
  private fun setSystemUIFlags(visibility: Int) {
    // Use Java getter to avoid unresolved synthetic property
    val decor = reactApplicationContext.currentActivity?.window?.decorView
    decor?.systemUiVisibility = visibility
  }
}
