/**
 * Sample React Native App
 * https://github.com/facebook/react-native 
 * https://www.google.com/maps/dir/Noida,+Uttar+Pradesh/Gurugram,+Haryana/@28.5563204,77.0362189,11z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x390ce5a43173357b:0x37ffce30c87cc03f!2m2!1d77.3910265!2d28.5355161!1m5!1m1!1s0x390d19d582e38859:0x2cf5fe8e5c64b1e!2m2!1d77.0266383!2d28.4594965?entry=ttu
 * @format
 */

import React from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    TextInput,
    View,
    FlatList,
    Text,
    Image,
    Dimensions,
    ImageBackground,
    AppState,
    Alert,
} from 'react-native';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import globle from '../../../common/env';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import Dialog, { SlideAnimation, DialogTitle, DialogContent, DialogFooter, DialogButton, } from 'react-native-popup-dialog';
import Geolocation from 'react-native-geolocation-service';
import Spinner from 'react-native-loading-spinner-overlay';
import ToggleSwitch from 'toggle-switch-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import database from '@react-native-firebase/database';
import BackgroundService from 'react-native-background-actions';
import messaging from '@react-native-firebase/messaging';
import RNLocation from 'react-native-location';
import { getPreciseDistance } from 'geolib';


RNLocation.configure({
    distanceFilter: 10, // Meters
    desiredAccuracy: {
        ios: 'best',
        android: 'balancedPowerAccuracy',
    },
    // Android only
    androidProvider: 'auto',
    interval: 5000, // Milliseconds
    fastestInterval: 10000, // Milliseconds
    maxWaitTime: 5000, // Milliseconds
    // iOS Only
    activityType: 'other',
    allowsBackgroundLocationUpdates: true,
    headingFilter: 1, // Degrees
    headingOrientation: 'portrait',
    pausesLocationUpdatesAutomatically: false,
    showsBackgroundLocationIndicator: false,
});

const veryIntensiveTask = async (taskDataArguments) => {
    // Example of an infinite loop task
    const { delay } = taskDataArguments;
    await new Promise(async (resolve) => {
        for (let i = 0; BackgroundService.isRunning(); i++) {
            console.log(i);
            await sleep(delay);
        }
    });
};

const options = {
    taskName: 'Example',
    taskTitle: 'ExampleTask title',
    taskDesc: 'ExampleTask description',
    taskIcon: {
        name: 'ic_launcher',
        type: 'mipmap',
    },
    color: '#ff00ff',
    linkingURI: 'yourSchemeHere://chat/jane', // See Deep Linking for more info
    parameters: {
        delay: 1000,
    },
};

const propertyData = [{ id: 1 }];

