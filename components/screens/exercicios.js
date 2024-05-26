import { StatusBar } from 'expo-status-bar';
import { useState , useEffect , memo } from 'react';
import { StyleSheet, Text, View , Image,TextInput , TouchableOpacity } from 'react-native';
import {useFonts} from "expo-font";
import {signInWithEmailAndPassword, onAuthStateChanged} from "@firebase/auth";
import "firebase/firestore";
import {authState} from '../../services/FirebaseConfig.js';
import { useUser } from './usercontext.js';
import { BuscarExercicios } from '../../services/HandleDataBase.js';

const Exercicios = ({navigation}) => {
    const [ShowBack, setShowBack] = useState(true);

    const [fontsloaded] = useFonts({
      "Zing.rust":require("../../assets/fonts/zing.rust-demo-base.otf")
    });

    if(!fontsloaded){
      return undefined;
  }
  
    const ToogleImg = () => {
      setShowBack(!ShowBack);
    }
  
    const handleBuscarExercicios = (musculo) => {
      BuscarExercicios(musculo, navigation)
        .catch(error => {
          console.error("Algo deu errado ao buscar exercícios:", error);
        });
    }
  
    return (
      <View style={{flex:1}}>
        <View style={{height:"20%",width:"100%"}}>
          <Text style={{marginTop:"9%",marginLeft:"7%",fontSize:30,fontFamily:"Zing.rust"}}>Exercícios</Text>
          <TextInput style={styles.pesquisa} placeholder='Pesquisar' paddingLeft={"10%"}/>
          <Image style={styles.img} source={require("../icons/search.png")}/>
        </View>
        <View>
          {ShowBack ? (
            <Image style={styles.bodyimg} source={require("../imgs/Body_Front.png")}></Image>
          ) : (
            <Image style={styles.bodyimg} source={require("../imgs/Body_Back.png")}></Image>
          )}
          <View style={{position:"absolute",width:"100%",height:"100%"}}>
            {ShowBack? (
              <View style={{position:"absolute",width:"100%",height:"100%"}}>
                <TouchableOpacity style={{marginLeft:"73%",marginTop:"18%",width:"15%"}} onPress={() => handleBuscarExercicios("Peito")}>
                  <Text style={styles.txt}>Peito</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{marginLeft:"75%",marginTop:"18%",width:"15%"}} onPress={() => handleBuscarExercicios("Abdomen")}>
                  <Text style={styles.txt}>Abdômen</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{marginLeft:"74%",marginTop:"5%",width:"15%"}} onPress={() => handleBuscarExercicios("Antebraço")}>
                  <Text style={styles.txt}>Antebraço</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{marginLeft:"75%",marginTop:"16%",width:"15%"}} onPress={() => handleBuscarExercicios("Adutores")}>
                  <Text style={styles.txt}>Adutores</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{marginLeft:"75%",marginTop:"7%",width:"13%"}} onPress={() => handleBuscarExercicios("Cardio")}>
                  <Text style={styles.txt}>Cardio</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{marginLeft:"11%",marginTop:"-25%",width:"20%"}} onPress={() => handleBuscarExercicios("Abdutores")}>
                  <Text style={styles.txt}>Abdutores</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{marginLeft:"17%",marginTop:"10%",width:"20%"}} onPress={() => handleBuscarExercicios("Quadríceps")}>
                  <Text style={styles.txt}>Quadríceps</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{marginLeft:"15%",marginTop:"-30%",width:"15%"}} onPress={() => handleBuscarExercicios("Abdomen")}>
                  <Text style={styles.txt}>Oblíquos</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{marginLeft:"17%",marginTop:"-20%",width:"15%"}} onPress={() => handleBuscarExercicios("Bíceps")}>
                  <Text style={styles.txt}>Biceps</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{marginLeft:"17%",marginTop:"-23%",width:"15%"}} onPress={() => handleBuscarExercicios("Ombros")}>
                  <Text style={styles.txt}>Ombro</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <TouchableOpacity style={{marginLeft:"70%",marginTop:"32%",width:"20%",height:"10%"}} onPress={() => handleBuscarExercicios("Trapezio")}>
                  <Text style={styles.txt}>Trapézio</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{marginLeft:"75%",marginTop:"10%",width:"15%"}} onPress={() => handleBuscarExercicios("Costas")}>
                  <Text style={styles.txt}>Costas</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{marginLeft:"68%",marginTop:"30%",width:"18%"}} onPress={() => handleBuscarExercicios("Isquiotibiais")}>
                  <Text style={styles.txt}>Isquiotibiais</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{marginLeft:"75%",marginTop:"6%",width:"13%"}} onPress={() => handleBuscarExercicios("cardio")}>
                  <Text style={styles.txt}>Cardio</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{marginLeft:"20%",marginTop:"-14%",width:"15%"}} onPress={() => handleBuscarExercicios("Gemeos")}>
                  <Text style={styles.txt}>Gemeos</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{marginLeft:"15%",marginTop:"-15%",width:"20%"}} onPress={() => handleBuscarExercicios("Gluteos")}>
                  <Text style={styles.txt}>Glúteos</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{marginLeft:"17%",marginTop:"-28%",width:"15%"}} onPress={() => handleBuscarExercicios("Lombar")}>
                  <Text style={styles.txt}>Lombar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{marginLeft:"17%",marginTop:"-23%",width:"15%"}} onPress={() => handleBuscarExercicios("Triceps")}>
                  <Text style={styles.txt}>Tríceps</Text>
                </TouchableOpacity>
              </View>
            )}
  
            <TouchableOpacity style={{width:"20%",height:"5%",marginLeft:"74%",marginTop:ShowBack ? "120%" : "75%"}} onPress={() => ToogleImg()}>
              <Image style={{position:"absolute",width:30,height:30}} source={require("../icons/Girar.png")}></Image>
              <Text style={{fontSize:15,marginLeft:"35%",marginTop:4,fontFamily:"Zing.rust"}}>Girar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    pesquisa: {
      borderWidth: 1,
      width: "80%",
      borderRadius: 15,
      marginLeft: "8%",
      padding: "1%",
      fontSize: 16,
      alignSelf: 'center',
      marginTop: "5%"
    },
    img: {
      width: 25,
      height: 25,
      position: "absolute",
      left: "16%",
      top: '76%',
      marginTop: -12.5
    },
    bodyimg: {
      width: "95%",
      height: "90%",
      marginLeft: "3%"
    },
    txt:{
      fontFamily:"Zing.rust",
      fontSize:15
    }
  });
  
  export default Exercicios;
