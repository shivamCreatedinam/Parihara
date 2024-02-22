import { View, Text, TouchableOpacity, StatusBar, Image, FlatList, Dimensions, StyleSheet } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import React from 'react';

const FoodOrderHistoryScreen = () => {

    const [DataCart, setDataCart] = React.useState([{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]);
    const navigation = useNavigation();

    const showErrorToast = (msg, orderReciptId) => {
        Toast.show({
            type: 'success',
            text1: 'Download Order Recipt ' + orderReciptId + '',
            text2: msg
        });
    }

    const renderItemsCard = (item) => {
        return (
            <View style={{ margin: 5, backgroundColor: '#ffffff', elevation: 5, borderRadius: 20 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 20, paddingTop: 10 }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#666362' }}>Order : 0923029{item.id}PLOK</Text>
                        <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#b4b4b4' }}>1{item?.id} February 2024 At 5:{item?.id}4Pm  </Text>
                    </View>
                    <TouchableOpacity onPress={() => showErrorToast('Download Order Recipt in progress...', '0923029' + item?.id + 'PLOK')} hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }} style={{ backgroundColor: '#000000', padding: 8, borderRadius: 5, marginRight: 15 }}>
                        <Image style={{ height: 20, width: 20, resizeMode: 'contain', tintColor: '#ffffff' }} source={require('../../../assets/bills.png')} />
                    </TouchableOpacity>
                </View>
                <View style={{ width: '100%', height: 1, backgroundColor: '#b4b4b4', marginVertical: 10 }} />
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 5 }}>
                    <TouchableOpacity hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }} style={{ padding: 10 }}>
                        <Image style={{ height: 110, width: 110, resizeMode: 'cover', marginRight: 10, borderRadius: 15 }} source={{ uri: 'https://images.squarespace-cdn.com/content/v1/63120ad437b82d25a00b57a7/1662129666499-6EV1U19KMVD9CE3A2TQ6/unsplash-image-H2RzlOijhlQ.jpg' }} />
                    </TouchableOpacity>
                    <View style={{ marginRight: 20, flex: 1 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 18 }}>FRENCH FRIES</Text>
                        <Text numberOfLines={2} style={{ fontWeight: 'bold', fontSize: 14, color: '#b4b4b4' }}>Fries, nuggets & poppers to calm your hunger, quick solution to hunger pangs. Never compromise on the taste.</Text>
                        <Text style={{ fontWeight: 'bold', fontSize: 12, color: '#b4b4b4' }}>EASY BITES</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>₹ 99</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                <View style={{ width: 10, height: 10, borderWidth: 1, borderColor: '#3b8132', borderRadius: 5, marginRight: 5, backgroundColor: '#3b8132', elevation: 5 }} />
                                <Text style={{ fontWeight: 'bold', color: '#3b8132' }}>Order Delivered</Text>
                            </View>
                            {item.id === 2 ?
                                <TouchableOpacity onPress={() => navigation.navigate('FoodOrderTrackScreen')} style={{ borderRadius: 1, borderWidth: 1, paddingVertical: 5, paddingHorizontal: 15, borderRadius: 5, backgroundColor: '#000000', elevation: 5 }}>
                                    <Text style={{ fontWeight: 'bold', color: '#FFFFFF' }}>Track Order</Text>
                                </TouchableOpacity> : null}
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    return (
        <View style={{ flex: 1, marginTop: StatusBar.currentHeight, height: Dimensions.get('screen').height }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 7, backgroundColor: '#ffffff', elevation: 5 }}>
                <TouchableOpacity hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }} onPress={() => navigation.goBack()} style={{ padding: 10 }}>
                    <Image style={{ height: 20, width: 20, resizeMode: 'contain', marginRight: 10 }} source={require('../../../assets/left_icon.png')} />
                </TouchableOpacity>
                <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Orders</Text>
            </View>
            <View
                style={{ flex: 1, padding: 5, backgroundColor: '#ffffff', marginTop: 1, }} >
                <View
                    style={{ flexGrow: 1, marginTop: 2, }} >
                    <FlatList
                        style={{}}
                        data={DataCart}
                        keyExtractor={(id) => id}
                        renderItem={({ item }) => renderItemsCard(item)}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </View>
        </View>
    )
}

export default FoodOrderHistoryScreen


const styles = StyleSheet.create({})