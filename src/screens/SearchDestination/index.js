/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * https://www.google.com/maps/dir/Noida,+Uttar+Pradesh/Gurugram,+Haryana/@28.5563204,77.0362189,11z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x390ce5a43173357b:0x37ffce30c87cc03f!2m2!1d77.3910265!2d28.5355161!1m5!1m1!1s0x390d19d582e38859:0x2cf5fe8e5c64b1e!2m2!1d77.0266383!2d28.4594965?entry=ttu
 * @format
 */


import React from 'react';
import {
    Image,
    View,
    TouchableOpacity,
    Text,
    Dimensions,
    Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AddressPickup from '../../../common/AddressPickup';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
import styles from './styles';

const SearchDestinationScreen = () => {

    const navigate = useNavigation();
    const [Destinationstate, setDestinationState] = React.useState({ destinationCords: {} });
    const [Dropstate, setDropState] = React.useState({ dropCords: {} });


    React.useEffect(() => {
        // AppState.addEventListener('change', _handleAppStateChange);
        return () => {
            // console.log('addEventListener');
        };
    }, [false]);


    const fetchDropCords = (locations) => {
        setDropState({
            ...Dropstate,
            dropCords: {
                latitude: locations?.geometry?.location?.lat,
                longitude: locations?.geometry?.location?.lng,
                name: locations?.name,
                icon: locations?.icon,
            }
        })
        ShareLocation(locations);
    }

    const ShareLocation = async (locations) => {
        let sendDetails = {
            type: 'ToDestination',
            latitude: locations?.geometry?.location?.lat,
            longitude: locations?.geometry?.location?.lng,
            name: locations?.name,
            icon: locations?.icon,
        }
        console.log(JSON.stringify(sendDetails));
        const jsonValue = JSON.stringify(sendDetails);
        await AsyncStorage.setItem('@autoEndTrip', jsonValue);
        console.log('save_end_trip');
        navigate.replace('TripCreateScreen', sendDetails);
    }


    return (
        <View style={styles.container}>
            <View style={{ padding: 10, borderBottomColor: 'black', borderBottomWidth: 1, flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity style={{}} onPress={() => navigate.goBack()}>
                    <Image style={{ height: 20, width: 20, resizeMode: 'contain', }} source={require('../../assets/left_icon.png')} />
                </TouchableOpacity>
                <Text style={{ textAlign: 'center', fontWeight: 'bold', flex: 1, }}>Pick Drop Location</Text>
            </View>
            <View style={{ flexDirection: 'column', alignItems: 'center', zIndex: 9999 }}>
                <View style={{ height: 260, width: Dimensions.get('screen').width - 10, zIndex: 999, right: 0, padding: 10 }}>
                    <AddressPickup
                        placheholderText={"Enter Drop Location"}
                        fetchAddress={fetchDropCords}
                    />
                    {Object.keys(Dropstate.dropCords).length > 0 ?
                        <Pressable onPress={() => console.log('click drop')} style={{ position: 'absolute', right: 25, top: 45, zIndex: 9999 }}>
                            <Image style={{ height: 20, width: 20, resizeMode: 'contain', }} source={require('../../assets/red_cross.png')} />
                        </Pressable> : null}
                </View>
            </View>
            <View style={{ alignItems: 'center', flex: 1 }}>
                <Image style={{ width: width, height: width / 1.5, resizeMode: 'contain' }} source={require('../../assets/How_to_Fix_No_LocationFound.jpeg')} />
            </View>
        </View>
    );
};

export default SearchDestinationScreen;