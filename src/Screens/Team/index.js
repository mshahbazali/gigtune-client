import { View, Image, StyleSheet, ImageBackground, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native'
import React, { useState, useRef } from 'react'
import { BlurView } from 'expo-blur';
import { Ionicons, Entypo, FontAwesome, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import RBSheet from "react-native-raw-bottom-sheet";
import { useSelector } from 'react-redux';
export default function Index({ navigation }) {
  const state = useSelector(state => state)
  const contactRef = useRef();
  const optionRef = useRef();
  const arr = [1, 2, 3, 4, 5, 6, 7]
  const event = state.selectedEvent
  return (
    <View style={styles.container}>
      <ImageBackground source={require('../../Assets/Images/bg.jpg')} resizeMode="cover" style={styles.background}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.contentContainer}>
            <View style={styles.topNavContainer}>
              <TouchableOpacity onPress={() => navigation.navigate("Event")}>
                <Ionicons name="arrow-back-sharp" size={33} color="white" />
              </TouchableOpacity>
            </View>
            <View>
              <Text style={styles.teamNameTitle}>Team Name</Text>
              {
                event?.team?.map((e, i) => {
                  return (
                    <BlurView key={i} intensity={40} tint="light" style={styles.teamMemberContainer}>
                      <View style={styles.teamMemberDetailContainer}>
                        <View>
                          <Image source={{ uri: e.profileImage }} style={styles.teamMemberProfileImage} />
                        </View>
                        <View style={styles.teamMemberNameData}>
                          <Text style={styles.teamMemberName}>{e.fullName}</Text>
                          <Text style={styles.teamMemberPosition}>{e.jobRole}</Text>
                        </View>
                      </View>
                      <View style={{ marginRight: 10 }}>
                        <View style={{ backgroundColor: "#14AE5C", padding: 6, borderRadius: 10, justifyContent: 'center', alignItems: 'center', }}>
                          <Text style={styles.teamMemberPosition}>{e.status}</Text>
                        </View>
                      </View>
                      <View>
                        <TouchableOpacity onPress={() => optionRef.current.open()} style={{ marginLeft: 10 }}>
                          <Entypo name="dots-three-vertical" size={24} color="white" />
                        </TouchableOpacity>
                        <Text style={styles.teamMemberPosition}>{`$${e.price}`}</Text>
                      </View>
                    </BlurView>
                  )
                })
              }
              <TouchableOpacity style={styles.addTeamMember} onPress={() => contactRef.current.open()}>
                <Text style={styles.addTeamMemberText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.doneTeamMember} onPress={() => navigation.navigate("Event")}>
                <Text style={styles.doneTeamMemberText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
          <RBSheet
            animationType={"slide"}
            closeOnDragDown={true}
            dragFromTopOnly={true}
            onOpen={(e) => { console.log(e) }}
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
                  <TouchableOpacity style={styles.contactSelectBtn} onPress={() => {
                    setAddCharge(true)
                    contactRef.current.close()
                  }}>
                    <Text style={styles.contactSelectBtnText}>Next</Text>
                  </TouchableOpacity>
                </View>
                <View>
                  <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    {
                      arr.map((e, i) => {
                        return (
                          <View key={i} style={styles.contactProfileContainer}>
                            <Image source={require("../../Assets/Images/team.png")} style={styles.contactImage} />
                            <Text style={styles.contactName}>John</Text>
                          </View>
                        )
                      })
                    }

                  </ScrollView>
                </View>
                <View>
                  <View style={styles.contactSearchContainer}>
                    <AntDesign name="search1" size={24} color="#797979" />
                    <TextInput placeholder='Search Job Roles' style={styles.contactSearchInput} placeholderTextColor="#797979" />
                  </View>
                </View>
                <View>
                  <ScrollView showsVerticalScrollIndicator={false}>
                    <TouchableOpacity style={styles.contactsShowContainer}>
                      <TouchableOpacity style={{ width: 18, height: 18, borderRadius: 80, borderColor: "#CECECF", borderWidth: 2, }}>
                      </TouchableOpacity>
                      <View style={styles.contactData}>
                        <View>
                          <Image source={require("../../Assets/Images/team.png")} style={styles.contactImage} />
                        </View>
                        <View style={styles.contactNameData}>
                          <Text style={styles.contactName}>Adam Erickson</Text>
                          <Text style={styles.contactPosition}>Manager</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </ScrollView>
                </View>
              </ScrollView>
            </View>
          </RBSheet>
          <RBSheet
            animationType={"slide"}
            closeOnDragDown={true}
            dragFromTopOnly={true}
            onOpen={(e) => { console.log(e) }}
            ref={optionRef}
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
                optionRef.current.close()
              }}>
                <Text style={styles.listViewBtnText}>Change Price</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.listViewBtn} onPress={() => {
                optionRef.current.close()
              }}>
                <Text style={styles.listViewDeleteBtnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </RBSheet>
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
  teamNameTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: '500',
    marginVertical: 18,
    marginHorizontal: 12
  },
  teamMemberDetailContainer: {
    justifyContent: 'flex-start',
    alignItems: "flex-start",
    flexDirection: 'row',
    width: "63%"
  },
  teamMemberNameData: {
    marginHorizontal: 10,
  },
  teamMemberProfileImage: {
    width: 30, height: 30
  },
  teamMemberName: {
    color: "white", fontSize: 18, fontWeight: '700',
  },
  teamMemberPosition: {
    color: "white", fontSize: 15, fontWeight: '400',
  },
  teamMemberContainer: {
    borderRadius: 10,
    width: 320,
    justifyContent: 'flex-start',
    marginVertical: 5,
    padding: 10,
    marginHorizontal: 12,
    alignItems: 'center',
    flexDirection: "row"
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
  addTeamMember: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 30,
    marginVertical: 8,
    borderColor: "#fff",
    borderWidth: 1
  },
  doneTeamMember: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 30,
    marginVertical: 8,
    borderColor: "#fff",
    borderWidth: 1,
    backgroundColor: "#fff"
  },
  addTeamMemberText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: '700'
  },
  doneTeamMemberText: {
    color: "#ED6324",
    fontSize: 18,
    fontWeight: '700'
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
    marginVertical: 20,
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
})