import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, StyleSheet, Keyboard, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SelectList } from 'react-native-dropdown-select-list';
import { useUser } from './usercontext';
import { TextInput } from 'react-native-gesture-handler';
import { doc, setDoc } from 'firebase/firestore';
import { useFonts } from "expo-font";
import { db } from '../../services/FirebaseConfig.js';

const Perguntas = ({ navigation, route }) => {
  const fadeAnim = useRef(null);
  const Idade = route.params.Idade;
  const Nome = route.params.Nome;
  const [barWidth, setBarWidth] = useState(0);
  const [divVisible, setDivVisible] = useState(false);
  const [KeyboardVisible, setKeyboardVisible] = useState(false);
  const dataSexo = ["Masculino", "Feminino"];
  const dataAtividade = ["Sedentario", "Levemente Ativo", "Moderadamente Ativo", "Muito Ativo", "Extremamente Ativo"];
  const dataObj = ["Perda de Peso", "Definição Muscular", "Ganho de massa muscular"];
  const { idutilizador } = useUser();
  const [Sexo, setSexo] = useState(null);
  const [selected, setSelected] = useState(null);
  const [Peso, setPeso] = useState(null);
  const [Altura, setAltura] = useState(null);
  const [Atvfisica, setAtvfisica] = useState(null);
  const [Objetivo, setObjetivo] = useState(null);
  const Consumo_Agua = 3;

  const [Proteinas, setProteinas] = useState(null);
  const [Gorduras, setGorduras] = useState(null);
  const [Calorias, setCalorias] = useState(null);
  const [Carboidratos, setCarboidratos] = useState(null);
  const [TMB, setTMB] = useState(null);

  const [fontsLoaded] = useFonts({
    "Zing.rust": require("../../assets/fonts/zing.rust-demo-base.otf"),
  });

  useEffect(() => {
    const KeyBoardShowListener = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });
    const KeyBoardHideListener = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      KeyBoardShowListener.remove();
      KeyBoardHideListener.remove();
    };
  }, []);

  useEffect(() => {
    fadeAnim.current.fadeIn(800).then(() => { });

    const interval = setInterval(() => {
      setBarWidth(prevWidth => (prevWidth < 100 ? prevWidth + 1 : 100));
    }, 10);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      fadeAnim.current.fadeOut(800).then(() => {
        setDivVisible(true);
      });
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  const CalcularDadosNutricionais = async (TMB) => {
    const gorduras = Math.round(0.8 * Peso);
    let proteinas = Math.round(2 * Peso);
    let carboidratos = Math.round(4 * Peso);
    let calorias;
  
    switch (Objetivo) {
      case "Perda de Peso":
        calorias = Math.round(TMB - 750);
        break;
      case "Definição Muscular":
        calorias = Math.round(TMB);
        break;
      case "Ganho de massa muscular":
        calorias = Math.round(TMB + 500);
        proteinas = Math.round(2.2 * Peso);
        carboidratos = Math.round(7 * Peso);
        break;
      default:
        console.error("Objetivo inválido:", Objetivo);
        return;
    }
  
    const usuarioDocRef = doc(db, 'Utilizador', idutilizador); // Definindo o caminho para o documento do usuário
    const dietaDocRef = doc(db, 'Dieta', idutilizador); // Definindo o caminho para o documento da dieta
  
    const utilizadoData = {
      Nome,
      Idade,
      Peso,
      Altura,
      Sexo,
      Objetivo,
      Atividade_Fisica: Atvfisica
    };
  
    const dietaData = {
      Id_Utilizador: idutilizador, // Adicionando o ID do usuário
      Calorias: calorias,
      Carboidrato: carboidratos,
      Proteinas: proteinas,
      Consumo_Agua: Consumo_Agua,
      Gorduras: gorduras,
      TMB: TMB
    };
  
    try {
      console.log("Tentando adicionar dados ao documento Utilizador...");
      console.log("Dados:", utilizadoData);
      await setDoc(usuarioDocRef, utilizadoData, { merge: true }); // Usando setDoc para atualizar ou criar o documento
  
      console.log("Tentando adicionar dados ao documento Dieta...");
      console.log("Dados:", dietaData);
      await setDoc(dietaDocRef, dietaData, { merge: true }); // Usando setDoc para atualizar ou criar o documento
  
      console.log("Dados adicionados com sucesso aos documentos Utilizador e Dieta");
  
      navigation.replace("Home");
    } catch (error) {
      console.error("Erro ao adicionar dados no Firebase:", error);
    }
  };
  
  

  const HandleSubmit = () => {
    if (!Sexo || !Peso || !Altura || !Atvfisica || !Objetivo) {
      alert("Todos os dados devem ser devidamente preenchidos");
    } else {
      try {
        console.log("Iniciando cálculo de TMB...");
        let tempTMB;
        if (Sexo === "Feminino") {
          tempTMB = 447.6 + (9.2 * Peso) + (3.1 * Altura) - (4.3 * Idade);
        } else {
          tempTMB = 88.36 + (13.4 * Peso) + (4.8 * Altura) - (5.7 * Idade);
        }
        switch (Atvfisica) {
          case "Sedentario":
            tempTMB *= 1.2;
            break;
          case "Levemente Ativo":
            tempTMB *= 1.375;
            break;
          case "Moderadamente Ativo":
            tempTMB *= 1.55;
            break;
          case "Muito Ativo":
            tempTMB *= 1.725;
            break;
          case "Extremamente Ativo":
            tempTMB *= 1.9;
            break;
        }
        tempTMB = Math.round(tempTMB);
        console.log("TMB calculado:", tempTMB);
        setTMB(tempTMB);
        CalcularDadosNutricionais(tempTMB);
      } catch (error) {
        console.error("Ocorreu um erro:", error.message);
        alert("Algo deu errado, tente novamente mais tarde!!!");
      }
    }
  };

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
          <KeyboardAwareScrollView style={{ flex: 1 }} enableOnAndroid={true} extraScrollHeight={KeyboardVisible ? 150 : 0}>
            <View style={styles.container}>
              <Text style={{ textAlign: "center", fontSize: 30, fontFamily: "Zing.rust" }}>Preencha as informações abaixo:</Text>
              <Text style={styles.txt}>Sexo:</Text>
              <SelectList
                setSelected={(val) => setSexo(val)}
                data={dataSexo}
                save='value'
                placeholder='Selecione seu Sexo'
                search={false}
                boxStyles={{ width: "95%", alignSelf: "center", marginTop: 10 }}
              />

              <Text style={styles.txt}>Peso:</Text>
              <TextInput onChangeText={(value) => setPeso(parseFloat(value))} keyboardType='numeric' style={{ marginTop: 10, width: "95%", height: "5%", borderWidth: 0.7, borderColor: "black", borderRadius: 5, alignSelf: "center", padding: 10 }} placeholder='Insira seu peso' />
              <Text style={styles.txt}>Altura:</Text>
              <TextInput onChangeText={(value) => setAltura(parseFloat(value))} keyboardType='numeric' style={{ marginTop: 10, width: "95%", height: "5%", borderWidth: 0.7, borderColor: "black", borderRadius: 5, alignSelf: "center", padding: 5 }} placeholder='Insira sua altura' />
              <Text style={styles.txt}>Atividade Fisica:</Text>
              <SelectList
                setSelected={(val) => setAtvfisica(val)}
                data={dataAtividade}
                save='value'
                placeholder='Selecione sua atividade fisica'
                search={false}
                boxStyles={{ width: "95%", alignSelf: "center", marginTop: 10 }}
              />
              <Text style={styles.txt}>Objetivo:</Text>
              <SelectList
                setSelected={(val) => setObjetivo(val)}
                data={dataObj}
                save='value'
                placeholder='Selecione seu objetivo'
                search={false}
                boxStyles={{ width: "95%", alignSelf: "center", marginTop: 10 }}
              />
              <TouchableOpacity onPress={HandleSubmit} style={styles.button}>
                <Text style={{ textAlign: "center", fontFamily: "Zing.rust", fontSize: 17 }}>Enviar</Text>
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
  container: {
    flex: 1,
    alignSelf: "center",
    width: "90%",
    marginTop: "10%",
    height: 800
  },
  txt: {
    marginLeft: 10,
    marginTop: 20,
    fontSize: 20,
    fontFamily: "Zing.rust"
  },
  button: {
    alignSelf: "center",
    marginTop: 30,
    padding: 10,
    borderWidth: 1,
    borderRadius: 15,
    width: "50%",
  }
});

export default Perguntas;