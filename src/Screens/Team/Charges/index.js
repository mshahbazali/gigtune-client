import { View, Image, StyleSheet, ImageBackground, Text, ScrollView, TouchableOpacity, RefreshControl, TextInput } from 'react-native'
import React, { useState, useRef, useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux';
import { Api } from '../../../Config/Api';
import axios from 'axios';
import SelectDropdown from 'react-native-select-dropdown'
import JWT from 'expo-jwt';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-root-toast';

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}
export default function Index({ navigation }) {
    const [refreshing, setRefreshing] = useState(false);
    const [adminId, setAdminId] = useState()
    const state = useSelector(state => state)
    const [selectedContact, setSelectedContact] = useState([])
    const [contactIndex, setContactIndex] = useState()
    const [selectedTeamMember, setSelectedTeamMember] = useState([])
    const [charges, setCharges] = useState()
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
    async function sendPushNotification() {
        const message = {
            to: selectedTeamMember[0].notificationToken,
            sound: 'default',
            title: 'New Suggestions!',
            body: `You received a new job offer from ${state.user.fullName}`,
            data: { someData: 'goes here' },
        };

        await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });
    }
    useEffect(() => {
        getAdminId()
        setSelectedContact(state.selectedContact)
    }, [refreshing])
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getAdminId()
            setSelectedContact(state.selectedContact)
        });

        return unsubscribe;
    }, [navigation])
    const event = state.selectedEvent
    const addTeamMember = async () => {
        await sendPushNotification()
        const memberData = {
            admin: adminId,
            _id: event._id,
            team: selectedTeamMember,
            userId: selectedTeamMember[0].id
        }
        axios.post(`${Api}/team/add`, memberData, {
            headers: {
                token: state.token
            }
        }).then(async (res) => {
            Toast.show(res.data.message, {
                duration: Toast.durations.LONG,
                position: Toast.positions.TOP,
                shadow: true,
                animation: true,
                hideOnPress: true,
                delay: 0,
            });
        }).catch(() => { })
    }
    const updateCharges = async () => {
        const memberData = {
            admin: adminId,
            _id: event._id,
            team: selectedTeamMember,
            teamMemberIndex: state.selectedTeamMemberIndex
        }
        axios.post(`${Api}/team/update/charges`, memberData, {
            headers: {
                token: state.token
            }
        }).then(async (res) => {
            Toast.show(res.data.message, {
                duration: Toast.durations.LONG,
                position: Toast.positions.TOP,
                shadow: true,
                animation: true,
                hideOnPress: true,
                delay: 0,
            });
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

                    <View style={styles.chargesContainer}>
                        <SelectDropdown
                            data={selectedContact}
                            onSelect={(selectedItem, index) => {
                                const teamMemberDetail = {
                                    id: selectedItem._id,
                                    fullName: selectedItem.fullName,
                                    jobRole: selectedItem.jobRole,
                                    profileImage: selectedItem.profileImage,
                                    notificationToken: selectedItem.notificationToken
                                }
                                setSelectedTeamMember([teamMemberDetail])
                                setContactIndex(index)
                            }}
                            buttonTextAfterSelection={(selectedItem, index) => {
                                return selectedItem.fullName
                            }}
                            rowTextForSelection={(item, index) => {
                                return item
                            }}
                            dropdownStyle={{ height: 'auto', paddingVertical: 20, borderRadius: 10 }}
                            rowStyle={{ height: 'auto', paddingVertical: 14 }}
                            renderCustomizedRowChild={(e, i) => {
                                return (
                                    <View style={styles.selectedTeamMember}>
                                        <View style={styles.contactData}>
                                            <View>
                                                <Image source={{ uri: e.profileImage }} style={styles.contactImage} />
                                            </View>
                                            <View style={styles.contactNameData}>
                                                <Text style={styles.contactName}>{e.fullName}</Text>
                                                <Text style={styles.contactPosition}>{`${e?.jobRole[0]} ${e?.jobRole[1] !== undefined ? e?.jobRole[1] : ''}`}</Text>
                                            </View>
                                        </View>
                                    </View>
                                )
                            }}
                            defaultButtonText="Select Team Member"
                            buttonStyle={{ backgroundColor: "white", width: 300, borderRadius: 10 }}
                        />
                        <View style={styles.chargesInputContainer}>
                            <TextInput onChangeText={(text) => setCharges(text)} keyboardType='number-pad' placeholder='Enter Price' style={styles.chargesInput} placeholderTextColor="#fff" />
                        </View>
                        <View>
                            <TouchableOpacity style={styles.doneChargesBtn} onPress={async () => {
                                if (selectedContact.length > 0) {
                                    selectedTeamMember[0].price = charges
                                    state.updateCharges == false ?
                                        selectedTeamMember[0].status = "Awating"
                                        : selectedTeamMember[0].status = event.team[state.selectedTeamMemberIndex].status
                                    await setSelectedTeamMember(...selectedTeamMember)
                                    state.updateCharges == false ?
                                        await addTeamMember()
                                        : await updateCharges()
                                    selectedContact[contactIndex] = null
                                    const filter = selectedContact.filter((e) => e !== null)
                                    await setSelectedContact(filter)
                                }
                                else {
                                    navigation.navigate("Event")
                                }

                            }}>
                                <Text style={styles.doneChargesBtnText}>{state.updateCharges == false ? "Done" : "Update"}</Text>
                            </TouchableOpacity>
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