import { useState , useEffect , memo } from 'react';
import { StyleSheet, Text, View , Image,TextInput , TouchableOpacity,Keyboard, LogBox } from 'react-native';
import {useFonts} from "expo-font";
import {signInWithEmailAndPassword, onAuthStateChanged} from "@firebase/auth";
import "firebase/firestore";
import {authState} from '../../services/FirebaseConfig.js';
import { useUser } from './usercontext.js';


const Login =({navigation}) => {
    LogBox.ignoreAllLogs();

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
    const [HidePass , setHidePass] = useState(true);
    const EyeIcon = HidePass ? require("../icons/view.png") : require("../icons/hide.png");
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
                    navigation.replace("Home");
                }
            }
        }catch(error){
            console.log("Aconteceu o seguinte erro --> : " + error.message);
            alert("Algo deu errado, tente novamente mais tarde")
        }
        return () => unsubscribe();
    }

    return(
        <View style={styles.content}>
            <Image style={{width:"100%",height:"100%",zIndex:0,position:"absolute",}} source={require("../imgs/background.png")}></Image>
            <Image style={styles.img} source={require("../imgs/GymPro_sem_fundo.png")} resizeMode='contain'></Image>
            <View style={styles.div}>

                <Text style={{...styles.fonttexto,textAlign:"center" , fontSize:45, marginTop:20,}}>Login</Text>

                <View id='Formulario' style={styles.form}>

                    <Text style={{...styles.fonttexto,color:"gray",marginBottom:"4%",marginLeft:"4%"}}>Email</Text>
                    <TextInput onChangeText={(text) => SetarEmail(text)} style={styles.input} placeholder="Insira seu E-mail"/>
                    <Text style={{...styles.fonttexto,color:"gray",marginBottom:"4%",marginLeft:"4%"}}>Senha</Text>
                    
                    <View style={styles.inputContainer}>
                        <TextInput secureTextEntry={HidePass} onChangeText={(text) => SetarSenha(text)} style={styles.input} placeholder='Insira sua senha'/>
                        <TouchableOpacity onPress={() => setHidePass(!HidePass)} style={styles.eye}>
                            <Image style={{ width: 30, height: 30 }} source={EyeIcon} />
                         </TouchableOpacity>
                    </View>

                    <TouchableOpacity onPress={() => HandleLogin()} style={TecladoVisivel ? {...styles.botoes,marginTop:"5%"} : styles.botoes}>
                        <Text style={{...styles.fonttexto,textAlign:"center", color:"white",marginTop:"1%"}}>Login</Text>
                    </TouchableOpacity>

                    <Text style={{...styles.fonttexto,textAlign:"center",marginBottom:"2%"}}>Não tem uma conta?</Text>
                    <TouchableOpacity style={{...styles.botoes,width:"30%",marginBottom:"2%"}} onPress={() => navigation.replace("Cadastro")}>
                        <Text style={{...styles.fonttexto,textAlign:"center",textDecorationLine:"underline",color:"white",marginTop:"1%"}}>Crie uma</Text>
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
        marginTop:"1%",
        width:"70%",
        padding:"1%"
    },
    input:{
        padding:"4%",
        borderWidth:1,
        borderRadius:20,
        width:"95%",
        marginBottom:"7%",
        alignSelf:"center",
        color:"black"
    },
    botoes:{
        padding:"5%",
        borderWidth:1,
        borderRadius:10,
        width:"95%",
        marginBottom:"7%",
        backgroundColor:"black",
        alignSelf:"center",
    },
    fonttexto:{
        fontFamily:"Zing.rust"
    },
    eye:{
        position:"absolute",
        marginLeft:"80%",
        marginTop:"4%"
    }
})

export default memo(Login);