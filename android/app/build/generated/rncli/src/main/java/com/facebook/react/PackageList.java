
package com.facebook.react;

import android.app.Application;
import android.content.Context;
import android.content.res.Resources;

import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainPackageConfig;
import com.facebook.react.shell.MainReactPackage;
import java.util.Arrays;
import java.util.ArrayList;

// @react-native-async-storage/async-storage
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
// @react-native-community/clipboard
import com.reactnativecommunity.clipboard.ClipboardPackage;
// @react-native-community/geolocation
import com.reactnativecommunity.geolocation.GeolocationPackage;
// @react-native-community/progress-view
import com.reactnativecommunity.progressview.RNCProgressViewPackage;
// @react-native-firebase/analytics
import io.invertase.firebase.analytics.ReactNativeFirebaseAnalyticsPackage;
// @react-native-firebase/app
import io.invertase.firebase.app.ReactNativeFirebaseAppPackage;
// @react-native-firebase/auth
import io.invertase.firebase.auth.ReactNativeFirebaseAuthPackage;
// @react-native-firebase/database
import io.invertase.firebase.database.ReactNativeFirebaseDatabasePackage;
// @react-native-firebase/firestore
import io.invertase.firebase.firestore.ReactNativeFirebaseFirestorePackage;
// @react-native-firebase/messaging
import io.invertase.firebase.messaging.ReactNativeFirebaseMessagingPackage;
// @supersami/rn-foreground-service
import com.supersami.foregroundservice.ForegroundServicePackage;
// @voximplant/react-native-foreground-service
import com.voximplant.foregroundservice.VIForegroundServicePackage;
// appcenter
import com.microsoft.appcenter.reactnative.appcenter.AppCenterReactNativePackage;
// appcenter-analytics
import com.microsoft.appcenter.reactnative.analytics.AppCenterReactNativeAnalyticsPackage;
// appcenter-crashes
import com.microsoft.appcenter.reactnative.crashes.AppCenterReactNativeCrashesPackage;
// react-native-background-actions
import com.asterinet.react.bgactions.BackgroundActionsPackage;
// react-native-background-timer
import com.ocetnik.timer.BackgroundTimerPackage;
// react-native-geocoder
import com.devfd.RNGeocoder.RNGeocoderPackage;
// react-native-geolocation-service
import com.agontuk.RNFusedLocation.RNFusedLocationPackage;
// react-native-gesture-handler
import com.swmansion.gesturehandler.RNGestureHandlerPackage;
// react-native-image-crop-picker
import com.reactnative.ivpusic.imagepicker.PickerPackage;
// react-native-loader-kit
import com.reactnativeloaderkit.LoaderKitPackage;
// react-native-location
import com.github.reactnativecommunity.location.RNLocationPackage;
// react-native-maps
import com.airbnb.android.react.maps.MapsPackage;
// react-native-pager-view
import com.reactnativepagerview.PagerViewPackage;
// react-native-permissions
import com.zoontek.rnpermissions.RNPermissionsPackage;
// react-native-push-notification
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
// react-native-restart
import com.reactnativerestart.RestartPackage;
// react-native-safe-area-context
import com.th3rdwave.safeareacontext.SafeAreaContextPackage;
// react-native-screens
import com.swmansion.rnscreens.RNScreensPackage;
// react-native-sensors
import com.sensors.RNSensorsPackage;
// react-native-svg
import com.horcrux.svg.SvgPackage;
// react-native-version-check
import io.xogus.reactnative.versioncheck.RNVersionCheckPackage;

public class PackageList {
  private Application application;
  private ReactNativeHost reactNativeHost;
  private MainPackageConfig mConfig;

  public PackageList(ReactNativeHost reactNativeHost) {
    this(reactNativeHost, null);
  }

  public PackageList(Application application) {
    this(application, null);
  }

  public PackageList(ReactNativeHost reactNativeHost, MainPackageConfig config) {
    this.reactNativeHost = reactNativeHost;
    mConfig = config;
  }

  public PackageList(Application application, MainPackageConfig config) {
    this.reactNativeHost = null;
    this.application = application;
    mConfig = config;
  }

  private ReactNativeHost getReactNativeHost() {
    return this.reactNativeHost;
  }

  private Resources getResources() {
    return this.getApplication().getResources();
  }

  private Application getApplication() {
    if (this.reactNativeHost == null) return this.application;
    return this.reactNativeHost.getApplication();
  }

  private Context getApplicationContext() {
    return this.getApplication().getApplicationContext();
  }

  public ArrayList<ReactPackage> getPackages() {
    return new ArrayList<>(Arrays.<ReactPackage>asList(
      new MainReactPackage(mConfig),
      new AsyncStoragePackage(),
      new ClipboardPackage(),
      new GeolocationPackage(),
      new RNCProgressViewPackage(),
      new ReactNativeFirebaseAnalyticsPackage(),
      new ReactNativeFirebaseAppPackage(),
      new ReactNativeFirebaseAuthPackage(),
      new ReactNativeFirebaseDatabasePackage(),
      new ReactNativeFirebaseFirestorePackage(),
      new ReactNativeFirebaseMessagingPackage(),
      new ForegroundServicePackage(),
      new VIForegroundServicePackage(),
      new AppCenterReactNativePackage(getApplication()),
      new AppCenterReactNativeAnalyticsPackage(getApplication(), getResources().getString(com.mapilocator.R.string.appCenterAnalytics_whenToEnableAnalytics)),
      new AppCenterReactNativeCrashesPackage(getApplication(), getResources().getString(com.mapilocator.R.string.appCenterCrashes_whenToSendCrashes)),
      new BackgroundActionsPackage(),
      new BackgroundTimerPackage(),
      new RNGeocoderPackage(),
      new RNFusedLocationPackage(),
      new RNGestureHandlerPackage(),
      new PickerPackage(),
      new LoaderKitPackage(),
      new RNLocationPackage(),
      new MapsPackage(),
      new PagerViewPackage(),
      new RNPermissionsPackage(),
      new ReactNativePushNotificationPackage(),
      new RestartPackage(),
      new SafeAreaContextPackage(),
      new RNScreensPackage(),
      new RNSensorsPackage(),
      new SvgPackage(),
      new RNVersionCheckPackage()
    ));
  }
}
