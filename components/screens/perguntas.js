import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, StyleSheet,Keyboard, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SelectList } from 'react-native-dropdown-select-list';
import { useUser } from './usercontext';
import { TextInput } from 'react-native-gesture-handler';


const Perguntas = ({ navigation }) => {
  const fadeAnim = useRef(null);
  const [barWidth, setBarWidth] = useState(0);
  const [divVisible, setDivVisible] = useState(false);
  const [KeyboardVisible , setKeyboardVisible] = useState(false);
  const data = ["Masculino","Feminino"];
  const [selected, setSelected] = useState("");
  const {idutilizador} = useUser();



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
      console.log('Apareceu!');
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
        console.log('Desapareceu!');
        console.log(idutilizador)
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
                <Text style={{textAlign:"center",fontSize:25}}>Preencha as informações abaixo:</Text>
                <Text style={styles.txt}>Sexo:</Text>
                <SelectList
                    setSelected={(val) => setSelected(val)}
                    data={data}
                    save='value'
                    placeholder='Selecione seu Sexo'
                    search={false}
                    boxStyles={{width:"95%",alignSelf:"center",marginTop:10}}
                />

                <Text style={styles.txt}>Peso:</Text>
                <TextInput style={{width:"95%",height:"5%",borderWidth:1,borderColor:"black",borderRadius:5,alignSelf:"center"}} placeholder='Insira seu peso'/>

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
    backgroundColor:"red",
    width:"90%",
    marginTop:"10%",
    height:800
    
  },
  txt:{
    marginLeft:10,
    marginTop:20,
    fontSize:20
  }
});

export default Perguntas;
