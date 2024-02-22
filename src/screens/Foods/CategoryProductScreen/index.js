import React from 'react';
import { Text, View, RefreshControl, Image, FlatList, ScrollView, Dimensions, ActivityIndicator, StatusBar, TouchableOpacity, useWindowDimensions, StyleSheet } from 'react-native';
import { useNavigation, useFocusEffect, useRoute } from '@react-navigation/native';
import { decode as atob, encode as btoa } from 'base-64';

export default function CategoryProductDetails() {

    const [productData, setProductData] = React.useState(null);
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const [isLoading, setLoading] = React.useState(false);
    const navigation = useNavigation();
    const route = useRoute();


    useFocusEffect(
        React.useCallback(() => {
            loadProducts(route.params);
            console.log(route.params);
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
        const productId = 1; // Replace with your actual product ID : 
        const apiUrl = `https://restaurant.createdinam.in//wp-json/wp/v2/product?filter${id}`;

        fetch(apiUrl, {
            method: 'GET',
            // headers: {
            //     'Authorization': `Basic ${btoa(`${apiKey}:${apiSecret}`)}`,
            // }
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setLoading(false);
                setProductData(data);
                setIsRefreshing(false);
                // Handle the product details here
            })
            .catch(error => setLoading(false));
    }

    const GoToProductDetails = (info) => {
        navigation.navigate('ProductDetails', info);
    }

    const renderItemsCard = (item) => {

        console.log('renderItemsCard', JSON.stringify(item));

        return (
            <View style={{ backgroundColor: '#fff', width: Dimensions.get('screen').width / 2 - 23, borderRadius: 20, margin: 5, elevation: 5 }}>
                <TouchableOpacity onPress={() => GoToProductDetails(item?.id)}>
                    <Image style={{ width: '100%', height: 160, resizeMode: 'cover', alignSelf: 'center', borderTopLeftRadius: 20, borderTopRightRadius: 20 }} source={{ uri: item?.acf?.product_images }} />
                </TouchableOpacity>
                <View style={{ marginTop: 5 }}>
                    <Text numberOfLines={1} style={{ paddingLeft: 5, color: '#000000', fontWeight: '900', flex: 1, fontSize: 14 }}>{item?.title?.rendered}</Text>
                    <Text adjustsFontSizeToFit={false} numberOfLines={2} style={{ paddingLeft: 5, fontWeight: 'bold', textAlign: 'auto' }}>{item?.content?.rendered?.replace(/<\/?[^>]+(>|$)/g, "")}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, paddingRight: 5, marginTop: 5, flex: 1 }}>
                    <TouchableOpacity style={{ paddingHorizontal: 25, paddingVertical: 4, backgroundColor: '#000', borderRadius: 55, flex: 1 }}>
                        <Text style={{ fontWeight: 'bold', textAlign: 'center', fontSize: 16, color: '#ffffff' }}>View Item</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
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
                    } >
                    <FlatList
                        style={{ marginBottom: 10, marginLeft: 15, }}
                        numColumns={2}
                        horizontal={false}
                        data={productData}
                        keyExtractor={(item, index) => index}
                        renderItem={({ item }) => renderItemsCard(item)}
                    />
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