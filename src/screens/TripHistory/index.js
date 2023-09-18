/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * https://www.google.com/maps/dir/Noida,+Uttar+Pradesh/Gurugram,+Haryana/@28.5563204,77.0362189,11z/data=!3m1!4b1!4m13!4m12!1m5!1m1!1s0x390ce5a43173357b:0x37ffce30c87cc03f!2m2!1d77.3910265!2d28.5355161!1m5!1m1!1s0x390d19d582e38859:0x2cf5fe8e5c64b1e!2m2!1d77.0266383!2d28.4594965?entry=ttu
 * @format
 */


import React from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    FlatList,
    Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from './styles';


const TripHistoryScreen = () => {

    const navigate = useNavigation();
    const [historyData, setHistoryData] = React.useState([{ id: 1, name: 'Prashant Verma' }, { id: 2, name: 'Prashant Verma' }, { id: 3, name: 'Prashant Verma' }, { id: 4, name: 'Prashant Verma' }, { id: 5, name: 'Prashant Verma' }, { id: 6, name: 'Prashant Verma' }]);

    React.useEffect(() => {
        // AppState.addEventListener('change', _handleAppStateChange);
        return () => {
            // console.log('addEventListener');
        };
    }, [false]);

    const renderHistoryView = () => {
        return <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: 10, borderBottomColor: 'grey', borderBottomWidth: 0.5, }}>
            <View style={{ width: 60, height: 60, backgroundColor: '#F5F5F5', borderRadius: 150, marginRight: 10 }}>
                <Image style={{ width: 25, height: 25, alignSelf: 'center', marginTop: 15, marginLeft: 5, elevation: 5 }} source={require('../../assets/map_pointer.png')} />
            </View>
            <View>
                <Text style={{ fontWeight: 'bold' }}>Pragati Maidan</Text>
                <Text style={{}} >Pragati Maidan, New Delhi, Delhi 110001</Text>
            </View>
        </TouchableOpacity>
    }

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 35, padding: 15, borderBottomWidth: 1, borderColor: 'grey' }}>
                <TouchableOpacity onPress={() => navigate.goBack()} style={{ padding: 5 }}>
                    <Image style={{ width: 20, height: 20, resizeMode: 'contain' }} source={require('../../assets/left_icon.png')} />
                </TouchableOpacity>
                <Text style={{ flex: 1, textAlign: 'center', color: '#000000', fontWeight: 'bold' }}>Trip History</Text>
            </View>
            <View>
                <FlatList
                    data={historyData}
                    keyExtractor={(e) => e.id}
                    renderItem={(items) => renderHistoryView(items)}
                />
            </View>
        </View>
    );
};

export default TripHistoryScreen;