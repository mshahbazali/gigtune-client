import { View, RefreshControl, Image, StyleSheet, ImageBackground, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native'
import React, { useState, useRef, useCallback, useEffect } from 'react'
import { BlurView } from 'expo-blur';
import { Ionicons, Entypo, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import RBSheet from "react-native-raw-bottom-sheet";
import * as ImagePicker from 'expo-image-picker';
import Placesearch from 'react-native-placesearch';
import { useSelector } from 'react-redux';
import * as DocumentPicker from 'expo-document-picker';
import Toast from 'react-native-root-toast';
import { Api } from '../../../Config/Api';
import axios from 'axios';
import { WebView } from 'react-native-webview';

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}
export default function Index({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const state = useSelector(state => state)
  const locationRef = useRef();
  const [datePicker, setDatePicker] = useState(false)
  const [date, setDate] = useState("date");
  const [defaultDate, setDefaultDate] = useState(new Date());
  const datePickerFun = (event, text) => {
    setDefaultDate(text)
    setDate(text.toISOString().slice(0, 10))
    setDatePicker(false)
  }
  const [title, setTitle] = useState()
  const [location, setLocation] = useState()
  const [discription, setDiscription] = useState()
  const [photos, setPhotos] = useState([])
  const [files, setFiles] = useState([])
  const [filePath, setFilePath] = useState()
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);
  const checkFileRef = useRef();

  useEffect(() => {
    if (state?.selectedEvent?.title !== undefined) {
      setTitle(state.selectedEvent.title)
      setLocation(state.selectedEvent.location)
      setDate(state.selectedEvent.date)
      setDiscription(state.selectedEvent.discription)
      setPhotos(state.selectedEvent.photos)
      setFiles(state.selectedEvent.files)
    }
  }, [])
  const selectImages = async () => {
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
          state.photos.push(response.data.fileId)
          setPhotos(state.photos)
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
  const docSelect = async () => {
    let result = await DocumentPicker.getDocumentAsync()
    if (!result.cancelled) {
      const formData = new FormData();
      formData.append('file', {
        uri: result.uri,
        name: result.name,
        type: result.mimeType
      })
      setRefreshing(true)
      await axios.post(`${Api}/event/uploadfile`, formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          transformRequest: () => {
            return formData;
          }
        })
        .then((response) => {
          state.files.push(response.data.fileId)
          setFiles(state.files)
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
  const updateEvent = async () => {
    const eventUpdateData = {
      title,
      date,
      location,
      discription,
      photos,
      files,
      admin: state.selectedEvent.admin,
      _id: state.selectedEvent._id
    }
    if (title == undefined) {
      Toast.show("Enter Event Title", {
        duration: Toast.durations.LONG,
        position: Toast.positions.TOP,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });
    }
    else if (date == undefined) {
      Toast.show("Select Event Date", {
        duration: Toast.durations.LONG,
        position: Toast.positions.TOP,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });
    }
    else if (location == undefined) {
      Toast.show("Pick Location", {
        duration: Toast.durations.LONG,
        position: Toast.positions.TOP,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });
    }
    else if (discription == undefined) {
      Toast.show("Enter Discription", {
        duration: Toast.durations.LONG,
        position: Toast.positions.TOP,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });
    }
    else if (photos[0] == undefined) {
      Toast.show("Select Event Photos", {
        duration: Toast.durations.LONG,
        position: Toast.positions.TOP,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });
    }
    else if (files[0] == undefined) {
      Toast.show("Select Event Files", {
        duration: Toast.durations.LONG,
        position: Toast.positions.TOP,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });
    }
    else {
      axios.post(`${Api}/event/update`, eventUpdateData, {
        headers: {
          token: state.token
        }
      })
        .then(async (response) => {
          state.selectedEvent = {}
          await navigation.navigate("Event")
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
          <View style={styles.contentContainer}>
            <View style={styles.backIconContainer}>
              <TouchableOpacity onPress={() => navigation.navigate("Event")}>
                <Ionicons name="arrow-back-sharp" size={33} color="white" />
              </TouchableOpacity>
            </View>
            <View style={styles.titleGuideContainer}>
              <View>
                <Image source={require("../../../Assets/Images/arrow.png")} style={styles.titleGuideArrow} />
              </View>
              <View>
                <Text style={styles.titleText}>Give a catchy title to your event</Text>
              </View>
            </View>
            <BlurView intensity={40} tint="light" style={styles.inputTitleContainer}>
              <TextInput value={title} onChangeText={(text) => setTitle(text)} placeholder='Event Title' placeholderTextColor={"#fff"} style={styles.input} />
            </BlurView>
            <View>
              <TouchableOpacity style={styles.dataPickerBtn} onPress={() => setDatePicker(!datePicker)}>
                <Text style={styles.dataPickerBtnText}>{date == "date" ? "Pick a date" : date}</Text>
                <FontAwesome name="calendar" size={24} color="white" />
              </TouchableOpacity>
              {
                datePicker == true ?
                  <RNDateTimePicker value={defaultDate} onChange={datePickerFun} />
                  : null
              }
              <TouchableOpacity style={styles.locationPickerBtn} onPress={() => locationRef.current.open()}>
                <View>
                  <Text style={styles.locationPickerBtnMainText}>Pick a location</Text>
                  <Text style={styles.locationPickerBtnSubText}>{location == undefined ? "Address of location" : location.slice(0, 32)}</Text>
                </View>
                <Ionicons name="location" size={30} color="white" />
              </TouchableOpacity>
              <BlurView intensity={40} tint="light" style={styles.TextArea}>
                <TextInput value={discription} onChangeText={(text) => setDiscription(text)} placeholder='Event description' placeholderTextColor={"#fff"} style={styles.TextAreaText} />
              </BlurView>
              <View>
                <Text style={styles.addPhotoTitle}>Add Photos</Text>
              </View>
              <BlurView intensity={40} tint="light" style={styles.photoPickContainer}>
                <View style={styles.userDetail}>
                  {
                    photos[0] == undefined ?
                      <Text style={styles.addFileSubTitle}>No Photo</Text>
                      :
                      <View style={styles.imagesContainer}>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                          {
                            photos.map((e, i) => {
                              return (
                                <TouchableOpacity key={i} style={styles.imageContainer} onPress={() => {
                                  setFilePath(e)
                                  checkFileRef.current.open()
                                }}>
                                  <Image source={{ uri: `https://drive.google.com/uc?export=view&id=${e}` }} style={styles.images} />
                                </TouchableOpacity>
                              )
                            })
                          }
                        </ScrollView>
                      </View>
                  }
                </View>
                <View style={styles.pickBtnContainer}>
                  <TouchableOpacity intensity={40} tint="light" style={styles.photoPickBtn} onPress={selectImages}>
                    <Entypo name="squared-plus" size={45} color="#fff" />
                  </TouchableOpacity>
                </View>
              </BlurView>
              <View>
                <Text style={styles.addFileTitle}>Add Files</Text>
              </View>
              <BlurView intensity={40} tint="light" style={styles.photoPickContainer}>
                <View style={styles.userDetail}>
                  {
                    files[0] == undefined ?
                      <View style={styles.userDetail}>
                        <Text style={styles.addFileSubTitle}>No File</Text>
                      </View>
                      :
                      <View style={styles.imagesContainer}>
                        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                          {
                            files.map((e, i) => {
                              return (
                                <TouchableOpacity key={i} style={styles.fileContainer} onPress={() => {
                                  setFilePath(e)
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
                  }
                </View>
                <View style={styles.pickBtnContainer}>
                  <TouchableOpacity intensity={40} tint="light" style={styles.photoPickBtn} onPress={docSelect}>
                    <Entypo name="squared-plus" size={45} color="#fff" />
                  </TouchableOpacity>
                </View>
              </BlurView>
            </View>
            <View style={styles.btnContainer}>
              <TouchableOpacity style={styles.createEventBtn} onPress={updateEvent}>
                <Text style={styles.createEventBtnText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
            <RBSheet
              animationType={"slide"}
              closeOnDragDown={true}
              dragFromTopOnly={true}
              onOpen={(e) => { }}
              ref={locationRef}
              height={750}
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
                  <Text style={styles.industriesBoxTitle}>Pick a location</Text>
                </View>
                <View style={styles.industriesSearchBox}>

                  {/* <AntDesign name="search1" size={24} color="#797979" /> */}
                  {/* <TextInput placeholder='Search location' style={styles.industriesSearchInput} placeholderTextColor="#797979" /> */}
                  <Placesearch
                    apikey={"AIzaSyBJTIYwTIrkgzHZ5s6sshI5uxks4by7D3g"} // required *
                    SelectedAddress={(data) => {
                      locationRef.current.close()
                      setLocation(`${data.structured_formatting.main_text} ${data.structured_formatting.secondary_text}`)
                    }
                    } // required *
                    // onClose={(data) => console.log(data)}
                    coordinate={true} //optional
                    removeImg={true} //optional
                    StatusBarColor={"white"}
                    textInput={{
                      backgroundColor: "white",
                      padding: 0
                    }}
                    InputContainer={{
                      backgroundColor: "white",
                      marginTop: -5,
                      marginLeft: -5,
                      width: "100%"
                    }}
                    MainContainer={{
                      backgroundColor: "white",

                    }}
                    ListIconStyle={{
                      backgroundColor: "white",
                    }}
                    ContainerBackgroundColor={"white"}
                    placeHolder={"Search location"}
                  />
                </View>
                {/* <View style={styles.subIndustriesBox}>
                  <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    {
                      arr.map((e, i) => {
                        return (
                          <TouchableOpacity key={i} style={styles.subIndustriesBoxItem}>
                            <Image source={require("../../../Assets/Images/dj.png")} style={styles.subIndustriesImage} />
                            <Text style={styles.subIndustriesTitle}>Home</Text>
                          </TouchableOpacity>
                        )
                      })
                    }
                  </ScrollView>
                </View> */}
                {/* <TouchableOpacity style={styles.pickLocationBtn}>
                  <Text style={styles.pickLocationBtnText}>Pick from map</Text>
                </TouchableOpacity> */}
              </View>
            </RBSheet>
          </View>

        </ScrollView >
        <RBSheet
          animationType={"slide"}
          closeOnDragDown={true}
          dragFromTopOnly={true}
          onOpen={(e) => { }}
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
    paddingHorizontal: 20
  },
  contentContainer: {
    paddingTop: 70
  },
  backIconContainer: {
    position: 'absolute',
    left: 0,
    top: 50
  },
  titleGuideContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 20
  },
  titleGuideArrow: {
    width: 110,
    height: 110
  },
  fileContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10, backgroundColor: "#D92C4A", marginHorizontal: 5, paddingVertical: 10, borderRadius: 10, paddingHorizontal: 13
  },
  fileView: {
    color: "white", fontSize: 13, fontWeight: '500',
  },
  imagesContainer: {
    width: "90%",
  },
  imageContainer: {
    marginHorizontal: 4, marginVertical: 10,
  },
  images: {
    width: 80, height: 80, borderRadius: 10, borderColor: "white", borderWidth: 2
  },
  pickBtnContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -30

  },
  titleText: {
    color: "#EBE90B",
    marginTop: 20,
    fontSize: 16,
    marginLeft: -20
  },
  inputTitleContainer: {
    borderRadius: 10,
    height: 50,
    width: 320,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
    marginTop: -40
  },
  input: {
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '500',
    color: "white",
    width: 295
  },
  TextArea: {
    borderRadius: 10,
    height: 170,
    width: 320,
    justifyContent: 'flex-start',
    marginVertical: 14,
    padding: 10,
    marginHorizontal: 12,
  },
  TextAreaText: {
    fontSize: 17,
    fontWeight: '400',
    color: "white",
    opacity: 0.8
  },
  addPhotoTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "400",
    marginHorizontal: 12,
  },
  addFileTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "400",
    marginHorizontal: 12,
    marginTop: 10
  },
  photoPickContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 10,
    marginHorizontal: 12,
    paddingLeft: 15
  },
  photoPickBtn: {
    padding: 10,
    borderRadius: 10,
  },
  userDetail: {
    justifyContent: 'center',
  },
  addFileSubTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: '600'
  },
  userPosition: {
    color: "#fff",
    fontSize: 15,
    fontWeight: '400'
  },
  btnContainer: {
    marginVertical: 30
  },
  createEventBtn: {
    backgroundColor: "#fff",
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 30
  },
  createEventBtnText: {
    color: "#EF4D38",
    fontSize: 18,
    fontWeight: '700'
  },
  dataPickerBtn: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    marginVertical: 14,
    borderColor: "#fff",
    borderWidth: 1,
    flexDirection: 'row',
    marginHorizontal: 12,
    paddingHorizontal: 10
  },
  dataPickerBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: '700'
  },
  locationPickerBtn: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    borderColor: "#fff",
    borderWidth: 1,
    flexDirection: 'row',
    marginHorizontal: 12,
    paddingHorizontal: 10
  },
  locationPickerBtnMainText: {
    color: "#fff",
    fontWeight: '700',
    fontSize: 18,
  },
  locationPickerBtnSubText: {
    color: "#fff",
    fontWeight: '400',
    fontSize: 16,
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
    paddingHorizontal: 8,
    marginTop: 20,
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
  pickLocationBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 30,
    marginVertical: 18,
    borderColor: "#ED3A24",
    borderWidth: 1
  },
  pickLocationBtnText: {
    color: "#ED3A24",
    fontSize: 18,
    fontWeight: '700'
  }
})