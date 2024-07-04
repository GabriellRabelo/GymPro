import React, { useState, useEffect } from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet, Image, View, Dimensions, Modal, TextInput } from 'react-native';
import { useUser } from './usercontext.js';
import { doc, setDoc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../../services/FirebaseConfig.js';
import { LineChart } from 'react-native-chart-kit';
import ExerciciosData from "../../services/ExerciciosData.json";

const Dados_Exercicios = ({ navigation, route }) => {
    const Exercicio = route.params.Exercicio;
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

    const [initialWeight, setInitialWeight] = useState("");
    const [newWeight, setNewWeight] = useState("");
    const [weightData, setWeightData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const auth = getAuth();

    const getImageSource = (nomeExercicio) => {
        return exercicioImages[nomeExercicio] || null;
    };

    useEffect(() => {
        if (Exercicio && Exercicio.Nome_Exercicio) {
            fetchWeights(Exercicio.Nome_Exercicio);
        } else {
            console.error('Exercicio não encontrado ou inválido:', Exercicio);
            alert('Erro ao carregar os detalhes do exercício');
        }
    }, [Exercicio.Nome_Exercicio]);

    const fetchWeights = async (exerciseName) => {
        try {
            const user = auth.currentUser;
            if (user) {
                const userId = user.uid;
                const docRef = doc(db, 'Progresso', userId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    const exerciseData = data[exerciseName] || { weights: [] };
                    setWeightData(exerciseData.weights);
                }
            } else {
                console.error('Usuário não autenticado');
            }
        } catch (error) {
            console.error('Erro ao buscar progresso:', error);
        }
    };

    const handleSaveWeight = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
                const userId = user.uid;
                const docRef = doc(db, 'Progresso', userId);
                const newEntry = {
                    timestamp: new Date().toISOString(),
                    weight: parseFloat(newWeight || initialWeight)
                };

                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    await updateDoc(docRef, {
                        [`${Exercicio.Nome_Exercicio}.weights`]: arrayUnion(newEntry)
                    });
                } else {
                    await setDoc(docRef, {
                        userId,
                        [Exercicio.Nome_Exercicio]: {
                            weights: [newEntry]
                        }
                    });
                }

                setWeightData([...weightData, newEntry]);
                setInitialWeight("");
                setNewWeight("");
                alert('Peso salvo com sucesso!');
                setModalVisible(false);
            }
        } catch (error) {
            console.error('Erro ao salvar peso:', error);
        }
    };

    const data = {
        labels: weightData.map(entry => new Date(entry.timestamp).toLocaleDateString()),
        datasets: [
            {
                data: weightData.map(entry => entry.weight),
                strokeWidth: 2
            }
        ]
    };

    return (
        <ScrollView style={{ backgroundColor: "white" }}>
            <View style={{ flex: 1, backgroundColor: "white", height: "100%" }}>
                <TouchableOpacity style={{ position: "absolute", width: 30, height: 20, marginTop: "4%", marginLeft: "5%" }} onPress={() => navigation.navigate("Progresso")}>
                    <Image style={styles.backimg} source={require("../icons/back_arrow.png")} />
                </TouchableOpacity>
                <Text style={{ alignSelf: "center", marginTop: "15%", fontSize: 30, fontFamily: "Zing.rust" }}>{Exercicio.Nome_Exercicio}</Text>
                <Text style={{ marginLeft: "12%", marginTop: "5%", fontSize: 20, fontFamily: "Zing.rust", marginBottom:"2%" }}>Progresso</Text>

                {weightData.length > 0 ? (
                    <ScrollView>
                        <LineChart
                            data={data}
                            width={Dimensions.get('window').width - 40}
                            height={230}
                            chartConfig={{
                                backgroundColor: 'black',
                                backgroundGradientFrom: 'white',
                                backgroundGradientTo: 'white',
                                decimalPlaces: 2,
                                color: (opacity = 1) => `black`,
                            }}
                            style={{
                                marginVertical: 8,
                                borderRadius: 15,
                                alignSelf: "center",
                            }}
                        />
                        <Text style={{ marginLeft: "12%", marginTop: "5%", fontSize: 20, fontFamily: "Zing.rust" }}>Histórico:</Text>

                        {weightData.map((valores, index) => (
                            <View key={index} style={styles.divs}>
                                <Text style={{ fontSize: 16 }}><Text style={{ fontWeight: "bold" }}>Dia: </Text>{new Date(valores.timestamp).toLocaleDateString()}<Text style={{ fontWeight: "bold" }}> Peso: </Text>{valores.weight} kg</Text>
                            </View>
                        ))}

                        <Image style={{ alignSelf: "center", marginTop: "15%", width: "13%", resizeMode: "contain" }} source={require("../icons/add.png")} />
                        <Text style={{ textAlign: "center", fontFamily: "Zing.rust", fontSize: 17, marginTop: "-5%" }}>Adicione um novo registro</Text>
                        <TouchableOpacity onPress={() => { setModalVisible(true) }} style={{...styles.botao, marginBottom:"20%"}}>
                            <Text style={{ textAlign: "center", fontFamily: "Zing.rust", fontSize: 17 }}>Adicionar Registro</Text>
                        </TouchableOpacity>
                    </ScrollView>

                ) : (
                    <>
                        <Text style={{ alignSelf: "center", marginVertical: 20 }}>Ainda não tem nenhum dado? Faça seu primeiro registro</Text>
                        <Text style={{ marginLeft: "12%", marginTop: "5%", fontSize: 20, fontFamily: "Zing.rust" }}>Histórico:</Text>
                        <Image style={{ alignSelf: "center", marginTop: "15%", width: "13%", resizeMode: "contain" }} source={require("../icons/add.png")} />
                        <Text style={{ textAlign: "center", fontFamily: "Zing.rust", fontSize: 17 }}>Histórico vazio</Text>

                        <TouchableOpacity onPress={() => { setModalVisible(true) }} style={styles.botao}>
                            <Text style={{ textAlign: "center", fontFamily: "Zing.rust", fontSize: 17 }}>Adicionar Registro</Text>
                        </TouchableOpacity>
                    </>
                )}

            </View>

            <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalView}>
                    <ScrollView contentContainerStyle={{ height: "100%", width: "100%" }}>
                        <Text style={styles.modalText}>{Exercicio.Nome_Exercicio}</Text>
                        <Image style={styles.modalImage} source={getImageSource(Exercicio.Nome_Exercicio)} />

                        <Text style={{ textAlign: "center", marginTop: "5%", fontSize: 20, fontFamily: "Zing.rust" }}>Insira o peso que realizou neste exercicio:</Text>

                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Peso"
                                keyboardType="numeric"
                                value={newWeight}
                                onChangeText={setNewWeight}
                            />
                            <Text style={styles.inputKgText}>KG</Text>
                        </View>

                        <TouchableOpacity style={styles.botoes} onPress={() => handleSaveWeight()}>
                            <Text style={{ fontFamily: "Zing.rust" }}>Salvar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.botoes} onPress={() => setModalVisible(false)}>
                            <Text style={{ fontFamily: "Zing.rust" }}>Fechar</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </Modal>

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    backimg: {
        width: 50,
        height: 50,
    },
    divs:{
        marginLeft: "12%", 
        marginTop: "5%",
        borderWidth:1,
        borderRadius:15,
        width:"70%",
        padding:"3%", 
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: '5%',
        width: '70%',
        borderRadius: 15,
        borderWidth: 1,
        paddingHorizontal: 10,
    },
    input: {
        flex: 1,
        height: 40,
        paddingHorizontal: 10,
        fontFamily: "Zing.rust"
    },
    inputKgText: {
        fontFamily: "Zing.rust",
        marginLeft: 10,
        marginRight: 5,
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
    botao:{
        padding:10,
        borderWidth:1, 
        borderRadius:15,
        width:"40%",
        alignSelf:"center", 
        marginTop:"2%"
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
      botoes: {
        padding: "5%",
        borderWidth: 1,
        borderRadius: 20,
        marginTop: "5%",
        alignSelf: "center"
    },
});

export default Dados_Exercicios;
