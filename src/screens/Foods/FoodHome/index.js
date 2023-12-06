import React from 'react';
import { Text, View, ImageBackground, Image, FlatList, Alert, Dimensions } from 'react-native';

const FoodHomeScreen = () => {

    return (
        <ImageBackground
            source={require('../../../assets/background_images.gif')}
            style={{ width: '100%', height: '100%' }}>
            <Text style={{ color: '#fff', fontSize: 50, textAlign: 'center', marginTop: Dimensions.get('screen').height - 170, fontWeight: 'bold' }}>Coming Soon</Text>
        </ImageBackground>
    )

}

export default FoodHomeScreen;