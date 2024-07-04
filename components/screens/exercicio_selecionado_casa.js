import React, { useState, useEffect } from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet, Image, Modal, View, TextInput, Keyboard } from 'react-native';
import { useUser } from './usercontext.js';
import { useFonts } from "expo-font";
import ExerciciosData from "../../services/ExerciciosData.json";
import { doc, setDoc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../../services/FirebaseConfig.js';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const exercicioImages = {
    "Flexões": require("../imgs/Exercicios/Flexões.jpeg"),
    "Flexões Diamante": require("../imgs/Exercicios/Flexões Diamante.gif"),
    "Flexão Inclinada": require("../imgs/Exercicios/Flexão Inclinada.jpeg"),
    "V-Up": require("../imgs/Exercicios/V-Up.jpeg"),
    "Abdominal Crunch": require("../imgs/Exercicios/Abdominal Crunch.jpeg"),
    "Prancha": require("../imgs/Exercicios/Prancha.gif"),
    "Agachamento Afundo Apoiado": require("../imgs/Exercicios/Agachamento Afundo Apoiado.jpeg"),
    "Afundo": require("../imgs/Exercicios/Afundo.gif"),
    "Agachamento Pulando": require("../imgs/Exercicios/Agachamento Pulando.jpeg"),
};

const Exercicio_Selecionado_Casa = ({ navigation, route }) => {
    const [dados, setDados] = useState([]);
    const [KeyboardVisible, setKeyboardVisible] = useState(false);
    const [Musculo, setMusculo] = useState(route.params.musculo);
    const { idutilizador } = useUser();
    const [modalExercicioIndex, setModalExercicioIndex] = useState(null);
    const [modalTreinoVisible, setModalTreinoVisible] = useState(false);
    const [treinos, setTreinos] = useState([]);
    const [novoTreino, setNovoTreino] = useState('');
    const auth = getAuth();
    const [fontsloaded] = useFonts({
        "Zing.rust": require("../../assets/fonts/zing.rust-demo-base.otf")
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
      }, []); //useEffect para verificar se o teclado está ativo

    useEffect(() => {
        const exerciciosFiltrados = ExerciciosData.filter(exercicio => exercicio.Musculo === Musculo);
        setDados(exerciciosFiltrados);
    }, [Musculo]); //useEffect para filtrar exercicios pelo musculo selecionado

    const fetchTreinos = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
                const userId = user.uid;
                const docRef = doc(db, 'treinos', userId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    const treinoNomes = Object.keys(data);
                    setTreinos(treinoNomes);
                }
            }
        } catch (error) {
            console.error('Erro ao buscar Treinos:', error);
        }
    };

    useEffect(() => {
        fetchTreinos();
    }, [auth]); //useEffeect para buscar os treinos

    if (!fontsloaded) {
        return null;
    }

    const OpenModal = (index) => {
        setModalExercicioIndex(index);
    };

    const CloseModal = () => {
        setModalExercicioIndex(null);
    };

    const HandleAdicionarFavorito = async (exercicio) => {
        try {
            const user = auth.currentUser;
            if (user) {
                const userId = user.uid;
                const docRef = doc(db, 'favoritos', userId);
                const exercicioCompleto = ExerciciosData.find(e => e.Nome_Exercicio === exercicio.Nome_Exercicio);
                const exercicioData = exercicioCompleto ? { ...exercicio, ...exercicioCompleto } : exercicio;

                await setDoc(docRef, {
                    favoritos: arrayUnion(exercicioData)
                }, { merge: true });

                alert('Adicionado com sucesso!');
            }
        } catch (error) {
            console.error('Erro ao adicionar favorito:', error);
        }
    };

    const HandleAdicionarTreino = async (exercicio) => {
        setModalTreinoVisible(true);
    };

    const HandleConfirmarAdicionarTreino = async (exercicio, treino) => {
        try {
            const user = auth.currentUser;
            if (user) {
                const userId = user.uid;
                const docRef = doc(db, 'treinos', userId);

                if (treino === 'Novo Treino') {
                    treino = novoTreino;
                    if (!treino) {
                        alert('Por favor, insira o nome do novo treino.');
                        return;
                    }
                }

                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    await updateDoc(docRef, {
                        [treino]: arrayUnion(exercicio)
                    });
                } else {
                    await setDoc(docRef, {
                        [treino]: [exercicio]
                    });
                }

                alert('Exercício adicionado ao treino com sucesso!');
                setModalTreinoVisible(false);
                setNovoTreino('');
                fetchTreinos();
            }
        } catch (error) {
            console.error('Erro ao adicionar treino:', error);
            alert('Erro ao adicionar treino. Por favor, tente novamente.');
        }
    };

    const HandleVoltar = () => {
        setDados([]);
        setMusculo("");
        navigation.navigate("ExerciciosCasa");
    };

    const getImageSource = (nomeExercicio) => {
        return exercicioImages[nomeExercicio] || null;
    };

    return (
        <ScrollView>
            <Text style={{ alignSelf: "center", marginTop: "15%", fontSize: 30, fontFamily: "Zing.rust" }}>Exercícios de {Musculo}</Text>
            <TouchableOpacity style={{ position: "absolute", width: 30, height: 20, marginTop: "3%", marginLeft: "5%" }} onPress={HandleVoltar}>
                <Image style={styles.backimg} source={require("../icons/back_arrow.png")}></Image>
            </TouchableOpacity>
            {dados.map((exercicio, index) => (
    exercicio.RealizaremCasa && (
        <View key={index}>
            <TouchableOpacity style={styles.divs} onPress={() => OpenModal(index)}>
                <Text style={{ textAlign: "center", fontSize: 20, fontFamily: "Zing.rust" }}>{exercicio.Nome_Exercicio}</Text>
            </TouchableOpacity>

            <Modal animationType='slide' transparent={true} visible={modalExercicioIndex === index} onRequestClose={CloseModal}>
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>{exercicio.Nome_Exercicio}</Text>
                    <Image style={{ width: "100%", height: "30%", resizeMode: "contain" }} source={getImageSource(exercicio.Nome_Exercicio)}/>
                    <Text style={{ fontSize: 15, fontFamily: "Zing.rust" }}><Text style={{ fontWeight: "bold" }}>INSTRUÇÃO:</Text> {exercicio.Descricao}</Text>
                    <Text style={{ marginTop: "5%", fontSize: 15, fontFamily: "Zing.rust" }}><Text style={{ fontWeight: "bold" }}>Foco Muscular:</Text> {exercicio.Foco_Muscular}</Text>
                    <Text style={{ marginTop: "3%", marginBottom: "3%", fontSize: 15, fontFamily: "Zing.rust" }}><Text style={{ fontWeight: "bold" }}>Repetições:</Text> {exercicio.Repeticoes}</Text>
                    <Text style={{ fontFamily: "Zing.rust" }}><Text style={{ fontWeight: "bold", fontSize: 15 }}>Series:</Text> {exercicio.Series}</Text>

                    <TouchableOpacity style={styles.botoes} onPress={() => HandleAdicionarFavorito(exercicio)}>
                        <Text style={{ fontFamily: "Zing.rust" }}>Adicionar aos favoritos</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.botoes} onPress={() => HandleAdicionarTreino(exercicio)}>
                        <Text style={{ fontFamily: "Zing.rust" }}>Adicionar a um treino</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.botoes} onPress={CloseModal}>
                        <Text style={{ fontFamily: "Zing.rust" }}>Fechar</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
        )
    ))}


            <Modal animationType='slide' transparent={true} visible={modalTreinoVisible} onRequestClose={() => setModalTreinoVisible(false)}>
                <KeyboardAwareScrollView style={styles.modalView} enableOnAndroid={true} extraScrollHeight={KeyboardVisible ? 150 : 0}>
                    <Text style={styles.modalText}>Escolha um dos seus treinos para adicionar o exercicio</Text>
                    {treinos.map((treino, index) => (
                        <TouchableOpacity key={index} style={styles.treinoContainer} onPress={() => HandleConfirmarAdicionarTreino(dados[modalExercicioIndex], treino)}>
                            <Text style={{ fontFamily: "Zing.rust",textAlign:"center" }}>{treino}</Text>
                        </TouchableOpacity>
                    ))}
                    <Text style={{...styles.modalText, marginTop:"10%"}}>Ou crie um treino novo</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nome do Novo Treino"
                        value={novoTreino}
                        onChangeText={setNovoTreino}
                    />
                    <TouchableOpacity style={styles.botoes} onPress={() => HandleConfirmarAdicionarTreino(dados[modalExercicioIndex], 'Novo Treino')}>
                        <Text style={{ fontFamily: "Zing.rust" }}>Criar Novo Treino</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.botoes} onPress={() => setModalTreinoVisible(false)}>
                        <Text style={{ fontFamily: "Zing.rust" }}>Sair</Text>
                    </TouchableOpacity>
                </KeyboardAwareScrollView>
            </Modal>
        </ScrollView>
    );
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
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginTop: "5%"
    },
    treinoContainer: {
        marginVertical: 10,
        padding: 10,
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 15,
        alignSelf:"center",
        width:"80%"
    }
});

export default Exercicio_Selecionado_Casa;