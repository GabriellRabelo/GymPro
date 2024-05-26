import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet, Image, Modal, View } from 'react-native';
import {Favoritar, shareDatabase} from "../../services/HandleDataBase.js";
import { useUser } from './usercontext.js';
import {useFonts} from "expo-font";

const Exercicio_Selecionado = ({ navigation, route }) => {
    const [dados, setDados] = useState(route.params.dados);
    const [Musculo, setMusculo] = useState(route.params.musculo);
    const { idutilizador } = useUser();

    // Assumindo que 'dados' contém uma lista de objetos com a propriedade 'Nome_Exercicio' e 'instructions'
    const Nome_Exercicios = Array.isArray(dados) ? dados.map(exercicio => exercicio.Nome_Exercicio) : [];
    const Detalhes_Exercicios = Array.isArray(dados) ? dados.map(exercicio => exercicio.Descricao) : [];
    const Series_Exercicios = Array.isArray(dados) ? dados.map(exercicio => exercicio.Series) : [];
    const Repeticoes_Exercicios = Array.isArray(dados) ? dados.map(exercicio => exercicio.Repeticoes) : [];
    const Foco_Muscular_Exercicios = Array.isArray(dados) ? dados.map(exercicio => exercicio.Foco_Muscular) : [];

    const [modalExercicioIndex, setModalExercicioIndex] = useState(null); // Estado para controlar qual exercício específico foi clicado

    const [fontsloaded] = useFonts({
        "Zing.rust":require("../../assets/fonts/zing.rust-demo-base.otf")
      });
  
      if(!fontsloaded){
        return undefined;
    }

    const OpenModal = (index) => {
        setModalExercicioIndex(index); // Definir o índice do exercício clicado
    };

    const CloseModal = () => {
        setModalExercicioIndex(null); // Fechar a modal definindo o índice como null
    }

    const HandleFavoritar = (Nome_Exercicio) => {
        Favoritar(Nome_Exercicio,idutilizador);
    }

    const HandleVoltar = () => {
        setDados([]);
        setMusculo("");
        navigation.navigate("Exercicios");
    }

    return (
        <ScrollView>
            <Text style={{ alignSelf: "center", marginTop: "15%", fontSize: 30,fontFamily:"Zing.rust" }}>Exercícios de {Musculo}</Text>
            <TouchableOpacity style={{position:"absolute",width:30,height:20,marginTop:"3%",marginLeft:"5%"}} onPress={() => HandleVoltar()}>
                <Image style={styles.backimg} source={require("../icons/back_arrow.png")}></Image>
            </TouchableOpacity>
            {Nome_Exercicios.map((nome, index) => (
                <View key={index}>
                    <TouchableOpacity style={styles.divs} onPress={() => OpenModal(index)}>
                        <Text style={{ textAlign: "center", fontSize: 20,fontFamily:"Zing.rust" }}>{nome}</Text>
                    </TouchableOpacity>

                    <Modal animationType='slide' transparent={true} visible={modalExercicioIndex === index} onRequestClose={CloseModal}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>{nome}</Text>
                            <Text style={{fontSize:15,fontFamily:"Zing.rust"}}><Text style={{fontWeight:"bold"}}>INSTRUÇÃO:</Text> {Detalhes_Exercicios[index]}</Text>
                            <Text style={{marginTop:"5%",fontSize:15,fontFamily:"Zing.rust"}}><Text style={{fontWeight:"bold"}}>Foco Muscular:</Text> {Foco_Muscular_Exercicios[index]}</Text>
                            <Text style={{marginTop:"3%",marginBottom:"3%",fontSize:15,fontFamily:"Zing.rust"}}><Text style={{fontWeight:"bold"}}>Repetições:</Text> {Repeticoes_Exercicios[index]}</Text>
                            <Text style={{fontFamily:"Zing.rust"}}><Text style={{fontWeight:"bold",fontSize:15}}>Series:</Text> {Series_Exercicios[index]}</Text>

                            <TouchableOpacity style={styles.botoes} onPress={() => HandleFavoritar(nome)}>
                                <Text style={{fontFamily:"Zing.rust"}}>Adicionar aos favoritos</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.botoes} onPress={() => CloseModal()}>
                                <Text style={{fontFamily:"Zing.rust"}}>Adicionar a um treino</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.botoes} onPress={() => CloseModal()}>
                                <Text style={{fontFamily:"Zing.rust"}}>Fechar</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                </View>
            ))}
        </ScrollView>
    )
};

const styles = StyleSheet.create({
    divs: {
        width: "70%",
        minHeight: 60,
        padding: "3%",
        marginTop: "8%",
        alignSelf: "center",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.7)"
    },
    backimg:{
        width:50,
        height:50,
    },
    modalView: {
        height:"90%",
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        borderWidth:1
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize:20,
        fontFamily:"Zing.rust"
    },
    botoes:{
        padding:"5%",
        borderWidth:1,
        borderRadius:20,
        marginTop:"5%",
        alignSelf:"center"
    }
});

export default Exercicio_Selecionado;
