import * as React from 'react';
import { Image, Text, View, } from 'react-native';
import analytics from '@react-native-firebase/analytics';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// firebase 
import database from '@react-native-firebase/database';
// screens
import MapScreens from '../src/screens/map_screens';
import HomeScreen from '../src/screens/home_screen';
import RegisterScreen from '../src/screens/register_screen';
import ProfileScreen from '../src/screens/ProfileScreen';
import MapComponent from '../src/screens/TrackingMaps';
import LoginScreen from '../src/screens/login_screen';
import SplashAppScreen from '../src/screens/SplashScreen';
import SplashScreen from '../src/screens/splash_screen';
import TrackingMapsScreen from '../src/screens/tracking_maps';
import UpcomingTripsScreen from '../src/screens/upcoming_trips';
import EndStartScreen from '../src/screens/endtrip_screen';
import TripStartScreen from '../src/screens/tripstart_screen';
import OTPSubmitScreen from '../src/screens/submitOtpScreen';
import UserHomeScreen from '../src/screens/UserHomeScreen';
import TripHistoryScreen from '../src/screens/TripHistory';
import RegisterDriverTwoScreen from '../src/screens/registerDrivertwo';
import UserEditProfileScreen from '../src/screens/userEditProfile';
// driver
import DriverLoginScreen from '../src/screens/driverLogin';
import DriverProfileScreen from '../src/screens/driverProfile';
import NotificationScreen from '../src/screens/notificationScreen';
import StartTripSearchingScreen from '../src/screens/SearchStartTripLocation';
import SearchDestinationScreen from '../src/screens/SearchDestination';
import TripCreateScreen from '../src/screens/tripCreateScreen';
// Theme.
const MyTheme = {
    dark: false,
    colors: {
        primary: '#FFE473',
        secondary: '#000000',
        background: 'white',
        card: 'rgb(255, 255, 255)',
        text: '#1F1F39',
        invert_text_color: '#FAFAFA',
        border: 'rgb(199, 199, 204)',
        notification: 'rgb(255, 69, 58)',
    },
};

// Veriable.
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom screen.
function BottomNavigation() {

    return (
        <Tab.Navigator
            shifting={true}
            labeled={true}
            screenOptions={{
                tabBarShowLabel: false,
            }}
            sceneAnimationEnabled={false}
            barStyle={{ backgroundColor: '#eff4fa' }}
            tabBarOptions={{
                activeTintColor: '#20251e',
                inactiveTintColor: '#20251e',
                showLabel: true,
                style: {
                    borderTopColor: '#66666666',
                    backgroundColor: 'eff4fa',
                    elevation: 0,
                },
            }}>
            <Tab.Screen
                name="HomeScreen"
                component={HomeScreen}
                options={{
                    headerShown: false,
                    tabBarLabel: () => { return 'Delivery' },
                    tabBarIcon: ({ size, focused, color }) => {
                        return (
                            <Image
                                style={{ width: focused ? 25 : 25, height: focused ? 25 : 25, tintColor: focused ? 'orange' : 'rgb(116,24,28)', resizeMode: 'contain' }}
                                source={require('../src/assets/car.png')}
                            />
                        );
                    },
                }}
            />
            <Tab.Screen
                name="SplashScreen"
                component={SplashScreen}
                options={{
                    headerShown: false,
                    tabBarLabel: () => { return 'Ekart' },
                    tabBarIcon: ({ size, focused, color }) => {
                        return (
                            <Image
                                style={{ width: 25, height: 25, tintColor: focused ? 'orange' : 'rgb(116,24,28)', resizeMode: 'contain' }}
                                source={require('../src/assets/car.png')}
                            />
                        );
                    },
                }}
            />
            <Tab.Screen
                name="ProfileScreen"
                component={ProfileScreen}
                options={{
                    headerShown: false,
                    tabBarLabel: () => { return 'Ekart' },
                    tabBarIcon: ({ size, focused, color }) => {
                        return (
                            <Image
                                style={{ width: 25, height: 25, tintColor: focused ? 'orange' : 'rgb(116,24,28)', resizeMode: 'contain' }}
                                source={require('../src/assets/car.png')}
                            />
                        );
                    },
                }}
            />

        </Tab.Navigator>
    );
}

