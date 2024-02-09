import React from 'react';
import { Text, View, ImageBackground, Image, FlatList, ScrollView, Dimensions, TextInput, StatusBar, TouchableOpacity } from 'react-native';
import { SliderBox } from "react-native-image-slider-box";

const FoodHomeScreen = () => {

    const [OfferBannerImages, setOfferBannerImages] = React.useState(["https://d1csarkz8obe9u.cloudfront.net/posterpreviews/yellow-restaurant-business-card-design-template-bb4e8fca43872e4292f5d3af8c8a66ec_screen.jpg", "https://www.punekarnews.in/wp-content/uploads/2022/08/IMG-20220810-WA0012.jpg", "https://5.imimg.com/data5/SELLER/Default/2021/8/ZU/YY/UX/3811871/gold-membership-card-500x500.jpg"]);
    const [CategoryList, setCategoryList] = React.useState([
        require('../../../assets/mocktail.jpeg'),
        require('../../../assets/dessert.jpeg'),
        require('../../../assets/easy_bites.jpeg'),
        require('../../../assets/Shawarma.jpeg'),
        require('../../../assets/drinks.jpeg'),
        require('../../../assets/wrap.jpeg'),
    ]);

    const renderItemsCard = (item) => {
        return (
            <View style={{ backgroundColor: '#fff', width: Dimensions.get('screen').width / 3 - 20, borderRadius: 20, margin: 5, elevation: 5 }}>
                <Image style={{ width: '100%', height: 100, resizeMode: 'cover', alignSelf: 'center', borderTopLeftRadius: 20, borderTopRightRadius: 20 }} source={item} />
                <View>
                    <Text numberOfLines={1} style={{ paddingLeft: 10, fontWeight: 'bold' }}>Food</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 10, paddingRight: 5 }}>
                    <Text numberOfLines={1} style={{ paddingLeft: 10, color: 'gray', fontWeight: '900', flex: 1 }}>₹ 100/-</Text>
                    <TouchableOpacity style={{ paddingHorizontal: 15, paddingVertical: 3, backgroundColor: '#000', borderRadius: 55 }}>
                        <Image style={{ width: 20, height: 20, resizeMode: 'contain', tintColor: '#fff' }} source={require('../../../assets/add_cart.png')} />
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
                <View style={{ padding: 10, backgroundColor: '#fff', borderRadius: 15, marginLeft: 10 }}>
                    <Image style={{ width: 25, height: 25, resizeMode: 'contain' }} source={require('../../../assets/bell_icon_cart.png')} />
                </View>
            </View>
            <ScrollView style={{ marginTop: 10, flex: 1 }}>
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
                    currentImageEmitter={index => console.warn(`current pos is: ${index}`)}
                />
                <View style={{ flex: 1, marginBottom: 20 }}>
                    <FlatList
                        style={{ marginLeft: 20, marginTop: 10 }}
                        contentContainerStyle={{ height: 100 }}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        data={CategoryList}
                        keyExtractor={(item, index) => index}
                        renderItem={({ item }) => <TouchableOpacity style={{ backgroundColor: '#fff', width: 90, height: 90, borderRadius: 200, margin: 5, elevation: 5 }}><Image style={{ width: 80, height: 80, marginTop: 5, resizeMode: 'cover', alignSelf: 'center', borderRadius: 200 }} source={item} /></TouchableOpacity>}
                    />
                </View>
                <FlatList
                    style={{ marginBottom: 10, marginLeft: 20, }}
                    numColumns={3}
                    horizontal={false}
                    data={CategoryList}
                    keyExtractor={(item, index) => index}
                    renderItem={({ item }) => renderItemsCard(item)}
                />
            </ScrollView>
        </ImageBackground>
    )

}

export default FoodHomeScreen;