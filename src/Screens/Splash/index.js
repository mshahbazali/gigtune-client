import { View, Image, StyleSheet, ImageBackground } from 'react-native'
import React from 'react'


export default function index() {
    return (
        <View style={styles.container}>
            <ImageBackground source={require('../../Assets/Images/bg.jpg')} resizeMode="cover" style={styles.background}>
                <Image source={require("../../Assets/Images/whitelogo.png")} style={styles.logo} />
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 250,
        height: 80
    }
})