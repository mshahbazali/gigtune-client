import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { BottomTabBar, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import { CreateEvent, SuggestionsFeed } from '../../../Screens';
import Stack from '../Stack'
const Tab = createBottomTabNavigator();
import { BlurView } from 'expo-blur';

export default function Index() {

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarStyle: {
                    height: 55
                }
            }}

        >
            <Tab.Screen options={{
                headerShown: false, tabBarShowLabel: false, tabBarIcon: ({ focused }) => (
                    <View style={{ alignItems: 'center', justifyContent: 'center', }}>
                        <MaterialCommunityIcons name="party-popper" size={24} color="#ED5024" style={{ opacity: focused ? 1 : 0.5 }} />
                        <Text style={{ color: "#ED5024", fontSize: 12, opacity: focused ? 1 : 0.5 }}>Events</Text>
                    </View>
                ),
            }} name="Stack" component={Stack} />
            <Tab.Screen options={{
                headerShown: false, tabBarShowLabel: false, tabBarIcon: ({ focused }) => (
                    <View style={{ alignItems: 'center', justifyContent: 'center', }}>
                        <AntDesign name="pluscircle" size={24} color="#ED5024" style={{ opacity: focused ? 1 : 0.5 }} />
                        <Text style={{ color: "#ED5024", fontSize: 12, opacity: focused ? 1 : 0.5 }}>Create Events</Text>
                    </View>
                ),
            }} name="CreateEvent" component={CreateEvent} />
            <Tab.Screen options={{
                headerShown: false, tabBarShowLabel: false, tabBarIcon: ({ focused }) => (
                    <View style={{ alignItems: 'center', justifyContent: 'center', }}>
                        <AntDesign name="message1" size={24} color="#ED5024" style={{ opacity: focused ? 1 : 0.5 }} />
                        <Text style={{ color: "#ED5024", fontSize: 12, opacity: focused ? 1 : 0.5 }}>Suggestions Feed</Text>
                    </View>
                ),
            }} name="SuggestionsFeed" component={SuggestionsFeed} />
        </Tab.Navigator >

    );
}
