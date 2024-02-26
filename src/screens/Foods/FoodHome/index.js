import React from 'react';
import { Text, View, ImageBackground, Image, FlatList, ScrollView, Dimensions, TextInput, StatusBar, TouchableOpacity, useWindowDimensions, RefreshControl } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { decode as atob, encode as btoa } from 'base-64';
import { SliderBox } from "react-native-image-slider-box";
import globle from '../../../../common/env';
import axios from 'axios';

// https://example.com/wp-json/wc/v3/products?categories=15&?consumer_key=ck_6b20b87f3dd27c9a9e878a3d5baf03c47656a903&consumer_secret={{consumer_secret}}

const FoodHomeScreen = () => {

    const navigation = useNavigation();
    const { width } = useWindowDimensions();
    const [search, setSearch] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [productData, setProductData] = React.useState([]);
    const [CategoryData, setCategoryData] = React.useState([]);
    const [isRefreshing, setIsRefreshing] = React.useState(false);
    const [OfferBannerImages, setOfferBannerImages] = React.useState([]);
    const [restaurantList, setRestaurantList] = React.useState([]);
    const [DealsOfWeek, setDealsOfWeek] = React.useState([]);

    useFocusEffect(
        React.useCallback(() => {
            loadProducts();
            loadCategorys();
            return () => {
                // Useful for cleanup functions
            };
        }, [])
    );

    const onRefresh = () => {
        //set isRefreshing to true
        setIsRefreshing(true)
        loadProducts();
        loadCategorys();
        // and set isRefreshing to false at the end of your callApiMethod()
    }

    const loadProducts = async () => {
        setLoading(true)
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(valueX)?.token;
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: globle.API_BASE_URL + 'homepage',
            headers: {
                'Authorization': 'Bearer ' + data
            }
        };
        axios.request(config)
            .then((response) => {
                if (response.data.status) {
                    setLoading(false)
                    setProductData(response.data?.popular);
                    setOfferBannerImages(response.data?.slider);
                    setRestaurantList(response.data?.featured);
                    setDealsOfWeek(response.data?.deals_of_week);
                }
            })
            .catch((error) => {
                setLoading(false)
                console.log(error);
            });
    }

    const loadCategorys = async () => {
        setLoading(true)
        const valueX = await AsyncStorage.getItem('@autoUserGroup');
        let data = JSON.parse(valueX)?.token;
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: globle.API_BASE_URL + 'category-list',
            headers: {
                'Authorization': 'Bearer ' + data
            }
        };
        axios.request(config)
            .then((response) => {
                if (response.data.status) {
                    setLoading(false);
                    setCategoryData(response.data?.category);
                    setIsRefreshing(false);
                }
            })
            .catch((error) => {
                setLoading(false)
                console.log(error);
            });
    }

    const GoToProductDetails = (info) => {
        navigation.navigate('ProductDetails', info);
    }

    const renderItemsCard = (item) => {

        return (
            <View style={{ backgroundColor: '#fff', width: Dimensions.get('screen').width / 2 - 23, borderRadius: 20, margin: 5, elevation: 5 }}>
                <TouchableOpacity onPress={() => GoToProductDetails(item)}>
                    <Image style={{ width: '100%', height: 160, resizeMode: 'cover', alignSelf: 'center', borderTopLeftRadius: 20, borderTopRightRadius: 20 }} source={{ uri: 'https://theparihara.com/Parihara/public/' + item?.image }} />
                </TouchableOpacity>
                <View style={{ marginTop: 5 }}>
                    <Text adjustsFontSizeToFit={false} numberOfLines={2} style={{ paddingHorizontal: 10, paddingHorizontal: 5, fontWeight: 'bold', textAlign: 'auto' }}>{item?.description}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 10, paddingRight: 5, marginTop: 5 }}>
                    <View style={{ flex: 1 }}>
                        <Text numberOfLines={1} style={{ paddingLeft: 10, color: '#000000', fontWeight: '900', flex: 1, fontSize: 22 }}>₹ {item?.sale_price}</Text>
                    </View>
                    <TouchableOpacity style={{ paddingHorizontal: 15, paddingVertical: 2, backgroundColor: '#000', borderRadius: 55 }}>
                        <Text style={{ color: '#ffffff', fontWeight: 'bold', paddingVertical: 5, paddingHorizontal: 5 }}>View Item</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    return (
        <ImageBackground
            source={require('../../../assets/background_images.gif')}
            style={{ width: '100%', height: '100%' }}>
            <View style={{ marginTop: StatusBar.currentHeight + 20, paddingLeft: 20, paddingRight: 20, flexDirection: 'row', alignItems: 'center' }}>
                <TextInput style={{ color: '#fff', backgroundColor: '#fff', borderRadius: 20, paddingLeft: 20, elevation: 5, flex: 1 }} placeholder='Find for food or restaurant' />
                <TouchableOpacity onPress={() => navigation.navigate('CartScreenFood')} style={{ padding: 10, backgroundColor: '#fff', borderRadius: 15, marginLeft: 10 }}>
                    <Image style={{ width: 25, height: 25, resizeMode: 'contain' }} source={require('../../../assets/shoppingbag.png')} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('FoodOrderHistoryScreen')} style={{ padding: 10, backgroundColor: '#fff', borderRadius: 15, marginLeft: 10 }}>
                    <Image style={{ width: 25, height: 25, resizeMode: 'contain' }} source={require('../../../assets/order_history.png')} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('FoodNotificationScreen')} style={{ padding: 10, backgroundColor: '#fff', borderRadius: 15, marginLeft: 10 }}>
                    <Image style={{ width: 25, height: 25, resizeMode: 'contain' }} source={require('../../../assets/bell_icon_cart.png')} />
                </TouchableOpacity>
            </View>
            <ScrollView
                style={{ marginTop: 10, flex: 1 }}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={() => onRefresh()}
                        tintColor="red"
                    />
                }>
                <SliderBox
                    sliderBoxHeight={200}
                    dotColor="#FFEE58"
                    inactiveDotColor="#90A4AE"
                    dotStyle={{
                        width: 10,
                        height: 10,
                        borderRadius: 15,
                        marginHorizontal: 1,
                        padding: 0,
                        margin: 0
                    }}
                    activeOpacity={0.5}
                    paginationBoxVerticalPadding={10}
                    ImageComponentStyle={{ borderRadius: 15, width: '90%', marginTop: 5 }}
                    imageLoadingColor="#2196F3"
                    autoplayInterval={5000}
                    autoplay
                    circleLoop={true}
                    images={OfferBannerImages}
                    onCurrentImagePressed={index => console.warn(`image ${index} pressed`)}
                // currentImageEmitter={index => console.warn(`current pos is: ${index}`)}
                />
                <View style={{ flex: 1, marginBottom: 20 }}>
                    <FlatList
                        style={{ marginLeft: 20, marginTop: 10, marginRight: 15 }}
                        contentContainerStyle={{ height: 100 }}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        data={CategoryData}
                        keyExtractor={(item, index) => index}
                        renderItem={({ item }) => <TouchableOpacity onPress={() => navigation.navigate('CategoryProductDetails', item)} style={{ backgroundColor: '#fff', width: 90, height: 90, borderRadius: 200, margin: 5, elevation: 5 }}><Image style={{ width: 80, height: 80, marginTop: 5, resizeMode: 'cover', alignSelf: 'center', borderRadius: 200 }} source={{ uri: 'https://theparihara.com/Parihara/public/' + item?.image }} /></TouchableOpacity>}
                    />
                </View>
                <View style={{ flex: 1, marginBottom: 20 }}>
                    <FlatList
                        style={{ marginLeft: 20, marginTop: 5, marginRight: 15 }}
                        contentContainerStyle={{}}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        data={restaurantList}
                        keyExtractor={(item, index) => index}
                        renderItem={({ item }) => <TouchableOpacity style={{ backgroundColor: '#fff', width: Dimensions.get('screen').width - 80, height: 180, borderRadius: 10, marginRight: 6, elevation: 5 }}>
                            <Image style={{ width: '100%', height: '100%', resizeMode: 'cover', alignSelf: 'center', borderRadius: 0 }} source={{ uri: 'https://theparihara.com/Parihara/public/' + item?.image }} />
                            <Text>{JSON.stringify(item)}</Text>
                        </TouchableOpacity>}
                    />
                </View>
                <FlatList
                    style={{ marginBottom: 10, marginLeft: 15, }}
                    numColumns={2}
                    horizontal={false}
                    data={productData}
                    keyExtractor={(item, index) => index}
                    renderItem={({ item }) => renderItemsCard(item)}
                />
                <FlatList
                    style={{ marginBottom: 10, marginLeft: 15, }}
                    numColumns={2}
                    horizontal={false}
                    data={DealsOfWeek}
                    keyExtractor={(item, index) => index}
                    renderItem={({ item }) => renderItemsCard(item)}
                />
            </ScrollView>
        </ImageBackground>
    )

}

export default FoodHomeScreen;