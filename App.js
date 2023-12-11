import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Login from "./components/screens/login.js";
import Cadastro from "./components/screens/cadastro.js"
import { UserProvider } from './components/screens/usercontext.js';
import Home from './components/screens/home.js';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';



export default function App() {

  const Stack = createStackNavigator();
  const Tab = createBottomTabNavigator();

  return (
    <NavigationContainer>
      <UserProvider>
        <Stack.Navigator>
          <Stack.Screen options={{headerShown:false}} name='Login' component={Login}/>
          <Stack.Screen options={{headerShown:false}} name='Cadastro' component={Cadastro}/>
          <Stack.Screen options={{headerShown:false}} name="Home">
            {() => (
              <Tab.Navigator screenOptions={{drawerStyle:{backgroundColor:"#111111",padding:10}}}>
                <Tab.Screen options={{drawerInactiveTintColor:"white",title:"Home" , drawerLabel:"Home" ,
                drawerIcon:({color , size}) =>(<Ionicons name='home-outline' color={"white"} size={20}/>)}} name="Home" component={Home}/>
              </Tab.Navigator>
            )}
          </Stack.Screen>
        </Stack.Navigator>
        </UserProvider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