const HomeScreen = () => {

    const navigate = useNavigation();
    let RevertCxtUser = '/users/';
    let MINUTE_MS = 60000;
    let locationSubscription = null;
    let locationTimeout = null;
    const [data, setData] = React.useState([]);
    const reference = database().ref('/users/123');
    const [searchText, setSearchText] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [visible, setVisible] = React.useState(true);
    let [driverData, setDriverData] = React.useState(false);
    const [dutyStatus, setDutyStatus] = React.useState('Off');
    const [appState, setAppState] = React.useState(AppState.currentState);
    const [driver_activated, setDriverActivated] = React.useState(false);
    const [errorMsg, setErrorMessage] = React.useState('');
    const [Destinationstate, setDestinationState] = React.useState({ destinationCords: {} });
    const [location, setLocation] = React.useState({ latitude: 60.1098678, longitude: 24.7385084, });
    const [Pickupstate, setPickupState] = React.useState({ pickupCords: {} });
    const sleep = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));

    // You can do anything in your task such as network requests, timers and so on,
    // as long as it doesn't touch UI. Once your task completes (i.e. the promise is resolved),
    // React Native will go into "paused" mode (unless there are other tasks running,

    // or there is a foreground app).

    useFocusEffect(
        React.useCallback(() => {
            getUpcomingTrip();
            async function fetchData() {
                permissionCheck = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
                if (permissionCheck === RESULTS.GRANTED) {
                    updateUserTokenProfile();
                    startBackGroundServices();
                    getPriceFromWeb();
                    getProfileDriverData();
                    getProfileActiveStatus();
                    updateDriverLocation();
                    setVisible(false);
                } else {
                    setVisible(true);
                }
            }
            fetchData();
        }, []),
    );


    const getUpcomingTrip = async () => {
        const valueX = await AsyncStorage.getItem('@autoDriverGroup');
        let data = JSON.parse(valueX)?.id;
        let url_driverProfile = globle.API_BASE_URL + 'driver-nearest-user';
        console.log(url_driverProfile, data)
        setLoading(true);
        var authOptions = {
            method: 'post',
            url: url_driverProfile,
            data: JSON.stringify({ "driver_id": data }),
            headers: {
                'Content-Type': 'application/json'
            },
            json: true
        };
        axios(authOptions)
            .then((response) => {
                if (response.data.status) {
                    console.log('loggedUsingSubmitMobileIn', response.data?.data);
                    setData(response.data?.data);
                    setLoading(false);
                } else {
                    console.log('loggedUsingSubmitMobileIn', response.data);
                }
            })
            .catch((error) => {
                // alert(error)
                console.log('errors', error);
                setLoading(false);
            });
    }


    // React.useEffect(() => {
    //     async function fetchMyAPI() {
    //         permissionCheck = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    //         if (permissionCheck === RESULTS.GRANTED) {
    //             updateUserTokenProfile();
    //             startBackGroundServices();
    //             getPriceFromWeb();
    //             getProfileDriverData();
    //             getProfileActiveStatus();
    //             updateDriverLocation();
    //             setVisible(false);
    //         } else {
    //             setVisible(true);
    //         }
    //     }
    //     fetchMyAPI();
    // }, [visible])

    React.useEffect(() => {
        Geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ latitude, longitude });
            },
            (error) => {
                console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
    }, []);

    const startBackGroundServices = async () => {
        try {
            console.log('startBackGroundServices')
            await BackgroundService.start(veryIntensiveTask, options);
        } catch (error) {
            console.log(error)
        }
    }

    const getPriceFromWeb = async () => {
        // https://createdinam.in/Parihara/public/api/getPrice
        // Optionally the request above could also be done as
        setLoading(true)
        var authOptions = {
            method: 'GET',
            url: globle.API_BASE_URL + 'getPrice',
            headers: { 'Content-Type': 'application/json' },
            json: true,
        };
        axios(authOptions).then((resp) => {
            console.log(resp.data);
            // Alert.alert(resp.data);
            setLoading(false);
        });
    }

    const handleAppStateChange = (nextAppState) => {
        if (appState.match(/inactive|background/) && nextAppState === 'active') {
            console.log('handleAppStateChange', appState);
            // App is returning to the foreground
            // You can perform any actions or cleanup tasks here
        } else if (appState === 'active' && nextAppState.match(/inactive|background/)) {
            // App is going into the background
            console.log('handleAppStateChange', appState, nextAppState);
            // You can handle background-specific actions here
        }
        setAppState(nextAppState);
    };

    const sendNotification = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer AAAAPtYIrjk:APA91bH08K8usDvoiH-R45u8w-2TPvGQE7up5wR1O63QstD2QdrpSFeukpg9MtUcTTQ19y05M8D7PUK6H2CV4TiuQyL-7MjhfmDhb1ChfcsjqgENIhzYP2VZeahGe6t_R4m1kgzIIP_K");

        var raw = JSON.stringify({
            "to": "dBEJqVryRwS5YKmeFOJsPn:APA91bFhI4X2EeDWZ1LmcnLu47-uUMfokr30WUUSg5ux7q5PSsI5w149e1XDKrVsyPoojCTnax0_DCE9nzLzh2MXVUsKa0mqn7aeyh-QU70pfu64P_amTcMIZmSsDgeYtjNqQ6x6uneq",
            "notification": {
                "title": "Hello Test",
                "body": "Some body",
                "sound": "noti_sound1.wav",
                "android_channel_id": "new_email_arrived_channel"
            },
            "content_available": true,
            "priority": "high"
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch("https://fcm.googleapis.com/fcm/send", requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
    }

    const updateDriverLocation = async () => {
        const valueX = await AsyncStorage.getItem('@autoDriverGroup');
        let data = JSON.parse(valueX);
        console.log(data?.id);
        const driverData = {
            driverData: driverData,
        }
        let reff = '/drivers/' + data?.id;
        database()
            .ref(reff)
            .set({
                profile: data,
                role: 'driver',
                dutyStatus: dutyStatus,
            })
            .then(() => console.log('Data set.'));
    }

    const getProfileActiveStatus = async () => {
        const valueX = await AsyncStorage.getItem('@autoDriverGroup');
        let data = JSON.parse(valueX);
        let url_driverProfile = globle.API_BASE_URL + 'driver-check-active?driver_id=' + data?.id;
        setLoading(true);
        var authOptions = {
            method: 'GET',
            url: url_driverProfile,
            headers: { 'Content-Type': 'application/json' },
            json: true,
        };
        axios(authOptions)
            .then((response) => {
                if (response.data.driver_activated) {
                    setLoading(false); // driver_activated
                    setDriverActivated(response.data?.driver_activated);
                    setErrorMessage(response.data?.message);
                } else {
                    setLoading(false);
                    setDriverActivated(response.data?.driver_activated);
                    setErrorMessage(response.data?.message);
                }
            })
            .catch((error) => {
                console.log(error);
            });

    }

    const getProfileDriverData = async () => {
        const valueX = await AsyncStorage.getItem('@autoDriverGroup');
        let data = JSON.parse(valueX);
        let url_driverProfile = globle.API_BASE_URL + 'driver-profile?driver_id=' + data?.id;
        setLoading(true);
        var authOptions = {
            method: 'GET',
            url: url_driverProfile,
            headers: { 'Content-Type': 'application/json' },
            json: true,
        };
        axios(authOptions)
            .then((response) => {
                if (response.data.status) {
                    console.log('getProfileDriverData', response.data?.driver?.duty_status);
                    setLoading(false);
                    setDutyStatus(response.data.driver?.duty_status)
                    setDriverData(response.data?.driver);
                } else {
                    setLoading(false);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    React.useEffect(() => {
        if (dutyStatus === 'On') {
            updateDriverLocation();
        } else {
            updateDriverLocation();
        }
    }, [dutyStatus]);

    const updateUserTokenProfile = async () => {
        const valueX = await AsyncStorage.getItem('@autoDriverGroup');
        const fcmToken = await messaging().getToken();
        let data = JSON.parse(valueX)?.id;
        var formdata = new FormData();
        formdata.append('driver_id', data);
        formdata.append('token', fcmToken);
        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow',
            headers: {
                'Authorization': 'Bearer ' + data,
            }
        };
        console.log('updateDriverTokenProfilex', JSON.stringify(requestOptions))
        fetch(globle.API_BASE_URL + 'update-driver-fcm', requestOptions)
            .then(response => response.json())
            .then(result => {
                if (result.status) {
                    console.log('updateDriverTokenProfile', result?.message);
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

    const onPressHandler = () => {
        let tripDetails = {
            pickup: Pickupstate,
            drop: Destinationstate
        }
        console.log('addEventListener', tripDetails);
        navigate.navigate('MapScreens', { location: tripDetails });
    };

    const fetchPickupCords = (lat, lng, zipCode, cityText) => {
        console.log("zip code==>>>", zipCode)
        console.log('city texts', cityText)
        setDestinationState({
            ...Destinationstate,
            destinationCords: {
                latitude: lat,
                longitude: lng
            }
        })
    }

    const jobOnnOff = (status) => {

    }

    const fetchDestinationCords = (lat, lng, zipCode, cityText) => {
        console.log("zip code==>>>", zipCode)
        console.log('city texts', cityText)
        setPickupState({
            ...Pickupstate,
            pickupCords: {
                latitude: lat,
                longitude: lng,
            }
        });
    }

    const handleLocationSelect = (data, details) => {
        // Extract the necessary information from the selected location
        const { lat, lng } = details.geometry.location;
        const formattedAddress = details.formatted_address;
        console.log('Selected Location:', formattedAddress);
        console.log('Latitude:', lat);
        console.log('Longitude:', lng);
        // Perform actions with the selected location
    };

    const repeatLocationPermission = () => {
        Toast.show({
            type: 'error',
            text1: 'Location Permission',
            text2: "Location perrmission can't denied",
        });
    }

    const handleLocationPermission = async () => {
        console.warn('Location perrmission handleLocationPermission.1');
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
            console.warn('Location perrmission handleLocationPermission.2');
            permissionCheck = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
            if (permissionCheck === RESULTS.DENIED) {
                const permissionRequest = await request(
                    PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
                );
                if (permissionRequest === RESULTS.GRANTED) {
                    setVisible(false)
                } else {
                    console.warn('Location perrmission denied.');
                }
            } else if (permissionCheck === RESULTS.GRANTED) {
                setVisible(false)
                console.warn('Location perrmission denied.xx');
            }
        }
    };

    const showSuccessToast = (msg) => {
        navigate.navigate('DriverProfileScreen');
    }

    const statusOnOFF = (msg) => {
        Toast.show({
            type: 'success',
            text1: 'Duty Status Changed!',
            text2: msg,
        });
    }

    const handleSearch = (text) => {
        setSearchText(text);
    }

    const getDistance = async (f_latitude, f_longitude, t_latitude, t_longitude) => {
        console.log('getDistance_F', f_latitude, f_longitude);
        console.log('getDistance_T', t_latitude, t_longitude);
        let disct = getPreciseDistance(
            { latitude: f_latitude, longitude: f_longitude },
            { latitude: t_latitude, longitude: t_longitude }
        );
        console.log(disct);
    }

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            {/* <Image source={{ uri: item.image }} style={styles.image} /> */}
            <View style={styles.cardFooter}>
                <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('../../assets/passenger.png')} />
                <Text style={styles.beds}>{item.name}</Text>
                <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('../../assets/time_icon.png')} />
                <Text style={styles.baths}>0:45Min</Text>
                <Image style={{ width: 20, height: 20, resizeMode: 'contain', tintColor: '#000' }} source={require('../../assets/trip.png')} />
                <Text style={styles.parking}>{parseFloat(item?.distance).toFixed(3)}</Text>
            </View>
            <View style={styles.cardBody}>
                <Text style={styles.price}>{item?.from_address} To {item?.to_address}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image style={{ width: 17, height: 17, resizeMode: 'contain', tintColor: '#000' }} source={require('../../assets/clock.png')} />
                    <Text style={[styles.address, { verticalAlign: 'center', marginTop: 2 }]}> 0:45 min</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image style={{ width: 20, height: 20, resizeMode: 'contain', tintColor: '#000' }} source={require('../../assets/routes.png')} />
                    <Text style={[styles.address, { verticalAlign: 'center', marginTop: 2 }]}> {parseFloat(item?.distance).toFixed(3)} km</Text>
                </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 20, paddingRight: 20, paddingBottom: 20 }}>
                <TouchableOpacity style={{ flex: 1, padding: 10, backgroundColor: '#22A699', elevation: 5, borderRadius: 60, marginRight: 15 }}>
                    <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => getDistance(item?.from_lat, item?.from_long, item?.to_lat, item?.to_long)} style={{ flex: 1, padding: 10, backgroundColor: '#F24C3D', elevation: 5, borderRadius: 60 }}>
                    <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>Reject</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const dutyOnOff = async (status) => {
        const valueX = await AsyncStorage.getItem('@autoDriverGroup');
        let data = JSON.parse(valueX);
        let url_driverProfile = globle.API_BASE_URL + 'duty-on-off';
        setLoading(true);
        var authOptions = {
            method: 'POST',
            url: url_driverProfile,
            data: JSON.stringify({ "status": status === true ? 'On' : 'Off', 'driver_id': data?.id }),
            headers: { 'Content-Type': 'application/json' },
            json: true,
        };
        axios(authOptions)
            .then((response) => {
                if (response.data.message === 'Duty On Successfully.') {
                    setLoading(false);
                    setDutyStatus('On');
                    setVisible(status);
                    statusOnOFF(response.data.message);
                } else {
                    setDutyStatus('Off');
                    statusOnOFF(response.data.message);
                    setErrorMessage(response.data?.message);
                    setVisible(!status);
                    setLoading(false);
                }
            })
            .catch((error) => {
                setLoading(false);
                console.log(error);
            });
    }

    // const filteredData = propertyData.filter((item) => {
    //     return item.address.toLowerCase().includes(searchText.toLowerCase());
    // });

    return (
        <View style={{ flex: 1, marginTop: 25, backgroundColor: '#000000' }}>
            <Spinner
                visible={loading}
                textContent={'Loading...'}
                textStyle={{ color: 'black', fontSize: 12 }}
            />
            <View style={{ padding: 0, backgroundColor: '#000000', height: Dimensions.get('screen').height }}>
                <ImageBackground
                    source={require('../../assets/logo_main.gif')}
                    style={{ height: 300, marginLeft: 0, top: -15, paddingLeft: 0, paddingTop: 40 }}>
                    <View style={{ position: 'absolute', top: 40, left: 10 }}>
                        <Text style={{ color: '#fff', left: 10 }}>{driverData?.name}</Text>
                        <ToggleSwitch
                            isOn={dutyStatus === 'On' ? true : false}
                            onColor="#22A699"
                            offColor="#F24C3D"
                            label={visible === true ? 'Duty On' : 'Duty Off'}
                            onPress={() => setVisible(!visible)}
                            labelStyle={{ color: "white", fontWeight: "900" }}
                            size='small'
                            onToggle={isOn => dutyOnOff(isOn)}
                        />
                    </View>
                    <TouchableOpacity
                        onPress={() => showSuccessToast('Coming soon!')}
                        style={{ position: 'absolute', right: 20, top: 40 }} >
                        <Image
                            style={{ width: 100, height: 100, resizeMode: 'contain', backgroundColor: 'white', borderRadius: 200 }}
                            source={{ uri: globle.IMAGE_BASE_URL + driverData?.drv_image }} />
                    </TouchableOpacity>
                </ImageBackground>
                <View
                    style={{ flex: 1, borderTopLeftRadius: 40, borderTopRightRadius: 40, marginTop: -50, padding: 0, backgroundColor: '#F1F6F9' }}
                    contentContainerStyle={{ padding: 5, zIndex: 9999 }}>
                    <View style={{}}>
                        <Dialog
                            visible={!driver_activated}>
                            <DialogContent>
                                <View style={{ backgroundColor: '#ffffff', margin: 40, alignItems: 'center' }}>
                                    <Image style={{ height: 120, width: 120, resizeMode: 'contain', alignItems: 'center' }} source={require('../../assets/under_review.jpeg')} />
                                </View>
                                <Text style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: 10 }}>{errorMsg}</Text>
                                <TouchableOpacity onPress={() => getProfileActiveStatus()} style={{ alignItems: 'center' }}>
                                    <Image style={{ height: 20, width: 20, resizeMode: 'contain' }} source={require('../../assets/icons_refresh.png')} />
                                </TouchableOpacity>
                            </DialogContent>
                        </Dialog>
                    </View>
                    <View style={[styles.searchInputContainer, { paddingTop: 0, marginTop: 20 }]}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search trips..."
                            onChangeText={handleSearch}
                            value={searchText}
                        />
                        <TouchableOpacity style={{ position: 'absolute', right: 35, top: 12 }}>
                            <Image style={{ width: 16, height: 16, resizeMode: 'contain' }} source={require('../../assets/search_icon.png')} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ borderBottomWidth: 0, borderColor: 'grey', marginLeft: 24, marginRight: 24 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 10, color: '#b4b4b4' }}>Upcoming Trip Request</Text>
                    </View>
                    {propertyData.length > 0 ?
                        <FlatList
                            contentContainerStyle={styles.propertyListContainer}
                            data={data}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id}
                        />
                        :
                        <View style={{ flex: 1, alignItems: 'center' }}>
                            <Image style={{ width: 20, height: 20, resizeMode: 'contain', }} source={require('../../assets/search_result_not_found.png')} />
                            <Text style={{ fontWeight: 'bold', fontSize: 10, color: '#000' }}>No Upcoming Trip</Text>
                        </View>}
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
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        backgroundColor: 'black'
    },
    searchInputContainer: {
        paddingHorizontal: 20,
        borderBottomColor: 'grey',
    },
    searchInput: {
        height: 40,
        borderWidth: 1,
        borderColor: '#dcdcdc',
        backgroundColor: '#fff',
        borderRadius: 50,
        padding: 10,
        marginBottom: 10,
        fontSize: 11,
        paddingLeft: 20,
    },
    propertyListContainer: {
        paddingHorizontal: 20,
        height: Dimensions.get('screen').height / 2,
        zIndex: 999999
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 5,
        marginTop: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    image: {
        height: 150,
        marginBottom: 10,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
    },
    cardBody: {
        marginBottom: 10,
        padding: 10,
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 5
    },
    address: {
        fontSize: 16,
        marginBottom: 5
    },
    squareMeters: {
        fontSize: 14,
        marginBottom: 5,
        color: '#666'
    },
    cardFooter: {
        padding: 10,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#dcdcdc',
        justifyContent: 'space-between',
    },
    beds: {
        fontSize: 14,
        color: '#ffa500',
        fontWeight: 'bold'
    },
    baths: {
        fontSize: 14,
        color: '#ffa500',
        fontWeight: 'bold'
    },
    parking: {
        fontSize: 14,
        color: '#ffa500',
        fontWeight: 'bold'
    }
});

export default HomeScreen;