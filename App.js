import { View, Platform } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { Splash, SignUp, CreateEvent, Event } from './src/Screens'
import { Bottom, AuthenticationNavigation } from "./src/Config/Navigation"
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { RootSiblingParent } from 'react-native-root-siblings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import store from './src/Store'

export default function App() {

  const [splash, setSplash] = useState(false);
  const [token, setToken] = useState()
  const getToken = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('token')
      return jsonValue != null ? setToken(JSON.parse(jsonValue)) : null;
    } catch (e) { }
  }
  useEffect(() => {
    getToken()
    setTimeout(() => {
      setSplash(true)
    }, 3000)

  }, [])
  AsyncStorage.removeItem('token')
  return (
    <Provider store={store}>
      <RootSiblingParent>
        {splash == false ?
          <Splash />
          :
          <NavigationContainer>
            {
              token == undefined ?
                <AuthenticationNavigation />
                :
                <Bottom />
            }
          </NavigationContainer>}
      </RootSiblingParent>
    </Provider>

  )
}


