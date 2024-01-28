import { StatusBar } from 'expo-status-bar';
import { useState , useEffect , memo } from 'react';
import { StyleSheet, Text, View , Image,TextInput , TouchableOpacity } from 'react-native';
import {useFonts} from "expo-font";
import {signInWithEmailAndPassword, onAuthStateChanged} from "@firebase/auth";
import "firebase/firestore";
import {authState} from '../../services/FirebaseConfig.js';
import { useUser } from './usercontext.js';

const Progresso = () =>{
    return(
        <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
            <Text>Progresso Screen</Text>
        </View>
    );
};

const styles = StyleSheet.create({

});

export default Progresso;