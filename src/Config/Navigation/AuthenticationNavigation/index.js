import { SignUp, SignIn } from '../../../Screens/Authentication'
import BottomNavigation from '../Bottom'
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();
export default function Index() {
    return (
        <Stack.Navigator>
            <Stack.Screen options={{ headerShown: false }} name="SignIn" component={SignIn} />
            <Stack.Screen options={{ headerShown: false }} name="SignUp" component={SignUp} />
            <Stack.Screen options={{ headerShown: false }} name="BottomNavigation" component={BottomNavigation} />
        </Stack.Navigator>
    );
}