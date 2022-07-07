import { View, Image, StyleSheet, RefreshControl, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native'
import React, { useState, useRef, useEffect, useCallback } from 'react'
import { BlurView } from 'expo-blur';
import { Octicons, FontAwesome, AntDesign } from '@expo/vector-icons';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import RBSheet from "react-native-raw-bottom-sheet";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Api } from '../../../Config/Api';
import JWT from 'expo-jwt';

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}
export default function Index({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const state = useSelector(state => state)
  const filterRef = useRef();
  const arr = [1, 2, 3, 4, 5, 6, 7]
  const [events, setEvents] = useState([])
  const [listView, setListView] = useState(false);
  const currentDate = new Date().toISOString().slice(0, 10);
  const [selectDate, setSelectDate] = useState()
  const [adminId, setAdminId] = useState();
  const [today, setToday] = useState(new Date())
  const [searchQuery, setSearchQuery] = useState('');
  const [approveSuggestions, setApproveSuggestions] = useState()
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);
  const getToken = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('token')
      return jsonValue != null ? state.token = JSON.parse(jsonValue).token : null;
    } catch (e) { }
  }
  const getAdminId = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('token')
      return jsonValue != null ? setAdminId(JWT.decode(JSON.parse(jsonValue).token, "secret_gigtune").id) : null;
    } catch (e) { }
  }
  const suggestionArray = []
  const suggestionFilter = state.user.suggestions?.filter((e) => e.status == "Approve");
  for (let i = 0; i < suggestionFilter?.length; i++) {
    suggestionArray.push(suggestionFilter[i].eventId)
  }


  useEffect(() => {
    getToken()
    getAdminId()
    axios.get(`${Api}/event/`).then((res) => {
      setEvents(res.data.events);
    }).catch((err) => {
    })
    axios.get(`${Api}/user/me/`, {
      headers: {
        token: state.token
      }
    }).then((res) => {
      state.user = res.data
    }).catch((err) => {
    })
    axios.post(`${Api}/suggestions/`, { suggestions: suggestionArray }, {
      headers: {
        token: state.token
      }
    }).then((res) => {
      setApproveSuggestions(res.data.suggestions);
    }).catch(() => { })
  }, [])
  useEffect(() => {
    getToken()
    getAdminId()
    axios.get(`${Api}/event/`).then((res) => {
      setEvents(res.data.events);
    }).catch((err) => {
    })
    axios.get(`${Api}/user/me/`, {
      headers: {
        token: state.token
      }
    }).then((res) => {
      state.user = res.data
    }).catch((err) => { })
    axios.post(`${Api}/suggestions/`, { suggestions: suggestionArray }, {
      headers: {
        token: state.token
      }
    }).then((res) => {
      setApproveSuggestions(res.data.suggestions);
    }).catch(() => { })
  }, [refreshing])





  const adminFilter = events?.filter((e) => e.admin == adminId);
  const eventFilter = adminFilter?.filter((e) => e.date == (selectDate == undefined ? currentDate : selectDate));
  const approveSuggestionDate = approveSuggestions?.filter((e) => e.date == (selectDate == undefined ? currentDate : selectDate));
  const searchFilter = adminFilter?.filter((e) => e.title == searchQuery);
  let allDateObject = {};
  adminFilter?.forEach((day) => {
    allDateObject[day.date] = {
      customStyles: {
        container: {
          width: 50,
          height: 50,
          borderRadius: 8
        },
        text: {
          color: 'white',
          fontWeight: 'bold',
        }
      },
      marked: true, dotColor: '#fff'
    };
  });
  let approveSuggestionsDate = {};
  approveSuggestions?.forEach((day) => {
    approveSuggestionsDate[day.date] = {
      customStyles: {
        container: {
          width: 50,
          height: 50,
          borderRadius: 8
        },
        text: {
          color: 'white',
          fontWeight: 'bold',
        }
      },
      marked: true, dotColor: '#fff'
    };
  });
  const mark = {
    [currentDate]: {
      customStyles: {
        container: {
          backgroundColor: '#D92B50',
          width: 50,
          height: 50,
          borderRadius: 8
        },
        text: {
          color: 'white',
          fontWeight: 'bold',
        }
      },
      marked: true, dotColor: '#fff'
    },
    ...allDateObject,
    ...approveSuggestionsDate
  };

  var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  console.log(adminFilter);
  console.log(approveSuggestions);
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
                <Text style={styles.totalAmount}>Total $11,500</Text>
              </View>
              <View>
                <TouchableOpacity style={styles.filterBtn} onPress={() => filterRef.current.open()}>
                  <Text style={styles.filterBtnText}>Filter</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.eventSearchBar}>
              <View>
                <AntDesign name="search1" size={24} color="#797979" />
              </View>
              <View>
                <TextInput onChangeText={(text) => setSearchQuery(text)} maxLength={35} placeholder='Search events, dates, and more' placeholderTextColor={"#000"} style={styles.input} />
              </View>
            </View>
          </View>
          {
            searchQuery.length !== 0 ?
              <View>
                <BlurView intensity={40} tint="light" style={styles.eventListConatinerOnlyListView}>
                  <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                    {
                      searchFilter.map((e, i) => {
                        return (
                          <TouchableOpacity key={i} style={styles.eventList} >
                            <View>
                              <Text style={styles.eventListTitle}>{e.title}</Text>
                            </View>
                            <View style={styles.eventListBottomLine}>
                              <View>
                                <Image source={{ uri: state.user.profileImage }} style={styles.eventListBottomLineTeamImage} />
                              </View>
                              <View style={styles.eventListBottomLineCalandar}>
                                <FontAwesome name="calendar" size={18} color="white" />
                                <Text style={styles.eventListBottomLineCalandarText}>{e.date}</Text>
                              </View>
                              <View style={styles.eventListBottomLineCalandar}>
                                <Octicons name="location" size={18} color="white" />
                                <Text style={styles.eventListBottomLineCalandarText}>{e.location?.slice(0, 11)}...</Text>
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
              </View> :
              listView == false ?
                <View>
                  <View>
                    <Text style={styles.calanderTitle}>View events for</Text>
                  </View>

                  <View style={{ marginBottom: 27 }}>
                    <Calendar
                      style={{
                        height: 310,
                      }}
                      theme={{
                        textSectionTitleDisabledColor: '#fff',
                        calendarBackground: "#ED8524",
                        backgroundColor: "#ED8524",
                        textDayStyle: {
                          textAlign: 'center',
                          marginTop: 13,
                          color: "#fff",
                          fontSize: 17
                        },
                      }}
                      markingType={'custom'}
                      markedDates={mark}

                      onCalendarToggled={calendarOpened => {
                      }}
                      hideArrows={true}
                      hideExtraDays={true}
                      renderHeader={date => {
                        <View></View>
                      }}
                      onDayPress={day => {
                        setToday(new Date(day.timestamp));
                        setSelectDate(day.dateString);
                      }}
                    />
                  </View>
                  <View>
                    <Text style={styles.calanderTitle}>{`All events on ${days[today.getDay()]} ${today.getDate()}, ${months[today.getMonth()]} ${today.getFullYear()}`}</Text>
                  </View>
                  <BlurView intensity={40} tint="light" style={styles.eventListConatiner}>
                    <ScrollView style={{ height: 75 }} showsVerticalScrollIndicator={false}>
                      {
                        eventFilter?.map((e, i) => {
                          return (
                            <TouchableOpacity key={i} style={styles.eventList} onPress={() => {
                              state.selectedEvent = e
                              navigation.navigate("EventWithTeam")
                            }
                            }>
                              <View>
                                <Text style={styles.eventListTitle}>{e.title}</Text>
                              </View>
                              <View style={styles.eventListBottomLine}>
                                <View>
                                  <Image source={{ uri: state.user.profileImage }} style={styles.eventListBottomLineTeamImage} />
                                </View>
                                <View style={styles.eventListBottomLineCalandar}>
                                  <FontAwesome name="calendar" size={18} color="white" />
                                  <Text style={styles.eventListBottomLineCalandarText}>{e.date}</Text>
                                </View>
                                <View style={styles.eventListBottomLineCalandar}>
                                  <Octicons name="location" size={18} color="white" />
                                  <Text style={styles.eventListBottomLineCalandarText}>{e.location?.slice(0, 11)}...</Text>
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
                    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                      {
                        approveSuggestionDate?.map((e, i) => {
                          const charges = e?.team?.filter(e => e.id === state.user._id)
                          return (
                            <TouchableOpacity key={i} style={styles.eventList} onPress={async () => {
                              state.approveSugesstionCharges = charges[0].price
                              state.selectedApproveSuggestion = e
                              await navigation.navigate("SuggestionsApprove")
                            }}>
                              <View>
                                <Text style={styles.eventListTitle}>{e.title}</Text>
                              </View>
                              <View style={styles.eventListBottomLine}>
                                {/* <View>
                                  <Image source={require("../../../Assets/Images/team.png")} style={styles.eventListBottomLineTeamImage} />
                                </View> */}
                                <View style={styles.eventListBottomLineCalandar}>
                                  <FontAwesome name="calendar" size={18} color="white" />
                                  <Text style={styles.eventListBottomLineCalandarText}>{e.date}</Text>
                                </View>
                                <View style={styles.eventListBottomLineCalandar}>
                                  <Octicons name="location" size={18} color="white" />
                                  <Text style={styles.eventListBottomLineCalandarText}>{e.location?.slice(0, 14)}...</Text>
                                </View>
                                <View>
                                  <Text style={styles.eventListBottomLineCalandarText}>{`$${charges[0].price}`}</Text>
                                </View>
                              </View>
                            </TouchableOpacity>
                          )
                        })
                      }
                    </ScrollView>
                  </BlurView>
                </View>
                :
                // List View 
                <View>
                  <View>
                    <Text style={styles.calanderTitle}>{`All events on ${days[today.getDay()]} ${today.getDate()}, ${months[today.getMonth()]} ${today.getFullYear()}`}</Text>
                  </View>
                  <BlurView intensity={40} tint="light" style={styles.eventListConatinerOnlyListView}>
                    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                      {
                        eventFilter.map((e, i) => {
                          return (
                            <TouchableOpacity key={i} style={styles.eventList} >
                              <View>
                                <Text style={styles.eventListTitle}>{e.title}</Text>
                              </View>
                              <View style={styles.eventListBottomLine}>
                                <View>
                                  <Image source={{ uri: state.user.profileImage }} style={styles.eventListBottomLineTeamImage} />
                                </View>
                                <View style={styles.eventListBottomLineCalandar}>
                                  <FontAwesome name="calendar" size={18} color="white" />
                                  <Text style={styles.eventListBottomLineCalandarText}>{e.date}</Text>
                                </View>
                                <View style={styles.eventListBottomLineCalandar}>
                                  <Octicons name="location" size={18} color="white" />
                                  <Text style={styles.eventListBottomLineCalandarText}>{e.location?.slice(0, 11)}...</Text>
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
          }

          <TouchableOpacity style={styles.createEventBtn} onPress={() => navigation.navigate("CreateEvent")}>
            <Text style={styles.createEventBtnText}>Create Event</Text>
          </TouchableOpacity>
        </ScrollView>
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
            <View>
              <Text style={styles.filterBoxTitle}>Filter</Text>
            </View>
            <TouchableOpacity style={styles.listViewBtn} onPress={() => {
              setListView(true)
              filterRef.current.close()
            }}>
              <Text style={styles.listViewBtnText}>List View</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.listViewBtn} onPress={() => {
              setListView(false)
              filterRef.current.close()
            }}>
              <Text style={styles.listViewBtnText}>Calendar View</Text>
            </TouchableOpacity>
          </View>
        </RBSheet>
      </View >
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
  eventSearchBar: {
    borderRadius: 12,
    height: 50,
    width: 320,
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin: 12,
    backgroundColor: "#fff",
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  input: {
    fontSize: 15,
    fontWeight: '400',
    color: "black",
    marginLeft: 8
  },
  calanderTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: '400',
    marginHorizontal: 12,
  },
  eventListConatinerOnlyListView: {
    borderRadius: 10,
    height: 490,
    width: 320,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 17,
    marginHorizontal: 12,
    flex: 1
  },
  eventListConatiner: {
    borderRadius: 10,
    height: 240,
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
  createEventBtn: {
    backgroundColor: "#fff",
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 30,
    marginBottom: 15
  },
  createEventBtnText: {
    color: "#EF4D38",
    fontSize: 18,
    fontWeight: '700'
  },
  filterBoxTitle: {
    fontSize: 22,
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
})