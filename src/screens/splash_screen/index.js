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
    Platform
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, { Marker, AnimatedRegion } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import MapViewDirections from 'react-native-maps-directions';
import Toast from 'react-native-toast-message';
import globle from '../../../common/env';
import styles from './styles';

const { width, height } = Dimensions.get('window');
const LATITUDE_DELTA = 0.012;
const LONGITUDE_DELTA = 0.012;

const NotificationCenterScreen = () => {

    const navigate = useNavigation();
    const routes = useRoute();
    const markerRef = React.useRef();
    const mapRef = React.useRef();
    const [distance, setDistance] = React.useState(routes.params?.data?.distance);
    const [from_address, setFaddress] = React.useState(routes.params?.data?.from_address);
    const [to_address, setTaddress] = React.useState(routes.params?.data?.to_address);
    const [trip_cost, setTripcost] = React.useState(routes.params?.data?.price);
    let [startPoint, setStartPoint] = React.useState({ latitude: routes.params?.data?.from_lat, longitude: routes.params?.data?.from_long, });
    let [endPoint, setEndPoint] = React.useState({ latitude: routes.params?.data?.to_lat, longitude: routes.params?.data?.to_long, });
    const [marker, setMarker] = React.useState(false);
    const [TripStarted, setTripStarted] = React.useState(false);
    const [isSubmitOTP, setIsSubmitOTP] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    useFocusEffect(
        React.useCallback(() => {
            // whatever
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
                        setTripStarted(true);
                        setLoading(true);
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

    const FolloweOnGoogleMaps = async () => {
        if (Platform.OS === 'ios') {
            //  Linking.openURL('maps://app?saddr=' + startinPointName + '&daddr=' + endingPointName+'&travelmode=car') &waypoints=' + from_address + to_address
            // startTrip();
            // Linking.openURL('https://www.google.com/maps/dir/?api=1&origin=' + startinPointName + '&destination=' + endingPointName + '&travelmode=driving&waypoints=' + 'Office to Home ')
        }
        if (Platform.OS === 'android') {
            // startTrip();
            // https://www.google.com/maps/dir/Noida,+Uttar+Pradesh/GTB+Nagar,+Delhi/@28.607801,77.2154511,12z/
            // Linking.openURL('https://www.google.com/maps/dir/?api=1&origin=' + startPoint + '&destination=' + endPoint + '&travelmode=driving')
            Linking.openURL('http://maps.google.com/maps?daddr=' + startPoint.latitude + ',' + startPoint.longitude).catch(err => console.error('An error occurred', err));;
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
                    showsUserLocation={false}
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
                <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
                    <Text style={{ fontWeight: 'bold' }}>{from_address} To </Text>
                    <Text style={{ fontWeight: 'bold' }}>{to_address}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
                    <Text style={{ fontWeight: 'bold' }}>Total Distance </Text>
                    <Text style={{ fontWeight: 'bold' }}>{distance} KMs</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
                    <Text style={{ fontWeight: 'bold' }}>Trip Cost </Text>
                    <Text style={{ fontWeight: 'bold' }}>{trip_cost}/- ₹</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
                    <TouchableOpacity onPress={() => BookingReject()}
                        style={{ flex: 1, marginRight: 2 }}>
                        <Text style={{ textAlign: 'center', padding: 10, backgroundColor: 'orange', color: 'white', fontWeight: 'bold', textTransform: 'uppercase' }}>
                            Cancel Booking
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => BookingAccept()}
                        style={{ flex: 1 }}>
                        <Text style={{ textAlign: 'center', padding: 10, backgroundColor: 'green', color: 'white', fontWeight: 'bold', textTransform: 'uppercase' }}>
                            Accept Booking
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ position: 'absolute', alignItems: 'center', zIndex: 9999, }}>
                <Text> popup OTP View</Text>
            </View>
            <View style={{ padding: 20, backgroundColor: '#008000', position: 'absolute', bottom: 30, left: 20, borderRadius: 10, elevation: 5, display: TripStarted === true ? 'flex' : 'none' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View>
                        <TouchableOpacity onPress={() => setIsSubmitOTP(false)} style={{ padding: 15, elevation: 5, backgroundColor: '#ffffff', borderRadius: 5 }}>
                            <Text>Start Ride</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => FolloweOnGoogleMaps()} style={[styles.bubble, styles.button]}>
                        <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#ffffff' }}>Start Tracking Open Maps 🗺</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default NotificationCenterScreen; 