import { StatusBar } from 'expo-status-bar';
import { useState , useEffect , memo } from 'react';
import { StyleSheet, Text, View , Image,TextInput , TouchableOpacity, ImageBackground, LogBox } from 'react-native';
import {useFonts} from "expo-font";
import { useUser } from './usercontext.js';
import { shareDatabase } from '../../services/HandleDataBase.js';

const Home = ({navigation}) => {
    LogBox.ignoreAllLogs();
    const { idutilizador } = useUser();
    const NomeUtilizador = "Gabriel";

    return (
        <View style={styles.content}>
            <View style={styles.top}>
                <Text style={styles.text}>GymPro</Text>
            </View>

            <View style={styles.center}>
                <TouchableOpacity onPress={() => navigation.navigate("Exercicios")} style={styles.treino}>
                    <ImageBackground style={styles.backgroundimg} source={require("../imgs/div_semfundo.png")}>
                        <View>
                            <Text style={{marginTop:"7%",marginLeft:"7%",fontSize:23}}>Exercícios</Text>
                            <Text style={{marginLeft:"7%",fontSize:20}}>Veja nossos</Text>
                            <Text style={{marginLeft:"7%",fontSize:20}}>Exercícios</Text>
                        </View>
                    </ImageBackground>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Favoritos")} style={styles.treino}>
                    <ImageBackground style={styles.backgroundimg} source={require("../imgs/div_semfundo_favoritos.png")}>
                        <View>
                            <Text style={{marginTop:"7%",marginLeft:"5%",fontSize:23}}>Favoritos</Text>
                            <Text style={{marginLeft:"4%",fontSize:20}}>Veja seus{"\n"}Exercícios favoritos</Text>
                        </View>
                    </ImageBackground>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Dieta")} style={styles.treino}>
                    <ImageBackground style={styles.backgroundimg} source={require("../imgs/div_semfundo_dieta.png")}>
                        <View>
                            <Text style={{marginTop:"7%",marginLeft:"5%",fontSize:23}}>Dieta</Text>
                            <Text style={{marginLeft:"4%",fontSize:20}}>Acompanhe a{"\n"}Sua dieta</Text>
                        </View>
                    </ImageBackground>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
    },
    imguser: {
        width: 50,
        height: 50,
        marginRight:10
    },
    top: {
        alignItems: 'center', // Alinha os itens verticalmente
        width: "100%",
        padding: 10,
        paddingTop:40,
        height:"12%"
    },
    text: {
        fontFamily:"Zing.rust",
        fontSize:40
    },
    center:{
        height:"40%",
        borderTopWidth:0.7,
        marginTop:"3%"
    },
    treino:{
        height:"50%",
        width:"85%",
        marginTop:"10%",
        alignSelf:"center",
        borderRadius:15,
        overflow: "hidden", // Para garantir que as bordas não sejam afetadas pela imagem de fundo
        borderWidth:1.5,
        borderColor:"rgba(0,0,0,0.5)",
    },
    backgroundimg:{
        flex:1,
        resizeMode:"cover",
    },
});

export default Home;
