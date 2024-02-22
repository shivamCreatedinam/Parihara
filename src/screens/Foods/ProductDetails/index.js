import React from 'react';
import { Text, View, RefreshControl, Image, ActivityIndicator, ScrollView, Dimensions, TextInput, StatusBar, TouchableOpacity, useWindowDimensions, StyleSheet } from 'react-native';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import { decode as atob, encode as btoa } from 'base-64';

export default function ProductDetails() {

    const [productData, setProductData] = React.useState(null);
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const [isLoading, setLoading] = React.useState(false);
    const navigation = useNavigation();
    const route = useRoute();


    useFocusEffect(
        React.useCallback(() => {
            loadProducts(route.params);
            return () => {
                // Useful for cleanup functions
            };
        }, [])
    );

    const onRefresh = () => {
        loadProducts(route?.params);
    }

    const loadProducts = async (id) => {
        setLoading(true);
        const apiKey = 'ck_f740f56a6ca5bf6083be8fa400b2558cf2e52312';
        const apiSecret = 'cs_5eefb96bb75f2e4892d240989cbcd4c2fd830138';
        const productId = 1; // Replace with your actual product ID
        const apiUrl = `https://restaurant.createdinam.in/wp-json/wc/v3/products/${id}`;

        fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${btoa(`${apiKey}:${apiSecret}`)}`
            }
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setLoading(false);
                setProductData(data);
                // Handle the product details here
            })
            .catch(error => setLoading(false));
    }

    return (
        <View>
            <View style={{ padding: 20, marginTop: StatusBar.currentHeight, flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image style={{ width: 25, height: 25 }} source={require('../../../assets/left_icon.png')} />
                </TouchableOpacity>
                <Text style={{ flex: 1, fontWeight: 'bold', marginLeft: 20, fontSize: 16 }}>{productData?.name}</Text>
            </View>
            {isLoading === true ?
                <ActivityIndicator size="large" color="#0000ff" /> :
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={() => onRefresh()}
                            tintColor="red"
                        />
                    }
                >
                    <View>
                        <Image style={{ height: 400, width: Dimensions.get('screen').width, resizeMode: 'cover' }} source={{ uri: productData?.acf?.product_images }} />
                        <View style={{ padding: 20, position: 'absolute', bottom: 5, right: 10 }}>
                            <Image style={{ width: 12, height: 12, resizeMode: 'contain', tintColor: '#ffffff' }} source={require('../../../assets/profile_icon.png')} />
                            <Text style={{ color: '#ffffff', textAlign: 'center', fontWeight: 'bold', fontSize: 14 }}>{JSON.stringify(productData?.rating_count)}</Text>
                        </View>
                    </View>
                    <View style={{ padding: 20 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ flex: 1, fontWeight: 'bold', fontSize: 26, textTransform: 'capitalize' }}>{productData?.name}</Text>
                            <View>
                                <Text style={{ textDecorationLine: 'line-through', textDecorationStyle: 'solid', fontWeight: 'bold', fontSize: 22, color: '#b4b4b4' }}>₹ {productData?.regular_price === null ? '' : productData?.regular_price}/-</Text>
                                <Text style={{ fontWeight: 'bold', fontSize: 26 }}>₹ {productData?.sale_price}/-</Text>
                            </View>
                        </View>
                        <View style={{ paddingVertical: 10 }}>
                            {productData?.categories.map((items, index) => <Text style={{ paddingVertical: 5, backgroundColor: '#fff', color: '#000000', fontWeight: 'bold', fontSize: 16, textTransform: 'capitalize' }}>{items?.name}</Text>)}
                        </View>
                        <Text style={{ fontWeight: 'bold', color: '#000000', fontSize: 16 }}>{productData?.short_description.replace(/<\/?[^>]+(>|$)/g, "")}</Text>
                        <Text style={{ fontWeight: '900', fontSize: 16, color: '#b4b4b4' }}>{productData?.description.replace(/<\/?[^>]+(>|$)/g, "")}</Text>
                    </View>
                    <View style={{ position: 'absolute', top: 20, right: 20 }}>
                        <Text style={{ fontSize: 14, color: '#ffffff' }}>Rating {productData?.average_rating}</Text>
                    </View>
                    <View style={{ padding: 20 }}>
                        <TouchableOpacity style={{ padding: 20, backgroundColor: '#000000', borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                            <Image style={{ width: 25, height: 25, tintColor: '#ffffff' }} source={require('../../../assets/super_market_icon.png')} />
                            <Text style={{ color: '#ffffff', marginLeft: 30, fontWeight: 'bold', fontSize: 16, textTransform: 'uppercase' }}>Order Now</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>}
        </View>
    )
}

const styles = StyleSheet.create({
    a: {
        fontWeight: '300',
        color: '#FF3366', // make links coloured pink
    },
})