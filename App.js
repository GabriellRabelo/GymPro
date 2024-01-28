import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,Image } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Login from "./components/screens/login.js";
import Cadastro from "./components/screens/cadastro.js"
import { UserProvider } from './components/screens/usercontext.js';
import Home from './components/screens/home.js';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Exercicios from './components/screens/exercicios.js';
import Calendario from './components/screens/calendario.js';
import Treinos from './components/screens/treinos.js';
import Progresso from './components/screens/progresso.js';
import Perguntas from './components/screens/perguntas.js';
export default function App() {

  const Stack = createStackNavigator();
  const Tab = createBottomTabNavigator();

  const CustomTabBarIcon = (imageName) => ({ focused, color, size }) => (
    <Image
      source={imageName}
      style={{ width: size, height: size, tintColor: color }}
    />
  );

  return (
    <NavigationContainer>
      <UserProvider>
        <Stack.Navigator>
          <Stack.Screen options={{headerShown:false}} name='Login' component={Login}/>
          <Stack.Screen options={{headerShown:false}} name='Cadastro' component={Cadastro}/>
          <Stack.Screen options={{headerShown:false}} name='Perguntas' component={Perguntas}/>
          <Stack.Screen options={{headerShown:false}} name="Home">
            {() => (
              <Tab.Navigator
                screenOptions={({ route }) => ({
                  tabBarLabel:() => null,
                  tabBarStyle:{backgroundColor:"#808080",padding:10,borderTopWidth:0,height:55,paddingBottom:4},
                  tabBarIcon: ({ focused, color, size }) => {
                    let iconImage;

                    switch (route.name){
                      case "Home": iconImage = focused ? require("./components/imgs/casa.png")
                      : require("./components/imgs/casa.png");break;

                      case "Exercicios": iconImage = focused ? require("./components/imgs/dumbell.png")
                      : require("./components/imgs/dumbell.png");break;

                      case "Calendario": iconImage = focused ? require("./components/imgs/calendario.png")
                      : require("./components/imgs/calendario.png");break;

                      case "Progresso": iconImage = focused ? require("./components/imgs/evolucao.png")
                      : require("./components/imgs/evolucao.png");break;

                      case "Treinos": iconImage = focused ? require("./components/imgs/treinos.png")
                      : require("./components/imgs/treinos.png");break;
                    }
        
                    return CustomTabBarIcon(iconImage)({ focused, color, size });
                  },
                  tabBarActiveTintColor: 'black',
                  tabBarInactiveTintColor: 'lightgray',
                })}
              >
                <Tab.Screen options={{headerShown:false}} name="Home" component={Home} />
                <Tab.Screen options={{headerShown:false}} name="Exercicios" component={Exercicios} />
                <Tab.Screen options={{headerShown:false}} name="Calendario" component={Calendario} />
                <Tab.Screen options={{headerShown:false}} name="Progresso" component={Progresso} />
                <Tab.Screen options={{headerShown:false}} name="Treinos" component={Treinos} />
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
