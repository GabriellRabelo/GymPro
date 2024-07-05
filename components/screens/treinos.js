import { useState, useEffect, memo } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Modal } from 'react-native';
import { getAuth } from 'firebase/auth';
import { db } from '../../services/FirebaseConfig.js';
import { ScrollView } from 'react-native-gesture-handler';
import { updateDoc, arrayRemove, getDoc, doc } from 'firebase/firestore';

const Treinos = () => {
    const [musculos, setMusculos] = useState([]);
    const [exercicios, setExercicios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMuscle, setSelectedMuscle] = useState(null);
    const [modalExercicioIndex, setModalExercicioIndex] = useState(null);
    const auth = getAuth();

    const exercicioImages = {
        "Crucifixo Inclinado com Halteres": require("../imgs/Exercicios/Crucifixo Inclinado com Halteres.jpeg"),
        "Levantamento Terra": require("../imgs/Exercicios/Levantamento Terra.jpeg"),
        "Abdominal Crunch": require("../imgs/Exercicios/Abdominal Crunch.jpeg"),
        "Agachamento": require("../imgs/Exercicios/Agachamento.jpeg"),
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
        "Agachamento Afundo Apoiado": require("../imgs/Exercicios/Agachamento Afundo Apoiado.jpeg"),
        "Afundo": require("../imgs/Exercicios/Afundo.gif"),
        "Agachamento Pulando": require("../imgs/Exercicios/Agachamento Pulando.jpeg"),
        "Flexões Diamante": require("../imgs/Exercicios/Flexões Diamante.gif"),
        "Flexão Inclinada": require("../imgs/Exercicios/Flexão Inclinada.jpeg"),
    };

    const getImageSource = (nomeExercicio) => {
        return exercicioImages[nomeExercicio] || null;
    };

    const OpenModal = (index) => {
        setModalExercicioIndex(index);
    };

    const CloseModal = () => {
        setModalExercicioIndex(null);
    };

    const fetchTreinos = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
                const userId = user.uid;
                const docRef = doc(db, 'treinos', userId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    // Obter a lista de músculos
                    const muscleKeys = Object.keys(data);
                    setMusculos(muscleKeys);
                } else {
                    console.error('Documento não encontrado');
                }
            } else {
                console.error('Usuário não autenticado');
            }
        } catch (error) {
            console.error('Erro ao buscar Treinos:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTreinos();
    }, []);

    const handleMusclePress = (muscle) => {
        const user = auth.currentUser;
        if (user) {
            const userId = user.uid;
            const docRef = doc(db, 'treinos', userId);
            getDoc(docRef).then(docSnap => {
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setExercicios(data[muscle]);
                    setSelectedMuscle(muscle);
                }
            }).catch(error => {
                console.error('Erro ao buscar exercícios:', error);
            });
        }
    };

    const HandleRemoverTreino = async (exercicio, musculo) => {
        try {
            const auth = getAuth();
            const user = auth.currentUser;
            if (user) {
                const userId = user.uid;
                const docRef = doc(db, 'treinos', userId);
                
                // Verifica se o exercício está presente no treino
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    const treinoExercicios = data[musculo] || [];
    
                    const exercicioIndex = treinoExercicios.findIndex(e => e.Nome_Exercicio === exercicio.Nome_Exercicio);
    
                    if (exercicioIndex === -1) {
                        alert('Este exercício não está no treino!');
                        return;
                    }
    
                    // Remover o exercício do array
                    treinoExercicios.splice(exercicioIndex, 1);
    
                    // Atualizar o Firestore com o novo array de exercícios
                    await updateDoc(docRef, {
                        [musculo]: treinoExercicios
                    });
    
                    // Exibir o alerta de sucesso e atualizar a lista de exercícios no estado
                    alert('Exercício removido do treino com sucesso!');
                    setExercicios(treinoExercicios);
                }
            }
        } catch (error) {
            console.error('Erro ao remover treino:', error);
        }
    };

    const handleBackPress = () => {
        setSelectedMuscle(null);
        setExercicios([]);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Carregando...</Text>
            </View>
        );
    }

    if (selectedMuscle) {
        return (
            <ScrollView style={{ flex: 1 }}>
                <TouchableOpacity style={{ position: "absolute", width: 30, height: 20, marginTop: "7%", marginLeft: "5%" }} onPress={handleBackPress}>
                    <Image style={styles.backimg} source={require("../icons/back_arrow.png")}></Image>
                </TouchableOpacity>
                <Text style={styles.header}>{selectedMuscle}</Text>
                {exercicios.map((exercicio, index) => (
                    <View key={index}>
                        <TouchableOpacity onPress={() => OpenModal(index)} key={index} style={styles.treinoContainer}>
                            <Text style={styles.treinoTitle}>{exercicio.Nome_Exercicio}</Text>
                            <Text style={{marginTop:5}}><Text style={styles.txts}>Foco Muscular: </Text>{exercicio.Foco_Muscular}</Text>
                            <Text style={{marginTop:5}}><Text style={styles.txts}>Séries: </Text>{exercicio.Series}</Text>
                            <Text style={{marginTop:5}}><Text style={styles.txts}>Repetições: </Text>{exercicio.Repeticoes}</Text>
                            <Text style={{marginTop:5}}><Text style={styles.txts}>Descrição: </Text>{exercicio.Descricao}</Text>
                        </TouchableOpacity>

                        

                        <Modal animationType='slide' transparent={true} visible={modalExercicioIndex === index} onRequestClose={CloseModal}>
                            <View style={styles.modalView}>
                                <Text style={styles.modalText}>{exercicio.Nome_Exercicio}</Text>
                                <Image style={{ width: "100%", height: "30%", resizeMode: "contain" }} source={getImageSource(exercicio.Nome_Exercicio)}/>
                                <Text style={{marginTop:10}}><Text style={styles.txts}>INSTRUÇÃO: </Text>{exercicio.Descricao}</Text>
                                <Text style={{marginTop:10}}><Text style={styles.txts}>Foco Muscular: </Text>{exercicio.Foco_Muscular}</Text>
                                <Text style={{marginTop:10}}><Text style={styles.txts}>Repetições:</Text> {exercicio.Repeticoes}</Text>
                                <Text style={{marginTop:10}}><Text style={styles.txts}>Series:</Text> {exercicio.Series}</Text>

                                <TouchableOpacity style={styles.botoes} onPress={() => HandleRemoverTreino(exercicio, selectedMuscle)}>
                                    <Text style={{ fontFamily: "Zing.rust" }}>Remover do treino</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.botoes} onPress={CloseModal}>
                                    <Text style={{ fontFamily: "Zing.rust" }}>Fechar</Text>
                                </TouchableOpacity>
                            </View>
                        </Modal>
                    </View>
                ))}
            </ScrollView>
        );
    }

    return (
        <ScrollView style={{ flex: 1 }}>
            <TouchableOpacity style={{ position: "absolute", width: 30, height: 20, marginTop: "9%", marginLeft: "5%" }} onPress={fetchTreinos}>
                <Image style={styles.backimg} source={require("../icons/reload.png")}></Image>
            </TouchableOpacity>
            <Text style={styles.header}>Meus Treinos</Text>
            {musculos.length > 0 ? (
                musculos.map((muscle, index) => (
                    <TouchableOpacity key={index} onPress={() => handleMusclePress(muscle)} style={styles.muscleButton}>
                        <Text style={styles.muscleButtonText}>{muscle}</Text>
                    </TouchableOpacity>
                ))
            ) : (
                <Text style={{ alignSelf: "center", marginTop: "5%" }}>Nenhum treino encontrado</Text>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    txts:{
        fontFamily: "Zing.rust",
        fontSize:15,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        alignSelf: "center",
        marginTop: "12%",
        fontSize: 30,
        fontFamily: "Zing.rust"
    },
    treinoContainer: {
        marginVertical: 10,
        padding: 10,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 15,
        alignSelf:"center",
        width:"80%"
    },
    treinoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    muscleButton: {
        width: "70%",
        minHeight: 60,
        padding: "3%",
        marginTop: "8%",
        alignSelf: "center",
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "rgba(0,0,0,0.7)",
        alignItems:"center"
    },
    muscleButtonText: {
        fontSize: 18,
    },
    backButton: {
        padding: 10,
        margin: 10,
        backgroundColor: '#ddd',
        alignItems: 'center',
        borderRadius: 5,
    },
    backButtonText: {
        fontSize: 18,
    },
    backimg: {
        width: 50,
        height: 50,
    },
    modalView: {
        height: "90%",
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
    botoes: {
        padding: "5%",
        borderWidth: 1,
        borderRadius: 20,
        marginTop: "5%",
        alignSelf: "center"
    }
});

export default Treinos;
