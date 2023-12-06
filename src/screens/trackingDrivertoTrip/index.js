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
    StyleSheet,
    Pressable
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, { Marker, AnimatedRegion } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import MapViewDirections from 'react-native-maps-directions';
import BottomSheet from "react-native-gesture-bottom-sheet";
import database from '@react-native-firebase/database';
import Toast from 'react-native-toast-message';
import globle from '../../../common/env';
import axios from 'axios';

const { width, height } = Dimensions.get('window');
const LATITUDE_DELTA = 0.002;
const LONGITUDE_DELTA = 0.002;

const DriverTrackToMapsScreen = () => {

    const navigate = useNavigation();
    const routes = useRoute();
    const markerRef = React.useRef();
    const mapRef = React.useRef();
    const [loading, setLoading] = React.useState(false);
    const [PickupPoint, setPickupPoint] = React.useState(null);
    const [DropPoint, setDropPoint] = React.useState(null);
    // distanceTravelled
    const [driverID, setDriverID] = React.useState(routes?.params?.data?.driver_id);
    const [DistanceTravelled, setDistanceTravelled] = React.useState(0);
    const [TripOtp, setTripOtp] = React.useState(routes?.params?.data?.trip_otp);
    const [DriverName, setDriverName] = React.useState(routes?.params?.data?.drivername);
    const [DriverImage, setDriverImage] = React.useState(routes?.params?.data?.drv_image);
    const [DriverVehicleNo, setDriverVehicleNo] = React.useState(routes?.params?.data?.vehicle_no);
    const [Speed, setSpeed] = React.useState(0.0);
    const [Distance, setDistance] = React.useState(null);
    const [Duration, setDuration] = React.useState(null);
    const [Headings, setHeadings] = React.useState(0);


    useFocusEffect(
        React.useCallback(() => {
            // whatever
            setTimeout(() => {
                // setTimeout
                getTripDetails();
            }, 1000);
        }, [])
    );

    const startTracking = async () => {
        // Set up a listener for your Firebase database reference
        // const valueX = await AsyncStorage.getItem('@autoDriverGroup');
        // let data = JSON.parse(valueX);
        // console.log(data?.id);
        // // const driverData = {
        // //     lattitude: lattitude,
        // //     longitude: longitude,
        // // }
        let reff = '/tracking/' + Number(driverID) + '';
        database().ref(reff).on('value', (snapshot) => {
            // Update the component state with the fetched data
            let data = snapshot.val();
            // console.log('------>', JSON.stringify(data));
            animateMarker(data?.location?.lattitude, data?.location?.longitude);
            setHeadings(data?.location?.heading);
            setDistanceTravelled(data?.location?.speed);
            // this.setState({
            //     coordinate: new AnimatedRegion({
            //         latitude: data?.location?.lattitude,
            //         longitude: data?.location?.longitude,
            //         latitudeDelta: LATITUDE_DELTA,
            //         longitudeDelta: LONGITUDE_DELTA,
            //     })
            // })
            console.log('location_has_been_update', JSON.stringify(data?.location?.longitude));
        });
    }

    const animateMarker = (Lt, Ln) => {
        const newCoordinate = {
            latitude: Lt,
            longitude: Ln,
        };
        // console.log('animateMarker----------->', JSON.stringify(newCoordinate));
        if (Platform.OS === 'android') {
            if (mapRef.current)
                mapRef.current.animateCamera(
                    {
                        center: newCoordinate,
                    },
                    {
                        duration: 200,
                    }
                );
            if (markerRef?.current) {
                markerRef?.current?.animateMarkerToCoordinate(newCoordinate, 600);
            }
        } else {
            // coordinate.timing(newCoordinate).start();
        }
    };

    const getTripDetails = async () => {
        console.log('Tracking_Start_New', JSON.stringify(routes?.params?.data?.driver_id));
        const autoUserGroup = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(autoUserGroup)?.token;
        const valueX = await AsyncStorage.getItem('@autoEndTrip');
        const valueXX = await AsyncStorage.getItem('@fromTrip');
        let to_location = JSON.parse(valueX);
        let from_location = JSON.parse(valueXX);
        const pickup_point = {
            latitude: from_location?.latitude,
            longitude: from_location?.longitude
        }
        const drop_point = {
            latitude: to_location?.latitude,
            longitude: to_location?.longitude
        }
        console.log('getTripDetails', pickup_point);
        console.log('getTripDetails', drop_point);
        setPickupPoint(pickup_point);
        setDropPoint(drop_point);
        setLoading(true);
        startTracking();
        // this.setState({
        //     latitude: from_location?.latitude,
        //     longitude: from_location?.longitude,
        //     tripEndPoint: {
        //         latitude: to_location?.latitude,
        //         longitude: to_location?.longitude,
        //     }, coordinate: new AnimatedRegion({
        //         latitude: from_location?.latitude,
        //         longitude: from_location?.longitude,
        //         latitudeDelta: 0,
        //         longitudeDelta: 0,
        //     }),
        //     loading: false,
        // })
    }

    const handleOnMapsPress = () => {
        if (Platform.OS === 'ios') {
            //  Linking.openURL('maps://app?saddr=' + startinPointName + '&daddr=' + endingPointName+'&travelmode=car')
            // startTrip();
            // Linking.openURL('https://www.google.com/maps/dir/?api=1&origin=' + startinPointName + '&destination=' + endingPointName + '&travelmode=driving&waypoints=' + 'Office to Home ')
        }
        if (Platform.OS === 'android') {
            // startTrip();
            // Linking.openURL('https://www.google.com/maps/dir/?api=1&origin=' + startinPointName + '&destination=' + endingPointName + '&travelmode=driving&waypoints=' + DATA[1].name + DATA[2].name)
        }
    }

    const goBackEndTrip = () => {
        Alert.alert(
            'Go To Background',
            'Are you sure, want go Background, Tracking enable in background.',
            [
                { text: 'Cancel', onPress: () => console.log('cancel') },
                { text: 'OK', onPress: () => checkOrBack() },
            ]
        );
    }

    const checkOrBack = async () => {
        const autoUserGroup = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(autoUserGroup);
        console.log('checkOrBack', JSON.stringify(data));
        navigate.navigate('UserHomeScreen');
    }

    const callToDriver = async (number) => {
        Alert.alert(
            'Call Driver',
            'Are you sure, you want to call Driver?',
            [
                { text: 'No', onPress: () => console.log('cancel', JSON.stringify(routes?.params?.data?.mobile)) },
                { text: 'Yes', onPress: () => Linking.openURL(`tel:${routes?.params?.data?.mobile}`) },
            ]
        );
    }

    return (<View style={styles.container}>
        <Pressable onPress={() => goBackEndTrip()} style={{ position: 'absolute', top: 50, left: 10, zIndex: 9999 }} >
            <Image style={{ width: 25, height: 25, resizeMode: 'contain', tintColor: 'white' }} source={require('../../assets/previous.png')} />
        </Pressable>
        {loading === true ?
            <MapView
                ref={mapRef}
                style={styles.map}
                mapType={MapView.MAP_TYPES.TERRIN}
                followUserLocation
                initialRegion={{
                    latitude: PickupPoint?.latitude,
                    longitude: PickupPoint?.latitude,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA
                }}>
                <MapViewDirections
                    origin={PickupPoint}
                    destination={DropPoint}
                    apikey={globle.GOOGLE_MAPS_APIKEY_V2}
                    mode={'DRIVING'}
                    strokeWidth={6}
                    strokeColor="green"
                    optimizeWaypoints={true}
                    onStart={(params) => {
                        console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
                    }}
                    onReady={result => {
                        setDistance(result.distance)
                        setDuration(result.duration)
                    }}
                    onError={(errorMessage) => {
                        console.log('GOT_AN_ERROR', JSON.stringify(errorMessage));
                    }}
                />
                {/* <Polyline coordinates={this.state.routeCoordinates} strokeWidth={5} strokeColor="green" /> */}
                <Marker coordinate={PickupPoint}>
                    <Image style={{
                        width: 55,
                        height: 55,
                    }} source={require('../../assets/user_icon.png')} />
                </Marker>
                <Marker coordinate={DropPoint}>
                    <Image style={{
                        width: 55,
                        height: 55,
                    }} source={require('../../assets/end_icon.png')} />
                </Marker>
                <Marker.Animated
                    ref={markerRef}
                    coordinate={PickupPoint}
                    anchor={{ x: 0.5, y: 0.5 }}>
                    <Image
                        source={require('../../assets/data/auto_rickshaw.png')}
                        style={{
                            width: 45,
                            height: 45,
                            resizeMode: 'contain',
                            transform: [{ rotate: `${Headings}deg` }],
                        }}
                    />
                </Marker.Animated>
            </MapView> : <ActivityIndicator style={{ alignItems: 'center', marginTop: width / 2.3 }} size={'large'} color={'red'} />}
        <View style={{ position: 'absolute', bottom: 30, left: 20, right: 20, backgroundColor: '#ffffff', borderRadius: 10, elevation: 5 }}>
            <View style={{ padding: 20, alignItems: 'flex-end', flexDirection: 'row', }}>
                <Text style={{ flex: 1, alignItems: 'center', marginBottom: 5, fontWeight: 'bold', color: 'grey' }}>SHARE OTP WITH DRIVER TO START TRIP</Text>
                <Text style={{ fontWeight: 'bold', fontSize: 16, borderColor: 'grey', borderWidth: 1, padding: 7, borderRadius: 5, letterSpacing: 5, elevation: 5, backgroundColor: '#fff' }}>{TripOtp}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, marginLeft: 10, marginRight: 10 }}>
                <View style={{ flex: 1, marginBottom: 2 }}>
                    <Image style={{ height: 50, width: 50, borderRadius: 150, resizeMode: 'contain', marginLeft: 7 }} source={{ uri: globle.IMAGE_BASE_URL + DriverImage }} />
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontWeight: 'bold' }}>{DriverName}</Text>
                        <TouchableOpacity style={{
                            marginLeft: 5, paddingTop: 0, marginTop: 1
                        }}
                            onPress={() => callToDriver()}
                        >
                            <Image style={{ width: 15, height: 15, resizeMode: 'contain' }} source={require('../../assets/call.png')} />
                        </TouchableOpacity>
                    </View>
                    <Text style={{ fontWeight: 'bold' }}>{DriverVehicleNo}</Text>
                </View>
                <TouchableOpacity onPress={() => handleOnMapsPress()} style={{}}>
                    <Image style={{ width: 50, height: 50, resizeMode: 'contain' }} source={require('../../assets/map_icon.png')} />
                    <Text style={{ fontWeight: 'bold', fontSize: 10, textAlign: 'center' }}>Open Map</Text>
                </TouchableOpacity>
            </View>
        </View>
        <TouchableOpacity style={{ position: 'absolute', top: 150, right: 10, backgroundColor: '#fff', padding: 10, borderRadius: 150 }}>
            <Text style={{ fontSize: 12, fontWeight: 'bold' }}>
                {parseFloat(DistanceTravelled).toFixed(2)} km
            </Text>
        </TouchableOpacity>
    </View>)

}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "flex-end",
        alignItems: "center"
    },
    map: {
        ...StyleSheet.absoluteFillObject
    },
    bubble: {
        flex: 1,
        backgroundColor: "rgba(255,255,255,0.7)",
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 20
    },
    latlng: {
        width: 200,
        alignItems: "stretch"
    },
    button: {
        width: 80,
        paddingHorizontal: 12,
        alignItems: "center",
        marginHorizontal: 10
    },
    buttonContainer: {
        position: 'absolute',
        width: '90%',
        zIndex: 9999,
        bottom: 120,
        left: 20,
    }
});

export default DriverTrackToMapsScreen; 