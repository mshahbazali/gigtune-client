import { View, Image, StyleSheet, ImageBackground, Text, ScrollView, TouchableOpacity, TextInput, RefreshControl } from 'react-native'
import React, { useRef, useState, useEffect, useCallback } from 'react'
import { BlurView } from 'expo-blur';
import { Ionicons, MaterialIcons, AntDesign } from '@expo/vector-icons';
import RBSheet from "react-native-raw-bottom-sheet";
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-root-toast';
import { Api } from '../../../Config/Api'
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});
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
  const [industry, setIndustry] = useState();
  const [jobRole, setJobRole] = useState();
  const [discription, setDiscription] = useState();
  const [notificationToken, setNotificationToken] = useState()
  const [profileImage, setProfileImage] = useState();
  const industriesRefs = useRef();
  const jonRoleRefs = useRef();
  async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
    return token;
  }
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);
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
  const [industries, setIndustries] = useState();
  const [jobRoles, setJobRoles] = useState();
  const allIndustries = [
    {
      title: "Music",
      image: require("../../../Assets/Images/music.png")
    },
    {
      title: "Cinema",
      image: require("../../../Assets/Images/cinema.png")
    },
    {
      title: "Theater",
      image: require("../../../Assets/Images/theater.png")
    },
    {
      title: "Dancer",
      image: require("../../../Assets/Images/dancer.png")
    },
  ]
  const allJobRole = [
    {
      title: "Bandleader",
      image: require("../../../Assets/Images/bandleader.png")
    },
    {
      title: "D.J",
      image: require("../../../Assets/Images/dj.png")
    },
    {
      title: "Conductor",
      image: require("../../../Assets/Images/conductor.png")
    },
    {
      title: "Guitarist",
      image: require("../../../Assets/Images/guitarist.png")
    },
  ]
  useEffect(() => {
    setIndustries(allIndustries)
    setJobRoles(allJobRole)
    registerForPushNotificationsAsync().then(token => setNotificationToken(token));
  }, [])
  const induestrySearch = (text) => {
    const searchedIndustry = industries.filter(data =>
      data.title == text
    );
    if (searchedIndustry[0] === undefined) {
      setIndustries(industries)
    }
    else {
      setIndustries(searchedIndustry)
    }
  }
  const jobRoleSearch = (text) => {
    const searchedJobRole = jobRoles.filter(data =>
      data.title == text
    );
    if (searchedJobRole[0] === undefined) {
      setJobRoles(jobRoles)
    }
    else {
      setJobRoles(searchedJobRole)
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
        jobRole,
        industry,
        notificationToken
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
      else if (industry == undefined) {
        Toast.show('Select Industry', {
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
  return (
    <View style={styles.container}>
      <ImageBackground source={require('../../../Assets/Images/bg.jpg')} resizeMode="cover" style={styles.background}>
        <ScrollView showsVerticalScrollIndicator={false} refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }>
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
          <View style={styles.buisnessProfileContainer}>
            <Text style={styles.buisnessProfileTitle}>Business Profile</Text>
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
                <Text style={styles.userName}>{fullName}</Text>
                <Text style={styles.userPosition}>{jobRole}</Text>
              </View>
            </BlurView>
          </View>
          <TouchableOpacity onPress={() => industriesRefs.current.open()}>
            <BlurView intensity={40} tint="light" style={styles.inputIndustryContainer}>
              <Text style={styles.industryText}>Industry</Text>
              <AntDesign name="caretdown" size={18} color="white" style={{ marginRight: 20 }} />
            </BlurView>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => jonRoleRefs.current.open()}>
            <BlurView intensity={40} tint="light" style={styles.inputJobRoleContainer}>
              <Text style={styles.industryText}>Job Role</Text>
              <AntDesign name="caretdown" size={18} color="white" style={{ marginRight: 20 }} />
            </BlurView>
          </TouchableOpacity>
          <BlurView intensity={40} tint="light" style={styles.TextArea}>
            <TextInput onChangeText={(text) => setDiscription(text)} placeholder='Description & Links' placeholderTextColor={"#fff"} style={styles.TextAreaText} />
          </BlurView>

          <View style={styles.btnContainer}>
            <TouchableOpacity style={styles.signInBtn} onPress={signUp}>
              <Text style={styles.signInBtnText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
          <RBSheet
            ref={industriesRefs}
            height={300}
            openDuration={250}
            customStyles={{
              container: {
                padding: 20
              }
            }}
          >
            <View>
              <View>
                <Text style={styles.industriesBoxTitle}>Industries</Text>
              </View>
              <View style={styles.industriesSearchBox}>
                <AntDesign name="search1" size={24} color="#797979" />
                <TextInput onChangeText={induestrySearch} placeholder='Search industries' style={styles.industriesSearchInput} placeholderTextColor="#797979" />
              </View>
              <View style={styles.subIndustriesBox}>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                  {
                    industries == undefined ? allIndustries.map((e, i) => {
                      return (
                        <TouchableOpacity key={i} style={styles.subIndustriesBoxItem} onPress={() => {
                          industriesRefs.current.close()
                          setIndustry(e.title)
                        }}>
                          <Image source={e.image} style={styles.subIndustriesImage} />
                          <Text style={styles.subIndustriesTitle}>{e.title}</Text>
                        </TouchableOpacity>
                      )
                    })
                      :
                      industries.map((e, i) => {
                        return (
                          <TouchableOpacity key={i} style={styles.subIndustriesBoxItem} onPress={() => {
                            industriesRefs.current.close()
                            setIndustry(e.title)
                          }}>
                            <Image source={e.image} style={styles.subIndustriesImage} />
                            <Text style={styles.subIndustriesTitle}>{e.title}</Text>
                          </TouchableOpacity>
                        )
                      })
                  }

                </ScrollView>
              </View>
            </View>
          </RBSheet>
          <RBSheet
            ref={jonRoleRefs}
            height={300}
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
              <View style={styles.subIndustriesBox}>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                  {
                    jobRoles == undefined ? allJobRole.map((e, i) => {
                      return (
                        <TouchableOpacity key={i} style={styles.subIndustriesBoxItem} onPress={() => {
                          jonRoleRefs.current.close()
                          setJobRole(e.title)
                        }}>
                          <Image source={require("../../../Assets/Images/dj.png")} style={styles.subIndustriesImage} />
                          <Text style={styles.subIndustriesTitle}>Bandleader</Text>
                        </TouchableOpacity>
                      )
                    })
                      :
                      jobRoles.map((e, i) => {
                        return (
                          <TouchableOpacity key={i} style={styles.subIndustriesBoxItem} onPress={() => {
                            jonRoleRefs.current.close()
                            setJobRole(e.title)
                          }}>
                            <Image source={e.image} style={styles.subIndustriesImage} />
                            <Text style={styles.subIndustriesTitle}>{e.title}</Text>
                          </TouchableOpacity>
                        )
                      })
                  }

                </ScrollView>
              </View>
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
  buisnessProfileContainer: {
    marginTop: 18,
  },
  buisnessProfileTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "400"
  },
  buisnessProfileDetailContainer: {
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderRadius: 10
  },
  pickBusinessProfile: {
    padding: 10,
    margin: 10,
    borderRadius: 10
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
  inputIndustryContainer: {
    borderRadius: 10,
    height: 50,
    width: 320,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
    flexDirection: 'row'
  },
  industryText: {
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
    height: 170,
    width: 320,
    justifyContent: 'flex-start',
    marginVertical: 10,
    padding: 10,
  },
  TextAreaText: {
    fontSize: 17,
    fontWeight: '400',
    color: "white",
    opacity: 0.8
  },
  btnContainer: {
    marginVertical: 20
  },
  signInBtn: {
    backgroundColor: "#fff",
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 30
  },
  signInBtnText: {
    color: "#EF4D38",
    fontWeight: '600',
    fontSize: 18,
    fontWeight: '700'
  },
  signUpBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 30,
    marginVertical: 14,
    borderColor: "#fff",
    borderWidth: 1
  },
  signUpBtnText: {
    color: "#fff",
    fontWeight: '600',
    fontSize: 18,
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
})