import { StatusBar } from 'expo-status-bar';
import { useState , useEffect , memo } from 'react';
import { StyleSheet, Text, View , Image,TextInput , TouchableOpacity } from 'react-native';
import {useFonts} from "expo-font";
import { useUser } from './usercontext.js';


const Home = () => {

    const {idutilizador} = useUser();

    return(
        <View style={styles.content}>
            <Text style={{fontSize:30,color:"black"}}>Home Screen</Text>
        </View>
    )
};

const styles = StyleSheet.create({
    content:{
        flex:1,
        justifyContent:"center",
        alignItems:"center",
    }
});

export default Home;