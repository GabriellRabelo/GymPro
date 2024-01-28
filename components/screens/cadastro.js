import { useState , useEffect , memo } from 'react';
import { StyleSheet, Text, View , Image,TextInput , TouchableOpacity, Keyboard } from 'react-native';
import {useFonts} from "expo-font";
import { SelectList } from 'react-native-dropdown-select-list';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useUser } from './usercontext.js';
import { db } from '../../services/FirebaseConfig.js';
import {createUserWithEmailAndPassword} from "firebase/auth";
import {collection , addDoc} from "firebase/firestore";
import Ionicons from "react-native-vector-icons/Ionicons";
import "firebase/firestore";
import {authState} from '../../services/FirebaseConfig.js';
import RNDateTimePicker from '@react-native-community/datetimepicker';

/*<SelectList 
                        setSelected={(val) => setSelected(val)} 
                        data={data} 
                        save="value"
                        placeholder='Selecione seu ano de nascimento'
                        search={false}
                        boxStyles={{width:"95%",alignSelf:"center"}}
                    /> */


const Cadastro = ({ navigation }) => {
    const imagesData = [
      { marginLeft: 0, marginTop: 2, rotate: -40 },
      { marginLeft: 140, marginTop: 2, rotate: -40 },
      { marginLeft: 20, marginTop: 80, rotate: -40 },
      { marginLeft: 140, marginTop: 100, rotate: -30 },
      { marginLeft: 270, marginTop: 10, rotate: 60 },
      { marginLeft: 270, marginTop: 95, rotate: 10 },
    ];
  
    const [fontsLoaded] = useFonts({
      "Zing.rust": require("../../assets/fonts/zing.rust-demo-base.otf"),
    });
  
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const [selected, setSelected] = useState("");
    const data = [];
    const [Nome , SetarNome] = useState("");
    const [Email , SetarEmail] = useState("");
    const [Senha , SetarSenha] = useState("");
    const [KeyboardVisible , setKeyboardVisible] = useState(false);
    const {setIdutilizador} = useUser();
    const [Idade , setIdade] = useState(null);
    const now = new Date();
    const CurrentYear = now.getFullYear();
    const [Year , setYear] = useState(null);


    useEffect(() => {
        if (Year !== null) {
            const idade = CurrentYear - Year;
            setIdade(idade);
        }
    }, [Year]);
    
    useEffect(() => {
        console.log(isDatePickerVisible);
    }, [isDatePickerVisible]);
    


    const OpenDatetimePicker = () => {
        setDatePickerVisible(true);
    };

      

    useEffect(() => {
        const KeyBoardShowListener = Keyboard.addListener("keyboardDidShow" , () =>{
            setKeyboardVisible(true);
        });
        const KeyBoardHideListener = Keyboard.addListener("keyboardDidHide" , () =>{
            setKeyboardVisible(false);
        })
      });
    
    useEffect(() => {
      for (let i = 1940; i <= 2008; i++) {
        data.push(i);
      }  
      return () => {
      };
    });
  
    if (!fontsLoaded) {
      return null;
    };

    const HandleCadastro = () =>{
        try{
            if (Email === "" || Senha === "" || Nome === "" || Idade === null) {
                alert("Os campos não podem estar vazios");
            }
            else{
                    console.log(Idade);
                    createUserWithEmailAndPassword(authState, Email, Senha).then(async (userCredential) => {
                            const user = userCredential.user;
                            setIdutilizador(user.uid);
                            const docRef = await addDoc(collection(db,"Utilizadores"),{
                            Email : Email,
                            Nome : Nome,
                            Id : user.uid,
                            Idade : Idade
                        }).then(navigation.replace("Perguntas"));

                    }).catch((error) => {
                        alert("Erro ao criar utilizador: " + error.message);
                    });
            }

        }catch(error){
            console.log("Aconteceu o seguinte erro " + error.message);
        }
    };

    return(
        <KeyboardAwareScrollView  style={{flex:1 , backgroundColor:"#323232"}} enableOnAndroid={true} extraScrollHeight={KeyboardVisible ? 150 : 0}>
            <Image style={{width:"100%",height:"100%",zIndex:0,position:"absolute",}} source={require("../imgs/background.png")}></Image>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Image style={{width:40,marginLeft:10}} source={require("../imgs/back.png")} resizeMode='contain'/>
            </TouchableOpacity>

            <View style={styles.div}>

                <Text style={{...styles.fonttexto,textAlign:"center" , fontSize:45, marginTop:40,}}>Cadastro</Text>
                <Text style={{...styles.fonttexto,textAlign:"center" , color:"gray"}}>Faça login para continuar</Text>
                <View id='Formulario' style={styles.form}>

                    <Text style={{...styles.fonttexto,color:"gray",marginBottom:10,marginLeft:10}}>Nome</Text>
                    <TextInput value={Nome} onChangeText={(text) => SetarNome(text.trim())} style={styles.input} placeholder='Insira seu nome'></TextInput>

                    <Text style={{...styles.fonttexto,color:"gray",marginBottom:10,marginLeft:10}}>Ano de nascimento</Text>
                    <TouchableOpacity onPress={() => OpenDatetimePicker()} style={{ alignSelf:"center", marginTop: 15, width: "100%", height: 50, padding: 10, borderWidth: 1, borderRadius: 20 }}>
                        {
                            (Idade == null)
                            ?(
                                <Text>Insira sua data de nascimento</Text>
                            ):
                            (
                                (Idade <=14)
                                ?
                                (
                                    <Text>Idade inferior a 15 anos</Text>
                                )
                                :
                                (
                                    <Text>{Idade}</Text>
                                )
                            )
                        }
                        <Ionicons style={{marginLeft:"90%",marginTop:-17}} name='chevron-down-outline' size={15} color={"black"}/>
                    </TouchableOpacity>

                    <Text style={{...styles.fonttexto,color:"gray",marginBottom:10,marginLeft:10,marginTop:20}}>Email</Text>
                    <TextInput value={Email} onChangeText={(text) => SetarEmail(text.trim())} style={styles.input} placeholder='Insira seu E-mail'></TextInput>

                    <Text style={{...styles.fonttexto,color:"gray",marginBottom:10,marginLeft:10}}>Senha</Text>
                    <TextInput value={Senha} onChangeText={(text) => SetarSenha(text.trim())} style={styles.input} placeholder='Insira sua senha'></TextInput>

                    <TouchableOpacity onPress={() => HandleCadastro()} style={{...styles.botoes,marginTop:20}}>
                        <Text style={{...styles.fonttexto,textAlign:"center", color:"white"}}>Criar conta</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.botoes}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image style={{ width: 20, height: 20, marginRight: 10 , marginLeft:20 }} source={require("../imgs/Google.png")} resizeMode='contain' />
                            <Text style={{ ...styles.fonttexto,marginLeft:10, color: "white" }}>Criar com o Google</Text>
                        </View>
                    </TouchableOpacity>

                    {
                        isDatePickerVisible && (
                            <RNDateTimePicker 
                                display="calendar"
                                themeVariant="dark"
                                value={new Date()}
                                onChange={(event, selectedDate) => {
                                    setDatePickerVisible(false);
                                    if(selectedDate){
                                        const selectedYear = selectedDate.getFullYear();
                                        setYear(selectedYear);
                                        setIdade(CurrentYear - selectedYear);
                                    }
                                }}
                            />
                        )
                    }

                </View>
            </View>
        </KeyboardAwareScrollView>
    )
};

const styles = StyleSheet.create({
    content:{
        width:"100%",
        backgroundColor:"#323232",
        zIndex:2
    },
    div:{
        width:"100%",
        height:"85%",
        backgroundColor:"#ffffff",
        marginTop:"auto",
        borderTopRightRadius:120,
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
        flex:1,
        alignSelf:"center"
    },
    botoes:{
        padding:10,
        borderWidth:1,
        borderRadius:10,
        width:"95%",
        marginBottom:20,
        backgroundColor:"black",
    },

    fonttexto:{
        fontFamily:"Zing.rust"
    },
    
})

export default memo(Cadastro);