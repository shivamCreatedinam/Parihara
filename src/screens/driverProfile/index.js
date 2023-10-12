/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * https://www.google.com/maps/dir/Noida,+Uttar+Pradesh/Gurugram,+Haryana/@28.5563204,77.0362189,11z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x390ce5a43173357b:0x37ffce30c87cc03f!2m2!1d77.3910265!2d28.5355161!1m5!1m1!1s0x390d19d582e38859:0x2cf5fe8e5c64b1e!2m2!1d77.0266383!2d28.4594965?entry=ttu
 * @format
 */


import React from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Text,
    Alert,
    Image,
} from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import { showMessage } from "react-native-flash-message";
import ImagePicker from 'react-native-image-crop-picker';
import RNRestart from 'react-native-restart';
import info from '../../../package.json';
import globle from '../../../common/env';
import Toast from 'react-native-toast-message';
import styles from './styles';
// import Ionicons from "react-native-vector-icons/Ionicons";
import Colors from '../../../common/Colour';

const DriverProfileScreen = () => {

    const navigate = useNavigation();
    const routes = useRoute();
    const [loading, setLoading] = React.useState(false);
    let [driverData, setDriverData] = React.useState(false);
    const [uploadProfile, setuploadProfile] = React.useState(null);
    let [verified, setVerified] = React.useState('No');

    React.useEffect(() => {
        // AppState.addEventListener('change', _handleAppStateChange);
        return () => {
            // console.log('addEventListener');
        };
    }, [false]);

    const showSuccessToast = (msg) => {
        navigate.navigate('DriverProfileScreen');
        Toast.show({
            type: 'success',
            text1: 'Login Success',
            text2: msg,
        });
    }

    React.useEffect(() => {
        // const dataRef = database().ref('/users/');
        // dataRef.on('value', snapshot => {
        //     const newData = [];
        //     snapshot.forEach(childSnapshot => {
        //         newData.push(childSnapshot.val());
        //     });
        //     console.log(newData)
        //     setData(newData);
        // });
        getProfileDriverData();
        return () => {
            // dataRef.off(); // Clean up the listener when the component unmounts
        };
    }, []);

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
                console.log('getProfileDriverData', response.data.driver?.duty_status);
                if (response.data.status) {
                    setDriverData(response.data.driver);
                    setVerified(response.data.driver.verified);
                    setLoading(false);
                } else {
                    setLoading(false);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    function goBackEndTrip() {
        Alert.alert(
            'Driver Loggout',
            'Are you sure, want to logged out?',
            [
                { text: 'Cancel', onPress: () => console.log('cancel') },
                { text: 'OK', onPress: () => loggoutUser() },
            ]
        );
    }

    const loggoutUser = async () => {
        let keys = [];
        try {
            keys = await AsyncStorage.getAllKeys();
            console.log(`Keys: ${keys}`) // Just to see what's going on
            await AsyncStorage.multiRemove(keys);
            await AsyncStorage.multiRemove(keys);
            // navigate.replace('SplashAppScreen');
            showMessage({
                message: "Loggout Successfull!",
                description: "Congratulations, Loggout successfully!",
                type: "success",
            });
            RNRestart.restart();
            navigate.reset();
        } catch (e) {
            console.log(e)
        }
        console.log('Done');
    }

    const updateUserProfile = async () => {
        setLoading(true)
        const valueX = await AsyncStorage.getItem('@autoDriverGroup');
        let data = JSON.parse(valueX)?.id;
        var formdata = new FormData();
        formdata.append("image", { uri: uploadProfile, name: 'file_aadhar_photo.png', filename: 'file_aadhar_photo.png', type: 'image/png' });
        formdata.append("driver_id", data);
        console.log('uploadProfile', valueX)
        var requestOptions = {
            method: 'POST',
            body: formdata,
            redirect: 'follow',
        };
        console.log('uploadProfile', requestOptions)
        fetch(globle.API_BASE_URL + 'driver-profile-image', requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log('uploadProfileX', result)
                if (result.status) {
                    setLoading(false)
                    Toast.show({
                        type: 'success',
                        text1: 'Congratulations!',
                        text2: result?.message,
                    });
                    getProfileDriverData();
                } else {
                    // setLoading(false);
                    updateUserProfile();
                    // Toast.show({
                    //     type: 'success',
                    //     text1: 'Something went wrong!',
                    //     text2: result?.message,
                    // });
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

    const uplodProfilePhotoCard = () => {
        ImagePicker.openCamera({
            width: 400,
            height: 400,
            cropping: true
        }).then(image => {
            console.log(image.path);
            setuploadProfile(image.path);
            updateUserProfile();
        });
    }

    return (
        <View style={styles.container}>
            <Spinner
                visible={loading}
                textContent={'Loading...'}
                textStyle={{ color: 'black', fontSize: 12 }}
            />
            <View style={{ flexDirection: 'row', alignItems: 'center', zIndex: 9999 }}>
                <TouchableOpacity style={{ paddingLeft: 15, paddingRight: 15 }} onPress={() => navigate.goBack()}>
                    <Image style={{ width: 20, height: 20, resizeMode: 'contain', padding: 10 }} source={require('../../assets/left_icon.png')} />
                </TouchableOpacity>
                <Text style={{ textAlign: 'center', flex: 1, fontWeight: 'bold', marginLeft: -20, color: 'black', fontSize: 18 }} >Profile</Text>
                <TouchableOpacity onPress={() => goBackEndTrip()}>
                    <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('../../assets/power_off.png')} />
                </TouchableOpacity>
            </View>
            <View style={{ padding: 20, alignItems: 'center' }}>
                <TouchableOpacity
                    onPress={() => uplodProfilePhotoCard()}
                    style={{ paddingTop: 20 }}>
                    <Image
                        style={{ width: 110, height: 110, resizeMode: 'contain', borderRadius: 150, elevation: 5 }}
                        source={{ uri: globle.IMAGE_BASE_URL + driverData?.drv_image }} />
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {verified === 'Yes' ? <Image style={{ width: 20, height: 20, resizeMode: 'contain', marginRight: 4 }} source={require('../../assets/verified.png')} /> : null}
                    <Text>{driverData?.name}</Text>
                </View>
                <TouchableOpacity onPress={() => showSuccessToast('Coming soon!')} style={{ flexDirection: 'row', alignItems: 'center', padding: 15, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 35 }}>
                    <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('../../assets/driver_profile.png')} />
                    <Text style={{ fontWeight: 'bold', color: '#000000', marginLeft: 10 }}>Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => showSuccessToast('Coming soon!')} style={{ flexDirection: 'row', alignItems: 'center', padding: 15, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 20 }}>
                    <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('../../assets/support.png')} />
                    <Text style={{ fontWeight: 'bold', color: '#000000', marginLeft: 10 }}>Vehicle Details</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => showSuccessToast('Coming soon!')} style={{ flexDirection: 'row', alignItems: 'center', padding: 15, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 20 }}>
                    <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('../../assets/activity_history.png')} />
                    <Text style={{ fontWeight: 'bold', color: '#000000', marginLeft: 10 }}>Earning History</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => showSuccessToast('Coming soon!')} style={{ flexDirection: 'row', alignItems: 'center', padding: 15, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 20 }}>
                    <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('../../assets/history.png')} />
                    <Text style={{ fontWeight: 'bold', color: '#000000', marginLeft: 10 }}>Booking History</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => showSuccessToast('Coming soon!')} style={{ flexDirection: 'row', alignItems: 'center', padding: 15, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 20 }}>
                    <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('../../assets/privacy.png')} />
                    <Text style={{ fontWeight: 'bold', color: '#000000', marginLeft: 10 }}>Privacy Policy</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => showSuccessToast('Coming soon!')} style={{ flexDirection: 'row', alignItems: 'center', padding: 15, alignSelf: 'flex-start', elevation: 5, backgroundColor: '#ffffff', width: '100%', borderRadius: 50, marginTop: 20 }}>
                    <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('../../assets/home_shield.png')} />
                    <Text style={{ fontWeight: 'bold', color: '#000000', marginLeft: 10 }}>Terms & Conditions</Text>
                </TouchableOpacity>
            </View>
            <Text style={{ flex: 1, textAlign: 'center', fontSize: 12, color: 'black', marginTop: 30, fontWeight: 'bold' }}>v {info.version}</Text>
        </View>
    )
};

export default DriverProfileScreen;  //drv_image