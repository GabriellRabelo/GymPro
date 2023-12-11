import { StatusBar } from 'expo-status-bar';
import { useState , useEffect , memo } from 'react';
import { StyleSheet, Text, View , Image,TextInput , TouchableOpacity } from 'react-native';
import {useFonts} from "expo-font";
import { useUser } from './usercontext.js';


const Home = () => {

    const {idutilizador} = useUser();

    return(
        <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
            <Text>{idutilizador}</Text>
        </View>
    )
};

const style = StyleSheet.create({});

export default memo(Home);