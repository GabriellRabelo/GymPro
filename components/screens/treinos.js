import { StatusBar } from 'expo-status-bar';
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
    
                    if (!treinoExercicios.includes(exercicio)) {
                        alert('Este exercício não está no treino!');
                        return;
                    }
                }
    
                await updateDoc(docRef, {
                    [musculo]: arrayRemove(exercicio)
                }, { merge: true });
    
                // Exibir o alerta apenas quando um exercício é removido
                alert('Exercício removido do treino com sucesso!');
                // Atualizar a lista de exercícios após a remoção
                const updatedExercicios = treinoExercicios.filter(e => e !== exercicio);
                setExercicios(updatedExercicios);
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
        <View style={{ flex: 1 }}>
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
        </View>
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
