import { View, Image, StyleSheet, ImageBackground, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native'
import React, { useState, useRef } from 'react'
import { BlurView } from 'expo-blur';
import { Ionicons, Octicons, FontAwesome, AntDesign } from '@expo/vector-icons';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import RBSheet from "react-native-raw-bottom-sheet";

export default function Index({ navigation }) {
    const filterRef = useRef();
    const arr = [1, 2, 3, 4, 5, 6, 7]
    const [listView, setListView] = useState(false);
    const currentDate = new Date().toISOString().slice(0, 10);
    return (
        <View style={styles.container}>
            <View style={styles.background}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={styles.contentContainer}>
                        <View style={styles.topBarContainer}>
                            <View>
                                <Text style={styles.totalAmount}>Total $11,500</Text>
                            </View>
                            <View>
                                <TouchableOpacity style={styles.filterBtn} onPress={() => filterRef.current.open()}>
                                    <Text style={styles.filterBtnText}>Filter</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    <View>
                        <View>
                            <Text style={styles.todayText}>Today </Text>
                        </View>
                        <BlurView intensity={40} tint="light" style={styles.eventListConatinerOnlyListView}>
                            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                                {
                                    arr.map((e, i) => {
                                        return (
                                            <TouchableOpacity key={i} style={styles.eventList} onPress={() => navigation.navigate("SuggestionsDetail")}>
                                                <View>
                                                    <Text style={styles.eventListTitle}>Jacob and Emma’s Wedding</Text>
                                                </View>
                                                <View style={styles.eventListBottomLine}>
                                                    <View>
                                                        <Image source={require("../../../Assets/Images/team.png")} style={styles.eventListBottomLineTeamImage} />
                                                    </View>
                                                    <View style={styles.eventListBottomLineCalandar}>
                                                        <FontAwesome name="calendar" size={18} color="white" />
                                                        <Text style={styles.eventListBottomLineCalandarText}>18 Jun</Text>
                                                    </View>
                                                    <View style={styles.eventListBottomLineCalandar}>
                                                        <Octicons name="location" size={18} color="white" />
                                                        <Text style={styles.eventListBottomLineCalandarText}>Location</Text>
                                                    </View>
                                                    <View>
                                                        <Text style={styles.eventListBottomLineCalandarText}>$50</Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                            </ScrollView>
                        </BlurView>
                    </View>
                    <View>
                        <View>
                            <Text style={styles.todayText}>Yesterday</Text>
                        </View>
                        <BlurView intensity={40} tint="light" style={styles.eventListConatinerOnlyListView}>
                            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                                {
                                    arr.map((e, i) => {
                                        return (
                                            <TouchableOpacity key={i} style={styles.eventList} onPress={() => navigation.navigate("SuggestionsDetail")}>
                                                <View>
                                                    <Text style={styles.eventListTitle}>Jacob and Emma’s Wedding</Text>
                                                </View>
                                                <View style={styles.eventListBottomLine}>
                                                    <View>
                                                        <Image source={require("../../../Assets/Images/team.png")} style={styles.eventListBottomLineTeamImage} />
                                                    </View>
                                                    <View style={styles.eventListBottomLineCalandar}>
                                                        <FontAwesome name="calendar" size={18} color="white" />
                                                        <Text style={styles.eventListBottomLineCalandarText}>18 Jun</Text>
                                                    </View>
                                                    <View style={styles.eventListBottomLineCalandar}>
                                                        <Octicons name="location" size={18} color="white" />
                                                        <Text style={styles.eventListBottomLineCalandarText}>Location</Text>
                                                    </View>
                                                    <View>
                                                        <Text style={styles.eventListBottomLineCalandarText}>$50</Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                            </ScrollView>
                        </BlurView>
                    </View>
                </ScrollView>
                <RBSheet
                    animationType={"slide"}
                    closeOnDragDown={true}
                    dragFromTopOnly={true}
                    onOpen={(e) => { console.log(e) }}
                    ref={filterRef}
                    height={200}
                    openDuration={250}
                    closeDuration={250}
                    customStyles={{
                        wrapper: {
                            backgroundColor: "transparent"
                        },
                        draggableIcon: {
                            marginTop: -10
                        },
                        container: {
                            padding: 20
                        }
                    }}
                >
                    <View>
                        <View>
                            <Text style={styles.filterBoxTitle}>Filter</Text>
                        </View>
                        <View style={styles.fliterContainer}>
                            <TouchableOpacity style={styles.listViewBtn} onPress={() => {
                                setListView(true)
                                filterRef.current.close()
                            }}>
                                <Text style={styles.listViewBtnText}>Min.</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.listViewBtn} onPress={() => {
                                setListView(false)
                                filterRef.current.close()
                            }}>
                                <Text style={styles.listViewBtnText}>Max.</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </RBSheet>
            </View>
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: "#ED8524"
    },
    contentContainer: {
        paddingTop: 70
    },
    topBarContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalAmount: {
        color: "#fff",
        fontWeight: '700',
        fontSize: 15,
        marginBottom: 5
    },
    filterBtn: {
        backgroundColor: "#1A4BAB",
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10
    },
    filterBtnText: {
        color: "#fff",
        fontSize: 15,
        fontWeight: '700'
    },
    todayText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: '400',
        marginHorizontal: 12
    },
    eventListConatinerOnlyListView: {
        borderRadius: 10,
        height: 240,
        width: 320,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 17,
        marginHorizontal: 12,
        flex: 1
    },
    eventListConatiner: {
        borderRadius: 10,
        height: 250,
        width: 320,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 17,
        marginHorizontal: 12,
        flex: 1
    },
    eventList: {
        backgroundColor: "#D92C4A",
        width: 300,
        borderRadius: 10,
        padding: 10,
        marginTop: 8
    },
    eventListTitle: {
        color: "white",
        fontWeight: '500',
        fontSize: 18
    },
    eventListBottomLine: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 5
    },
    eventListBottomLineTeamImage: {
        width: 20, height: 20
    },
    eventListBottomLineCalandar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        opacity: 0.8
    },
    eventListBottomLineCalandarText: {
        color: 'white',
        fontWeight: '500',
        marginLeft: 5,
    },
    filterBoxTitle: {
        fontSize: 22,
        fontWeight: '400'
    },
    fliterContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    listViewBtn: {
        paddingVertical: 15,
        borderRadius: 20,
        borderColor: "#ED4524",
        borderWidth: 2,
        marginHorizontal: 20,
        paddingHorizontal: 20,
        marginVertical: 5
    },
    listViewBtnText: {
        fontSize: 16,
        fontWeight: '500',
        color: "#ED4524",
    },
})