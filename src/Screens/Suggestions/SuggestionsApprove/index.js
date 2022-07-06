import { View, Image, StyleSheet, ImageBackground, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native'
import React, { useState, useRef } from 'react'
import { BlurView } from 'expo-blur';
import { Ionicons, Entypo, FontAwesome, MaterialCommunityIcons, EvilIcons } from '@expo/vector-icons';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import RBSheet from "react-native-raw-bottom-sheet";

export default function Index({ navigation }) {
    const [datePicker, setDatePicker] = useState(false)
    const [date, setDate] = useState("date");
    const datePickerFun = (event, text) => {
        setDate(text.toString().slice(4, 15))
        setDatePicker(false)
    }
    const locationRef = useRef();
    const arr = [1, 2, 3, 4, 5, 6, 7]
    const [readMore, setReadMore] = useState(false)
    const ReadMoreBtn = () => {
        return (
            <TouchableOpacity style={styles.readBtn} onPress={() => setReadMore(!readMore)}>
                <Text style={styles.readMoreText}>{readMore == false ? "Read More" : "Read Less"}</Text>
            </TouchableOpacity>
        )
    }
    return (
        <View style={styles.container}>
            <ImageBackground source={require('../../../Assets/Images/bg.jpg')} resizeMode="cover" style={styles.background}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.contentContainer}>
                        <TouchableOpacity style={styles.backIconContainer} onPress={() => navigation.navigate("Suggestions")}>
                            <Ionicons name="arrow-back-sharp" size={33} color="white" />
                        </TouchableOpacity>
                        <View style={styles.titleContainer}>
                            <Text style={styles.titleText}>suggestion</Text>
                        </View>
                        <View style={styles.topBox}>
                            <Text style={styles.topBoxFirstText}>You get</Text>
                            <Text style={styles.topBoxSecondText}>$1,000</Text>
                        </View>
                        <View>
                            <Text style={styles.eventTitle}>Jacob and Emma’s Wedding</Text>
                            <View style={styles.eventDateContainer}>
                                <FontAwesome name="calendar" size={18} color="white" />
                                <Text style={styles.eventDate}>5 February, 2022, 14:30</Text>
                            </View>
                            <View style={styles.eventLocationContainer}>
                                <View style={styles.eventLocation}>
                                    <Ionicons name="location-sharp" size={18} color="white" />
                                    <View>
                                        <Text style={styles.locationTitle}>Grand Luxury Wedding Hall</Text>
                                        <Text style={styles.location}>Tulsa, Oklahoma</Text>
                                    </View>
                                </View>
                                <View>
                                    <TouchableOpacity style={styles.locationBtn}>
                                        <Text style={styles.locationBtnText}>Go</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <BlurView intensity={40} tint="light" style={styles.TextArea}>
                                <Text style={styles.detailText} numberOfLines={readMore == false ? 4 : 1000}>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Venenatis cursus potenti pharetra amet, quis turpis dignissim. Faucibus vel, ut nulla quis felis in eget. Lectus sit nulla cras erat amet adipiscing.
                                </Text>
                                <ReadMoreBtn />
                            </BlurView>
                            <BlurView intensity={40} tint="light" style={styles.eventCreatorDetail}>
                                <View style={styles.userDetail}>
                                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                        {
                                            arr.map((e, i) => {
                                                return (
                                                    <TouchableOpacity key={i} style={styles.imageContainer}>
                                                        <Image source={require("../../../Assets/Images/dj.png")} style={styles.images} />
                                                    </TouchableOpacity>
                                                )
                                            })
                                        }
                                    </ScrollView>
                                </View>
                            </BlurView>
                            <BlurView intensity={40} tint="light" style={styles.eventCreatorDetail}>
                                <View style={styles.userDetail}>
                                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                        {
                                            arr.map((e, i) => {
                                                return (
                                                    <TouchableOpacity key={i} style={styles.fileContainer}>
                                                        <MaterialCommunityIcons name="file-pdf-box" size={27} color="white" />
                                                        <Text style={styles.fileView}>VIEW</Text>
                                                    </TouchableOpacity>
                                                )
                                            })
                                        }
                                    </ScrollView>
                                </View>
                            </BlurView>
                            <BlurView intensity={40} tint="light" style={styles.eventCreatorDetail}>
                                <View style={styles.userDetail}>
                                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                        {
                                            arr.map((e, i) => {
                                                return (
                                                    <View key={i} style={styles.teamMember}>
                                                        <Image source={require("../../../Assets/Images/team.png")} style={styles.creatorProfileImage} />
                                                        <Text style={styles.teamMemberName}>John</Text>
                                                        <Text style={styles.teamMemberPosition}>CEO</Text>
                                                    </View>
                                                )
                                            })
                                        }

                                    </ScrollView>
                                </View>
                            </BlurView>
                            <BlurView intensity={40} tint="light" style={styles.eventCreatorDetail}>
                                <Image source={require("../../../Assets/Images/team.png")} style={styles.creatorProfileImage} />
                                <View style={styles.userDetail}>
                                    <Text style={styles.creatorLine}>created the event</Text>
                                    <Text style={styles.creatorName}>John Doe</Text>
                                </View>
                            </BlurView>
                        </View>
                    </View>

                </ScrollView>
            </ImageBackground>
        </View >
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
        paddingTop: 70
    },
    backIconContainer: {
        position: 'absolute',
        left: 0,
        top: 25, paddingVertical: 30
    },
    titleContainer: {
        marginBottom: 15,
        marginTop: -10
    },
    titleText: {
        color: "#fff",
        fontSize: 22,
        textAlign: 'center', fontWeight: '500'
    },
    topBox: {
        borderRadius: 15,
        height: 50,
        width: 320,
        marginHorizontal: 12,
        backgroundColor: "#D6287B",
        paddingHorizontal: 10,
        flexDirection: "row",
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    topBoxFirstText: {
        color: "white",
        fontSize: 16,
        fontWeight: '500',
        opacity: 0.8,
        marginRight: 5
    },
    topBoxSecondText: {
        color: "white",
        fontSize: 16,
        fontWeight: '500',
    },
    eventTitle: {
        color: "#fff",
        fontSize: 20,
        fontWeight: '700',
        marginTop: 13,
        marginHorizontal: 12
    },
    eventDateContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginHorizontal: 12,
        marginTop: 6,
    },
    eventDate: {
        color: "white",
        fontSize: 17,
        fontWeight: '500',
        opacity: 0.8,
        marginLeft: 5
    },
    eventLocationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginHorizontal: 12,
        marginTop: 10,
        marginBottom: 20,
    },
    eventLocation: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    locationTitle: {
        color: "#fff",
        fontSize: 18,
        fontWeight: '700',
        marginLeft: 5
    },
    location: {
        color: "white",
        fontSize: 17,
        fontWeight: '500',
        opacity: 0.8,
        marginLeft: 5
    },
    locationBtn: {
        backgroundColor: "#1A4BAB",
        justifyContent: 'center',
        alignItems: 'center',
        padding: 14,
        borderRadius: 10
    },
    locationBtnText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: '700'
    },
    TextArea: {
        borderRadius: 10,
        width: 320,
        justifyContent: 'flex-start',
        marginVertical: 14,
        padding: 10,
        marginHorizontal: 12,
    },
    detailText: {
        fontSize: 17,
        fontWeight: '400',
        color: "white",
        lineHeight: 20
    },
    teamMember: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10
    },
    teamMemberName: {
        color: "white", fontSize: 15, fontWeight: '500', marginTop: -10
    },
    teamMemberPosition: {
        color: "white", fontSize: 12, fontWeight: '400', marginTop: -2
    },
    fileContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10, backgroundColor: "#D92C4A", marginHorizontal: 5, paddingVertical: 10, borderRadius: 10, paddingHorizontal: 13
    },
    fileView: {
        color: "white", fontSize: 13, fontWeight: '500',
    },
    imageContainer: {
        marginHorizontal: 4, marginVertical: 10
    },
    images: {
        width: 80, height: 80, borderRadius: 10, borderColor: "white", borderWidth: 2
    },
    readBtn: {
        marginTop: 5
    },
    readMoreText: {
        color: "white", fontSize: 16
    },
    eventCreatorDetail: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        borderRadius: 10,
        marginHorizontal: 12,
        paddingHorizontal: 10
    },
    creatorProfileImage: {
        borderRadius: 60,
        width: 40,
        height: 40,
        margin: 10
    },
    creatorName: {
        color: "#fff",
        fontSize: 20,
        fontWeight: '400'
    },
    creatorLine: {
        color: "#fff",
        fontSize: 12,
        fontWeight: '400',
        opacity: 0.8, marginTop: 7
    },
    userPosition: {
        color: "#fff",
        fontSize: 15,
        fontWeight: '400'
    },
    btnContainer: {
        marginVertical: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 12
    },
    approveEventBtn: {
        backgroundColor: "#fff",
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 14,
        width: '45%',
        borderRadius: 10
    },
    approveEventBtnText: {
        color: "#2CBD15",
        fontSize: 18,
        fontWeight: '700'
    },
    rejectEventBtn: {
        backgroundColor: "#fff",
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 14,
        width: '45%',
        borderRadius: 10
    },
    rejectEventBtnText: {
        color: "#ED3A24",
        fontSize: 18,
        fontWeight: '700'
    },

})