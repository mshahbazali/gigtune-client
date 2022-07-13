import { View, Image, StyleSheet, RefreshControl, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native'
import React, { useState, useRef, useEffect, useCallback, Key } from 'react'
import { BlurView } from 'expo-blur';
import { Octicons, FontAwesome, AntDesign, Entypo } from '@expo/vector-icons';
import { CalendarList } from 'react-native-calendars';
import RBSheet from "react-native-raw-bottom-sheet";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Api } from '../../../Config/Api';
import JWT from 'expo-jwt';
import SelectDropdown from 'react-native-select-dropdown'
import RNDateTimePicker from '@react-native-community/datetimepicker';

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}
export default function Index({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const state = useSelector(state => state)
  const filterRef = useRef();
  const [events, setEvents] = useState([])
  const [listView, setListView] = useState(false);
  const currentDate = new Date().toISOString().slice(0, 10);
  const [selectDate, setSelectDate] = useState()
  const [adminId, setAdminId] = useState();
  const [today, setToday] = useState(new Date())
  const [searchQuery, setSearchQuery] = useState('');
  const [approveSuggestions, setApproveSuggestions] = useState();
  const [calendarData, setCalendarData] = useState({})

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
  let eventTotal = 0
  let suggestionsTotal = 0
  let [totalCharges, setTotalCharges] = useState(0);
  const suggestion = state.user?.suggestions?.filter((e) => e.status == "Awating")
  const todaySugg = new Date().toISOString().slice(0, 10);
  const todayFilter = suggestion?.filter((e) => e.date == todaySugg)
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
    });
    setCalendarData({ month: today.getMonth(), year: today.getFullYear() })
    axios.post(`${Api}/suggestions/`, { suggestions: todaySuggestionsIds }, {
      headers: {
        token: state.token
      }
    }).then((res) => {
      state.todaySuggestions = res.data.suggestions;
    }).catch(() => { })
    // Yesterday request 
    axios.post(`${Api}/suggestions/`, { suggestions: yesterdaySuggestionsIds }, {
      headers: {
        token: state.token
      }
    }).then((res) => {
      state.yesterdaySuggestions = res.data.suggestions;
    }).catch(() => { })
    setTotalCharges(eventTotal + suggestionsTotal)
    return unsubscribe;
  }, [navigation])
  useEffect(() => {
    getToken()
    getAdminId()
    axios.get(`${Api}/event/`).then((res) => {
      state.event = res.data.events
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
    axios.post(`${Api}/suggestions/`, { suggestions: todaySuggestionsIds }, {
      headers: {
        token: state.token
      }
    }).then((res) => {
      state.todaySuggestions = res.data.suggestions;
    }).catch(() => { })
    // Yesterday request 
    axios.post(`${Api}/suggestions/`, { suggestions: yesterdaySuggestionsIds }, {
      headers: {
        token: state.token
      }
    }).then((res) => {
      state.yesterdaySuggestions = res.data.suggestions;
    }).catch(() => { })
    setTotalCharges(eventTotal + suggestionsTotal)
  }, [refreshing])
  const adminFilter = events?.filter((e) => e.admin == adminId);
  const eventFilter = adminFilter?.filter((e) => e.date == (selectDate == undefined ? currentDate : selectDate));
  const approveSuggestionDate = approveSuggestions?.filter((e) => e.date == (selectDate == undefined ? currentDate : selectDate));
  const searchFilter = adminFilter?.filter((e) => e.title == searchQuery);
  let allDateObject = {};
  adminFilter?.forEach((day) => {
    allDateObject[day.date] = {
      marked: true, dotColor: '#fff'
    };
  });
  let approveSuggestionsDate = {};
  approveSuggestions?.forEach((day) => {
    approveSuggestionsDate[day.date] = {
      // customStyles: {
      //   container: {
      //     width: 50,
      //     height: 50,
      //     borderRadius: 8
      //   },
      //   text: {
      //     color: 'white',
      //     fontWeight: 'bold',
      //   }
      // },
      marked: true, dotColor: '#fff'
    };
  });
  const mark = {
    // [currentDate]: {
    //   // customStyles: {
    //   //   container: {
    //   //     backgroundColor: '#D92B50',
    //   //     width: 50,
    //   //     height: 50,
    //   //     borderRadius: 8
    //   //   },
    //   //   text: {
    //   //     color: 'white',
    //   //     fontWeight: 'bold',
    //   //   }
    //   // },
    //   marked: true, dotColor: '#fff'
    // },
    ...allDateObject,
    ...approveSuggestionsDate
  };
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const [fromDate, setFromDate] = useState()
  const [fromDateDefault, setFromDateDefault] = useState(new Date())
  const [ToDate, setToDate] = useState()
  const [ToDateDefault, setToDateDefault] = useState(new Date())
  const [fromDatePicker, setFromDatePicker] = useState(false)
  const [toDatePicker, setToDatePicker] = useState(false)
  let dateFilter = events.filter((e) => e.date >= fromDate && e.date <= ToDate)
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
                <Text style={styles.totalAmount}>{`Total $${totalCharges}`}</Text>
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
          {searchQuery.length !== 0 ?
            // Search View
            <View>
              <BlurView intensity={40} tint="light" style={styles.eventListConatinerOnlyListView}>
                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                  {
                    searchFilter.map((e, i) => {
                      let charges = e.team.map(e => Number(e.price))?.reduce((prev, curr) => prev - curr, 0);
                      eventTotal += charges
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
                              <Text style={styles.eventListBottomLineCalandarText}>{`$${charges}`}</Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                      )
                    })
                  }
                </ScrollView>
              </BlurView>
            </View>
            : dateFilter[0] !== undefined ?
              // Date View 
              <View>
                <View>
                  <Text style={styles.calanderTitle}>All events on</Text>
                </View>
                <BlurView intensity={40} tint="light" style={styles.selectedDateContainer}>
                  <View style={styles.dateContainer}>
                    <Text style={styles.dateContainerText}>{`${fromDate} - ${ToDate}`}</Text>
                  </View>
                  <TouchableOpacity onPress={() => {
                    setFromDate(undefined)
                    setToDate(undefined)
                    setListView(false)
                    setTotalCharges(eventTotal + suggestionsTotal)
                  }}>
                    <AntDesign name="closecircleo" size={20} color="white" />
                  </TouchableOpacity>
                </BlurView>
                <BlurView intensity={40} tint="light" style={styles.eventListConatinerOnlyListView}>
                  <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                    {
                      dateFilter.map((e, i) => {
                        let charges = e.team.map(e => Number(e.price))?.reduce((prev, curr) => prev - curr, 0);
                        eventTotal += charges
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
                                <Text style={styles.eventListBottomLineCalandarText}>{`$${charges}`}</Text>
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
              listView == false ?
                // Calendar View 
                <View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                    <Text style={styles.calanderTitle}>View events for</Text>
                    <Text style={styles.calanderTitle}>{`${months[calendarData?.month]} - ${calendarData?.year}`}</Text>
                  </View>

                  <View style={{ marginBottom: 27, }}>
                    <CalendarList
                      style={{
                        height: 270,
                      }}
                      key={Key}
                      dayComponent={({ date, state, marking }) => {
                        return (
                          <TouchableOpacity
                            style={{ backgroundColor: selectDate == undefined ? date.dateString == currentDate ? '#D92B50' : '' : date.dateString == selectDate ? '#D92B50' : '', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 10, marginVertical: -5 }}
                            onPress={() => {
                              setToday(new Date(date.timestamp));
                              setSelectDate(date.dateString)
                            }}>
                            <Text style={{ textAlign: 'center', color: "#fff", fontWeight: '600' }}>{date.day}</Text>
                            {
                              marking !== undefined ?
                                <Entypo name="dot-single" size={13} color="white" />
                                : null
                            }
                          </TouchableOpacity>
                        );
                      }}
                      theme={{
                        selectedDayBackgroundColor: '#00adf5',
                        textSectionTitleDisabledColor: '#fff',
                        calendarBackground: "#ED8524",
                        backgroundColor: "#ED8524",
                      }}
                      markingType={'custom'}
                      markedDates={mark}
                      hideArrows={true}
                      hideExtraDays={true}
                      renderHeader={date => {
                        <View></View>
                      }}
                      horizontal={true}
                      firstDay={1}
                      onVisibleMonthsChange={(e) => {
                        setCalendarData({ month: new Date(e[0].timestamp).getMonth(), year: new Date(e[0].timestamp).getFullYear() })
                      }}
                      calendarWidth={400}
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
                          let charges = e?.team?.map(e => Number(e.price))?.reduce((prev, curr) => prev - curr, 0);
                          eventTotal += charges
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
                                  <Text style={styles.eventListBottomLineCalandarText}>{`$${charges}`}</Text>
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
                          let totalCharges = charges?.map(e => Number(e.price))?.reduce((prev, curr) => prev + curr, 0);
                          suggestionsTotal += totalCharges
                          return (
                            <TouchableOpacity key={i} style={styles.eventList} onPress={async () => {
                              state.approveSugesstionCharges = charges[0]?.price
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
                                  <Text style={styles.eventListBottomLineCalandarText}>{`$${charges[0]?.price}`}</Text>
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
                listView !== false ?
                  <View>
                    <View>
                      <Text style={styles.calanderTitle}>{`All events on ${days[today.getDay()]} ${today.getDate()}, ${months[today.getMonth()]} ${today.getFullYear()}`}</Text>
                    </View>
                    <BlurView intensity={40} tint="light" style={styles.eventListConatinerOnlyListView}>
                      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                        {
                          eventFilter.map((e, i) => {
                            let charges = e.team.map(e => Number(e.price))?.reduce((prev, curr) => prev - curr, 0);
                            eventTotal += charges
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
                                    <Text style={styles.eventListBottomLineCalandarText}>{`$${charges}`}</Text>
                                  </View>
                                </View>
                              </TouchableOpacity>
                            )
                          })
                        }
                      </ScrollView>
                    </BlurView>
                  </View> :
                  null

          }
          {

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
          height={400}
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
            <View style={{ marginBottom: 20 }}>
              <Text style={styles.filterBoxTitle}>Filter</Text>
            </View>
            {/* <TouchableOpacity style={styles.listViewBtn} onPress={() => {
              setListView(true)
              filterRef.current.close()
            }}>
              <Text style={styles.listViewBtnText}>List View</Text>
            </TouchableOpacity> */}
            <View style={{ marginBottom: 16 }}>
              <Text style={styles.viewTitle}>Select View</Text>
            </View>
            <SelectDropdown
              buttonStyle={{ borderRadius: 20, backgroundColor: 'white', borderColor: '#ED3A24', borderWidth: 2, width: 150 }}
              buttonTextStyle={{ color: '#ED3A24', fontWeight: '600' }}
              defaultButtonText="Calendar"
              renderDropdownIcon={() => {
                return (
                  <AntDesign name="caretdown" size={15} color="#ED3A24" />
                )
              }}
              dropdownIconPosition="right"
              data={["Calendar", "List"]}
              onSelect={(selectedItem, index) => {
                if (selectedItem == "Calendar") {
                  setListView(false)
                }
                else {
                  setListView(true)
                }
              }}
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem
              }}
              rowTextForSelection={(item, index) => {
                return item
              }}
            />
            <View style={{ marginVertical: 20 }}>
              <Text style={styles.viewTitle}>Sort by date</Text>
            </View>
            <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
              <TouchableOpacity style={styles.datePickerBtn} onPress={() => setFromDatePicker(true)}>
                <Text style={styles.datePickerBtnText}>{fromDate == undefined ? "From" : fromDate}</Text>
                <AntDesign name="caretdown" size={15} color="#ED3A24" />
              </TouchableOpacity>
              {
                fromDatePicker ?
                  <RNDateTimePicker value={fromDateDefault} onChange={(event, text) => {
                    setFromDatePicker(false)
                    setFromDate(text.toISOString().slice(0, 10))
                    setFromDateDefault(text)
                  }} />
                  : null
              }
              <TouchableOpacity style={styles.datePickerBtn} onPress={() => setToDatePicker(true)}>
                <Text style={styles.datePickerBtnText}>{ToDate == undefined ? "To" : ToDate}</Text>
                <AntDesign name="caretdown" size={15} color="#ED3A24" />
              </TouchableOpacity>
              {
                toDatePicker ?
                  <RNDateTimePicker value={ToDateDefault} onChange={(event, text) => {
                    setToDatePicker(false)
                    setToDate(text.toISOString().slice(0, 10))
                    setToDateDefault(text)
                  }} />
                  : null
              }
            </View>
            <View>
              <TouchableOpacity style={styles.exitBtn} onPress={() => filterRef.current.close()}>
                <Text style={styles.exitBtnText}>Exit/Done</Text>
              </TouchableOpacity>
            </View>
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
  viewTitle: {
    fontSize: 17,
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
  datePickerBtn: {
    borderRadius: 20,
    borderColor: "#ED3A24",
    borderWidth: 2,
    paddingVertical: 12, paddingHorizontal: 16,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    width: '45%'
  },
  datePickerBtnText: {
    color: '#ED3A24', fontWeight: '600', textAlign: 'right', fontSize: 18
  },
  exitBtn: {
    backgroundColor: '#1A4BAB',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    borderRadius: 20,
    paddingVertical: 14
  },
  exitBtnText: {
    color: 'white',
    fontSize: 17, fontWeight: '500'
  },
  selectedDateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 14,
    marginHorizontal: 16,
    paddingHorizontal: 10,
    borderRadius: 20,
    width: 220,
    paddingVertical: 6
  },
  dateContainerText: {
    color: 'white', fontWeight: '700'
  }
})