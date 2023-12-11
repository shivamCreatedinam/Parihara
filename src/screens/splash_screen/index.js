/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * https://www.google.com/maps/dir/Noida,+Uttar+Pradesh/Gurugram,+Haryana/@28.5563204,77.0362189,11z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x390ce5a43173357b:0x37ffce30c87cc03f!2m2!1d77.3910265!2d28.5355161!1m5!1m1!1s0x390d19d582e38859:0x2cf5fe8e5c64b1e!2m2!1d77.0266383!2d28.4594965?entry=ttu
 * @format
 */


import React from 'react';
import {
    Alert,
    View,
    TouchableOpacity,
    Text,
    Dimensions,
    Image,
    ActivityIndicator,
    Linking,
    Platform,
    TextInput,
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import MapViewDirections from 'react-native-maps-directions';
import BottomSheet from "react-native-gesture-bottom-sheet";
import Toast from 'react-native-toast-message';
import globle from '../../../common/env';
import styles from './styles';
import axios from 'axios';

const { width, height } = Dimensions.get('window');
const LATITUDE_DELTA = 0.012;
const LONGITUDE_DELTA = 0.012;

const NotificationCenterScreen = () => {

    const navigate = useNavigation();
    const routes = useRoute();
    const markerRef = React.useRef();
    const mapRef = React.useRef();
    const bottomSheet = React.useRef();
    const UserbottomSheet = React.useRef();
    const [loader, serLoader] = React.useState(false);
    const [RequestId, setTripRequestId] = React.useState(routes.params?.data?.id);
    const [distance, setDistance] = React.useState(routes.params?.data?.distance);
    const [from_address, setFaddress] = React.useState(routes.params?.data?.from_address);
    const [to_address, setTaddress] = React.useState(routes.params?.data?.to_address);
    const [trip_cost, setTripcost] = React.useState(routes.params?.data?.price);
    const [tripType, setTripType] = React.useState(routes.params?.data?.trip_type);
    let [startPoint, setStartPoint] = React.useState({ latitude: routes.params?.data?.from_lat, longitude: routes.params?.data?.from_long, });
    let [endPoint, setEndPoint] = React.useState({ latitude: routes.params?.data?.to_lat, longitude: routes.params?.data?.to_long, });
    const [marker, setMarker] = React.useState(false);
    const [TripStarted, setTripStarted] = React.useState(false);
    const [isTripStartedStatus, setTripStartedStatus] = React.useState(false);
    const [StartTripOTP, setStartTripOTP] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    useFocusEffect(
        React.useCallback(() => {
            // whatever
            checkActveTripIsAvailable();
            setTimeout(() => {
                // setTimeout
                setLoading(true);
                setMarker(true);
            }, 1000);
        }, [])
    );

    const getAddressFromLatLong = async () => {
        // 

    }

    const BookingReject = () => {
        Alert.alert(
            'Cancel Booking',
            'Are you sure, you want cancel Booking, No longer available.',
            [
                { text: 'Cancel', onPress: () => console.log('cancel') },
                { text: 'OK', onPress: () => checkOrBack() },
            ]
        );
    }

    const checkOrBack = async () => {
        const autoUserGroup = await AsyncStorage.getItem('@autoDriverGroup');
        let data = JSON.parse(autoUserGroup);
        console.log('checkOrBack', JSON.stringify(data));
        navigate.navigate('HomeScreen');
    }

    const BookingAccept = async () => {
        setLoading(false);
        const valueX = await AsyncStorage.getItem('@autoDriverGroup');
        let data = JSON.parse(valueX)?.id;
        Geolocation.getCurrentPosition(info => {
            console.log(info?.coords?.latitude, info?.coords?.longitude);
            var formdata = new FormData();
            formdata.append('driver_id', data);
            formdata.append('request_id', routes.params?.data?.id);
            formdata.append('driver_latitude', info?.coords?.latitude);
            formdata.append('driver_longitude', info?.coords?.longitude);
            var requestOptions = {
                method: 'POST',
                body: formdata,
                redirect: 'follow',
                headers: {
                    'Authorization': 'Bearer ' + data,
                }
            };
            console.log('startTrip', JSON.stringify(requestOptions))
            fetch(globle.API_BASE_URL + 'driver-nearest-user-accept-trip', requestOptions)
                .then(response => response.json())
                .then(result => {
                    console.log('startTrip', result);
                    if (result.status) {
                        console.log('startTrip', result?.message);
                        Toast.show({
                            type: 'success',
                            text1: 'Status Update Successfully',
                            text2: 'Update Successfully',
                        });
                        saveBookingAcceptStatus();

                    } else {
                        Toast.show({
                            type: 'error',
                            text1: 'Something went wrong!',
                            text2: result?.message,
                        });
                        setLoading(true);
                    }
                })
                .catch((error) => {
                    console.log('error', error);
                    Toast.show({
                        type: 'error',
                        text1: 'Something went wrong!',
                        text2: error,
                    });
                    setLoading(true)
                });
        });
    }

    const notifiyUserDriverReached = async () => {
        const valueX = await AsyncStorage.getItem('@autoDriverGroup');
        let data = JSON.parse(valueX)?.id;
        Geolocation.getCurrentPosition(info => {
            var formdata = new FormData();
            formdata.append('request_id', routes.params?.data?.id);
            var requestOptions = {
                method: 'POST',
                body: formdata,
                redirect: 'follow',
                headers: {
                    'Authorization': 'Bearer ' + data,
                }
            };
            console.log('startTrip', JSON.stringify(requestOptions))
            fetch(globle.API_BASE_URL + 'driver-notify-user', requestOptions)
                .then(response => response.json())
                .then(result => {
                    console.log('startTrip', result);
                    if (result.status) {
                        console.log('startTrip', result?.message);
                        Toast.show({
                            type: 'success',
                            text1: 'User Notify Successfully',
                            text2: 'User Notify Successfully',
                        });
                    } else {
                        Toast.show({
                            type: 'error',
                            text1: 'Something went wrong!',
                            text2: result?.message,
                        });
                    }
                })
                .catch((error) => {
                    console.log('error', error);
                    Toast.show({
                        type: 'error',
                        text1: 'Something went wrong!',
                        text2: error,
                    });
                });
        });
    }

    const saveBookingAcceptStatus = async () => {
        let infoTrip_ = JSON.stringify(routes.params);
        AsyncStorage.setItem('@tripDriverAddedKeys', infoTrip_);
        AsyncStorage.setItem('@tripAcceptStatusKeys', 'true');
        console.log('trip_saved');
        setTripStarted(true);
        setLoading(true);
    }

    const FolloweOnGoogleMaps = async () => {
        if (Platform.OS === 'ios') {
            //  Linking.openURL('maps://app?saddr=' + startinPointName + '&daddr=' + endingPointName+'&travelmode=car') &waypoints=' + from_address + to_address
            // startTrip();
            // Linking.openURL('https://www.google.com/maps/dir/?api=1&origin=' + startinPointName + '&destination=' + endingPointName + '&travelmode=driving&waypoints=' + 'Office to Home ')
        }
        if (isTripStartedStatus === true) {
            if (Platform.OS === 'android') {
                // startTrip();
                // https://www.google.com/maps/dir/Noida,+Uttar+Pradesh/GTB+Nagar,+Delhi/@28.607801,77.2154511,12z/
                // Linking.openURL('https://www.google.com/maps/dir/?api=1&origin=' + startPoint + '&destination=' + endPoint + '&travelmode=driving')
                Linking.openURL('http://maps.google.com/maps?daddr=' + endPoint.latitude + ',' + endPoint.longitude).catch(err => console.error('An error occurred', err));;
            }
        } else {
            if (Platform.OS === 'android') {
                // startTrip();
                // https://www.google.com/maps/dir/Noida,+Uttar+Pradesh/GTB+Nagar,+Delhi/@28.607801,77.2154511,12z/
                // Linking.openURL('https://www.google.com/maps/dir/?api=1&origin=' + startPoint + '&destination=' + endPoint + '&travelmode=driving')
                Linking.openURL('http://maps.google.com/maps?daddr=' + startPoint.latitude + ',' + startPoint.longitude).catch(err => console.error('An error occurred', err));;
            }
        }
    }

    const startTripSubmitOTP = async () => {
        const valueX = await AsyncStorage.getItem('@autoDriverGroup');
        let data = JSON.parse(valueX)?.id;
        if (StartTripOTP.length === 4) {
            serLoader(true);
            var authOptions = {
                method: 'post',
                url: globle.API_BASE_URL + 'driver-verify-trip-otp',
                data: JSON.stringify({ "request_id": RequestId, 'otp': StartTripOTP, 'driver_id': data }),
                headers: {
                    'Content-Type': 'application/json'
                },
                json: true
            };
            console.log('startTripSubmitOTP', JSON.stringify(authOptions));
            axios(authOptions)
                .then((response) => {
                    if (response.data.status) {
                        console.log('loggedUsingSubmitMobileIn', response.data);
                        bottomSheet.current.close();
                        saveTripDetails();
                    } else {
                        Toast.show({
                            type: 'error',
                            text1: 'Something went wrong!',
                            text2: response?.data?.message
                        });
                        console.log('errors', response?.data?.message);
                        serLoader(false);
                    }
                })
                .catch((error) => {
                    // alert(error)
                    console.log('errors', error);
                    serLoader(false);
                });
        } else {
            Toast.show({
                type: 'error',
                text1: 'Please Enter 4 Digit OTP',
                text2: 'Invalid OTP, Please Enter Valid OTP!'
            });
        }
    }

    const saveTripDetails = async () => {
        let infoTrip_ = JSON.stringify(routes.params);
        AsyncStorage.setItem('@tripDriverAddedKeys', infoTrip_);
        AsyncStorage.setItem('@tripStartedStatusKeys', 'true');
        console.log('trip_saved');
        Toast.show({
            type: 'success',
            text1: 'Trip Start Successfully',
            text2: 'Your Trip has been started!'
        });
        setTripStartedStatus(true);
        serLoader(false);
    }

    const checkActveTripIsAvailable = async () => {
        const tripStartedStatus = await AsyncStorage.getItem('@tripStartedStatusKeys');
        const tripAcceptStatusKeys = await AsyncStorage.getItem('@tripAcceptStatusKeys');
        console.warn('tripAcceptStatusKeysY', tripAcceptStatusKeys);
        console.warn('tripStartedStatusZ', tripStartedStatus);
        if (tripAcceptStatusKeys === null) {
            setTripStarted(false);
        } else if (tripAcceptStatusKeys === 'true') {
            setTripStarted(true);
            if (tripStartedStatus === 'true') {
                setTripStartedStatus(true);
            } else {
                setTripStartedStatus(false);
            }
        }
    }

    const setTripEnd = async () => {
        const valueX = await AsyncStorage.getItem('@autoDriverGroup');
        let data = JSON.parse(valueX)?.id;
        serLoader(true);
        var authOptions = {
            method: 'post',
            url: globle.API_BASE_URL + 'end-trip',
            data: JSON.stringify({ "request_id": RequestId, 'driver_id': data }),
            headers: {
                'Content-Type': 'application/json'
            },
            json: true
        };
        console.log('setTripEnd', JSON.stringify(authOptions));
        axios(authOptions)
            .then((response) => {
                if (response.data.status) {
                    console.log('setTripEnd', response.data);
                    tripEndEventFinish();
                } else {
                    Toast.show({
                        type: 'error',
                        text1: 'Something went wrong!',
                        text2: response?.data?.message
                    });
                    console.log('errors', response?.data);
                    serLoader(false);
                }
            })
            .catch((error) => {
                // alert(error)
                console.log('errors', error);
                serLoader(false);
            });
    }

    const tripEndEventFinish = async () => {
        const key = '@tripDriverAddedKeys';
        const key_one = '@tripAcceptStatusKeys';
        const key_two = '@tripStartedStatusKeys';
        try {
            await AsyncStorage.removeItem(key);
            await AsyncStorage.removeItem(key_one);
            await AsyncStorage.removeItem(key_two);
            // move to home after finish the trip
            navigate.navigate('HomeScreen');
            return true;
        }
        catch (exception) {
            console.error('tripEndEventFinishX');
            return false;
        }
    }

    return (
        <View style={styles.container}>
            {loading === true ?
                <MapView
                    ref={mapRef}
                    style={{ height: height, width: width }}
                    mapType={MapView.MAP_TYPES.TERRIN}
                    // pitchEnabled={true}  
                    showsIndoors={true}
                    key={globle.GOOGLE_MAPS_APIKEY_V2}
                    showUserLocation
                    followUserLocation
                    minZoomLevel={18}
                    maxZoomLevel={18}
                    showsTraffic={false}
                    showsBuildings={false}
                    showsCompass={false}
                    // showsUserLocation={true}
                    initialRegion={{
                        latitude: parseFloat(startPoint.latitude),
                        longitude: parseFloat(startPoint.longitude),
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                    }}
                // onPress={(event) => onMapPress(event)}
                >
                    <MapViewDirections
                        origin={{ latitude: parseFloat(startPoint.latitude), longitude: parseFloat(startPoint.longitude) }}
                        destination={{ latitude: parseFloat(endPoint.latitude), longitude: parseFloat(endPoint.longitude) }}
                        apikey={globle.GOOGLE_MAPS_APIKEY_V2}
                        mode={'DRIVING'}
                        strokeWidth={6}
                        strokeColor="green"
                        optimizeWaypoints={true}
                        onStart={(params) => {
                            console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
                        }}
                        onReady={result => {
                            // mapRef.current.fitToCoordinates(result.coordinates, {
                            //     edgePadding: {
                            //         right: 30,
                            //         bottom: 300,
                            //         left: 30,
                            //         top: 100,
                            //     },
                            // });
                        }}
                        onError={(errorMessage) => {
                            console.log('GOT_AN_ERROR', JSON.stringify(errorMessage));
                        }}
                    />
                    {marker ? <Marker
                        ref={markerRef}
                        coordinate={{ latitude: parseFloat(startPoint.latitude), longitude: parseFloat(startPoint.longitude) }}
                        title={'title'}
                        description={'description'}
                    >
                        <Image style={{ width: 50, height: 50, resizeMode: 'contain' }} source={require('../../assets/greenMarker.png')} />
                    </Marker> : null}
                </MapView> : <ActivityIndicator style={{ alignItems: 'center', marginTop: width / 2.3 }} size={'large'} color={'red'} />}
            <View style={{ padding: 20, backgroundColor: '#fdfbf2', position: 'absolute', bottom: 30, left: 20, width: width - 40, borderRadius: 10, elevation: 5, display: TripStarted === true ? 'none' : 'flex' }}>
                <View>
                    <Image style={{ height: 50, width: 50, resizeMode: 'contain', alignSelf: 'center', marginBottom: 5 }} source={require('../../assets/auto_icon.png')} />
                    <Text style={{ fontWeight: 'bold', textAlign: 'center', fontSize: 16, textTransform: 'capitalize' }}>{routes.params?.notification?.title}</Text>
                </View>
                <View style={{ flexDirection: 'column', alignItems: 'center', alignSelf: 'center', marginBottom: 15, marginTop: 15 }}>
                    <Text style={{ fontWeight: 'bold', textAlign: 'center', fontSize: 12 }}>{from_address}</Text>
                    <Text style={{ fontWeight: 'bold', margin: 10 }}>To </Text>
                    <Text style={{ fontWeight: 'bold', fontSize: 12 }}>{to_address}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
                    <Text style={{ fontWeight: 'bold' }}>Total Distance </Text>
                    <Text style={{ fontWeight: 'bold' }}>{distance} KMs</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
                    <Text style={{ fontWeight: 'bold' }}>Trip Cost </Text>
                    <Text style={{ fontWeight: 'bold' }}>{trip_cost}/- ₹</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center', borderWidth: 1, padding: 10, marginTop: 15, borderRadius: 5, elevation: 5, backgroundColor: '#fff' }}>
                    <Text style={{ fontWeight: 'bold' }}>Payment Mode: </Text>
                    <Text style={{ fontWeight: 'bold', fontSize: 14, textTransform: 'uppercase' }}>{tripType}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
                    <TouchableOpacity onPress={() => BookingReject()}
                        style={{ flex: 1, marginRight: 2 }}>
                        <Text style={{ textAlign: 'center', padding: 10, backgroundColor: 'orange', color: 'white', fontWeight: 'bold', textTransform: 'uppercase', fontSize: 12, borderRadius: 5 }}>
                            Cancel Booking
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => BookingAccept()}
                        style={{ flex: 1 }}>
                        <Text style={{ textAlign: 'center', padding: 10, backgroundColor: 'green', color: 'white', fontWeight: 'bold', textTransform: 'uppercase', fontSize: 12, borderRadius: 5 }}>
                            Accept Booking
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            {/* <View style={{ position: 'absolute', alignItems: 'center', zIndex: 9999, width: '70%', marginTop: Dimensions.get('screen').width, backgroundColor: '#ffffff', alignSelf: 'center', elevation: 5, padding: 20 }}>
                <Text> popup OTP View</Text>
                <OTPInputView
                    style={{ width: '80%', height: 100 }}
                    pinCount={4}
                    code={StartTripOTP} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
                    onCodeChanged={(code) => setStartTripOTP(code)}
                    autoFocusOnLoad={true}
                    codeInputFieldStyle={styles.underlineStyleBase}
                    codeInputHighlightStyle={styles.underlineStyleHighLighted}
                    onCodeFilled={(code) => {
                        console.log(`Code is ${code}, you are good to go!`)
                    }}
                />
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => setIsSubmitOTP(false)} style={{ padding: 15, elevation: 5, backgroundColor: '#000000', borderRadius: 5, marginRight: 5 }}>
                        <Text style={{ color: '#ffffff', textTransform: 'uppercase', fontSize: 12 }}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setIsSubmitOTP(false)} style={{ padding: 15, elevation: 5, backgroundColor: '#000000', borderRadius: 5 }}>
                        <Text style={{ color: '#ffffff', textTransform: 'uppercase', fontSize: 12 }}>Start Trip</Text>
                    </TouchableOpacity>
                </View>
            </View> */}
            <View style={{ padding: 20, backgroundColor: '#ffffff', position: 'absolute', bottom: 50, left: 20, right: 20, borderRadius: 10, elevation: 5, display: TripStarted === true ? 'flex' : 'none' }}>
                <TouchableOpacity onPress={() => notifiyUserDriverReached()} style={{ flex: 1, alignItems: 'center', padding: 10, marginBottom: 10 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 12, textTransform: 'uppercase' }}>Trip Details ↑</Text>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 1, marginRight: 15 }}>
                        {isTripStartedStatus === true ? <TouchableOpacity onPress={() => setTripEnd()} style={{ padding: 15, elevation: 5, backgroundColor: '#913831', borderRadius: 5 }}>
                            <Text style={{ color: '#fff', fontWeight: 'bold', textTransform: 'uppercase', textAlign: 'center' }}>End Trip 🛺</Text>
                        </TouchableOpacity> : <TouchableOpacity onPress={() => bottomSheet.current.show()} style={{ padding: 15, elevation: 5, backgroundColor: '#008000', borderRadius: 5 }}>
                            <Text style={{ color: '#fff', fontWeight: 'bold', textTransform: 'uppercase', textAlign: 'center' }}>Start Trip 🛺</Text>
                        </TouchableOpacity>}
                    </View>
                    <TouchableOpacity onPress={() => FolloweOnGoogleMaps()} style={{ elevation: 5 }}>
                        <Image style={{ width: 60, height: 60, resizeMode: 'contain' }} source={require('../../assets/map_icon.png')} />
                    </TouchableOpacity>
                </View>
            </View>
            <BottomSheet
                hasDraggableIcon
                radius={20}
                ref={UserbottomSheet}
                height={450} >
                <View style={{ padding: 20 }}></View>
            </BottomSheet>
            <BottomSheet
                hasDraggableIcon
                radius={20}
                ref={bottomSheet}
                height={450} >
                <View style={{ padding: 20 }}>
                    <View style={{ flexDirection: 'column', alignItems: 'center', alignSelf: 'center', marginBottom: 20 }}>
                        <Text style={{ textAlign: 'center' }}>{from_address} </Text>
                        <Text style={{ fontWeight: 'bold' }}>To</Text>
                        <Text style={{ textAlign: 'center' }}> {to_address}</Text>
                    </View>
                    <View style={{ alignSelf: 'center', marginBottom: 20 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
                            <Text style={{ fontWeight: 'bold' }}>Total Distance </Text>
                            <Text style={{ fontWeight: 'bold' }}>{Number(distance)} KMs</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
                            <Text style={{ fontWeight: 'bold' }}>Trip Cost </Text>
                            <Text style={{ fontWeight: 'bold' }}>{trip_cost}/- ₹</Text>
                        </View>
                    </View>
                    <TextInput onChangeText={(e) => setStartTripOTP(e)} placeholder='Enter OTP' style={{ padding: 15, alignSelf: 'center', borderWidth: 1, textAlign: 'center', marginBottom: 15 }} maxLength={4} keyboardType='number-pad' autoFocus />
                    <Text style={{ fontSize: 10, textAlign: 'center', marginBottom: 20, color: 'grey' }}>Please Enter 4 Digit OTP</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
                        <TouchableOpacity onPress={() => bottomSheet.current.close()} style={{ padding: 15, elevation: 5, backgroundColor: '#000000', borderRadius: 5, marginRight: 5, flex: 1 }}>
                            <Text style={{ color: '#ffffff', textTransform: 'uppercase', fontSize: 12, textAlign: 'center' }}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => startTripSubmitOTP()} style={{ padding: 15, elevation: 5, backgroundColor: '#008000', borderRadius: 5, flex: 1 }}>
                            {loader === true ? <ActivityIndicator color={'#fff'} /> : <Text style={{ color: '#ffffff', textTransform: 'uppercase', fontSize: 12, textAlign: 'center' }}>Start Trip</Text>}
                        </TouchableOpacity>
                    </View>
                </View>
            </BottomSheet>
        </View>
    );
};

export default NotificationCenterScreen; 