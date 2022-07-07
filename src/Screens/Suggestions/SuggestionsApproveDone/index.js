import { View, Image, StyleSheet, ImageBackground, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native'
import React, { useState, useRef } from 'react'
import { BlurView } from 'expo-blur';
import { Ionicons, Entypo, FontAwesome, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import RBSheet from "react-native-raw-bottom-sheet";

export default function Index({ navigation }) {
    return (
        <View style={styles.container}>
            <ImageBackground source={require('../../../Assets/Images/bg.jpg')} resizeMode="cover" style={styles.background}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.contentContainer}>
                        <View style={{ alignItems: 'center' }}>
                            <Image source={require("../../../Assets/Images/done.png")} style={styles.doneImage} />
                        </View>
                        <View>
                            <Text style={styles.eventCreateTitle}>Event Synced</Text>
                            <Text style={styles.eventCreateSubTitle}>Your event has been synced</Text>
                        </View>
                        <View>
                            <TouchableOpacity style={styles.doneBtn} onPress={() => navigation.navigate("Event")}>
                                <Text style={styles.doneBtnText}>Done</Text>7
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
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
        paddingHorizontal: 20
    },
    contentContainer: {
        paddingTop: 50,
    },
    doneImage: {
        width: 250,
        height: 250,
        marginTop: 40
    },
    eventCreateTitle: {
        textAlign: 'center',
        marginTop: 20,
        color: "white",
        fontWeight: '400',
        fontSize: 30
    },
    eventCreateSubTitle: {
        textAlign: 'center',
        marginTop: 5,
        color: "white",
        fontWeight: '400',
        fontSize: 18
    },
    doneBtn: {
        backgroundColor: "#fff",
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 14,
        borderRadius: 30,
        marginTop: 20
    },
    doneBtnText: {
        color: "#EF4D38",
        fontSize: 18,
        fontWeight: '700'
    },
})