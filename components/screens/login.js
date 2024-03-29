import { StatusBar } from 'expo-status-bar';
import { useState , useEffect , memo } from 'react';
import { StyleSheet, Text, View , Image,TextInput , TouchableOpacity,Keyboard } from 'react-native';
import {useFonts} from "expo-font";
import {signInWithEmailAndPassword, onAuthStateChanged} from "@firebase/auth";
import "firebase/firestore";
import {authState} from '../../services/FirebaseConfig.js';
import { useUser } from './usercontext.js';

/*{imagesData.map((image, index) => (
                <Image
                    key={index}
                    style={{
                        position: "absolute",
                        marginLeft: image.marginLeft,
                        marginTop: image.marginTop,
                        transform: [{ rotate: `${image.rotate}deg` }],
                        zIndex:-1
                    }}
                    source={require("../imgs/dumbell.png")}
                />
            ))} */


const Login =({navigation}) => {

      const [TecladoVisivel,setTecladoVisivel] = useState(false);

      useEffect(() => {
        const KeyBoardShowListener = Keyboard.addListener("keyboardDidShow" , () =>{
            setTecladoVisivel(true);
        });
        const KeyBoardHideListener = Keyboard.addListener("keyboardDidHide" , () =>{
            setTecladoVisivel(false);
        })
      });
      
    const [Email , SetarEmail] = useState("");
    const [Senha , SetarSenha] = useState("");
    const {setIdutilizador} = useUser();
    const AdminEmail = "Admin";
    const AdminPass ="Admin123";


    const [fontsloaded] = useFonts({
        "Zing.rust":require("../../assets/fonts/zing.rust-demo-base.otf")
      });

      if(!fontsloaded){
        return undefined;
    }

    const HandleLogin = async() =>{
        let unsubscribe;

        try{
            if(Email == "" || Senha ==""){
                alert("Os campos não podem estar vazios");
            }
            else{
                if(Email == AdminEmail && Senha == AdminPass){
                    navigation.replace("FirstShown");
                    setIdutilizador("Admin");
                }
                else{
                    const userCredential = await signInWithEmailAndPassword(authState , Email , Senha);
                    const user = userCredential.user;
                    setIdutilizador(user.uid);
                    unsubscribe = onAuthStateChanged(authState , user => {
                        if(user){
                            setCurrentUser(true);
                        }
                        else{
                            setCurrentUser(false);
                        }
                    });
                    alert("Utilizador logado");
                    navigation.replace("Home");
                }
            }
        }catch(error){
            console.log("Aconteceu o seguinte erro --> : " + error.message)
        }
        return () => unsubscribe();
    }

    return(
        <View style={styles.content}>
            <Image style={{width:"100%",height:"100%",zIndex:0,position:"absolute",}} source={require("../imgs/background.png")}></Image>
            <Image style={styles.img} source={require("../imgs/GymPro_sem_fundo.png")} resizeMode='contain'></Image>
            <View style={styles.div}>

                <Text style={{...styles.fonttexto,textAlign:"center" , fontSize:45, marginTop:20,}}>Login</Text>
                <TouchableOpacity style={{marginLeft:20,padding:10,borderWidth:1,borderColor:"red",width:100,position:"absolute"}} onPress={() => navigation.replace("Perguntas")}>
                    <Text>Press-me</Text>
                </TouchableOpacity>
                <View id='Formulario' style={styles.form}>

                    <Text style={{...styles.fonttexto,color:"gray",marginBottom:10,marginLeft:10}}>Email</Text>
                    <TextInput onChangeText={(text) => SetarEmail(text)} style={styles.input} placeholder="Insira seu E-mail"/>
                    <Text style={{...styles.fonttexto,color:"gray",marginBottom:10,marginLeft:10}}>Senha</Text>
                    <TextInput onChangeText={(text) => SetarSenha(text)} style={styles.input} placeholder='Insira sua senha'></TextInput>

                    <TouchableOpacity onPress={() => HandleLogin()} style={styles.botoes}>
                        <Text style={{...styles.fonttexto,textAlign:"center", color:"white",marginTop:3}}>Login</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.botoes}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image style={{ width: 20, height: 20, marginRight: 10 , marginLeft:20 }} source={require("../imgs/Google.png")} resizeMode='contain' />
                        <Text style={{ ...styles.fonttexto,marginLeft:10, color: "white" }}>Login com o Google</Text>
                        </View>
                    </TouchableOpacity>

                    <Text style={{...styles.fonttexto,textAlign:"center",marginBottom:5}}>Não tem uma conta?</Text>
                    <TouchableOpacity style={{...styles.botoes,width:"30%",marginBottom:5}} onPress={() => navigation.navigate("Cadastro")}>
                        <Text style={{...styles.fonttexto,textAlign:"center",textDecorationLine:"underline",color:"white",marginTop:3}}>Crie uma</Text>
                    </TouchableOpacity>

                    <TouchableOpacity>
                        <Text style={{...styles.fonttexto,textAlign:"center",textDecorationLine:"underline"}}>Esqueci minha senha</Text>
                    </TouchableOpacity>

                </View>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    content:{
        width:"100%",
        height:"100%",
        zIndex:2,
    },
    div:{
        width:"100%",
        height:"65%",
        backgroundColor:"#ffffff",
        marginTop:"auto",
        borderTopRightRadius:120
    },
    img:{
        flex:1,
        alignSelf:"center",
        zIndex:2
    },
    form:{
        flex:1,
        alignSelf:"center",
        marginTop:10,
        width:"70%",
        padding:10
    },
    input:{
        padding:10,
        borderWidth:1,
        borderRadius:20,
        width:"95%",
        marginBottom:20,
        alignSelf:"center",
        color:"black"
    },
    botoes:{
        padding:10,
        borderWidth:1,
        borderRadius:10,
        width:"95%",
        marginBottom:20,
        backgroundColor:"black",
        flex:1,
        alignSelf:"center",
    },
    backimgs:{
        position:"absolute",
        width:"30%",
        marginLeft:10,
        marginTop:10,
        transform:[{rotate:"-45deg"}]
    },
    fonttexto:{
        fontFamily:"Zing.rust"
    }
})

export default memo(Login);