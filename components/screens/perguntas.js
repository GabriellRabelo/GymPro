import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, StyleSheet,Keyboard, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SelectList } from 'react-native-dropdown-select-list';
import { useUser } from './usercontext';
import { TextInput } from 'react-native-gesture-handler';
import {useFonts} from "expo-font";

const Perguntas = ({ navigation, route }) => {
  const fadeAnim = useRef(null);
  const Idade = route.params.Idade;
  const Nome = route.params.Nome;
  const [barWidth, setBarWidth] = useState(0);
  const [divVisible, setDivVisible] = useState(false);
  const [KeyboardVisible , setKeyboardVisible] = useState(false);
  const dataSexo = ["Masculino","Feminino"];
  const dataAtividade = ["Sedentario","Levemente Ativo","Moderadamente Ativo","Muito Ativo","Extremamente Ativo"];
  const dataObj = ["Perda de Peso","Definição Muscular","Ganho de massa muscular"];
  const {idutilizador} = useUser();
  const [Sexo,setSexo] = useState(null);
  const [selected,setSelected] = useState(null);
  const [Peso,setPeso] = useState(null);
  const [Altura,setAltura] = useState(null);
  const [Atvfisica,setAtvfisica] = useState(null);
  const [Objetivo,setObjetivo] = useState(null);

  const [Calorias,setCalorias] = useState(null);
  const [Proteinas,setProteinas] = useState(null);
  const [Carboidratos,setCarboidratos] = useState(null);
  const [Gorduras,setGorduras] = useState(null);
  const Consumo_Agua = 3;
  
  const [fontsLoaded] = useFonts({
    "Zing.rust": require("../../assets/fonts/zing.rust-demo-base.otf"),
  });


  useEffect(() => {
    const KeyBoardShowListener = Keyboard.addListener("keyboardDidShow" , () =>{
        setKeyboardVisible(true);
    });
    const KeyBoardHideListener = Keyboard.addListener("keyboardDidHide" , () =>{
        setKeyboardVisible(false);
    })
  });

  useEffect(() => {
    // Iniciar a animação de fade in quando o componente é montado
    fadeAnim.current.fadeIn(800).then(() => {
    });

    // Configurar a animação de carregamento da barra
    const interval = setInterval(() => {
      // Atualizar o estado da largura da barra
      setBarWidth(prevWidth => (prevWidth < 100 ? prevWidth + 1 : 100));
    }, 10);

    // Agendar a animação de fade out após 5 segundos
    const timeout = setTimeout(() => {
      clearInterval(interval);
      fadeAnim.current.fadeOut(800).then(() => {
        // Tornar a View com estilo styles.div visível após a animação de fade-out
        setDivVisible(true);
      });
    }, 5000);

    // Limpar os temporizadores quando o componente for desmontado
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  const InserirBaseDeDados = () => {
    // Lógica para inserir dados na base de dados
  }
  
  const CalcularDadosNutricionais = () =>{
    setGorduras(0.8 * Peso);
    setProteinas(2 * Peso);
    setCarboidratos(4 * Peso);
    switch(Objetivo){
      case "Perda de Peso":
        setCalorias(TMB - 750);
        break;
      case "Definição Muscular":
        setCalorias(TMB);
        break;
      case "Ganho de massa muscular":
        setCalorias(TMB - 500);
        setProteinas(2.2 * Peso);
        setCarboidratos(7 * Peso);
        break;
    }
    InserirBaseDeDados();
  }
  
  const HandleSubmit = () => {
    if(!Sexo || !Peso || !Altura || !Atvfisica || !Objetivo){
      alert("Todos os dados devem ser devidamente preenchidos");
    }
    else{
      try{
        let tempTMB;
        if(Sexo === "Feminino"){
          tempTMB = 447.6 + (9.2 * Peso) + (3.1 * Altura) - (4.3 * Idade);
        }
        else{
          tempTMB = 88.36 + (13.4 * Peso) + (4.8 * Altura) - (5.7 * Idade);
        }
        switch(Atvfisica){
          case "Sedentario":
            setTMB(tempTMB * 1.2);
            break;
          case "Levemente Ativo":
            setTMB(tempTMB * 1.375);
            break;
          case "Moderadamente Ativo":
            setTMB(tempTMB * 1.55);
            break;
          case "Muito Ativo":
            setTMB(tempTMB * 1.725);
            break;
          case "Extremamente Ativo":
            setTMB(tempTMB * 1.9);
            break;
        };
        CalcularDadosNutricionais();
      }
      catch(error){
        console.error("Ocorreu um erro:", error.message);
        alert("Algo deu errado, tente novamente mais tarde!!!");
      }
    }
  }
  

  /*const HandleSubmit = async() =>{
      if(Sexo == null || Peso == null || Altura == null || Atvfisica == null || Objetivo == null){
        alert("Todos os dados devem ser devidamente preenchidos");
      }
      else{
        try{
          alert("Entrei")
          const response = await fetch("http://192.168.1.138/api/calculo-dados-nutricionais",{
            method:"POST",
            headers:{
              "Content-Type":"application/json"
            },
            body:JSON.stringify({
              Sexo,
              Altura,
              Peso,
              Atvfisica,
              Objetivo,
            }),
            timeout:10000
          });

          if(!response.ok){
            console.error("Resposta não Ok: ",response.status + " -E mais isso: " + response.statusText);
            const errortext = await response.text();
            console.error("Detalhes do erro: ",errortext);
            throw new Error("Falha na solicitação do servidor");
          }
          const data = await response.json();
          console.log("Dados enviados com sucesso: ",data);
          alert("Indo para tela Home...");

        }catch(error){
            console.error("Erro durante a solicitação: ",error.message);
            alert("Algo deu errado, tente novamente mais tarde!");
        }
      }
  }*/

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Image style={{ width: '100%', height: '100%', zIndex: 0, position: 'absolute' }} source={require('../imgs/background.png')} />
      <Animatable.View
        ref={fadeAnim}
        style={{
          position: 'absolute',
          width: '80%',
          backgroundColor: '#ffffff',
          borderRadius: 20,
          padding: 20,
          opacity: 0.9,
          zIndex: 1,
        }}
      >
        <Text style={{ ...styles.texto }}>Vamos começar</Text>
        <Text style={styles.secondtxt}>Antes de continuar precisamos de algumas informações!</Text>
        <Text style={styles.secondtxt}>Essas informações serão apenas utilizadas para maior precisão da aplicação!</Text>
        <View style={styles.bar}>
          <View style={{ ...styles.inbar, width: `${barWidth}%` }}></View>
        </View>
      </Animatable.View>

      {divVisible && (
        <Animatable.View animation="fadeIn" style={styles.div}>
          <KeyboardAwareScrollView style={{flex:1}} enableOnAndroid={true} extraScrollHeight={KeyboardVisible ? 150 : 0}>
            <View style={styles.container}>
                <Text style={{textAlign:"center",fontSize:30,fontFamily:"Zing.rust"}}>Preencha as informações abaixo:</Text>
                <Text style={styles.txt}>Sexo:</Text>
                <SelectList
                    setSelected={(val) => setSexo(val)}
                    data={dataSexo}
                    save='value'
                    placeholder='Selecione seu Sexo'
                    search={false}
                    boxStyles={{width:"95%",alignSelf:"center",marginTop:10}}
                />

                <Text style={styles.txt}>Peso:</Text>
                <TextInput onChangeText={(value) => setPeso(value)} keyboardType='numeric' style={{marginTop:10,width:"95%",height:"5%",borderWidth:0.7,borderColor:"black",borderRadius:5,alignSelf:"center",padding:10}} placeholder='Insira seu peso'/>
                <Text style={styles.txt}>Altura:</Text>
                <TextInput onChangeText={(value) => setAltura(value)} keyboardType='numeric' style={{marginTop:10,width:"95%",height:"5%",borderWidth:0.7,borderColor:"black",borderRadius:5,alignSelf:"center",padding:5}} placeholder='Insira sua altura'/>
                <Text style={styles.txt}>Atividade Fisica:</Text>
                <SelectList
                    setSelected={(val) => setAtvfisica(val)}
                    data={dataAtividade}
                    save='value'
                    placeholder='Selecione sua atividade fisica'
                    search={false}
                    boxStyles={{width:"95%",alignSelf:"center",marginTop:10}}
                />
                <Text style={styles.txt}>Objetivo:</Text>
                <SelectList
                    setSelected={(val) => setObjetivo(val)}
                    data={dataObj}
                    save='value'
                    placeholder='Selecione seu objetivo'
                    search={false}
                    boxStyles={{width:"95%",alignSelf:"center",marginTop:10}}
                />
                <TouchableOpacity onPress={() => HandleSubmit()} style={styles.button}>
                  <Text style={{textAlign:"center",fontFamily:"Zing.rust",fontSize:17}}>Enviar</Text>
                </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
        </Animatable.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  div: {
    width: '100%',
    height: '85%',
    backgroundColor: '#ffffff',
    marginTop: 'auto',
    borderTopLeftRadius: 70,
    zIndex: 1,
  },
  texto: {
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
    fontSize: 40,
  },
  secondtxt: {
    fontSize: 23,
    textAlign: 'center',
  },
  bar: {
    marginTop: 20,
    width: '100%',
    borderWidth: 1,
    borderRadius: 20,
    height: 25,
    zIndex: 3,
  },
  inbar: {
    borderRadius: 10,
    height: 23,
    zIndex: 3,
    backgroundColor: 'black',
  },
  container:{
    flex:1,
    alignSelf:"center",
    width:"90%",
    marginTop:"10%",
    height:800
    
  },
  txt:{
    marginLeft:10,
    marginTop:20,
    fontSize:20,
    fontFamily:"Zing.rust"
  },
  button:{
    alignSelf:"center",
    marginTop:30,
    padding:10,
    borderWidth:1,
    borderRadius:15,
    width:"50%",
  }
});

export default Perguntas;
