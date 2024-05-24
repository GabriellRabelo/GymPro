import { StatusBar } from 'expo-status-bar';
import { useState , useEffect , memo } from 'react';
import { StyleSheet, Text, View , Image,TextInput , TouchableOpacity } from 'react-native';
import {useFonts} from "expo-font";
import {signInWithEmailAndPassword, onAuthStateChanged} from "@firebase/auth";
import "firebase/firestore";
import {authState} from '../../services/FirebaseConfig.js';
import { useUser } from './usercontext.js';

const Exercicios = ({navigation}) =>{

    const [ShowBack,setShowBack] = useState(true);

    const ToogleImg = () => {
        setShowBack(!ShowBack);
    }

    const BuscarExercicios = async(Musculo) => {
        try{
            const response = await fetch("http://192.168.1.138:3000/api/mostrar-exercicio-selecionado",{
            method:"POST",
            headers:{
              "Content-Type":"application/json"
            },
            body:JSON.stringify({musculo: Musculo})});

          if(!response.ok){
            console.error("Resposta não Ok: ",response.status + " -E mais isso: " + response.statusText);
            const errortext = await response.text();
            console.error("Detalhes do erro: ",errortext);
            throw new Error("Falha na solicitação do servidor");
          }
          const data = await response.json();
          navigation.navigate("Exercicio", { dados: data, musculo: Musculo });

        }
        catch(error){
            console.error("Algo deu errado no front: ",error);
        }
    }

    return(
        <View style={{flex:1}}>
            <View style={{height:"20%",width:"100%"}}>
                <Text style={{marginTop:"9%",marginLeft:"7%",fontSize:30}}>Exercícios</Text>
                <TextInput style={styles.pesquisa} placeholder='Pesquisar' paddingLeft={"10%"}/>
                <Image style={styles.img} source={require("../icons/search.png")}/>
            </View>
            
            <View>
                {ShowBack ?(
                    <Image style={styles.bodyimg} source={require("../imgs/Body_Front.png")}></Image>
                ) : (
                    <Image style={styles.bodyimg} source={require("../imgs/Body_Back.png")}></Image>
                )}
                
                <View style={{position:"absolute",width:"100%",height:"100%"}}>

                    {ShowBack? (
                        <View style={{position:"absolute",width:"100%",height:"100%"}}>
                            <TouchableOpacity style={{marginLeft:"73%",marginTop:"18%",width:"15%"}} onPress={() => alert("Teste")}>
                                <Text style={{fontSize:15}}>Peito</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{marginLeft:"75%",marginTop:"18%",width:"15%"}} onPress={() => BuscarExercicios("abdominals")}>
                                <Text style={{fontSize:15}}>Abdômen</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{marginLeft:"74%",marginTop:"5%",width:"15%"}} onPress={() => BuscarExercicios("forearms")}>
                                <Text style={{fontSize:15}}>Antebraço</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{marginLeft:"75%",marginTop:"16%",width:"15%"}} onPress={() => BuscarExercicios("adductors")}>
                                <Text style={{fontSize:15}}>Adutores</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{marginLeft:"75%",marginTop:"7%",width:"13%"}} onPress={() => BuscarExercicios("cardio")}>
                                <Text style={{fontSize:15}}>Cardio</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{marginLeft:"11%",marginTop:"-25%",width:"20%"}} onPress={() => BuscarExercicios("abductors")}>
                                <Text style={{fontSize:15}}>Abdutores</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{marginLeft:"17%",marginTop:"10%",width:"20%"}} onPress={() => BuscarExercicios("quadriceps")}>
                                <Text style={{fontSize:15}}>Quadríceps</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{marginLeft:"15%",marginTop:"-30%",width:"15%"}} onPress={() => BuscarExercicios("abdominals")}>
                                <Text style={{fontSize:15}}>Oblíquos</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{marginLeft:"17%",marginTop:"-20%",width:"15%"}} onPress={() => BuscarExercicios("biceps")}>
                                <Text style={{fontSize:15}}>Biceps</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{marginLeft:"17%",marginTop:"-23%",width:"15%"}} onPress={() => alert("Falta pensar como fazer com ombro ( não tem na Ninja Api)")}>
                                <Text style={{fontSize:15}}>Ombro</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View>
                            <TouchableOpacity style={{marginLeft:"70%",marginTop:"32%",width:"20%",height:"10%"}} onPress={() => BuscarExercicios("traps")}>
                                <Text style={{fontSize:15}}>Trapézio</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{marginLeft:"75%",marginTop:"10%",width:"15%"}} onPress={() => BuscarExercicios("lats")}>
                                <Text style={{fontSize:15}}>Dorsais</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{marginLeft:"68%",marginTop:"30%",width:"18%"}} onPress={() => BuscarExercicios("hamstrings")}>
                                <Text style={{fontSize:15}}>Isquiotibiais</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{marginLeft:"75%",marginTop:"6%",width:"13%"}} onPress={() => BuscarExercicios("cardio")}>
                                <Text style={{fontSize:15}}>Cardio</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{marginLeft:"20%",marginTop:"-14%",width:"15%"}} onPress={() => BuscarExercicios("calves")}>
                                <Text style={{fontSize:15}}>Gemeos</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{marginLeft:"15%",marginTop:"-15%",width:"20%"}} onPress={() => BuscarExercicios("glutes")}>
                                <Text style={{fontSize:15}}>Glúteos</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{marginLeft:"17%",marginTop:"-28%",width:"15%"}} onPress={() => BuscarExercicios("lower_back")}>
                                <Text style={{fontSize:15}}>Lombar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{marginLeft:"17%",marginTop:"-23%",width:"15%"}} onPress={() => BuscarExercicios("triceps")}>
                                <Text style={{fontSize:15}}>Tríceps</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    <TouchableOpacity style={{width:"20%",height:"5%",marginLeft:"74%",marginTop:ShowBack ? "120%" : "75%"}} onPress={() => ToogleImg()}>
                        <Image style={{position:"absolute",width:30,height:30}} source={require("../icons/Girar.png")}></Image>
                        <Text style={{fontSize:15,marginLeft:"35%",marginTop:4}}>Girar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    pesquisa:{
        borderWidth:1,
        width:"80%",
        borderRadius:15,
        marginLeft:"8%",
        padding:"1%",
        fontSize: 16,
        alignSelf: 'center',
        marginTop:"5%"
    },
    img:{
        width:25,
        height:25,
        position:"absolute",
        left: "16%",
        top: '76%',
        marginTop: -12.5
    },
    bodyimg:{
        width:"95%",
        height:"90%",
        marginLeft:"3%"
    }
});


export default Exercicios;