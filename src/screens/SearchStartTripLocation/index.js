/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * https://www.google.com/maps/dir/Noida,+Uttar+Pradesh/Gurugram,+Haryana/@28.5563204,77.0362189,11z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x390ce5a43173357b:0x37ffce30c87cc03f!2m2!1d77.3910265!2d28.5355161!1m5!1m1!1s0x390d19d582e38859:0x2cf5fe8e5c64b1e!2m2!1d77.0266383!2d28.4594965?entry=ttu
 * @format
 */

import React from 'react';
import {
    Image,
    Text,
    TouchableOpacity,
    Platform,
    View,
    Dimensions,
    Animated,
    Easing,
    ImageBackground,
    ActivityIndicator,
    FlatList,
    Linking
} from 'react-native';
import { setUpdateIntervalForType, SensorTypes } from 'react-native-sensors';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Geolocation from '@react-native-community/geolocation';
import AddressPickup from '../../../common/AddressPickup';
import getDistance from 'geolib/es/getPreciseDistance';
import globle from '../../../common/env';
import Geocoder from 'react-native-geocoder';
import MapView, { Marker, AnimatedRegion } from 'react-native-maps';
import {
    INPUT_RANGE_START,
    INPUT_RANGE_END,
    OUTPUT_RANGE_START,
    OUTPUT_RANGE_END,
    ANIMATION_TO_VALUE,
    ANIMATION_DURATION,
} from '../../../common/constants';
setUpdateIntervalForType(SensorTypes.accelerometer, 15);
const { width, height } = Dimensions.get('window');
const LATITUDE_DELTA = 0.012;
const LONGITUDE_DELTA = 0.012;

