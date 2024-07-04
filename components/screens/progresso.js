import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { auth, db } from '../../services/FirebaseConfig.js'; // Assuming your Firebase configuration is in this file
import { useUser } from './usercontext.js';
import ExerciciosData from "../../services/ExerciciosData.json";
import { doc, getDoc, setDoc, arrayUnion } from "firebase/firestore"; 
import { LineChart } from 'react-native-chart-kit'; // Assuming you're using this library for charts
import { Dimensions } from 'react-native';
import { getAuth } from 'firebase/auth';


const Progresso = ({navigation}) => {

    const exercicioImages = {
        "Crucifixo Inclinado com Halteres": require("../imgs/Exercicios/Crucifixo Inclinado com Halteres.jpeg"),
        "Levantamento Terra": require("../imgs/Exercicios/Levantamento Terra.jpeg"),
        "Abdominal Crunch": require("../imgs/Exercicios/Abdominal Crunch.jpeg"),
        "Agachamento": require("../imgs/Exercicios/Agachamento.jpeg"),
        "Afundo": require("../imgs/Exercicios/Afundo.gif"),
        "Agachamento Afundo Apoiado": require("../imgs/Exercicios/Agachamento Afundo Apoiado.jpeg"),
        "Agachamento Pulando": require("../imgs/Exercicios/Agachamento Pulando.jpeg"),
        "Barra Fixa Pronada": require("../imgs/Exercicios/Barra Fixa Pronada.jpeg"),
        "Búlgaro": require("../imgs/Exercicios/Búlgaro.jpeg"),
        "Cadeira Extensora": require("../imgs/Exercicios/Cadeira Extensora.gif"),
        "Cadeira Flexora": require("../imgs/Exercicios/Cadeira Flexora.jpeg"),
        "Crucifixo Reto com Halteres": require("../imgs/Exercicios/Crucifixo Reto com Halteres.jpeg"),
        "Desenvolvimento Militar com Barra Sentado": require("../imgs/Exercicios/Desenvolvimento Militar com Barra Sentado.jpeg"),
        "Desenvolvimento Militar com Barra": require("../imgs/Exercicios/Desenvolvimento Militar com Barra.jpeg"),
        "Elevação de Panturrilha com Halteres": require("../imgs/Exercicios/Elevação de Panturrilha com Halteres.jpeg"),
        "Elevação de Panturrilha em Pé": require("../imgs/Exercicios/Elevação de Panturrilha em Pé.jpeg"),
        "Elevação de Panturrilha Sentado": require("../imgs/Exercicios/Elevação de Panturrilha Sentado.jpeg"),
        "Elevação Frontal com Halteres": require("../imgs/Exercicios/Elevação Frontal com Halteres.jpeg"),
        "Elevação Lateral com Halteres": require("../imgs/Exercicios/Elevação Lateral com Halteres.jpeg"),
        "Elevação Lateral Curvada com Halteres": require("../imgs/Exercicios/Elevação Lateral Curvada com Halteres.jpeg"),
        "Encolhimento de Ombros com Halteres": require("../imgs/Exercicios/Encolhimento de Ombros com Halteres.gif"),
        "Extensão de Tríceps Sentado com Barra": require("../imgs/Exercicios/Extensão de Tríceps Sentado com Barra.jpeg"),
        "Flexões": require("../imgs/Exercicios/Flexões.jpeg"),
        "Flexões Diamante": require("../imgs/Exercicios/Flexões Diamante.gif"),
        "Flexão Inclinada": require("../imgs/Exercicios/Flexão Inclinada.jpeg"),
        "Hiperextensão Lombar": require("../imgs/Exercicios/Hiperextensão Lombar.jpeg"),
        "Kickback com Halteres": require("../imgs/Exercicios/Kickback com Halteres.jpeg"),
        "Leg Press": require("../imgs/Exercicios/Leg Press.jpeg"),
        "Mergulho nas Paralelas (Dips)": require("../imgs/Exercicios/Mergulho nas Paralelas (Dips).jpeg"),
        "Mesa Flexora": require("../imgs/Exercicios/Mesa Flexora.gif"),
        "Prancha": require("../imgs/Exercicios/Prancha.gif"),
        "Puxada Alta": require("../imgs/Exercicios/Puxada Alta.jpeg"),
        "Remada Alta com Barra": require("../imgs/Exercicios/Remada Alta com Barra.jpeg"),
        "Remada Cavalinho": require("../imgs/Exercicios/Remada Cavalinho.jpeg"),
        "Remada Curvada com Barra": require("../imgs/Exercicios/Remada Curvada com Barra.jpeg"),
        "Remada Curvada com Halteres": require("../imgs/Exercicios/Remada Curvada com Halteres.jpeg"),
        "Remada Curvada com Pegada Supinada": require("../imgs/Exercicios/Remada Curvada com Pegada Supinada.jpeg"),
        "Remada Sentada na Máquina": require("../imgs/Exercicios/Remada Sentada na Máquina.jpeg"),
        "Rosca 21 com Barra": require("../imgs/Exercicios/Rosca 21 com Barra.jpeg"),
        "Rosca Alternada com Halteres": require("../imgs/Exercicios/Rosca Alternada com Halteres.jpeg"),
        "Rosca Concentrada com Halter": require("../imgs/Exercicios/Rosca Concentrada com Halter.jpeg"),
        "Rosca de Punho com Halteres": require("../imgs/Exercicios/Rosca de Punho com Halteres.jpeg"),
        "Rosca de Punho Sentado com Barra": require("../imgs/Exercicios/Rosca de Punho Sentado com Barra.jpeg"),
        "Rosca Direta com Barra": require("../imgs/Exercicios/Rosca Direta com Barra.jpeg"),
        "Rosca Direta com Halteres": require("../imgs/Exercicios/Rosca Direta com Halteres.jpeg"),
        "Rosca Inclinada com Halteres": require("../imgs/Exercicios/Rosca Inclinada com Halteres.jpeg"),
        "Rosca Inversa": require("../imgs/Exercicios/Rosca Inversa.jpeg"),
        "Rosca Martelo com Halteres": require("../imgs/Exercicios/Rosca Martelo com Halteres.jpeg"),
        "Rosca Martelo Inversa com Barra": require("../imgs/Exercicios/Rosca Martelo Inversa com Barra.jpeg"),
        "Rosca Scott com Barra": require("../imgs/Exercicios/Rosca Scott com Barra.jpeg"),
        "Stiff com Barra": require("../imgs/Exercicios/Stiff com Barra.jpeg"),
        "Stiff com Halteres": require("../imgs/Exercicios/Stiff com Halteres.jpeg"),
        "Supino Declinado com Barra": require("../imgs/Exercicios/Supino Declinado com Barra.jpeg"),
        "Supino Declinado com Halteres": require("../imgs/Exercicios/Supino Declinado com Halteres.jpeg"),
        "Supino Inclinado com Barra": require("../imgs/Exercicios/Supino Inclinado com Barra.jpeg"),
        "Supino Reto com Halteres": require("../imgs/Exercicios/Supino Reto com Halteres.jpeg"),
        "Supino Reto com Barra": require("../imgs/Exercicios/Supino Reto com Barra.jpeg"),
        "Supino Inclinado com Halteres": require("../imgs/Exercicios/Supino Inclinado com Halteres.jpeg"),
        "Tríceps Francês com Barra EZ": require("../imgs/Exercicios/Tríceps Francês com Barra EZ.jpeg"),
        "Tríceps na Polia com Corda": require("../imgs/Exercicios/Tríceps na Polia com Corda.jpeg"),
        "Tríceps Testa com Halteres": require("../imgs/Exercicios/Tríceps Testa com Halteres.jpeg"),
        "V-Up": require("../imgs/Exercicios/V-Up.jpeg"),
    };

    const [exercicios, setExercicios] = useState(ExerciciosData);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedExercicio, setSelectedExercicio] = useState(null);
    const [initialWeight, setInitialWeight] = useState("");
    const [newWeight, setNewWeight] = useState("");
    const [weightData, setWeightData] = useState([]);
    const auth = getAuth();


    const getImageSource = (nomeExercicio) => {
        return exercicioImages[nomeExercicio] || null;
    };

    const handleExercicioPress = (exercicio) => {
        if (!exercicio || !exercicio.Nome_Exercicio) {
            alert('Dados do exercício estão incompletos');
            return;
        }
        console.log('Navegando para Dados_Exercicios com:', exercicio);
        navigation.navigate("Dados_Exercicios", { Exercicio: exercicio });
    };
    

    return (
        <View style={{ flex: 1 }}>
            <Text style={{ alignSelf: "center", marginTop: "10%", fontSize: 30, fontFamily: "Zing.rust", marginBottom: "5%" }}>Progresso</Text>
            <ScrollView style={{ height: "90%" }}>
                <View style={styles.container}>
                    {exercicios.map((exercicio, index) => {
                        return (
                            <TouchableOpacity onPress={() => handleExercicioPress(exercicio)} style={styles.div} key={index}>
                                <Image style={styles.image} source={getImageSource(exercicio.Nome_Exercicio)} />
                                <Text style={styles.text}>{exercicio.Nome_Exercicio}</Text>
                            </TouchableOpacity>
                        )
                    })}
                </View>
            </ScrollView>

            <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalView}>
                    <ScrollView contentContainerStyle={{height:"100%", width:"100%"}}>
                        {selectedExercicio && (
                            <>
                                <Text style={styles.modalText}>{selectedExercicio.Nome_Exercicio}</Text>
                                <Image style={styles.modalImage} source={getImageSource(selectedExercicio.Nome_Exercicio)} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Peso inicial"
                                    keyboardType="numeric"
                                    value={initialWeight}
                                    onChangeText={setInitialWeight}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Novo peso"
                                    keyboardType="numeric"
                                    value={newWeight}
                                    onChangeText={setNewWeight}
                                />
                                <TouchableOpacity style={styles.botoes}>
                                    <Text style={{ fontFamily: "Zing.rust" }}>Salvar</Text>
                                </TouchableOpacity>
                                {weightData.length > 0 && (
                                    <LineChart
                                        data={data}
                                        width={Dimensions.get('window').width - 90}
                                        height={230}
                                        yAxisLabel=""
                                        chartConfig={{
                                            backgroundColor: '#e26a00',
                                            backgroundGradientFrom: '#fb8c00',
                                            backgroundGradientTo: '#ffa726',
                                            decimalPlaces: 2,
                                            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                                            style: {
                                                borderRadius: 16
                                            }
                                        }}
                                        style={{
                                            marginVertical: 8,
                                            borderRadius: 16
                                        }}
                                    />
                                )}
                            </>
                        )}

                        <TouchableOpacity style={styles.botoes} onPress={() => setModalVisible(false)}>
                            <Text style={{ fontFamily: "Zing.rust" }}>Fechar</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    div: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 15,
        width: "45%",
        marginBottom: 10,
        alignItems: 'center',
        backgroundColor:"white"
    },
    image: {
        width: "100%",
        height: 150,
        resizeMode: "contain",
    },
    text: {
        marginTop: 10,
        textAlign: 'center',
    },
    modalView: {
        height: "95%",
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
        borderWidth: 1
      },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 20,
        fontFamily: "Zing.rust"
    },
    modalImage: {
        width: "100%",
        height: "30%", 
        resizeMode: "contain" 
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        padding: 10
    },
    botoes: {
        padding: "5%",
        borderWidth: 1,
        borderRadius: 20,
        marginTop: "5%",
        alignSelf: "center"
    },
});

export default Progresso;
