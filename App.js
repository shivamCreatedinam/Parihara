/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * https://www.google.com/maps/dir/Noida,+Uttar+Pradesh/Gurugram,+Haryana/@28.5563204,77.0362189,11z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x390ce5a43173357b:0x37ffce30c87cc03f!2m2!1d77.3910265!2d28.5355161!1m5!1m1!1s0x390d19d582e38859:0x2cf5fe8e5c64b1e!2m2!1d77.0266383!2d28.4594965?entry=ttu
 * @format
 */

import React from 'react';
import {
  AppState,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Platform,
  Text,
  Alert,
  TouchableOpacity,
  Dimensions,
  BackHandler,
  Linking,
  ImageBackground,
  Image,
} from 'react-native';
import Toast from 'react-native-toast-message';
import PushController from './PushController';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import VersionCheck from 'react-native-version-check';
import { TailwindProvider, useTailwind } from 'tailwind-rn';
import utilities from './tailwind.json';
import data from './package.json';
import StackNavigation from './navigation';
import NotificationCenter from './NotificationCenter';


const App = () => {

  const [isupdated, setisupdated] = React.useState(true);
  const appState = React.useRef(AppState.currentState);
  const [initialRoute, setInitialRoute] = React.useState('SplashAppScreen');
  const [appStateVisible, setAppStateVisible] = React.useState(appState.current);
  const [authenticated, setAuthenticated] = React.useState(true);

  React.useEffect(() => {
    checkPermission();
    messageListener();
    forceUpdate();
  }, []);

  const checkPermission = async () => {
    const enabled = await messaging().hasPermission();
    if (enabled) {
      getFcmToken();
    } else {
      requestPermission();
    }
  }

  const getFcmToken = async () => {
    // const fcmToken = await messaging().getToken();
    // if (fcmToken) {
    //   // showAlert('Your Firebase Token is:', fcmToken);
    //   await AsyncStorage.setItem('@tokenKey', fcmToken);
    //   console.log('FCM_save:' + fcmToken);
    // } else {
    //   showAlert('Failed', 'No token received');
    // }
  }

  const requestPermission = async () => {
    try {
      await messaging().requestPermission();
      // User has authorised
    } catch (error) {
      console.log("call error", error);
      // User has rejected permissions
    }
  }

  const messageListener = async () => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      // console.log(
      //   'Notification caused app to open from background state:',
      //   remoteMessage.notification,
      // ); 
      setInitialRoute('TripStartScreen');
    });

    // Quiet and Background State -> Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
        }
      })
      .catch(error => console.log('failed', error));

    // Foreground State
    messaging().onMessage(async remoteMessage => {
      console.log('foreground', remoteMessage);
    });
  }

  const showAlert = (title, message) => {
    Alert.alert(
      title,
      message,
      [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ],
      { cancelable: false },
    );
  }

  // React.useEffect(() => {
  //   if (authenticated) {
  //     BackgroundGeolocation.configure({
  //       desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
  //       stationaryRadius: 50,
  //       distanceFilter: 50,
  //       notificationTitle: 'Background tracking',
  //       notificationText: 'enabled',
  //       debug: false,
  //       startOnBoot: false,
  //       stopOnTerminate: true,
  //       locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
  //       interval: 30000,
  //       fastestInterval: 30000,
  //       activitiesInterval: 30000,
  //       stopOnStillActivity: false,
  //       url: 'http://192.168.81.15:3000/location',
  //       httpHeaders: {
  //         'X-FOO': 'bar',
  //       },
  //       // customize post properties
  //       postTemplate: {
  //         lat: '@latitude',
  //         lon: '@longitude',
  //         foo: 'bar' // you can also add your own properties
  //       }
  //     })

  //     BackgroundGeolocation.on('location', (location) => {
  //       console.log('BackgroundGeolocation', payload);
  //       const payload = { latitude: location?.latitude, longitude: location?.longitude }
  //       // dispatch({ type: CONSTANTS.LOCATION_POST_REQUEST, payload })
  //       // handle your locations here
  //       // to perform long running operation on iOS
  //       // you need to create background task
  //       BackgroundGeolocation.startTask(taskKey => {
  //         // execute long running task
  //         // eg. ajax post location
  //         // IMPORTANT: task has to be ended by endTask
  //         BackgroundGeolocation.endTask(taskKey);
  //       });
  //     });

  //     BackgroundGeolocation.on('stationary', (stationaryLocation) => {
  //       // handle stationary locations here
  //       // Actions.sendLocation(stationaryLocation);
  //       console.log('stationaryLocation', stationaryLocation);
  //     });

  //     BackgroundGeolocation.on('error', (error) => {
  //       console.log('[ERROR] BackgroundGeolocation error:', error);
  //     });

  //     BackgroundGeolocation.on('start', () => {
  //       console.log('[INFO] BackgroundGeolocation service has been started');
  //     });

  //     BackgroundGeolocation.on('stop', () => {
  //       console.log('[INFO] BackgroundGeolocation service has been stopped');
  //     });

  //     BackgroundGeolocation.on('authorization', (status) => {
  //       console.log('[INFO] BackgroundGeolocation authorization status: ' + status);
  //       if (status !== BackgroundGeolocation.AUTHORIZED) {
  //         // we need to set delay or otherwise alert may not be shown
  //         setTimeout(() =>
  //           Alert.alert('App requires location tracking permission', 'Would you like to open app settings?', [
  //             { text: 'Yes', onPress: () => BackgroundGeolocation.showAppSettings() },
  //             { text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel' }
  //           ]), 1000);
  //       }
  //     });

  //     BackgroundGeolocation.on('background', () => {
  //       console.log('[INFO] App is in background');
  //     });

  //     BackgroundGeolocation.on('foreground', () => {
  //       console.log('[INFO] App is in foreground');
  //     });

  //     BackgroundGeolocation.on('abort_requested', () => {
  //       console.log('[INFO] Server responded with 285 Updates Not Required');
  //     });

  //     BackgroundGeolocation.on('http_authorization', () => {
  //       console.log('[INFO] App needs to authorize the http requests');
  //     });

  //     BackgroundGeolocation.checkStatus(status => {

  //       console.log('[INFO] BackgroundGeolocation service is running', status.isRunning);
  //       console.log('[INFO] BackgroundGeolocation services enabled', status.locationServicesEnabled);
  //       console.log('[INFO] BackgroundGeolocation auth status: ' + status.authorization);

  //       if (!status.isRunning) {
  //         BackgroundGeolocation.start(); //triggers start on start event
  //       }
  //     });
  //   }

  //   // you can also just start without checking for status
  //   // BackgroundGeolocation.start();
  // }, [authenticated]);


  const forceUpdate = async () => {
    try {
      let updateNeeded = await VersionCheck.needUpdate();
      console.log('updateNeeded------------->', JSON.stringify(updateNeeded));
      // if (updateNeeded && updateNeeded.isNeeded) {
      //   setisupdated(false)
      //   Alert.alert('Please update', 'You have to update the app to continue using',
      //     [{
      //       text: 'Update',
      //       onPress: () => {
      //         Linking.openURL(updateNeeded.storeUrl)
      //         BackHandler.exitApp()
      //       }
      //     }
      //     ], { cancelable: false })
      // }
      // else {
      //   setisupdated(true)
      // }
    }
    catch (err) {
      console.log(err);
    }
  }


  if (!isupdated) {
    return <ImageBackground
      style={{ flex: 1 }}
      source={require('./src/assets/background.jpeg')}
      resizeMode={'repeat'}>
      <Image
        style={{ width: 300, height: 300, resizeMode: 'contain', alignSelf: 'center', marginTop: 150, tintColor: 'rgb(131,24,28)' }}
        source={require('./src/assets/updateImage.png')} />
      <TouchableOpacity
        style={{ alignSelf: 'center', top: -50, backgroundColor: 'rgb(131,24,28)', paddingVertical: 10, paddingHorizontal: 30, borderRadius: 10, elevation: 5 }}
        onPress={() => forceUpdate()}>
        <Text style={{ color: '#ffffff', textTransform: 'uppercase', fontWeight: 'bold' }}>Update Now {data?.version}</Text>
      </TouchableOpacity>
    </ImageBackground>
  } else {
    return (
      <SafeAreaView style={{ height: Dimensions.get('screen').height, width: Dimensions.get('screen').width }}>
        <TailwindProvider utilities={utilities}>
          <StatusBar backgroundColor='black' barStyle='light-content' translucent />
          <NotificationCenter />
          <StackNavigation initialRouts={initialRoute} />
          <PushController />
          <Toast />
        </TailwindProvider>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  imageMarker: {
    width: 40,
    height: 40,
    resizeMode: 'contain'
  }
});

export default App;
