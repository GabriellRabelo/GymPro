import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet, Image, Modal, View } from 'react-native';

const Exercicio_Selecionado = ({ navigation, route }) => {
    const [dados, setDados] = useState(route.params.dados);
    const [Musculo, setMusculo] = useState(route.params.musculo);
    const Nome_Exercicios = Array.isArray(dados) ? dados.map(exercicio => exercicio.name) : [];
    const Detalhes_Exercicios = Array.isArray(dados) ? dados.map(exercicio => exercicio.instructions) : [];

    const [modalExercicioIndex, setModalExercicioIndex] = useState(null); // Estado para controlar qual exercício específico foi clicado

    const OpenModal = (index) => {
        setModalExercicioIndex(index); // Definir o índice do exercício clicado
    };

    const CloseModal = () => {
        setModalExercicioIndex(null); // Fechar a modal definindo o índice como null
    }

    const HandleVoltar = () => {
        setDados([]);
        setMusculo("");
        navigation.navigate("Exercicios");
    }

    return (
        <ScrollView>
            <Text style={{ alignSelf: "center", marginTop: "6%", fontSize: 30 }}>Exercícios de {Musculo}</Text>
            <TouchableOpacity style={{position:"absolute",width:30,height:20,marginTop:"5%",marginLeft:"5%"}} onPress={() => HandleVoltar()}>
                <Image style={styles.backimg} source={require("../icons/back_arrow.png")}></Image>
            </TouchableOpacity>
            {Nome_Exercicios.map((nome, index) => (
                <View key={index}>
                    <TouchableOpacity style={styles.divs} onPress={() => OpenModal(index)}>
                        <Text style={{ textAlign: "center", fontSize: 20 }}>{nome}</Text>
                    </TouchableOpacity>

                    <Modal animationType='slide' transparent={true} visible={modalExercicioIndex === index} onRequestClose={CloseModal}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>{nome}</Text>
                            <Text> INSTRUÇÃO: {Detalhes_Exercicios[index]}</Text>

                            <TouchableOpacity style={styles.botoes}>
                                <Text>Adicionar aos favoritos</Text>
                            </TouchableOpacity>


                            <TouchableOpacity style={styles.botoes} onPress={() => CloseModal()}>
                                <Text>Fechar Modal</Text>
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
        alignItems: 'center',
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
    },
    botoes:{
        padding:"5%",
        borderWidth:1,
        borderRadius:20,
        marginTop:"5%"
    }
});

export default Exercicio_Selecionado;
