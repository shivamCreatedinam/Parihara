import { View, Text, TouchableOpacity, StatusBar, Image, FlatList, Dimensions } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import React from 'react';

const CartScreenFood = () => {


    const [DataCart, setDataCart] = React.useState([{ id: 0 }, { id: 1 }, { id: 2 }])
    const navigation = useNavigation();


    const renderItemsCard = (item) => {
        return (
            <View style={{ margin: 5, backgroundColor: '#ffffff', elevation: 5, borderRadius: 20 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 5 }}>
                    <TouchableOpacity hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }} style={{ padding: 10 }}>
                        <Image style={{ height: 110, width: 110, resizeMode: 'cover', marginRight: 10, borderRadius: 15 }} source={{ uri: 'https://images.squarespace-cdn.com/content/v1/63120ad437b82d25a00b57a7/1662129666499-6EV1U19KMVD9CE3A2TQ6/unsplash-image-H2RzlOijhlQ.jpg' }} />
                    </TouchableOpacity>
                    <View style={{ marginRight: 20, flex: 1 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 18 }}>FRENCH FRIES</Text>
                        <Text style={{ fontWeight: 'bold', fontSize: 14, color: '#b4b4b4' }}>Fries, nuggets & poppers to calm your hunger, quick solution to hunger pangs. Never compromise on the taste.</Text>
                        <Text style={{ fontWeight: 'bold', fontSize: 12, color: '#b4b4b4' }}>EASY BITES</Text>
                        <Text style={{ fontWeight: 'bold', fontSize: 18 }}>₹ 99</Text>
                    </View>
                </View>
                <TouchableOpacity hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }} style={{ position: 'absolute', top: 10, right: 10, }}>
                    <Image style={{ height: 20, width: 20, resizeMode: 'contain' }} source={require('../../../assets/cancel.png')} />
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View style={{ flex: 1, marginTop: StatusBar.currentHeight, height: Dimensions.get('screen').height }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 7, backgroundColor: '#ffffff', elevation: 5 }}>
                <TouchableOpacity hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }} onPress={() => navigation.goBack()} style={{ padding: 10 }}>
                    <Image style={{ height: 20, width: 20, resizeMode: 'contain', marginRight: 10 }} source={require('../../../assets/left_icon.png')} />
                </TouchableOpacity>
                <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Cart</Text>
            </View>
            <View
                style={{ flex: 1, padding: 5, backgroundColor: '#ffffff', marginTop: 1, }} >
                <View
                    style={{ flexGrow: 1, marginTop: 2, }} >
                    <FlatList
                        style={{ height: Dimensions.get('screen').height / 1, marginTop: 2, }}
                        data={DataCart}
                        keyExtractor={(id) => id}
                        renderItem={({ item }) => renderItemsCard(item)}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
                <View style={{ padding: 15, position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#000000', zIndex: 9999, elevation: 5 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                        <Text style={{ fontWeight: 'bold', flex: 1, color: '#ffffff' }}>Item's</Text>
                        <Text style={{ color: '#ffffff' }}>x{DataCart.length}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                        <Text style={{ fontWeight: 'bold', flex: 1, color: '#ffffff' }}>Total Amount</Text>
                        <Text style={{ color: '#ffffff' }}>₹500</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontWeight: 'bold', flex: 1, color: '#ffffff' }}>Delivey Charges</Text>
                        <Text style={{ color: '#ffffff' }}>₹50</Text>
                    </View>
                    <View style={{ width: '100%', height: 1, backgroundColor: '#b4b4b4', marginVertical: 10 }} />
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                        <Text style={{ fontWeight: 'bold', flex: 1, color: '#ffffff' }}>Total Amount</Text>
                        <Text style={{ color: '#ffffff' }}>₹500</Text>
                    </View>
                    <TouchableOpacity hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }} style={{ paddingVertical: 18, backgroundColor: '#3b8132', borderRadius: 6, paddingHorizontal: 15, elevation: 5 }}>
                        <Text style={{ color: '#ffffff', fontWeight: 'bold', textTransform: 'uppercase', textAlign: 'center' }}>Proceed To Pay</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default CartScreenFood