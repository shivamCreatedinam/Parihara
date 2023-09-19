/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * https://www.google.com/maps/dir/Noida,+Uttar+Pradesh/Gurugram,+Haryana/@28.5563204,77.0362189,11z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x390ce5a43173357b:0x37ffce30c87cc03f!2m2!1d77.3910265!2d28.5355161!1m5!1m1!1s0x390d19d582e38859:0x2cf5fe8e5c64b1e!2m2!1d77.0266383!2d28.4594965?entry=ttu
 * @format
 */

import React, { useEffect, useState, useRef } from 'react';
import {
    ImageBackground,
    View,
    Text,
    Platform,
    Dimensions,
    TouchableOpacity,
    FlatList,

} from 'react-native';
import axios from 'axios';
import globle from '../../../common/env';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Dialog, { SlideAnimation, DialogTitle, DialogContent, DialogFooter, DialogButton, } from 'react-native-popup-dialog';
import { showMessage } from "react-native-flash-message";
import notifee, { AndroidImportance, AndroidBadgeIconType, AndroidVisibility, AndroidColor, AndroidCategory } from '@notifee/react-native';
import Global from '../../../common/env';
import Toast from 'react-native-toast-message';
import { Image } from 'react-native-elements';

const UserHomeScreen = () => {

    const permModal = React.useRef();
    const navigate = useNavigation();
    let permissionCheck = '';
    const [visible, setVisible] = React.useState(false);
    const [historyData, setHistoryData] = React.useState([]);
    const [location, setLocation] = React.useState({ latitude: 60.1098678, longitude: 24.7385084, });

    const handleLocationPermission = async () => {
        console.warn('Location perrmission handleLocationPermission.');
        if (Platform.OS === 'ios') {
            permissionCheck = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
            if (permissionCheck === RESULTS.DENIED) {
                const permissionRequest = await request(
                    PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
                );
                permissionRequest === RESULTS.GRANTED ?
                    console.warn('Location permission granted.') :
                    console.warn('Location perrmission denied.');
            }
        }

        if (Platform.OS === 'android') {
            console.warn('Location perrmission handleLocationPermission.');
            permissionCheck = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
            if (permissionCheck === RESULTS.DENIED) {
                const permissionRequest = await request(
                    PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
                );
                permissionRequest === RESULTS.GRANTED
                    ? setVisible(false)
                    : console.warn('Location perrmission denied.');
            }
        }
    };

    useFocusEffect(
        React.useCallback(async () => {
            permissionCheck = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
            console.warn('handleLocationPermission.', permissionCheck);
            updateUserTokenProfile();
            if (permissionCheck === RESULTS.GRANTED) {
                setVisible(false);
            } else {
                setVisible(true);
            }
        }, [visible])
    );

    // const requestLocationPermission = async () => {
    //     try {
    //         const granted = await request(
    //             Platform.select({ android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION, ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE, }),
    //             {
    //                 title: 'Parihara',
    //                 message: 'Parihara provide you with the best cab booking experience, we need your location. Granting location permission allows us to show you nearby drivers, estimate accurate arrival times, and ensure smooth navigation during your ride. Your safety is our top priority, and knowing your location helps us connect you with the nearest drivers',
    //                 // buttonNeutral: 'Ask Me Later',
    //                 buttonNegative: 'Cancel',
    //                 buttonPositive: 'OK',
    //             },
    //         );
    //         if (granted === 'granted') {
    //             console.log('You can use Geolocation');
    //             return true;
    //         } else {
    //             console.log('You cannot use Geolocation');
    //             return false;
    //         }
    //     } catch (err) {
    //         return false;
    //     }
    // };


    // const getRequest = async () => {
    //     await request(
    //         Platform.select({ android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION, ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE, }),
    //         {
    //             title: 'Parihara',
    //             message: 'Parihara provide you with the best cab booking experience, we need your location. Granting location permission allows us to show you nearby drivers, estimate accurate arrival times, and ensure smooth navigation during your ride. Your safety is our top priority, and knowing your location helps us connect you with the nearest drivers',
    //             // buttonNeutral: 'Ask Me Later',
    //             buttonNegative: 'Cancel',
    //             buttonPositive: 'OK',
    //         },
    //     );
    // }

    // useEffect(() => {
    //     handleLocationPermission();
    // }, []);

    // const locationDriverPermission = () => {
    //     Geolocation.getCurrentPosition(
    //         (position) => {
    //             const { latitude, longitude } = position.coords;
    //             setLocation({ latitude, longitude });
    //         },
    //         (error) => {
    //             console.log(error.code, error.message);
    //         },
    //         { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    //     );
    // }

    const startTrip = () => {
        // StartTripSearchingScreen / TripStartScreen
        navigate.navigate('StartTripSearchingScreen');
    }

    const updateUserTokenProfile = async () => {
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        const fcmToken = await messaging().getToken();
        let data = JSON.parse(valueX)?.token;
        var formdata = new FormData();
        formdata.append('token', fcmToken);
        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow',
            headers: {
                'Authorization': 'Bearer ' + data,
            }
        };
        console.log('updateUserTokenProfile', JSON.stringify(requestOptions))
        fetch(Global.API_BASE_URL + 'update-user-fcm', requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.status) {
                    console.log('updateUserTokenProfilex', result?.message);
                    Toast.show({
                        type: 'success',
                        text1: 'Status Update Successfully',
                        text2: 'Update Successfully -> ' + fcmToken,
                    });

                } else {
                    Toast.show({
                        type: 'success',
                        text1: 'Something went wrong!',
                        text2: result?.message,
                    });
                }
            })
            .catch((error) => {
                console.log('error', error);
                Toast.show({
                    type: 'success',
                    text1: 'Something went wrong!',
                    text2: error,
                });
                setLoading(false)
            });
    }

    const renderHistoryView = () => {
        return <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: 10, borderBottomColor: 'grey', borderBottomWidth: 0.5, }}>
            <View style={{ width: 60, height: 60, backgroundColor: '#F5F5F5', borderRadius: 150, marginRight: 10 }}>
                <Image style={{ width: 25, height: 25, alignSelf: 'center', marginTop: 20, marginLeft: 17, elevation: 5 }} source={require('../../assets/map_pointer.png')} />
            </View>
            <View>
                <Text style={{ fontWeight: 'bold' }}>Pragati Maidan</Text>
                <Text style={{}} >Pragati Maidan, New Delhi, Delhi 110001</Text>
            </View>
        </TouchableOpacity>
    }

    const downloadHistoryPayment = () => {
        Toast.show({
            type: 'success',
            text1: 'Payment History Download!',
            text2: 'Payment History Send to your registerd Email!',
        });
    }

    const AddWalletPayment = () => {
        Toast.show({
            type: 'success',
            text1: 'Comming Soon',
            text2: 'Wallet Configuration Pending',
        });
    }

    const repeatLocationPermission = () => {
        showMessage({
            message: "Location Permission",
            description: "Location perrmission can't denied",
            type: "success",
        });
        Toast.show({
            type: 'error',
            text1: 'Location Permission',
            text2: "Location perrmission can't denied",
        });
    }

    const showAllTripData = async () => {
        const autoUserGroup = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(autoUserGroup)?.token;
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: globle.API_BASE_URL + 'travel-request',
            data: {
                'from_address': 'new delhi lal kila',
                'to_address': 'faridaab',
                'from_state': 1,
                'from_city': 1,
                'to_state': 1,
                'to_city': 1,
                'to_pincode': 110084,
                'from_pincode': 110009,
                'to_lat': 232.3453,
                'to_long': 1312.23432,
                'from_lat': 21.344,
                'from_long': 22.4564,
                'price': 270,
                'distance': 12,
            },
            headers: {
                'Authorization': 'Bearer ' + data
            }
        };
        console.log('purchasePackage', config);
        axios.request(config)
            .then((response) => {
                console.log('purchasePackage', response.data);
                if (response.data?.error) {
                    Toast.show({
                        type: 'success',
                        text1: 'Something went wrong!',
                        text2: response.data?.error,
                    });
                } else {
                    Toast.show({
                        type: 'success',
                        text1: 'Buying Package Successfully',
                        text2: response.data?.message,
                    });
                }
                console.log('purchasePackage', JSON.stringify(response.data));
            })
            .catch((error) => {
                console.log(error);
            });
    }

    async function onDisplayNotification() {
        // Request permissions (required for iOS)
        if (Platform.OS === 'ios') {
            await notifee.requestPermission()
        }

        // Create a channel (required for Android)
        const channelId = await notifee.createChannel({
            id: 'default1',
            name: 'Default Channel1',
            sound: 'default',
            importance: AndroidImportance.HIGH,
            badge: true,
            vibration: true,
            vibrationPattern: [300, 700],
            lights: true,
            lightColor: AndroidColor.RED,
        });

        // Display a notification
        // Display a notification
        await notifee.displayNotification({
            title: 'Notification Title',
            body: 'Main body content of the notification',
            android: {
                channelId,
                smallIcon: 'ic_small_icon', // optional, defaults to 'ic_launcher'.
                color: '#9c27b0',
                category: AndroidCategory.CALL,
                badgeIconType: AndroidBadgeIconType.SMALL,
                importance: AndroidImportance.HIGH,
                visibility: AndroidVisibility.SECRET,
                vibrationPattern: [300, 700],
                ongoing: true,
                lights: [AndroidColor.RED, 300, 600],
                // pressAction is needed if you want the notification to open the app when pressed
                pressAction: {
                    id: 'default',
                },
            },
        });
    }

    return (
        <View style={{ flex: 1, marginTop: 25, backgroundColor: '#000' }}>
            <View style={{ padding: 0, backgroundColor: '#000', height: Dimensions.get('screen').height }}>
                <ImageBackground source={require('../../assets/logo_main.gif')} style={{ height: 300, marginLeft: 0, top: -15, paddingLeft: 30, paddingTop: 40 }}>
                    <Text style={{ marginLeft: 21, fontSize: 13, color: '#b3b3b3', marginBottom: -20 }}>Feels Like</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image style={{ width: 80, height: 80, resizeMode: 'contain', tintColor: 'white' }} source={require('../../assets/weather_icon.png')} />
                        <Text style={{ fontSize: 24, marginLeft: -15, color: 'white' }}>24°c</Text>
                    </View>
                    <TouchableOpacity style={{ width: 40, height: 40, borderRadius: 150, backgroundColor: 'white', alignItems: 'center', elevation: 5, position: 'absolute', right: 20, top: 50 }}>
                        <Image style={{ width: 20, height: 20, resizeMode: 'contain', marginTop: 10 }} source={require('../../assets/bell_notification.png')} />
                    </TouchableOpacity>
                </ImageBackground>
                <View
                    contentContainerStyle={{ padding: 5, zIndex: 9999 }}
                    style={{ flex: 1, borderTopLeftRadius: 40, borderTopRightRadius: 40, marginTop: -50, padding: 20, backgroundColor: '#F1F6F9' }}>
                    {/* <View style={{ borderRadius: 10, borderWidth: 1, borderColor: '#F1F6F9', backgroundColor: '#F1F6F9', elevation: 6, flexDirection: 'row', alignItems: 'center', padding: 20 }}>
                        <View style={{ flex: 1 }}> onPress={() => navigate.navigate('NotificationScreen')} 
                            <View>
                                <Text style={{}}>Cab Pay</Text>
                            </View>
                            <View>
                                <Text style={{}}>Wallet Balance</Text>
                                <Text style={{ fontWeight: 'bold', color: '#000' }}>₹ 9,600.00</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity onPress={() => AddWalletPayment()} style={{ width: 30, height: 30, borderRadius: 150, backgroundColor: 'black', alignItems: 'center', marginRight: 20 }}>
                                <Image style={{ width: 20, height: 20, resizeMode: 'contain', marginTop: 5, tintColor: 'white' }} source={require('../../assets/icons_plus.png')} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => downloadHistoryPayment()} style={{ width: 30, height: 30, borderRadius: 150, backgroundColor: 'black', alignItems: 'center' }}>
                                <Image style={{ width: 20, height: 20, resizeMode: 'contain', marginTop: 5, tintColor: 'white' }} source={require('../../assets/download.png')} />
                            </TouchableOpacity>
                        </View>
                    </View> */}
                    <TouchableOpacity onPress={() => startTrip()} style={{ marginTop: 5, width: '100%', height: 50 }}>
                        <Text style={{ height: 50, borderRadius: 50, borderWidth: 1, borderColor: '#F1F6F9', paddingLeft: 20, backgroundColor: '#F1F6F9', elevation: 3, paddingTop: 15, fontWeight: 'bold' }}>Where are you going?</Text>
                        <View style={{ position: 'absolute', right: 10, top: 15 }}>
                            <Image style={{ width: 20, height: 20, resizeMode: 'contain', }} source={require('../../assets/next.png')} />
                        </View>
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20, marginBottom: 10 }}>
                        <Text style={{ flex: 1, color: '#000', fontWeight: 'bold', }}>Your last trip</Text>
                        <TouchableOpacity style={{}} onPress={() => onDisplayNotification()}>
                            <Text style={{ fontWeight: 'bold', fontSize: 10, color: '#000' }}>View All</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        {historyData.length > 0 ?
                            <FlatList
                                style={{ height: Dimensions.get('screen').width / 1 }}
                                data={historyData}
                                keyExtractor={(e) => e.id}
                                renderItem={(items) => renderHistoryView(items)}
                            />
                            : <View style={{ alignItems: 'center', marginTop: 20 }}>
                                <Image style={{ width: 200, height: 200, resizeMode: 'cover', }} source={require('../../assets/search_result_not_found.png')} />
                                <Text style={{ fontWeight: 'bold', fontSize: 10, color: '#000' }}>No Trip Found</Text>
                            </View>}
                    </View>
                </View>
            </View>
            <Dialog
                visible={visible}
                dialogAnimation={new SlideAnimation({
                    slideFrom: 'bottom',
                })}
                dialogStyle={{ width: Dimensions.get('screen').width - 60 }}
                dialogTitle={<DialogTitle title="Parihara, Location Permission" />}
                footer={
                    <DialogFooter>
                        <DialogButton
                            text="Cancel"
                            onPress={() => repeatLocationPermission()}
                        />
                        <DialogButton
                            text="Allow"
                            onPress={() => handleLocationPermission()}
                        />
                    </DialogFooter>
                }
            >
                <DialogContent>
                    <View>
                        <View>
                            <View style={{ padding: 20 }}>
                                <Text style={{ fontSize: 16 }}><Text style={{ fontWeight: 'bold' }}>Parihara</Text> collects location data to enable <Text style={{ fontWeight: 'bold' }}> show you nearby drivers</Text>, <Text style={{ fontWeight: 'bold' }}>smooth navigation</Text>, & <Text style={{ fontWeight: 'bold' }}>estimate accurate arrival times</Text> even when the app is closed or not in use.</Text>
                            </View>
                        </View>
                    </View>
                </DialogContent>
            </Dialog>
        </View>
    );
};
// 
export default UserHomeScreen;