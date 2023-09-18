/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * https://www.google.com/maps/dir/Noida,+Uttar+Pradesh/Gurugram,+Haryana/@28.5563204,77.0362189,11z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x390ce5a43173357b:0x37ffce30c87cc03f!2m2!1d77.3910265!2d28.5355161!1m5!1m1!1s0x390d19d582e38859:0x2cf5fe8e5c64b1e!2m2!1d77.0266383!2d28.4594965?entry=ttu
 * @format
 */


import React from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
    Dimensions,
    Pressable,
    View,
    Alert,
    Text,
    Image
} from 'react-native';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapViewDirections from 'react-native-maps-directions';
import MapView, {
    Camera,
    Marker,
    Circle
} from 'react-native-maps';
import globle from '../../../common/env';
import { mapStyle } from '../../../common/customStyleMaps';
const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0012;
const LONGITUDE_DELTA = 0.0012;

const TripCreateScreen = () => {

    const navigate = useNavigation();
    const markerRef = React.useRef();
    const mapRef = React.useRef();
    const [tripPrice, setTripPrice] = React.useState(0);
    const [Endname, setEndName] = React.useState([]); // React.useState(route.params.location?.pickup?.destinationCords.name);
    const [StartName, setStartName] = React.useState([]); //React.useState(route.params.location?.drop?.dropCords.name);
    const [Time, setTime] = React.useState('');
    const [eventPrice, setEventPrice] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    const [Distance, setDistance] = React.useState('');
    const [Destinationstate, setDestinationState] = React.useState(null);
    const [Pickupstate, setPickupState] = React.useState(null);

    useFocusEffect(
        React.useCallback(() => {
            async function fetchData() {
                console.log('just_focus');
                //each count lasts for a second
                getAllTripData();
                //cleanup the interval on complete
            }
            fetchData();
        }, []),
    );

    const getAllTripData = async () => {
        setLoading(false);
        const valueX = await AsyncStorage.getItem('@autoEndTrip');
        const valueXX = await AsyncStorage.getItem('@fromTrip');
        let to_location = JSON.parse(valueX);
        let from_location = JSON.parse(valueXX);

        console.log('to_location', to_location);
        console.log('from_location', from_location);

        const pickup_point = {
            latitude: from_location?.latitude,
            longitude: from_location?.longitude,
        }
        const drop_point = {
            latitude: to_location?.latitude,
            longitude: to_location?.longitude,
        }
        setPickupState(pickup_point);
        setDestinationState(drop_point);
        console.log('getAllTripData_F', pickup_point);
        console.log('getAllTripData_T', drop_point);
        getPriceFromWeb();
    }

    const getPriceFromWeb = () => {
        // https://createdinam.in/Parihara/public/api/getPrice
        // Optionally the request above could also be done as
        var authOptions = {
            method: 'GET',
            url: globle.API_BASE_URL + 'getPrice',
            headers: { 'Content-Type': 'application/json' },
            json: true,
        };
        axios(authOptions).then((resp) => {
            setTripPrice(resp.data.data?.value);
            setLoading(true);
        });
    }

    const calculateDistance = (dis) => {
        let distance = dis;
        let price = tripPrice;
        const mePrice = Number(distance) * Number(price);
        setEventPrice(mePrice);
        return mePrice;
    }

    const displaytime = (time) => {
        var value = time;
        // value = value.toFixed(2);
        return value
    }

    function goBackEndTrip() {
        Alert.alert(
            'End Trip',
            'Are you sure, want end the trip?',
            [
                { text: 'Cancel', onPress: () => console.log('cancel') },
                { text: 'OK', onPress: () => navigate.goBack() },
            ]
        );
    }

    const fetchTime = (d, t) => {
        setTime(t);
        setDistance(d);
    }

    // create trip
    // const createNewTripForCustomer = async () => {
    //     const autoUserGroup = await AsyncStorage.getItem('@autoUserGroup');
    //     let data = JSON.parse(autoUserGroup)?.token;
    //     const valueX = await AsyncStorage.getItem('@autoEndTrip');
    //     const valueXX = await AsyncStorage.getItem('@fromTrip');
    //     let to_location = JSON.parse(valueX);
    //     let from_location = JSON.parse(valueXX);

    //     const pickup_point = {
    //         latitude: from_location?.lat,
    //         longitude: from_location?.lng
    //     }
    //     const drop_point = {
    //         latitude: to_location?.latitude,
    //         longitude: to_location?.longitude
    //     }

    //     // var formdata = new FormData();
    //     // formdata.append('from_address', pickup_point);
    //     // formdata.append('to_address', drop_point);

    //     // formdata.append('from_state', '1');
    //     // formdata.append('from_city', '1');

    //     // formdata.append('to_state', '1');
    //     // formdata.append('to_city', '1');

    //     // formdata.append('to_pincode', '123123');
    //     // formdata.append('from_pincode', '123123');

    //     // formdata.append('to_lat', to_location?.latitude);
    //     // formdata.append('to_long', to_location?.longitude);

    //     // formdata.append('from_lat', from_location?.lat);
    //     // formdata.append('from_long', from_location?.lng);

    //     // formdata.append('price', eventPrice);
    //     // formdata.append('distance', Distance);

    //     const apiUrl = globle.API_BASE_URL + 'travel-request';
    //     // Replace 'YOUR_AUTH_TOKEN' with your actual Authorization token
    //     const authToken = data;

    //     // Define the data you want to send in the POST request body
    //     const postData = {
    //         from_address: pickup_point,
    //         to_address: drop_point,
    //         from_state: '1',
    //         from_city: '1',
    //         to_state: '1',
    //         to_city: '1',
    //         to_pincode: '123123',
    //         from_pincode: '123123',
    //         to_lat: to_location?.latitude,
    //         to_long: to_location?.longitude,
    //         from_lat: from_location?.lat,
    //         from_long: from_location?.lng,
    //         price: eventPrice,
    //         distance: Distance,
    //         // Add other data as needed
    //     };

    //     // Set up the Axios configuration
    //     const config = {
    //         headers: {
    //             'Authorization': `Bearer ${authToken}`, // Include the Authorization header with your token
    //             'Content-Type': 'application/json', // Set the content type to JSON
    //         },
    //     };

    //     // var requestOptions = {
    //     //     method: 'POST',
    //     //     body: formdata,
    //     //     redirect: 'follow',
    //     //     headers: {
    //     //         'Authorization': 'Bearer ' + data
    //     //     }
    //     // };

    //     console.log('createNewTripForCustomer', JSON.stringify(postData));

    //     try {
    //         const response = await axios.post(apiUrl, postData, config);
    //         // Handle successful response
    //         console.log('Response:', response.data);
    //     } catch (error) {
    //         // Handle Axios or network errors
    //         console.error('Error:', error.message);
    //     }

    // }

    // create new trips
    const createNewTripForCustomer = async (id) => {
        const autoUserGroup = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(autoUserGroup)?.token;
        const valueX = await AsyncStorage.getItem('@autoEndTrip');
        const valueXX = await AsyncStorage.getItem('@fromTrip');
        let to_location = JSON.parse(valueX);
        let from_location = JSON.parse(valueXX);
        const pickup_point = {
            latitude: from_location?.lat,
            longitude: from_location?.lng
        }
        const drop_point = {
            latitude: to_location?.latitude,
            longitude: to_location?.longitude
        }
        setLoading(true)
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: globle.API_BASE_URL + 'travel-request',
            data: {
                'from_address': drop_point,
                'to_address': drop_point,
                'from_state': '1',
                'from_city': '1',
                'to_state': '1',
                'to_city': '1',
                'to_pincode': '123123',
                'from_pincode': '123123',
                'to_lat': to_location?.latitude,
                'to_long': to_location?.longitude,
                'from_lat': to_location?.latitude,
                'from_long': to_location?.longitude,
                'price': eventPrice,
                'distance': Distance === '' ? 10 : Distance,
            },
            headers: {
                'Authorization': 'Bearer ' + data
            }
        };
        console.log('purchasePackage', config);
        axios.request(config)
            .then((response) => {
                setLoading(false)
                console.log('purchasePackage', response.data);
                Toast.show({
                    type: 'success',
                    text1: 'Buying Package Successfully',
                    text2: response.data?.message,
                });
                console.log('purchasePackage', JSON.stringify(response.data));
            })
            .catch((error) => {
                setLoading(false)
                console.log(error);
            });
    }


    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.containerX}>
            <View style={{ flex: 1 }}>
                <Pressable
                    onPress={() => goBackEndTrip()}
                    style={{ position: 'absolute', top: 45, left: 10, zIndex: 9999 }} >
                    <Image
                        style={{ width: 25, height: 25, resizeMode: 'contain', tintColor: 'green' }}
                        source={require('../../assets/previous.png')} />
                </Pressable>
                {loading ? <View>
                    <MapView
                        ref={mapRef}
                        // customMapStyle={mapStyle}
                        style={{ height: height - 0, width: width }}
                        pitchEnabled={true}
                        initialRegion={{
                            ...Pickupstate,
                            latitudeDelta: LATITUDE_DELTA,
                            longitudeDelta: LONGITUDE_DELTA,
                        }}
                        onLayout={() => { }}
                    >
                        {Object.keys(Destinationstate) !== null && (<MapViewDirections
                            origin={Pickupstate}
                            destination={Destinationstate}
                            apikey={globle.GOOGLE_MAPS_APIKEY_V2}
                            strokeWidth={4}
                            strokeColor="green"
                            optimizeWaypoints={true}
                            onStart={(params) => {
                                console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
                            }}
                            onReady={result => {
                                fetchTime(result.distance, result.duration),
                                    mapRef.current.fitToCoordinates(result.coordinates, {
                                        edgePadding: {
                                            right: 30,
                                            bottom: 300,
                                            left: 30,
                                            top: 100,
                                        },
                                    });
                            }}
                            onError={(errorMessage) => {
                                console.log('GOT AN ERROR', JSON.stringify(errorMessage));
                                Toast.show({
                                    type: 'error',
                                    text1: 'Something went wrong!',
                                    text2: errorMessage,
                                });

                            }}
                        />)}
                        <Marker key={1} draggable tracksViewChanges coordinate={Pickupstate} >
                            <Image style={{ height: 30, width: 30, resizeMode: 'contain', marginRight: 10 }} source={{ uri: 'https://www.pngkey.com/png/full/13-137571_map-marker-png-hd-marker-icon.png' }} />
                        </Marker>
                        <Marker key={2} draggable tracksViewChanges coordinate={Destinationstate} >
                            <Image style={{ height: 30, width: 30, resizeMode: 'contain', marginRight: 10, tintColor: 'green' }} source={{ uri: 'https://www.pngkey.com/png/full/13-137571_map-marker-png-hd-marker-icon.png' }} />
                        </Marker>
                        {/* <Circle
                            key={1}
                            center={Pickupstate}
                            radius={100}
                            options={{
                                strokeColor: "#66009a",
                                strokeOpacity: 0.2,
                                strokeWeight: 2,
                                fillColor: `#66009a`,
                                fillOpacity: 0.1,
                                zIndex: 1
                            }}
                        /> */}
                    </MapView>
                </View> : <ActivityIndicator style={{ alignItems: 'center', marginTop: width / 1.5 }} size={'large'} color={'red'} />}
                <View style={styles.innerContainer}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>Booking Details</Text>
                    </View>
                    <TouchableOpacity onPress={() => createNewTripForCustomer()} style={styles.buttonContainer}>
                        <Text style={styles.buttonText}>Search Driver</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

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
    },
    container: {
        flex: 1,
    },
    textInputContainer: {
        backgroundColor: 'rgba(0,0,0,0)',
        borderTopWidth: 0,
        borderBottomWidth: 0,
    },
    textInput: {
        marginLeft: 0,
        marginRight: 0,
        height: 38,
        color: '#5d5d5d',
        fontSize: 16,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 20,
        marginLeft: 20,
        width: '100%',
        paddingHorizontal: 10,
        paddingVertical: 14,
        marginTop: 10,
        backgroundColor: 'black',
        borderRadius: 5,
        elevation: 6,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        textAlign: 'center',
    },
    containerX: {
        backgroundColor: '#ffffff',
        flex: 1,
    },
    innerContainer: {
        padding: 20,
        height: 250,
        width: Dimensions.get('screen').width - 20,
        backgroundColor: 'white',
        flexGrow: 1,
        borderRadius: 10,
        elevation: 5,
        marginBottom: 20,
        position: 'absolute',
        bottom: 0,
        left: 10,
        zIndex: 999,
    }, item: {
        flex: 1,
        aspectRatio: 1,
        margin: 5,
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 10,
        elevation: 5,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    }, circle: {
        width: 30,
        height: 30,
        borderRadius: 30 / 2,
        backgroundColor: 'red',
    },
    pinText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 20,
        marginBottom: 10,
    },
});

export default TripCreateScreen;