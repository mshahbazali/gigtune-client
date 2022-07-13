import { View, Image, StyleSheet, RefreshControl, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native'
import React, { useState, useRef, useEffect, useCallback } from 'react'
import { BlurView } from 'expo-blur';
import { Ionicons, Octicons, FontAwesome, AntDesign } from '@expo/vector-icons';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import RBSheet from "react-native-raw-bottom-sheet";
import { Api } from '../../../Config/Api';
import axios from 'axios';
import { useSelector } from 'react-redux';
const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}
export default function Index({ navigation }) {
    const [refreshing, setRefreshing] = useState(false);
    const state = useSelector(state => state)
    const filterRef = useRef();
    const [todaySuggestions, setTodaySuggestions] = useState([])
    const [yesterdaySuggestions, setYesterdaySuggestions] = useState([])
    const [listView, setListView] = useState(false);
    let totalCharges = 0
    const [charges, setCharges] = useState(0)
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
    }, []);
    const suggestion = state.user?.suggestions?.filter((e) => e.status == "Awating")
    const today = new Date().toISOString().slice(0, 10);
    const todayFilter = suggestion?.filter((e) => e.date == today)
    const todaySuggestionsIds = []
    for (let i = 0; i < todayFilter?.length; i++) {
        todaySuggestionsIds.push(todayFilter[i].eventId)
    }
    const yesterday = new Date();
    const previous = new Date(yesterday.getTime());
    previous.setDate(yesterday.getDate() - 1);
    const yesterdayDate = previous.toISOString().slice(0, 10)
    const yesterdayFilter = suggestion?.filter((e) => e.date == yesterdayDate)
    const yesterdaySuggestionsIds = []
    for (let i = 0; i < yesterdayFilter?.length; i++) {
        yesterdaySuggestionsIds.push(yesterdayFilter[i].eventId)
    }
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setTodaySuggestions(state.todaySuggestions)
            setYesterdaySuggestions(state.yesterdaySuggestions)
        });
        return unsubscribe;
    }, [navigation])
    useEffect(() => {
        axios.post(`${Api}/suggestions/`, { suggestions: todaySuggestionsIds }, {
            headers: {
                token: state.token
            }
        }).then((res) => {
            setTodaySuggestions(res.data.suggestions);
        }).catch(() => { })
        // Yesterday request 
        axios.post(`${Api}/suggestions/`, { suggestions: yesterdaySuggestionsIds }, {
            headers: {
                token: state.token
            }
        }).then((res) => {
            setYesterdaySuggestions(res.data.suggestions);
        }).catch(() => { })
        setCharges(totalCharges)
    }, [refreshing])
    return (
        <View style={styles.container}>
            <View style={styles.background}>
                <ScrollView showsVerticalScrollIndicator={false} refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }>
                    <View style={styles.contentContainer}>
                        <View style={styles.topBarContainer}>
                            <View>
                                <Text style={styles.totalAmount}>{`Total $${charges}`}</Text>
                            </View>
                            <View>
                                {/* <TouchableOpacity style={styles.filterBtn} onPress={() => filterRef.current.open()}>
                                    <Text style={styles.filterBtnText}>Filter</Text>
                                </TouchableOpacity> */}
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
                                    todaySuggestions?.map((e, i) => {
                                        const todayChargesFilter = e?.team?.filter(e => e?.id === state.user?._id)
                                        let charges = todayChargesFilter?.map(e => Number(e.price))?.reduce((prev, curr) => prev + curr, 0);
                                        totalCharges += charges
                                        return (
                                            <TouchableOpacity key={i} style={styles.eventList} onPress={() => {
                                                state.selectedSuggestions = e
                                                navigation.navigate("SuggestionsDetail")
                                            }}>
                                                <View>
                                                    <Text style={styles.eventListTitle}>{e?.title}</Text>
                                                </View>
                                                <View style={styles.eventListBottomLine}>
                                                    <View style={styles.eventListBottomLineCalandar}>
                                                        <FontAwesome name="calendar" size={18} color="white" />
                                                        <Text style={styles.eventListBottomLineCalandarText}>{e?.date}</Text>
                                                    </View>
                                                    <View style={styles.eventListBottomLineCalandar}>
                                                        <Octicons name="location" size={18} color="white" />
                                                        <Text style={styles.eventListBottomLineCalandarText}>{e.location?.slice(0, 11)}...</Text>
                                                    </View>
                                                    <View>
                                                        <Text style={styles.eventListBottomLineCalandarText}>{`$${todayChargesFilter[0]?.price}`}</Text>
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
                                    yesterdaySuggestions?.map((e, i) => {
                                        const yesterdayChargesFilter = e?.team?.filter(e => e?.id === state.user._id)
                                        let charges = yesterdayChargesFilter?.map(e => Number(e.price))?.reduce((prev, curr) => prev + curr, 0);
                                        totalCharges += charges
                                        return (
                                            <TouchableOpacity key={i} style={styles.eventList} onPress={() => {
                                                state.selectedSuggestions = e
                                                navigation.navigate("SuggestionsDetail")
                                            }}>
                                                <View>
                                                    <Text style={styles.eventListTitle}>{e?.title}</Text>
                                                </View>
                                                <View style={styles.eventListBottomLine}>
                                                    {/* <View>
                                                        <Image source={require("../../../Assets/Images/team.png")} style={styles.eventListBottomLineTeamImage} />
                                                    </View> */}
                                                    <View style={styles.eventListBottomLineCalandar}>
                                                        <FontAwesome name="calendar" size={18} color="white" />
                                                        <Text style={styles.eventListBottomLineCalandarText}>{e?.date}</Text>
                                                    </View>
                                                    <View style={styles.eventListBottomLineCalandar}>
                                                        <Octicons name="location" size={18} color="white" />
                                                        <Text style={styles.eventListBottomLineCalandarText}>{e.location?.slice(0, 11)}...</Text>
                                                    </View>
                                                    <View>
                                                        <Text style={styles.eventListBottomLineCalandarText}>{`$${yesterdayChargesFilter[0]?.price}`}</Text>
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
                    onOpen={(e) => { }}
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