function UserBottomNavigation() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarShowLabel: false,
                tabBarActiveTintColor: '#58ceb2',
                tabBarInactiveTintColor: 'gray',
                //Tab bar styles can be added here
                tabBarStyle: {
                    // paddingVertical: 5,
                    // borderRadius: 15,
                    // backgroundColor: 'white',
                    // position: 'absolute',
                    // height: 55,
                    // bottom: 35,
                    // left: 35,
                    // right: 35,
                    // zIndex: 9999,
                },
                tabBarLabelStyle: {
                    paddingBottom: 3,
                },
            })}
            shifting={true}
            labeled={true}
            sceneAnimationEnabled={false}
            barStyle={{
                // backgroundColor: '#000000',
            }}
            //Tab bar styles can be added here
            tabBarOptions={{
                style: {
                    // backgroundColor: 'yellow',
                }
            }}
            tabBarStyle={{
                // paddingVertical: 5,
                // borderRadius: 15,
                // backgroundColor: 'white',
                // position: 'absolute',
                // height: 50,
            }}
        >
            <Tab.Screen
                name="UserHomeScreen"
                component={UserHomeScreen}
                options={{
                    headerShown: false,
                    tabBarLabel: () => { return 'Delivery' },
                    tabBarIcon: ({ size, focused, color }) => {
                        return (
                            <View style={{ alignItems: 'center' }}>
                                <Image
                                    style={{ width: focused ? 25 : 20, height: focused ? 25 : 20, tintColor: focused ? 'orange' : 'rgb(116,24,28)', resizeMode: 'contain', }}
                                    source={require('../src/assets/home.png')}
                                />
                                <Text style={{ alignItems: 'center', color: '#000', fontSize: 12, fontWeight: '700' }}>Home</Text>
                            </View>
                        );
                    },
                }}
            />
            <Tab.Screen
                name="ProfileScreen"
                component={ProfileScreen}
                options={{
                    headerShown: false,
                    tabBarLabel: () => { return 'Ekart' },
                    tabBarIcon: ({ size, focused, color }) => {
                        return (
                            <View style={{ alignItems: 'center' }}>
                                <Image
                                    style={{ width: focused ? 25 : 20, height: focused ? 25 : 20, tintColor: focused ? 'orange' : 'rgb(116,24,28)', resizeMode: 'contain', }}
                                    source={require('../src/assets/profile_icon.png')}
                                />
                                <Text style={{ alignItems: 'center', color: '#000', fontSize: 12, fontWeight: '700' }}>Profile</Text>
                            </View>
                        );
                    },
                }}
            />
        </Tab.Navigator>
    );
}

// Stack screen.
function StackNavigation(initialRouts) {

    console.log('StackNavigation', 'init_routes --> ' + initialRouts?.initialRouts)
    const routeNameRef = React.useRef();
    const navigationRef = React.useRef();

    let addItem = item => {
        database().ref('/navigation').push({
            name: item
        });
    };

    // SplashAppScreen
    return (
        <NavigationContainer
            ref={navigationRef}
            onReady={() => {
                routeNameRef.current = navigationRef.current.getCurrentRoute().name;
            }}
            theme={MyTheme}
            onStateChange={async () => {
                const previousRouteName = routeNameRef.current;
                const currentRouteName = navigationRef.current.getCurrentRoute().name;
                if (previousRouteName !== currentRouteName) {
                    await analytics().logScreenView({
                        screen_name: currentRouteName,
                        screen_class: currentRouteName,
                    });
                }
                routeNameRef.current = currentRouteName;
                addItem(currentRouteName);
            }} >
            <Stack.Navigator
                initialRouteName={initialRouts?.initialRouts}
                screenOptions={{ headerShown: false, }}>
                <Stack.Screen
                    name="HomeScreen"
                    component={HomeScreen}
                    options={{
                        title: 'HomeScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="SplashAppScreen"
                    component={SplashAppScreen}
                    options={{
                        title: 'SplashAppScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="UserBottomNavigation"
                    component={UserBottomNavigation}
                    options={{
                        title: 'UserBottomNavigation',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="MapScreens"
                    component={MapScreens}
                    options={{
                        title: 'MapScreens',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="UpcomingTripsScreen"
                    component={UpcomingTripsScreen}
                    options={{
                        title: 'UpcomingTripsScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="TrackingMapsScreen"
                    component={TrackingMapsScreen}
                    options={{
                        title: 'TrackingMapsScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="LoginScreen"
                    component={LoginScreen}
                    options={{
                        title: 'TrackingMapsScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="OTPSubmitScreen"
                    component={OTPSubmitScreen}
                    options={{
                        title: 'OTPSubmitScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="RegisterScreen"
                    component={RegisterScreen}
                    options={{
                        title: 'RegisterScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="HomeBottomNavigation"
                    component={BottomNavigation}
                    options={{
                        title: 'BottomNavigation',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="TripStartScreen"
                    component={TripStartScreen}
                    options={{
                        title: 'TripStartScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="EndStartScreen"
                    component={EndStartScreen}
                    options={{
                        title: 'EndStartScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="MapComponent"
                    component={MapComponent}
                    options={{
                        title: 'MapComponent',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="TripHistoryScreen"
                    component={TripHistoryScreen}
                    options={{
                        title: 'TripHistoryScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="RegisterDriverTwoScreen"
                    component={RegisterDriverTwoScreen}
                    options={{
                        title: 'RegisterDriverTwoScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="DriverLoginScreen"
                    component={DriverLoginScreen}
                    options={{
                        title: 'DriverLoginScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="DriverProfileScreen"
                    component={DriverProfileScreen}
                    options={{
                        title: 'DriverProfileScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="UserEditProfileScreen"
                    component={UserEditProfileScreen}
                    options={{
                        title: 'UserEditProfileScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="NotificationScreen"
                    component={NotificationScreen}
                    options={{
                        title: 'NotificationScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="StartTripSearchingScreen"
                    component={StartTripSearchingScreen}
                    options={{
                        title: 'StartTripSearchingScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="SearchDestinationScreen"
                    component={SearchDestinationScreen}
                    options={{
                        title: 'SearchDestinationScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
                <Stack.Screen
                    name="TripCreateScreen"
                    component={TripCreateScreen}
                    options={{
                        title: 'TripCreateScreen',
                        headerStyle: { backgroundColor: 'black', },
                        headerTintColor: '#fff',
                        headerTitleStyle: { fontWeight: 'bold', },
                    }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default StackNavigation; // TripCreateScreen