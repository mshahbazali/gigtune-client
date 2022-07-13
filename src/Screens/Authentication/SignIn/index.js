import { View, Image, StyleSheet, RefreshControl, ImageBackground, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native'
import React, { useState, useCallback, useEffect } from 'react'
import { BlurView } from 'expo-blur';
import axios from 'axios';
import Toast from 'react-native-root-toast';
import { Api } from '../../../Config/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
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
  const [identifier, setIdentifier] = useState()
  const [password, setPassword] = useState();
  const [notificationToken, setNotificationToken] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);
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
  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setNotificationToken(token));
  }, [])
  const signIn = () => {
    setRefreshing(true)
    const userData = {
      identifier,
      password,
      notificationToken
    }
    if (identifier == undefined) {
      setRefreshing(false)
      Toast.show("Enter Email Address", {
        duration: Toast.durations.LONG,
        position: Toast.positions.TOP,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });
    }
    else if (password == undefined) {
      setRefreshing(false)
      Toast.show("Enter Password", {
        duration: Toast.durations.LONG,
        position: Toast.positions.TOP,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });
    }
    else {
      axios.post(`${Api}/login`, userData)
        .then(async (response) => {
          setRefreshing(false)
          if (response.data.token) {
            const token = JSON.stringify({ token: response.data.token })
            await AsyncStorage.setItem('token', token).then(() => {
              Toast.show(response.data.message, {
                duration: Toast.durations.LONG,
                position: Toast.positions.TOP,
                shadow: true,
                animation: true,
                hideOnPress: true,
                delay: 0,
                onHidden: () => {
                  navigation.navigate("BottomNavigation")
                }
              });

            })
              .catch(() => { })
          }
          else {
            Toast.show(response.data.message, {
              duration: Toast.durations.LONG,
              position: Toast.positions.TOP,
              shadow: true,
              animation: true,
              hideOnPress: true,
              delay: 0,
            });
          }

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
  return (
    <View style={styles.container}>
      <ImageBackground source={require('../../../Assets/Images/bg.jpg')} resizeMode="cover" style={styles.background}>
        <ScrollView showsVerticalScrollIndicator={false} refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }>
          <View style={styles.logoContainer}>
            <Image source={require("../../../Assets/Images/whitelogo.png")} style={styles.logo} />
          </View>
          <View style={styles.headingContainer}>
            <Text style={styles.heading}>Explore the largest</Text>
            <Text style={styles.heading}>service market</Text>
          </View>
          <BlurView intensity={40} tint="light" style={styles.inputContainer}>
            <TextInput onChangeText={(text) => setIdentifier(text)} keyboardType="email-address" placeholder='Email Address' placeholderTextColor={"#fff"} style={styles.input} />
          </BlurView>
          <BlurView intensity={40} tint="light" style={styles.inputContainer}>
            <TextInput onChangeText={(text) => setPassword(text)} keyboardType="visible-password" placeholder='Password' placeholderTextColor={"#fff"} style={styles.input} />
          </BlurView>
          <View style={styles.forgotPasswordContainer}>
            <Text style={styles.forgotPassword}>FORGOT PASSWORD?</Text>
          </View>
          <View style={styles.btnContainer}>
            <TouchableOpacity style={styles.signInBtn} onPress={signIn}>
              <Text style={styles.signInBtnText}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.signUpBtn} onPress={() => navigation.navigate("SignUp")}>
              <Text style={styles.signUpBtnText}>Sign Up</Text>
            </TouchableOpacity>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    marginTop: 120,
    marginBottom: 10,
    justifyContent: 'center',
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
  forgotPasswordContainer: {
    marginTop: 25,
  },
  forgotPassword: {
    textAlign: "center",
    textDecorationLine: "underline",
    color: "white",
    fontSize: 18,
    fontWeight: "600"
  },
  btnContainer: {
    marginTop: 150,
    marginBottom: 20
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
    fontSize: 18,
    fontWeight: '700'
  }
})