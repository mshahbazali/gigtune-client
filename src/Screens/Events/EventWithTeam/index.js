import { View, Image, StyleSheet, ImageBackground, Text, ScrollView, TouchableOpacity, RefreshControl, TextInput } from 'react-native'
import React, { useState, useRef, useCallback, useEffect } from 'react'
import { BlurView } from 'expo-blur';
import { Ionicons, Entypo, FontAwesome, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import RBSheet from "react-native-raw-bottom-sheet";
import { useSelector } from 'react-redux';
import { WebView } from 'react-native-webview';
import { Api } from '../../../Config/Api';
import axios from 'axios';
import JWT from 'expo-jwt';
import AsyncStorage from '@react-native-async-storage/async-storage';

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}
export default function Index({ navigation }) {
    const [refreshing, setRefreshing] = useState(false);
    const [users, setUsers] = useState()
    const [adminId, setAdminId] = useState()
    const state = useSelector(state => state)
    const filterRef = useRef();
    const checkFileRef = useRef();
    const contactRef = useRef();
    const [filePath, setFilePath] = useState()
    const [readMore, setReadMore] = useState(false)
    const [searchQuery, setSearchQuery] = useState([])
    const [seletedContact, setSeletedContact] = useState([])
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
    }, []);
    const getAdminId = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('token')
            return jsonValue != null ? setAdminId(JWT.decode(JSON.parse(jsonValue).token, "secret_gigtune").id) : null;
        } catch (e) { }
    }
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getAdminId()
            axios.get(`${Api}/user/allusers`).then((res) => {
                setUsers(res.data.users);
            }).catch((err) => { })
        });
        return unsubscribe;
    }, [navigation])
    useEffect(() => {
        getAdminId()
        axios.get(`${Api}/user/allusers`).then((res) => {
            setUsers(res.data.users);
        }).catch((err) => { })
    }, [refreshing])

    const searchResult = users?.filter((e) => e.fullName == searchQuery);
    const ReadMoreBtn = () => {
        return (
            <TouchableOpacity style={styles.readBtn} onPress={() => setReadMore(!readMore)}>
                <Text style={styles.readMoreText}>{readMore == false ? "Read More" : "Read Less"}</Text>
            </TouchableOpacity>
        )
    }
    const event = state.selectedEvent
    const user = state.user
    const adminFilter = users?.filter((e) => e._id !== adminId);
    const deleteEvent = () => {
        axios.post(`${Api}/event/delete`, { _id: event._id, admin: event.admin }, {
            headers: {
                token: state.token
            }
        }).then((res) => {
            navigation.navigate("Event")
        }).catch(() => { })
    }
    return (
        <View style={styles.container}>
            <ImageBackground source={require('../../../Assets/Images/bg.jpg')} resizeMode="cover" style={styles.background}>
                <ScrollView showsVerticalScrollIndicator={false} refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }>
                    <View style={styles.contentContainer}>
                        <View style={styles.topNavContainer}>
                            <TouchableOpacity onPress={() => navigation.navigate("Event")}>
                                <Ionicons name="arrow-back-sharp" size={33} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => filterRef.current.open()}>
                                <Entypo name="dots-three-vertical" size={24} color="white" />
                            </TouchableOpacity>
                        </View>
                        <View>
                            <Text style={styles.eventTitle}>{event?.title}</Text>
                            <View style={styles.eventDateContainer}>
                                <FontAwesome name="calendar" size={18} color="white" />
                                <Text style={styles.eventDate}>{event?.date}</Text>
                            </View>
                            <View style={styles.eventLocationContainer}>
                                <View style={styles.eventLocation}>
                                    <Ionicons name="location-sharp" size={18} color="white" />
                                    <View>
                                        <Text style={styles.locationTitle}>{event?.location}</Text>
                                        {/* <Text style={styles.location}>{event.location.slice(15,20)}</Text> */}
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
                                    {event?.discription}
                                </Text>
                                {
                                    event?.discription.length > 250 ?
                                        <ReadMoreBtn />
                                        : null
                                }
                            </BlurView>
                            <BlurView intensity={40} tint="light" style={styles.eventCreatorDetail}>
                                <View style={styles.userDetail}>
                                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                        {
                                            event?.photos?.map((e, i) => {
                                                return (
                                                    <TouchableOpacity key={i} style={styles.imageContainer} onPress={() => {
                                                        setFilePath(e);
                                                        checkFileRef.current.open()
                                                    }}>
                                                        <Image source={{ uri: `https://drive.google.com/uc?export=view&id=${e}` }} style={styles.images} />
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
                                            event?.files?.map((e, i) => {
                                                return (
                                                    <TouchableOpacity key={i} style={styles.fileContainer} onPress={() => {
                                                        setFilePath(e);
                                                        checkFileRef.current.open()
                                                    }}>
                                                        <MaterialCommunityIcons name="file-pdf-box" size={27} color="white" />
                                                        <Text style={styles.fileView}>VIEW</Text>
                                                    </TouchableOpacity>
                                                )
                                            })
                                        }
                                    </ScrollView>
                                </View>
                            </BlurView>
                            <Text style={styles.teamMemberTitle}>Team Members</Text>
                            {
                                event.team[0] == undefined ?
                                    <BlurView intensity={40} tint="light" style={styles.eventCreatorDetail}>
                                        <View style={styles.teamContainer}>
                                            <Text style={styles.teamGuideText}>There is no team member for now. Add a member</Text>
                                            <TouchableOpacity style={styles.teamAddBtnWithoutTeam} onPress={() => contactRef.current.open()}>
                                                <AntDesign name="pluscircleo" size={24} color="#ED5424" />
                                            </TouchableOpacity>
                                        </View>
                                    </BlurView>
                                    :
                                    <BlurView intensity={40} tint="light" style={styles.teamMainContainer}>
                                        <View style={styles.teamContainer}>
                                            <View style={styles.teamMembers}>
                                                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                                    {
                                                        event.team?.map((e, i) => {
                                                            return (
                                                                <View key={i} style={styles.teamMember}>
                                                                    <Image source={{ uri: e?.profileImage }} style={styles.creatorProfileImage} />
                                                                    <Text style={styles.teamMemberName}>{e?.fullName}</Text>
                                                                    <Text style={styles.teamMemberCharges}>{e?.price}</Text>
                                                                    {/* <Text style={{ color: "white", fontWeight: '500', fontSize: 13, opacity: 1, marginTop: -2 }}>PAID</Text> */}
                                                                </View>
                                                            )
                                                        })
                                                    }

                                                </ScrollView>
                                            </View>
                                            <TouchableOpacity style={styles.teamAddBtn} onPress={() => contactRef.current.open()}>
                                                <AntDesign name="pluscircleo" size={24} color="#ED5424" />
                                            </TouchableOpacity>
                                        </View>
                                        <View>
                                            <TouchableOpacity style={styles.editTeamMember} onPress={() => navigation.navigate("Team")}>
                                                <Text style={styles.editTeamMemberText}>Edit Team</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </BlurView>
                            }

                            <BlurView intensity={40} tint="light" style={styles.eventCreatorDetail}>
                                <Image source={{ uri: state.user.profileImage }} style={styles.creatorProfileImage} />
                                <View style={styles.userDetail}>
                                    <Text style={styles.creatorLine}>You created the event</Text>
                                    <Text style={styles.creatorName}>{event?.admin == user?._id ? user?.fullName : null}</Text>
                                </View>
                            </BlurView>
                        </View>
                    </View>
                    <RBSheet
                        animationType={"slide"}
                        closeOnDragDown={true}
                        dragFromTopOnly={true}
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
                            <TouchableOpacity style={styles.listViewBtn} onPress={() => {
                                state.selectedEvent = event
                                navigation.navigate("EditEvent")
                                filterRef.current.close()
                            }}>
                                <Text style={styles.listViewBtnText}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.listViewBtn} onPress={() => {
                                deleteEvent()
                                filterRef.current.close()
                            }}>
                                <Text style={styles.listViewDeleteBtnText}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </RBSheet>
                    <RBSheet
                        animationType={"slide"}
                        closeOnDragDown={true}
                        dragFromTopOnly={true}
                        ref={checkFileRef}
                        height={600}
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
                        <WebView
                            style={styles.container}
                            source={{ uri: `https://drive.google.com/file/d/${filePath}/view` }}
                        />
                    </RBSheet>
                    <RBSheet
                        animationType={"slide"}
                        closeOnDragDown={true}
                        dragFromTopOnly={true}
                        ref={contactRef}
                        height={700}
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
                        <View style={styles.contactsContainer}>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View style={styles.contactsTitleContainer}>
                                    <Text style={styles.contactTitle}>Select contacts</Text>
                                    <TouchableOpacity style={styles.contactSelectBtn} onPress={async () => {
                                        state.updateCharges = false
                                        state.selectedContact = seletedContact
                                        await navigation.navigate("Charges")
                                        contactRef.current.close()
                                    }}>
                                        <Text style={styles.contactSelectBtnText}>Next</Text>
                                    </TouchableOpacity>
                                </View>
                                <View>
                                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                                        {
                                            seletedContact.map((e, i) => {
                                                return (
                                                    <View key={i} style={styles.contactProfileContainer}>
                                                        <Image source={{ uri: e.profileImage }} style={styles.contactImage} />
                                                        <Text style={styles.contactName}>{e.fullName}</Text>
                                                    </View>
                                                )
                                            })
                                        }

                                    </ScrollView>
                                </View>
                                <View>
                                    <View style={styles.contactSearchContainer}>
                                        <AntDesign name="search1" size={24} color="#797979" />
                                        <TextInput onChangeText={(text) => setSearchQuery(text)} placeholder='Search Contacts' style={styles.contactSearchInput} placeholderTextColor="#797979" />
                                    </View>
                                </View>
                                <View>
                                    <ScrollView showsVerticalScrollIndicator={false}>
                                        {
                                            searchResult !== undefined ? adminFilter.map((e, i) => {
                                                return (
                                                    <TouchableOpacity key={i} style={styles.contactsShowContainer} onPress={() => setSeletedContact([...seletedContact, e])
                                                    }>
                                                        {/* <TouchableOpacity style={{ width: 18, height: 18, borderRadius: 80, borderColor: "#CECECF", borderWidth: 2, }}>
                                                            </TouchableOpacity> */}
                                                        <View style={styles.contactData}>
                                                            <View>
                                                                <Image source={{ uri: e?.profileImage }} style={styles.contactImage} />
                                                            </View>
                                                            <View style={styles.contactNameData}>
                                                                <Text style={styles.contactName}>{e?.fullName}</Text>
                                                                <Text style={styles.contactPosition}>{`${e?.jobRole[0]} ${e?.jobRole[1] !== undefined ? e?.jobRole[1] : ''}`}</Text>
                                                            </View>
                                                        </View>
                                                    </TouchableOpacity>
                                                )
                                            })
                                                :
                                                searchResult?.map((e, i) => {
                                                    return (
                                                        <TouchableOpacity key={i} style={styles.contactsShowContainer} onPress={() => setSeletedContact([...seletedContact, e])
                                                        }>
                                                            {/* <TouchableOpacity style={{ width: 18, height: 18, borderRadius: 80, borderColor: "#CECECF", borderWidth: 2, }}>
                                                            </TouchableOpacity> */}
                                                            <View style={styles.contactData}>
                                                                <View>
                                                                    <Image source={{ uri: e.profileImage }} style={styles.contactImage} />
                                                                </View>
                                                                <View style={styles.contactNameData}>
                                                                    <Text style={styles.contactName}>{e.fullName}</Text>
                                                                    <Text style={styles.contactPosition}>{`${e?.jobRole[0]} ${e?.jobRole[1] !== undefined ? e?.jobRole[1] : ''}`}</Text>
                                                                </View>
                                                            </View>
                                                        </TouchableOpacity>
                                                    )
                                                })
                                        }
                                    </ScrollView>
                                </View>
                            </ScrollView>
                        </View>
                    </RBSheet>
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
        paddingTop: 50
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
    topNavContainer: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row'
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
        marginLeft: 5, width: 230
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
    teamContainer: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingVertical: 10,
    },
    teamMembers: {
        width: '85%'
    },
    teamMember: {
        justifyContent: 'center',
        alignItems: 'center',

    },
    teamMemberTitle: {
        color: "white",
        fontSize: 15,
        fontWeight: '500',
        marginHorizontal: 12,
        marginTop: 12
    },
    teamMemberName: {
        color: "white",
        fontSize: 15,
        fontWeight: '400',
        marginTop: -10
    },
    teamMemberCharges: {
        color: "white",
        fontSize: 13,
        fontWeight: '300',
        marginTop: -2
    },
    teamAddBtn: {
        backgroundColor: "white",
        padding: 10, borderRadius: 10, height: 100, justifyContent: 'center',
    },
    teamAddBtnWithoutTeam: {
        backgroundColor: "white",
        padding: 10, borderRadius: 10
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
        paddingHorizontal: 10, marginVertical: 13
    },
    teamMainContainer: {
        marginTop: 10,
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
    editTeamMember: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        borderRadius: 30,
        marginVertical: 8,
        borderColor: "#fff",
        borderWidth: 1
    },
    editTeamMemberText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: '700'
    },
    userPosition: {
        color: "#fff",
        fontSize: 15,
        fontWeight: '400'
    },
    listViewBtn: {
        paddingVertical: 15,
        borderBottomColor: '#d6d6d6',
        borderBottomWidth: 1,
    },
    listViewBtnText: {
        fontSize: 16,
        fontWeight: '400'
    },
    listViewDeleteBtnText: {
        fontSize: 16,
        fontWeight: '400', color: 'red'
    },
    filterBoxTitle: {
        fontSize: 22,
        fontWeight: '400'
    },
    teamGuideText: {
        color: "white",
        fontSize: 15,
        fontWeight: '400',
        opacity: 0.8,
        width: "85%"
    },
    contactsContainer: {
        paddingVertical: 10
    },
    contactsTitleContainer: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    },
    contactTitle: {
        fontSize: 17, fontWeight: "400"
    },
    contactSelectBtn: {
        backgroundColor: "#1A4BAB", paddingHorizontal: 15, borderRadius: 8, paddingVertical: 10
    },
    contactSelectBtnText: {
        color: "white", fontSize: 16, fontWeight: '500'
    },
    contactProfileContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20, marginHorizontal: 10
    },
    contactImage: {
        width: 40, height: 40, borderRadius: 60
    },
    contactName: {
        fontSize: 13, fontWeight: "400", marginTop: 3
    },
    contactSearchContainer: {
        flexDirection: "row",
        justifyContent: 'flex-start',
        borderColor: '#EEEEEE',
        borderWidth: 1.5,
        paddingVertical: 10,
        paddingHorizontal: 8,
        marginTop: 10,
        borderRadius: 15,
    },
    contactSearchInput: {
        marginHorizontal: 10,
        color: '#797979'
    },
    contactsShowContainer: {
        marginTop: 25,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    contactData: {
        flexDirection: "row",
        marginHorizontal: 13
    },
    contactNameData: {
        marginHorizontal: 10
    },
    contactName: {
        fontWeight: '600',
        fontSize: 17
    },
    chargesContainer: {
        paddingTop: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    chargesInputContainer: {
        marginTop: 50,
        borderColor: "#ECECEC",
        borderWidth: 1,
        width: 300,
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderRadius: 10
    },
    chargesInput: {
        color: "white", fontSize: 20, fontWeight: '500'
    },
    doneChargesBtn: {
        marginVertical: 30, borderRadius: 30, borderWidth: 1, borderColor: 'white', width: 300, padding: 10, justifyContent: 'center', alignItems: 'center',
    },
    doneChargesBtnText: {
        color: 'white', fontWeight: '600', fontSize: 23
    },
    selectedTeamMember: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    }
})