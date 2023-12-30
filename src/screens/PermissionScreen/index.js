import { Text, View, TouchableOpacity, Image, PermissionsAndroid, BackHandler } from 'react-native'
import React, { Component } from 'react';

export default class PermissionScreenMain extends Component {

    constructor(props) {
        super(props);
        this.state = {
            cameraPermission: false,
            locationPermission: false,
            locationBackgroundPermission: false,
            filePermission: false,
        }
    }

    async componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackClick);
        this.props.navigation.addListener('focus', () => {
            this.componentDidFocus()
        });
    }

    onBackClick() {
        console.log("You can use the camera");
    }

    componentDidFocus = () => {
        this.CameraPermission();
    };


    requestLocationPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Parihara App',
                    message: 'Parihara App needs to access your Location',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'Okay',
                },
            );

            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                Geolocation.getCurrentPosition(
                    position => {
                        console.log('position coords', position.coords);
                        const { latitude, longitude } = position.coords;
                        console.log('lat and long', latitude, longitude);
                        this.setState({ locationPermission: true });
                    },
                    error => {
                        console.log('Error getting location:', error.code, error.message);
                        this.setState({ locationPermission: false });
                    },
                    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
                );

            } else {
                console.log('Location permission denied');

            }
        } catch (error) {
            console.error('Error in location permission:', error);
        }
    };

    async CameraPermission(params) {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    'title': 'Cool Photo App Camera Permission',
                    'message': 'Cool Photo App needs access to your camera ' +
                        'so you can take awesome pictures.'
                }
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("You can use the camera")
                this.setState({ cameraPermission: true });
            } else {
                console.log("Camera permission denied")
                this.setState({ cameraPermission: false });
            }
        } catch (err) {
            console.warn(err)
        }
    }


    render() {
        return (
            <View style={{ padding: 30, backgroundColor: 'black', flex: 1, }}>
                <Text style={{ color: '#fff', marginTop: 50, fontSize: 25 }}>App Permission</Text>
                <View style={{ flex: 1 }}>
                    <View style={{ marginBottom: 20 }}>
                        <Image style={{ height: 250, width: 250, resizeMode: 'contain', alignSelf: 'center' }} source={require('../../assets/ic_launcher_round.jpg')} />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 15 }}>
                        <Text style={{ fontSize: 14, color: '#fff', flex: 1 }}>Location Permission</Text>
                        <Image style={{ height: 20, width: 20, resizeMode: 'contain', alignSelf: 'center', tintColor: 'red' }} source={require('../../assets/circle_green.png')} />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 15 }}>
                        <Text style={{ fontSize: 14, color: '#fff', flex: 1 }}>Location Background Permission</Text>
                        <Image style={{ height: 20, width: 20, resizeMode: 'contain', alignSelf: 'center', tintColor: 'red' }} source={require('../../assets/circle_green.png')} />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 15 }}>
                        <Text style={{ fontSize: 14, color: '#fff', flex: 1 }}>Camera Permission {this.state.cameraPermission}</Text>
                        <Image style={{ height: 20, width: 20, resizeMode: 'contain', alignSelf: 'center', tintColor: this.state.cameraPermission === true ? null : 'red' }} source={require('../../assets/circle_green.png')} />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 15 }}>
                        <Text style={{ fontSize: 14, color: '#fff', flex: 1 }}>File Permission</Text>
                        <Image style={{ height: 20, width: 20, resizeMode: 'contain', alignSelf: 'center', tintColor: 'red' }} source={require('../../assets/circle_green.png')} />
                    </View>
                </View>
                <View>
                    <TouchableOpacity style={{ paddingHorizontal: 20, paddingVertical: 15, elevation: 5, borderRadius: 10, backgroundColor: '#fff' }}>
                        <Text style={{ color: '#000', textAlign: 'center', fontWeight: 'bold', textTransform: 'uppercase' }}>Continue </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}