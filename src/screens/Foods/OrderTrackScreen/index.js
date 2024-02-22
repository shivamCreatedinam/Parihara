import { View, Text, TouchableOpacity, StatusBar, Image, FlatList, Dimensions, StyleSheet } from 'react-native';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
import MapViewDirections from 'react-native-maps-directions';
import MapView, { Marker } from 'react-native-maps';
import Toast from 'react-native-toast-message';
import globle from '../../../../common//env';
import React from 'react';

const { width, height } = Dimensions.get('window');
const LATITUDE_DELTA = 0.012;
const LONGITUDE_DELTA = 0.012;

const FoodOrderTrackScreen = () => {

    const navigation = useNavigation();
    const routes = useRoute();
    const markerRef = React.useRef();
    const mapRef = React.useRef();

    const showErrorToast = (msg, orderReciptId) => {
        Toast.show({
            type: 'success',
            text1: 'Download Order Recipt ' + orderReciptId + '',
            text2: msg
        });
    }

    return (
        <View style={{ flex: 1, marginTop: StatusBar.currentHeight, height: Dimensions.get('screen').height }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 7, backgroundColor: '#ffffff', elevation: 5 }}>
                <TouchableOpacity hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }} onPress={() => navigation.goBack()} style={{ padding: 14 }}>
                    <Image style={{ height: 20, width: 20, resizeMode: 'contain', marginRight: 10 }} source={require('../../../assets/left_icon.png')} />
                </TouchableOpacity>
                <View>
                    <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Track Order</Text>
                    <Text style={{ fontWeight: 'bold', fontSize: 12, color: '#b4b4b4' }}>#092302912PLOK</Text>
                </View>
            </View>
            <View
                style={{ flex: 1, backgroundColor: '#ffffff'}} >
                <View style={{ flexGrow: 1 }} >
                    <MapView
                        ref={mapRef}
                        style={{ height: height, width: width }}
                        mapType={MapView.MAP_TYPES.TERRIN}
                        showsIndoors={true}
                        key={globle.GOOGLE_MAPS_APIKEY_V2}
                        showUserLocation
                        followUserLocation
                        minZoomLevel={8}
                        maxZoomLevel={18}
                        showsTraffic={false}
                        showsBuildings={false}
                        showsCompass={false}
                        initialRegion={{
                            latitude: parseFloat('28.7520436'),
                            longitude: parseFloat('77.2008686'),
                            latitudeDelta: LATITUDE_DELTA,
                            longitudeDelta: LONGITUDE_DELTA,
                        }}
                    >
                        <MapViewDirections
                            origin={{ latitude: parseFloat('28.7520436'), longitude: parseFloat('77.2008686') }}
                            destination={{ latitude: parseFloat('28.7092385'), longitude: parseFloat('77.1870097') }}
                            apikey={globle.GOOGLE_MAPS_APIKEY_V2}
                            mode={'DRIVING'}
                            strokeWidth={6}
                            strokeColor={'green'}
                            optimizeWaypoints={true}
                            onStart={(params) => {
                                console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
                            }}
                            onReady={result => {
                                mapRef.current.fitToCoordinates(result.coordinates, {
                                    edgePadding: { top: 50, right: 50, bottom: 50, left: 50, }
                                });
                            }}
                            onError={(errorMessage) => {
                                console.log('GOT_AN_ERROR', JSON.stringify(errorMessage));
                            }}
                        />
                        <Marker
                            ref={markerRef}
                            coordinate={{ latitude: parseFloat('28.7092385'), longitude: parseFloat('77.1870097') }}
                            title={'title'}
                            description={'description'}
                        >
                            <Image style={{ width: 50, height: 50, resizeMode: 'contain' }} source={require('../../../assets/greenMarker.png')} />
                        </Marker>
                        <Marker
                            ref={markerRef}
                            coordinate={{ latitude: parseFloat('28.7520436'), longitude: parseFloat('77.2008686') }}
                            title={'title'}
                            description={'description'}
                        >
                            <Image style={{ width: 50, height: 50, resizeMode: 'contain' }} source={require('../../../assets/greenMarker.png')} />
                        </Marker>
                    </MapView>
                </View>
            </View>
        </View>
    )
}

export default FoodOrderTrackScreen


const styles = StyleSheet.create({})