const StartTripSearchingScreen = () => {

    const routes = useRoute();
    const markerRef = React.useRef();
    const mapRef = React.useRef();
    const navigate = useNavigation();
    const initialValue = 0;
    const [searchData, setSearchData] = React.useState(null);
    const [searchFavData, setSearchFavData] = React.useState([]);
    Geocoder.fallbackToGoogle(globle.GOOGLE_MAPS_APIKEY_V2);
    const translateValue = React.useRef(new Animated.Value(initialValue)).current;
    const numColumns = 2;
    const [formattedAddress, setformattedAddress] = React.useState(null);
    const [formattedToAddress, setformatteTodAddress] = React.useState(null);
    const [toformattedAddress, setToformattedAddress] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [selectedTrip, setSelectedTrip] = React.useState('');
    const [Destinationstate, setDestinationState] = React.useState({ destinationCords: {} });
    const [Pickupstate, setPickupState] = React.useState({ pickupCords: {} });
    const [Dropstate, setDropState] = React.useState({ dropCords: {} });
    const [markerLocation, serLocation] = React.useState({ latitude: null, longitude: null, additionDetails: null });
    const [marker, setMarker] = React.useState(false);
    console.log(JSON.stringify(routes.params));

    React.useEffect(() => {
        const translate = () => {
            translateValue.setValue(initialValue);
            Animated.timing(translateValue, {
                toValue: ANIMATION_TO_VALUE,
                duration: ANIMATION_DURATION,
                easing: Easing.linear,
                useNativeDriver: true,
            }).start(() => translate());
        };
        // translate();
    }, [translateValue]);

    useFocusEffect(
        React.useCallback(() => {
            async function fetchData() {
                console.log('just_focus');
                //each count lasts for a second
                getNearbyBars();
                //cleanup the interval on complete
            }
            fetchData();
        }, []),
    );

    // React.useEffect(() => {
    //     Geolocation.getCurrentPosition(
    //         (position) => {
    //             const { latitude, longitude } = position.coords;
    //             console.log({ latitude, longitude });
    //         },
    //         (error) => {
    //             console.log(error.code, error.message);
    //         },
    //         { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    //     );
    // }, []);

    const getLocationData = async () => {
        console.log('triggered!')
        setTimeout(async () => {
            // write your functions    
            if (routes.params?.type === 'ToDestination') {
                console.log('just focus', routes.params?.type)
                var NY = {
                    lat: routes.params?.latitude,
                    lng: routes.params?.longitude
                };
                await Geocoder.geocodePosition(NY).then(res => {
                    console.log('geocodePosition', res[0]);
                    if (routes.params?.type === 'ToDestination') {
                        setToformattedAddress(res[0]?.formattedAddress);
                        setSearchData(res[0]);
                        createNewTripForCustomer();
                    }

                }).catch(err => console.log(err));
            }
        }, 500);
    }


    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of the Earth in kilometers
        const dLat = (lat2 - lat1) * (Math.PI / 180); // Convert latitude difference to radians
        const dLon = (lon2 - lon1) * (Math.PI / 180); // Convert longitude difference to radians

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c; // Distance in kilometers

        return distance;
    }

    // create trip
    const createNewTripForCustomer = async () => {
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(valueX)?.token;
        const toLocation = await AsyncStorage.getItem('@autoEndTrip');
        const fromLocation = await AsyncStorage.getItem('@fromTrip');
        // @autoEndTrip
        console.log('createNewTripForCustomer1', toLocation);
        console.log('createNewTripForCustomer2', fromLocation);

        console.log('createNewTripForCustomer1', searchData?.position?.lat);
        console.log('createNewTripForCustomer1', searchData?.position?.lng);
        console.log('createNewTripForCustomer1', searchData?.postalCode);
        console.log('createNewTripForCustomer1', searchData?.countryCode);
        console.log('createNewTripForCustomer1', searchData?.adminArea);
        console.log('createNewTripForCustomer1', searchData?.country);
        console.log('createNewTripForCustomer1', searchData?.formattedAddress);
        console.log('createNewTripForCustomer1', searchData?.streetName);

        console.log('createNewTripForCustomer2', formattedToAddress?.position?.lat);
        console.log('createNewTripForCustomer2', formattedToAddress?.position?.lng);
        console.log('createNewTripForCustomer2', formattedToAddress?.postalCode);
        console.log('createNewTripForCustomer2', formattedToAddress?.countryCode);
        console.log('createNewTripForCustomer2', formattedToAddress?.adminArea);
        console.log('createNewTripForCustomer2', formattedToAddress?.country);
        console.log('createNewTripForCustomer2', formattedToAddress?.formattedAddress);
        console.log('createNewTripForCustomer2', formattedToAddress?.streetName);

        const distance = calculateDistance(searchData?.position?.lat, searchData?.position?.lng, formattedToAddress?.position?.lat, formattedToAddress?.position?.lng); // Berlin to Paris
        console.log(`Distance: ${distance.toFixed(2)} km`);
        const centerOff = getDistance(searchData?.position?.lat, searchData?.position?.lng, formattedToAddress?.position?.lat, formattedToAddress?.position?.lng);
        console.log(`Distance: ${centerOff} km`);
        // let tokneFcm = JSON.parse(valueX)?.token;

        // var formdata = new FormData();
        // formdata.append('from_address', formattedToAddress?.formattedAddress);
        // formdata.append('to_address', searchData?.formattedAddress);

        // formdata.append('from_state', '');
        // formdata.append('from_city', '');

        // formdata.append('to_state', '');
        // formdata.append('to_city', '');

        // formdata.append('to_pincode', formattedToAddress?.postalCode);
        // formdata.append('from_pincode', searchData?.postalCode);

        // formdata.append('to_lat', searchData?.position?.lat);
        // formdata.append('to_long', searchData?.position?.lng);

        // formdata.append('from_lat', formattedToAddress?.position?.lat);
        // formdata.append('from_long', formattedToAddress?.position?.lng);

        // formdata.append('price', '');
        // formdata.append('distance', '');

        // var requestOptions = {
        //     method: 'POST',
        //     body: formdata,
        //     redirect: 'follow',
        //     headers: {
        //         'Authorization': 'Bearer ' + data
        //     }
        // };
        // console.log('uploadProfile', requestOptions)
        // fetch(globle.API_BASE_URL + 'travel-request', requestOptions)
        //     .then(response => response.json())
        //     .then(result => {
        //         console.log('uploadProfileX', result)
        //         if (result.status) {
        //             Toast.show({
        //                 type: 'success',
        //                 text1: 'Congratulations!',
        //                 text2: result?.message,
        //             });
        //         } else {
        //             Toast.show({
        //                 type: 'success',
        //                 text1: 'Something went wrong!',
        //                 text2: result?.message,
        //             });
        //         }
        //     })
        //     .catch((error) => {
        //         console.log('error', error);
        //         Toast.show({
        //             type: 'success',
        //             text1: 'Something went wrong!',
        //             text2: error,
        //         });
        //         setLoading(false)
        //     });
    }

    const AnimetedImage = Animated.createAnimatedComponent(ImageBackground);

    const fetchPickupCords = (locations) => {
        console.log('fetchPickupCords', JSON.stringify(locations));
        setDestinationState({
            ...Destinationstate,
            destinationCords: {
                latitude: locations?.geometry?.location?.lat,
                longitude: locations?.geometry?.location?.lng,
                name: locations?.name,
                icon: locations?.icon,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1
            }
        });
        mapRef.current.animateCamera({
            center: {
                latitude: locations?.geometry?.location?.lat,
                longitude: locations?.geometry?.location?.lng,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
            },
            heading: 0,
            pitch: 90,
        });
        let additionDetails = {
            formatted_address: locations?.formatted_address,
            name: locations?.name,
        }
        serLocation({ latitude: locations?.geometry?.location?.lat, longitude: locations?.geometry?.location?.lng, additionDetails: additionDetails });
        setMarker(true);
        let locFrom = {
            latitude: locations?.geometry?.location?.lat,
            longitude: locations?.geometry?.location?.lng,
        }
        saveToStoragex(locFrom);
        console.log('fetchPickupCords', JSON.stringify(locFrom));
    }

    const getLocationAddress = async (lat, long) => {
        var NY = {
            lat: lat,
            lng: long
        };
        Geocoder.geocodePosition(NY).then(res => {
            setformattedAddress(res[0]?.formattedAddress);
            setformatteTodAddress(res[0]);
            saveToStorage(res[0]);
            setLoading(true);
        }).catch(err => console.log(err));
    }

    const saveToStorage = async (info) => {
        let save_from = {
            latitude: info?.position?.lat,
            longitude: info?.position?.lng,
        }
        await AsyncStorage.setItem('@fromTrip', JSON.stringify(save_from));
        console.log('saveToStorage', save_from);
    }


    const saveToStoragex = async (info) => {
        console.log('saveToStoragex', info);
        // const jsonValue = JSON.stringify(info);
        // await AsyncStorage.setItem('@fromTrip', jsonValue);
        // console.log('saveToStorage', info);
    }

    const onMapPress = (e) => {
        let additionDetails = {
            formatted_address: '',
            name: '',
        }
        console.log('onMapPress', JSON.stringify(e.nativeEvent.coordinate));
        animate(e.nativeEvent.coordinate?.latitude, e.nativeEvent.coordinate?.longitude);
        serLocation({ latitude: e.nativeEvent.coordinate?.latitude, longitude: e.nativeEvent.coordinate?.longitude, additionDetails: additionDetails });
        saveToFromStorage(e.nativeEvent.coordinate?.latitude, e.nativeEvent.coordinate?.longitude);
        setMarker(true);
    }


    const saveToFromStorage = async (latitude, longitude) => {
        let save_from = {
            latitude: latitude,
            longitude: longitude,
        }
        await AsyncStorage.setItem('@fromTrip', JSON.stringify(save_from));
        console.log('saveToStorage', save_from);
    }

    const getNearbyBars = async () => {
        Geolocation.getCurrentPosition(
            (position) => {
                let additionDetails = {
                    formatted_address: '',
                    name: '',
                }
                console.log('getNearbyBars', JSON.stringify(position));
                serLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude, additionDetails: additionDetails });
                animate(position.coords.latitude, position.coords.longitude);
                getLocationAddress(position.coords.latitude, position.coords.longitude);
                setLoading(true);
                setMarker(true);
            },
            error => console.log('error--->', error),
            {
                enableHighAccuracy: false,
                timeout: 10000,
            },
        );
    };

    const animate = (latitude, longitude) => {
        if (Platform.OS == 'android') {
            if (markerRef.current) {
                mapRef.current.animateCamera({
                    center: {
                        latitude: latitude,
                        longitude: longitude,
                    },
                });
            }
        } else {
            // coordinate.timing(newCoordinate).start();
        }
    }

    const handleOnPress = () => {
        if (Platform.OS === 'ios') {
            //  Linking.openURL('maps://app?saddr=' + startinPointName + '&daddr=' + endingPointName+'&travelmode=car')
            // startTrip();
            Linking.openURL('https://www.google.com/maps/dir/?api=1&origin=' + startinPointName + '&destination=' + endingPointName + '&travelmode=driving&waypoints=' + DATA[1].name + DATA[2].name)
        }
        if (Platform.OS === 'android') {
            // startTrip();
            Linking.openURL('https://www.google.com/maps/dir/?api=1&origin=' + startinPointName + '&destination=' + endingPointName + '&travelmode=driving&waypoints=' + DATA[1].name + DATA[2].name)
        }
    }


    return (
        <View>
            <View style={{ marginTop: 35 }}>
                <View style={{ position: 'absolute', top: 10, left: 22, zIndex: 9999, width: '90%', flexDirection: 'row', alignItems: 'center' }}>
                    <AddressPickup
                        fetchDetails={true}
                        placheholderText={formattedAddress === '' ? 'Please enter Location' : formattedAddress}
                        fetchAddress={fetchPickupCords}
                        query={{
                            key: globle.GOOGLE_MAPS_APIKEY_V2,
                            language: 'en',
                        }}
                        currentLocation={true}
                        currentLocationLabel='Current location'
                    />
                </View>
                <View style={{ height: height / 2, width: width }}>
                    {loading === true ?
                        <MapView
                            ref={mapRef}
                            style={{ height: height / 2, width: width }}
                            mapType={MapView.MAP_TYPES.TERRIN}
                            // pitchEnabled={true}  
                            showsIndoors={true}
                            key={globle.GOOGLE_MAPS_APIKEY_V2}
                            minZoomLevel={18}
                            maxZoomLevel={18}
                            showsTraffic={false}
                            showsBuildings={false}
                            showsCompass={false}
                            showsUserLocation={false}
                            initialRegion={{
                                ...markerLocation,
                                latitudeDelta: LATITUDE_DELTA,
                                longitudeDelta: LONGITUDE_DELTA,
                            }}
                            onPress={(event) => onMapPress(event)}
                        >
                            {marker ? <Marker
                                ref={markerRef}
                                coordinate={markerLocation}
                                title={'title'}
                                description={'description'}
                            >
                                <Image style={{ width: 50, height: 50, resizeMode: 'contain' }} source={require('../../assets/greenMarker.png')} />
                            </Marker> : null}
                        </MapView> : <ActivityIndicator style={{ alignItems: 'center', marginTop: width / 2.3 }} size={'large'} color={'red'} />}
                    <TouchableOpacity onPress={() => getNearbyBars()} style={{ position: 'absolute', bottom: 5, right: 5, zIndex: 9999 }}>
                        <Image style={{ width: 55, height: 55, resizeMode: 'contain' }} source={require('../../assets/greenIndicator.png')} />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ backgroundColor: '#fff', borderRadius: 10, padding: 10, flexGrow: 1 }}>
                <TouchableOpacity onPress={() => navigate.navigate('SearchDestinationScreen')} style={{ marginTop: 0, width: '100%', height: 45, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ left: 25, width: 10, height: 10, backgroundColor: 'red', borderRadius: 150, zIndex: 9999, marginTop: 3 }} />
                    <Text numberOfLines={1} style={{ height: 50, borderRadius: 50, borderWidth: 1, borderColor: '#F1F6F9', paddingLeft: 30, backgroundColor: '#F1F6F9', elevation: 3, paddingTop: 17, fontWeight: 'bold', flex: 1, paddingRight: 40 }}>{toformattedAddress === null ? 'Enter Drop Location' : toformattedAddress}</Text>
                    <View style={{ position: 'absolute', right: 10, top: 12 }}>
                        <Image style={{ width: 20, height: 20, resizeMode: 'contain', }} source={require('../../assets/next.png')} />
                    </View>
                </TouchableOpacity>
                <View style={{ padding: 5, marginTop: 5, marginLeft: 10 }}>
                    <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 12 }}>Drop suggestions</Text>
                </View>
                <View style={{}}>
                    {searchFavData.length > 0 ?
                        <FlatList
                            style={{ height: width / 2, width: width - 20, }}
                            data={searchData}
                            keyExtractor={(id) => id}
                            renderItem={(items) => <Text style={{ fontSize: 22 }}>xx{JSON.stringify(items)}</Text>}
                        /> : <View style={{ alignItems: 'center' }}>
                            <Image style={{ width: 220, height: 220, resizeMode: 'contain', }} source={require('../../assets/search_result_not_found.png')} />
                        </View>}

                </View>
            </View>
        </View>
    );
};

export default StartTripSearchingScreen;