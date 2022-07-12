import { createStackNavigator } from '@react-navigation/stack';
import { Event, CreateEvent, SuggestionsDetail, SuggestionsFeed, EditEvent, Charges, EventWithTeam, Team, EventCreateDone, SuggestionsApproveDone, SuggestionsApprove } from '../../../Screens';
import { AuthenticationNavigation } from '../../../Config/Navigation';
const Stack = createStackNavigator();
export default function Index() {
    return (
        <Stack.Navigator>
            <Stack.Screen options={{ headerShown: false }} name="Event" component={Event} />
            <Stack.Screen options={{ headerShown: false }} name="CreateEvent" component={CreateEvent} />
            <Stack.Screen options={{ headerShown: false }} name="AuthenticationNavigation" component={AuthenticationNavigation} />
            <Stack.Screen options={{ headerShown: false }} name="SuggestionsDetail" component={SuggestionsDetail} />
            <Stack.Screen options={{ headerShown: false }} name="Suggestions" component={SuggestionsFeed} />
            <Stack.Screen options={{ headerShown: false }} name="EventWithTeam" component={EventWithTeam} />
            <Stack.Screen options={{ headerShown: false }} name="Team" component={Team} />
            <Stack.Screen options={{ headerShown: false }} name="EventCreateDone" component={EventCreateDone} />
            <Stack.Screen options={{ headerShown: false }} name="SuggestionsApprove" component={SuggestionsApprove} />
            <Stack.Screen options={{ headerShown: false }} name="SuggestionsApproveDone" component={SuggestionsApproveDone} />
            <Stack.Screen options={{ headerShown: false }} name="EditEvent" component={EditEvent} />
            <Stack.Screen options={{ headerShown: false }} name="Charges" component={Charges} />
        </Stack.Navigator>
    );
}