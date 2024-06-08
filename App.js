import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet, Text, View,Image } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
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
import Exercicio_Selecionado from './components/screens/exercicio_selecionado.js';
import { CreateTables, InsertDataExercicios } from './services/HandleDataBase.js';
import Favoritos from './components/screens/favoritos.js';
import Dieta from './components/screens/dieta.js';
import BuscarAlimentos from './components/screens/buscaralimentos.js';


export default function App() {

  /*useEffect(() => {
    const initializeDatabase = async () => {
      await CreateTables();
      await InsertDataExercicios();
    };
    initializeDatabase();
  }, []);*/

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
          <Stack.Screen options={{headerShown:false}} name='Exercicio' component={Exercicio_Selecionado}/>
          <Stack.Screen options={{headerShown:false}} name='Dieta' component={Dieta}/>
          <Stack.Screen options={{headerShown:false}} name='Favoritos' component={Favoritos}/>
          <Stack.Screen options={{headerShown:false}} name='BuscarAlimentos' component={BuscarAlimentos}/>
          <Stack.Screen options={{headerShown:false}} name="Home">
            {() => (
              <Tab.Navigator
                screenOptions={({ route }) => ({
                  tabBarStyle:styles.barstyle,
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
  barstyle:{
    padding:10,
    borderTopWidth:2,
    borderColor:"rgba(0,0,0,0.5)",
    height:55,
    paddingBottom:4,
  }
});
