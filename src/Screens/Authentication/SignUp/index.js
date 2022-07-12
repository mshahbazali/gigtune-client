import { View, Image, StyleSheet, ImageBackground, Text, ScrollView, TouchableOpacity, TextInput, RefreshControl } from 'react-native'
import React, { useRef, useState, useEffect, useCallback } from 'react'
import { BlurView } from 'expo-blur';
import { Ionicons, MaterialIcons, AntDesign } from '@expo/vector-icons';
import RBSheet from "react-native-raw-bottom-sheet";
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-root-toast';
import { Api } from '../../../Config/Api'
import SelectMultiple from 'react-native-select-multiple'

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}
export default function Index({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const [fullName, setFullName] = useState()
  const [emailAddress, setEmailAddress] = useState()
  const [phoneNumber, setPhoneNumber] = useState()
  const [password, setPassword] = useState()
  const [confirmPassword, setConfirmPassword] = useState()
  const [address, setAddress] = useState();
  const [businessName, setBusinessName] = useState();
  const [jobRole, setJobRole] = useState([]);
  const [discription, setDiscription] = useState();
  const [profileImage, setProfileImage] = useState();
  const [businessProfile, setBusinessProfile] = useState(false)
  const jonRoleRefs = useRef();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);
  let filterJobRole = [...new Set(jobRole)];
  const selectProfileImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync();
    if (!result.cancelled) {
      const formData = new FormData();
      formData.append('image', {
        uri: result.uri,
        name: 'random-file-name',
        type: 'image/jpg'
      })
      setRefreshing(true)
      await axios.post(`${Api}/event/uploadimage`, formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          transformRequest: () => {
            return formData;
          }
        })
        .then((response) => {
          setProfileImage(`https://drive.google.com/uc?export=view&id=${response.data.fileId}`)
          setRefreshing(false)
        })
        .catch(function (error) {
          setRefreshing(false)
          Toast.show("Check Internet Connection", {
            duration: Toast.durations.LONG,
            position: Toast.positions.TOP,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
          });
        });

    }
  }
  const signUp = async () => {
    if (password == confirmPassword) {
      const userData = {
        fullName,
        emailAddress,
        phoneNumber,
        profileImage,
        password,
        address,
        discription,
        jobRole: filterJobRole,
        businessName
      }
      if (fullName == undefined) {
        Toast.show('Enter Full Name', {
          duration: Toast.durations.LONG,
          position: Toast.positions.TOP,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        });
      }
      else if (emailAddress == undefined) {
        Toast.show('Enter Email Address', {
          duration: Toast.durations.LONG,
          position: Toast.positions.TOP,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        });
      }
      else if (phoneNumber == undefined) {
        Toast.show('Enter Phone Number', {
          duration: Toast.durations.LONG,
          position: Toast.positions.TOP,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        });
      }
      else if (password == undefined) {
        Toast.show('Enter Password', {
          duration: Toast.durations.LONG,
          position: Toast.positions.TOP,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        });
      }
      else if (confirmPassword == undefined) {
        Toast.show('Enter Confirm Password', {
          duration: Toast.durations.LONG,
          position: Toast.positions.TOP,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        });
      }
      else if (businessName == undefined) {
        Toast.show('Select businessName', {
          duration: Toast.durations.LONG,
          position: Toast.positions.TOP,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        });
      }
      else if (jobRole == undefined) {
        Toast.show('Select Job Role', {
          duration: Toast.durations.LONG,
          position: Toast.positions.TOP,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        });
      }
      else {
        axios.post(`${Api}/register`, userData)
          .then(function (response) {
            Toast.show(response.data.message, {
              duration: Toast.durations.LONG,
              position: Toast.positions.TOP,
              shadow: true,
              animation: true,
              hideOnPress: true,
              delay: 0,
              onHidden: () => {
                navigation.navigate("SignIn")
              }
            });
          })
          .catch(function (error) {
            Toast.show("Check Internet Connection", {
              duration: Toast.durations.LONG,
              position: Toast.positions.TOP,
              shadow: true,
              animation: true,
              hideOnPress: true,
              delay: 0,
            });
          });
      }

    }
    else {
      Toast.show('Password are not matching', {
        duration: Toast.durations.LONG,
        position: Toast.positions.TOP,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });
    }

  }

  const musicInstrument = ['Singer', 'Bass guitar', 'Keyboard, Piano',
    'Drum',
    'Guitar',
    'Violin',
    'Trumpet',
    'Drummer',
    'Percussion',
    'Trombone',
    'Darbuka',
    'Djembe',
    'Clarinet',
    'Buzuki',
    'Harp',
    'Flute',
    'Cello',
  ]
  const equipment = ['Amplification & lighting', 'Stage worker', 'Soundman',
    'Inflatables',
    'Balloons',
    'Flower arranging',
    'Screens',
    'Electrical engineer',
    'Construction engineer',
    'Equipment for events'
  ]
  const photographer = ['photographer', 'Photographer assistant', 'Lighting technician',
    'Magnet photographer',
    'Video',
    'Video assistant',
    'Screens',
    'Electrical engineer',
    'Construction engineer',
    'Equipment for events'
  ]
  const management = ['Event Planner', 'Seating arrangements and arrival confirmations']
  const eventServices = ['Band',
    'D.J',
    'Choir',
    'Big band',
    'Philharmonic',
    'Venues',
  ]
  const entertainment = ['Magician', 'Clown']
  const cinemaAndTheater = ['Director',
    'Assistant director',
    'Choreographer',
    'Dancer',
    'Extra',
    'Actor',
    'Circus preformer',
  ]
  const food = ['Catering',
    'Shef',
    'Waiter',
    'Alcohol, cocktails',
    'Barman',
  ]
  const stylingAndDesign = ['Hair & make up',
    'Stylist',
    'Designing tables'
  ]
  const transportation = ['Shuttle service',
    'Driver']

  const [searchJobRole, setSearchJobRole] = useState([])
  const jobRoleSearch = (text) => {
    const allItem = [...musicInstrument, ...equipment, ...photographer, ...management, ...eventServices,
    ...cinemaAndTheater,
    ...food,
    ...stylingAndDesign,
    ...transportation,
    ]
    const searchedJobRole = allItem.filter(data =>
      data == text
    );
    if (searchedJobRole[0] === undefined) {
      setSearchJobRole([undefined])
    }
    else {
      setSearchJobRole(searchedJobRole)
    }
  }


  const renderLabel = (label, style) => {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ marginLeft: 10 }}>
          <Text style={style}>{label}</Text>
        </View>
      </View>
    )
  }
  const [searchQuery, setSearchQuery] = useState({ searchJobRole: [] })
  const [musicInstrumentSelected, setMusicInstrumentSelected] = useState({ musicInstrument: [] })
  const [equipmentSelected, setEquipmentSelected] = useState({ equipment: [] })
  const [photographerSelected, setPhotographerSelected] = useState({ photographer: [] })
  const [managementSelected, setManagementSelected] = useState({ management: [] })
  const [eventServicesSelected, setEventServicesSelected] = useState({ eventServices: [] })
  const [entertainmentSelected, setEntertainmentSelected] = useState({ entertainment: [] })
  const [cinemaAndTheaterSelected, setCinemaAndTheaterSelected] = useState({ cinemaAndTheater: [] })
  const [foodSelected, setFoodSelected] = useState({ food: [] })
  const [stylingAndDesignSelected, setStylingAndDesignSelected] = useState({ stylingAndDesign: [] })
  const [transportationSelected, setTransportationSelected] = useState({ transportation: [] })
  
  return (
    <View style={styles.container}>
      <ImageBackground source={require('../../../Assets/Images/bg.jpg')} resizeMode="cover" style={styles.background}>
        <ScrollView showsVerticalScrollIndicator={false} refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }>
          {
            businessProfile == false ?
              <View>
                <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
                  <View style={styles.backIconContainer}>
                    <Ionicons name="arrow-back-sharp" size={33} color="white" />
                  </View>
                </TouchableOpacity>
                <View style={styles.logoContainer}>
                  <Image source={require("../../../Assets/Images/whitelogo.png")} style={styles.logo} />
                </View>
                <View style={styles.headingContainer}>
                  <Text style={styles.heading}>Sign Up</Text>
                  <Text style={styles.noteText}>Please, enter your details.</Text>
                </View>
                <BlurView intensity={40} tint="light" style={styles.inputContainer}>
                  <TextInput onChangeText={(text) => setFullName(text)} placeholder='Full Name' placeholderTextColor={"#fff"} style={styles.input} />
                </BlurView>
                <BlurView intensity={40} tint="light" style={styles.inputContainer}>
                  <TextInput onChangeText={(text) => setEmailAddress(text)} keyboardType="email-address" placeholder='Email Address' placeholderTextColor={"#fff"} style={styles.input} />
                </BlurView>
                <BlurView intensity={40} tint="light" style={styles.inputContainer}>
                  <TextInput onChangeText={(text) => setPhoneNumber(text)} keyboardType="number-pad" placeholder='Phone Number' placeholderTextColor={"#fff"} style={styles.input} />
                </BlurView>
                <BlurView intensity={40} tint="light" style={styles.inputContainer}>
                  <TextInput onChangeText={(text) => setPassword(text)} keyboardType="visible-password" placeholder='Password' placeholderTextColor={"#fff"} style={styles.input} />
                </BlurView>
                <BlurView intensity={40} tint="light" style={styles.inputContainer}>
                  <TextInput onChangeText={(text) => setConfirmPassword(text)} placeholder='Confirm Password' keyboardType="visible-password" placeholderTextColor={"#fff"} style={styles.input} />
                </BlurView>
                <BlurView intensity={40} tint="light" style={styles.inputContainer}>
                  <TextInput onChangeText={(text) => setAddress(text)} placeholder='Address' placeholderTextColor={"#fff"} style={styles.input} />
                </BlurView>
                <View style={styles.btnContainer}>
                  <TouchableOpacity style={styles.nextBtn} onPress={() => setBusinessProfile(true)}>
                    <Text style={styles.signInBtnText}>Next</Text>
                  </TouchableOpacity>
                </View>
              </View>
              :
              <View style={styles.buisnessProfileContainer}>
                <TouchableOpacity onPress={() => setBusinessProfile(false)}>
                  <View style={styles.backIconContainer}>
                    <Ionicons name="arrow-back-sharp" size={33} color="white" />
                  </View>
                </TouchableOpacity>
                <View style={styles.logoContainer}>
                  <Image source={require("../../../Assets/Images/whitelogo.png")} style={styles.logo} />
                </View>
                <View style={styles.headingContainer}>
                  <Text style={styles.heading}>Business Profile</Text>
                </View>
                <BlurView intensity={40} tint="light" style={styles.buisnessProfileDetailContainer}>
                  <TouchableOpacity onPress={selectProfileImage}>
                    <BlurView intensity={40} tint="light" style={styles.pickBusinessProfile}>
                      {
                        profileImage == undefined ?
                          <MaterialIcons name="camera" size={45} color="#fff" />
                          :
                          <Image source={{ uri: profileImage }} style={{ width: 50, height: 50 }} />
                      }
                    </BlurView>
                  </TouchableOpacity>
                  <View style={styles.userDetail}>
                    <Text style={styles.userPosition}>Add logo or profile photo</Text>
                  </View>
                </BlurView>
                <BlurView intensity={40} tint="light" style={styles.inputContainer}>
                  <TextInput onChangeText={(text) => setBusinessName(text)} placeholder='Business name' placeholderTextColor={"#fff"} style={styles.input} />
                </BlurView>

                <TouchableOpacity onPress={() => jonRoleRefs.current.open()}>
                  <BlurView intensity={40} tint="light" style={styles.inputJobRoleContainer}>
                    <Text style={styles.businessNameText}>Job Role</Text>
                    <AntDesign name="caretdown" size={18} color="white" style={{ marginRight: 20 }} />
                  </BlurView>
                </TouchableOpacity>
                <BlurView intensity={40} tint="light" style={styles.TextArea}>
                  <TextInput multiline={true} onChangeText={(text) => setDiscription(text)} placeholder='Description & links - Provide a short description of your services and links - this will help organizers and freelancers choose you!' placeholderTextColor={"#fff"} style={styles.TextAreaText} />
                </BlurView>

                <View style={styles.btnContainer}>
                  <TouchableOpacity style={styles.signInBtn} onPress={signUp}>
                    <Text style={styles.signInBtnText}>Sign Up</Text>
                  </TouchableOpacity>
                </View>
              </View>

          }
          <RBSheet
            ref={jonRoleRefs}
            height={600}
            openDuration={250}
            customStyles={{
              container: {
                padding: 20
              }
            }}
          >

            <View>
              <View>
                <Text style={styles.industriesBoxTitle}>Job Roles</Text>
              </View>
              <View style={styles.industriesSearchBox}>
                <AntDesign name="search1" size={24} color="#797979" />
                <TextInput onChangeText={jobRoleSearch} placeholder='Search Job Roles' style={styles.industriesSearchInput} placeholderTextColor="#797979" />
              </View>
              {
                searchJobRole[0] == undefined ?
                  <View style={styles.itemListContainer}>
                    <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={false}>
                      <View style={styles.jobRolesHeading}>
                        <Text style={styles.jobRolesHeadingText}>Music instrument</Text>
                      </View>
                      <SelectMultiple
                        items={musicInstrument}
                        renderLabel={renderLabel}
                        selectedItems={musicInstrumentSelected.musicInstrument}
                        onSelectionsChange={(musicInstrument, item) => {
                          setJobRole([...jobRole, item.label])
                          setMusicInstrumentSelected({ musicInstrument })
                        }} />
                      <View style={styles.jobRolesHeading}>
                        <Text style={styles.jobRolesHeadingText}>Equipment</Text>
                      </View>
                      <SelectMultiple
                        items={equipment}
                        renderLabel={renderLabel}
                        selectedItems={equipmentSelected.equipment}
                        onSelectionsChange={(equipment, item) => {
                          setJobRole([...jobRole, item.label])
                          setEquipmentSelected({ equipment })
                        }} />
                      <View style={styles.jobRolesHeading}>
                        <Text style={styles.jobRolesHeadingText}>Photographer</Text>
                      </View>
                      <SelectMultiple
                        items={photographer}
                        renderLabel={renderLabel}
                        selectedItems={photographerSelected.photographer}
                        onSelectionsChange={(photographer, item) => {
                          setJobRole([...jobRole, item.label])
                          setPhotographerSelected({ photographer })
                        }} />
                      <View style={styles.jobRolesHeading}>
                        <Text style={styles.jobRolesHeadingText}>Management</Text>
                      </View>
                      <SelectMultiple
                        items={management}
                        renderLabel={renderLabel}
                        selectedItems={managementSelected.management}
                        onSelectionsChange={(management, item) => {
                          setManagementSelected({ management })
                        }} />
                      <View style={styles.jobRolesHeading}>
                        <Text style={styles.jobRolesHeadingText}>Event services</Text>
                      </View>
                      <SelectMultiple
                        items={eventServices}
                        renderLabel={renderLabel}
                        selectedItems={eventServicesSelected.eventServices}
                        onSelectionsChange={(eventServices, item) => {
                          setJobRole([...jobRole, item.label])
                          setEventServicesSelected({ eventServices })
                        }} />
                      <View style={styles.jobRolesHeading}>
                        <Text style={styles.jobRolesHeadingText}>Entertainment</Text>
                      </View>
                      <SelectMultiple
                        items={entertainment}
                        renderLabel={renderLabel}
                        selectedItems={entertainmentSelected.entertainment}
                        onSelectionsChange={(entertainment, item) => {
                          setJobRole([...jobRole, item.label])
                          setEntertainmentSelected({ entertainment })
                        }} />
                      <View style={styles.jobRolesHeading}>
                        <Text style={styles.jobRolesHeadingText}>Cinema & Theater</Text>
                      </View>
                      <SelectMultiple
                        items={cinemaAndTheater}
                        renderLabel={renderLabel}
                        selectedItems={cinemaAndTheaterSelected.cinemaAndTheater}
                        onSelectionsChange={(cinemaAndTheater, item) => {
                          setJobRole([...jobRole, item.label])
                          setCinemaAndTheaterSelected({ cinemaAndTheater })
                        }} />
                      <View style={styles.jobRolesHeading}>
                        <Text style={styles.jobRolesHeadingText}>Food</Text>
                      </View>
                      <SelectMultiple
                        items={food}
                        renderLabel={renderLabel}
                        selectedItems={foodSelected.food}
                        onSelectionsChange={(food, item) => {
                          setJobRole([...jobRole, item.label])
                          setFoodSelected({ food })
                        }} />
                      <View style={styles.jobRolesHeading}>
                        <Text style={styles.jobRolesHeadingText}>Styling & Design</Text>
                      </View>
                      <SelectMultiple
                        items={stylingAndDesign}
                        renderLabel={renderLabel}
                        selectedItems={stylingAndDesignSelected.stylingAndDesign}
                        onSelectionsChange={(stylingAndDesign, item) => {
                          setJobRole([...jobRole, item.label])
                          setStylingAndDesignSelected({ stylingAndDesign })
                        }} />
                      <View style={styles.jobRolesHeading}>
                        <Text style={styles.jobRolesHeadingText}>Transportation</Text>
                      </View>
                      <SelectMultiple
                        items={transportation}
                        renderLabel={renderLabel}
                        selectedItems={transportationSelected.transportation}
                        onSelectionsChange={(transportation, item) => {
                          setJobRole([...jobRole, item.label])
                          setTransportationSelected({ transportation })
                        }} />
                    </ScrollView>
                  </View>
                  :
                  <View>
                    <View style={styles.jobRolesHeading}>
                      <Text style={styles.jobRolesHeadingText}>Search Result</Text>
                    </View>
                    <SelectMultiple
                      items={searchJobRole}
                      renderLabel={renderLabel}
                      selectedItems={searchQuery.searchJobRole}
                      onSelectionsChange={(searchJobRole, item) => {
                        setJobRole([...jobRole, item.label])
                        setSearchQuery({ searchJobRole })
                      }} />
                  </View>
              }


            </View>
          </RBSheet>
        </ScrollView>
      </ImageBackground >
    </View >
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
  backIconContainer: {
    position: 'absolute',
    left: 0,
    top: 80
  },
  logoContainer: {
    marginTop: 70,
    marginBottom: 10,
    alignItems: 'center',
  },
  logo: {
    width: 180,
    height: 60
  },
  headingContainer: {
    marginVertical: 20
  },
  heading: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 27,
    textAlign: 'center',
    lineHeight: 33
  },
  noteText: {
    color: "#fff",
    fontWeight: "400",
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 33
  },
  inputContainer: {
    borderRadius: 10,
    height: 50,
    width: 320,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10
  },
  input: {
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '500',
    color: "white"
  },

  buisnessProfileTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "400"
  },
  buisnessProfileDetailContainer: {
    marginTop: 18,
    borderRadius: 10, justifyContent: 'center', alignItems: 'center', paddingVertical: 15, marginVertical: 10
  },
  pickBusinessProfile: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,

  },
  userDetail: {
    justifyContent: 'center',
  },
  userName: {
    color: "#fff",
    fontSize: 22,
    fontWeight: '600'
  },
  userPosition: {
    color: "#fff",
    fontSize: 15,
    fontWeight: '400'
  },
  inputbusinessNameContainer: {
    borderRadius: 10,
    height: 50,
    width: 320,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
    flexDirection: 'row'
  },
  businessNameText: {
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '500',
    color: "white",
    marginLeft: 130
  },
  inputJobRoleContainer: {
    borderRadius: 10,
    height: 50,
    width: 320,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
    flexDirection: 'row'
  },
  TextArea: {
    borderRadius: 10,
    height: 200,
    width: 320,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginVertical: 10,
    padding: 10,
  },
  TextAreaText: {
    fontSize: 17,
    fontWeight: '400',
    color: "white",
    opacity: 0.8,
    textAlignVertical: 'top'
  },
  btnContainer: {
    marginVertical: 20
  },
  nextBtn: {
    backgroundColor: "#fff",
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 30,
    marginTop: 20
  },
  signInBtn: {
    backgroundColor: "#fff",
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 30,
  },
  signInBtnText: {
    color: "#EF4D38",
    fontWeight: '600',
    fontSize: 18,
    fontWeight: '700'
  },
  industriesBoxTitle: {
    fontSize: 22,
    fontWeight: '500'
  },
  industriesSearchBox: {
    flexDirection: "row",
    justifyContent: 'flex-start',
    borderColor: '#EEEEEE',
    borderWidth: 1.5,
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginTop: 15,
    borderRadius: 15,
  },
  industriesSearchInput: {
    marginHorizontal: 10,
    color: '#797979'
  },
  subIndustriesBox: {
    marginTop: 20
  },
  subIndustriesBoxItem: {
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subIndustriesImage: {
    borderRadius: 20,
    width: 80,
    height: 90
  },
  subIndustriesTitle: {
    fontSize: 15,
    textAlign: 'center',
    marginVertical: 6,
    fontWeight: "500"
  },
  jobRolesHeading: {
    marginVertical: 10
  },
  jobRolesHeadingText: {
    fontSize: 16
  },
  itemListContainer: {
    marginBottom: 16
  }
})