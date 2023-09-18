//@ts-nocheck
import React from "react";
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Platform,
    Pressable,
    Image,
    Alert,
} from "react-native";
import MapView, {
    Marker,
    AnimatedRegion,
    Polyline,
    PROVIDER_GOOGLE
} from "react-native-maps";
import haversine from "haversine";
import Geolocation from '@react-native-community/geolocation';
import MapViewDirections from 'react-native-maps-directions';
import globle from '../../../common/env';
// const LATITUDE = 29.95539;
// const LONGITUDE = 78.07513;
const LATITUDE_DELTA = 0.009;
const LONGITUDE_DELTA = 0.009; 

export default class MapComponent extends React.Component {
    
    constructor(props: any) {
        super(props);
        this.state = {
            latitude: this.props.route.params.startPoint.latitude,
            longitude: this.props.route.params.startPoint.longitude,
            routeCoordinates: [],
            tripEndPoint: {
                latitude: this.props.route.params.endPoint.pickupCords.latitude,
                longitude: this.props.route.params.endPoint.pickupCords.longitude
            },
            distanceTravelled: 0,
            Distance: '',
            Duration: '',
            prevLatLng: {},
            heading: 0,
            coordinate: new AnimatedRegion({
                latitude: this.props.route.params.startPoint.latitude,
                longitude: this.props.route.params.startPoint.longitude,
                latitudeDelta: 0,
                longitudeDelta: 0
            })
        };
        //  this.marker = React.createRef();
    }

    componentDidMount() {
        const { coordinate } = this.state;
        this.watchID = Geolocation.watchPosition(
            position => {
                const { routeCoordinates, distanceTravelled } = this.state;
                const { latitude, longitude, heading } = position.coords;

                const newCoordinate = {
                    latitude,
                    longitude
                };

                if (Platform.OS === "android") {
                    if (this.marker) {
                        this.marker.animateMarkerToCoordinate(
                            newCoordinate,
                            1200
                        );
                    }
                } else {
                    coordinate.timing(newCoordinate).start();
                }

                this.setState({
                    latitude,
                    longitude,
                    heading,
                    routeCoordinates: routeCoordinates.concat([newCoordinate]),
                    distanceTravelled:
                        distanceTravelled + this.calcDistance(newCoordinate),
                    prevLatLng: newCoordinate
                });
            },
            error => console.log(error),
            {
                enableHighAccuracy: true,
                timeout: 20000,
                maximumAge: 1000,
                distanceFilter: 0
            }
        );

        setInterval(() => {
            this.onCenter(this.state.latitude, this.state.longitude)
        }, 6000);
    }

    componentWillUnmount() {
        Geolocation.clearWatch(this.watchID);
    }

    getMapRegion = () => ({
        latitude: this.state.latitude,
        longitude: this.state.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
    });

    calcDistance = newLatLng => {
        const { prevLatLng } = this.state;
        return haversine(prevLatLng, newLatLng) || 0;
    };

    onCenter = (latitude: any, longitude: any) => {
        this.mapRef?.animateToRegion({
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
        })
    }

    goBackEndTrip() {
        Alert.alert(
            'End Trip',
            'Are you sure, want end the trip?',
            [
                { text: 'Cancel', onPress: () => console.log('cancel') },
                { text: 'OK', onPress: () => this.props.navigation.navigate('HomeScreen') },
            ]
        );
    }


    render() {
        return (
            <View style={styles.container}>
                <Pressable onPress={() => this.goBackEndTrip()} style={{ position: 'absolute', top: 10, left: 10, zIndex: 9999 }} >
                    <Image style={{ width: 25, height: 25, resizeMode: 'contain', tintColor: 'green' }} source={require('../../assets/previous.png')} />
                </Pressable>
                <MapView
                    ref={mapRef => (this.mapRef = mapRef)}
                    style={styles.map}
                    provider={PROVIDER_GOOGLE}
                    showUserLocation
                    followUserLocation
                    loadingEnabled
                    initialRegion={{
                        latitude: this.state.latitude,
                        longitude: this.state.longitude,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA
                    }}
                // region={this.getMapRegion()}
                ><MapViewDirections
                        origin={{ latitude: this.state.latitude, longitude: this.state.longitude }}
                        destination={this.state?.tripEndPoint}
                        apikey={globle.GOOGLE_MAPS_APIKEY_V2}
                        strokeWidth={6}
                        strokeColor="red"
                        optimizeWaypoints={true}
                        onStart={(params) => {
                            console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
                        }}
                        onReady={result => {
                            this.setState({
                                Distance: result.distance,
                                Duration: result.duration
                            });
                        }}
                        onError={(errorMessage) => {
                            console.log('GOT_AN_ERROR', JSON.stringify(errorMessage));
                        }}
                    />
                    <Polyline coordinates={this.state.routeCoordinates} strokeWidth={5} strokeColor="green" />
                    <Marker.Animated
                        // ref={marker => {
                        //   this.marker = marker;
                        // }}
                        ref={marker => (this.marker = marker)}
                        coordinate={this.state.coordinate}
                    >
                        <Image
                            source={require('../../assets/data/auto_rickshaw.png')}
                            style={{
                                width: 55,
                                height: 55,
                                resizeMode: 'contain',
                                transform: [{ rotate: `${this.state.heading}deg` }],
                            }}
                        />
                    </Marker.Animated>
                </MapView>
                <View style={styles.buttonContainer}>

                    <TouchableOpacity style={[styles.bubble, styles.button]}>
                        <Text style={styles.bottomBarContent}>
                            {parseFloat(this.state.distanceTravelled).toFixed(2)} km
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
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
