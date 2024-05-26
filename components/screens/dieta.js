import { StatusBar } from 'expo-status-bar';
import { useState , useEffect , memo } from 'react';
import { StyleSheet, Text, View , Image,TextInput , TouchableOpacity } from 'react-native';
import {useFonts} from "expo-font";
import "firebase/firestore";
import { useUser } from './usercontext.js';

const Dieta = ({navigation}) =>{
    return(
        <View>
            <Text style={{ alignSelf: "center", marginTop: "15%", fontSize: 30,fontFamily:"Zing.rust" }}>Dieta</Text>
            <TouchableOpacity style={{position:"absolute",width:30,height:20,marginTop:"12%",marginLeft:"5%"}} onPress={() => navigation.navigate("Home")}>
                <Image style={styles.backimg} source={require("../icons/back_arrow.png")}></Image>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    backimg:{
        width:50,
        height:50,
    },
});

export default Dieta;