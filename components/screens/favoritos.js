import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Modal, ScrollView, TouchableOpacity, Image, Keyboard, TextInput} from 'react-native';
import { useUser } from './usercontext.js';
import { getDoc, updateDoc, doc, arrayUnion } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../../services/FirebaseConfig.js';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const Favoritos = ({ navigation }) => {
    const [dados, setDados] = useState([]);
    const { idutilizador } = useUser();
    const [favoritos, setFavoritos] = useState([]);
    const [KeyboardVisible, setKeyboardVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [modalExercicioIndex, setModalExercicioIndex] = useState(null);
    const [modalTreinoVisible, setModalTreinoVisible] = useState(false);
    const [treinos, setTreinos] = useState([]);
    const [novoTreino, setNovoTreino] = useState('');
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
        "Supino Reto com Halteres": require("../imgs/Exercicios/Supino Inclinado com Halteres.jpeg"),
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

    const fetchFavoritos = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
                const userId = user.uid;
                const docRef = doc(db, 'favoritos', userId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setFavoritos(data.favoritos || []);
                }
                setLoading(false);
            } else {
                console.error('Usuário não autenticado');
            }
        } catch (error) {
            console.error('Erro ao buscar favoritos:', error);
        }
    };

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
      }, []); // useEffect para verificar se o teclado está ativo

      useEffect(() => {
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

        fetchTreinos();
    }, [auth]); // useEffect para buscar os treinos

    useEffect(() => {
        fetchFavoritos();
    }, []); // useEffect para buscar os favoritos

    const OpenModal = (index) => {
        setModalExercicioIndex(index);
    };

    const CloseModal = () => {
        setModalExercicioIndex(null);
    }

    const HandleVoltar = () => {
        setFavoritos([]);
        navigation.navigate("Home");
    }

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Carregando...</Text>
            </View>
        );
    };

    

    const HandleRemoverFavorito = async (exercicio) => {
        try {
            const user = auth.currentUser;
            if (user) {
                const userId = user.uid;
                const docRef = doc(db, 'favoritos', userId);
    
                await updateDoc(docRef, {
                    favoritos: favoritos.filter(fav => fav.Nome_Exercicio !== exercicio.Nome_Exercicio)
                });
    
                setFavoritos(favoritos.filter(fav => fav.Nome_Exercicio !== exercicio.Nome_Exercicio));
                alert("Exercicio removido com sucesso");
                CloseModal();
            }
        } catch (error) {
            console.error('Erro ao remover favorito:', error);
        }
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
    
                if (exercicio && treino) {
                    await updateDoc(docRef, {
                        [treino]: arrayUnion(exercicio)
                    }, { merge: true });
    
                    alert('Exercício adicionado ao treino com sucesso!');
                    setModalTreinoVisible(false);
                    setNovoTreino('');
                } else {
                    console.error('Erro: Exercicio ou treino indefinido');
                }
            }
        } catch (error) {
            console.error('Erro ao adicionar treino:', error);
        }
    };

    const HandleAdicionarTreino = (exercicio) => {
        setDados([exercicio]);
        setModalTreinoVisible(true);
    };

    const getImageSource = (nomeExercicio) => {
        return exercicioImages[nomeExercicio] || null;
    };

    return (
        <ScrollView>
            <Text style={{ alignSelf: "center", marginTop: "10%", fontSize: 30, fontFamily: "Zing.rust" }}>Exercícios Favoritos</Text>
            <TouchableOpacity style={{ position: "absolute", width: 30, height: 20, marginTop: "7%", marginLeft: "5%" }} onPress={HandleVoltar}>
                <Image style={styles.backimg} source={require("../icons/back_arrow.png")}></Image>
            </TouchableOpacity>
            {favoritos.map((favorito, index) => (
                <View key={index}>
                    <TouchableOpacity style={styles.divs} onPress={() => OpenModal(index)}>
                        <Text style={{ textAlign: "center", fontSize: 20, fontFamily: "Zing.rust" }}>{favorito.Nome_Exercicio || "Nome do Exercicio"}</Text>
                    </TouchableOpacity>

                    <Modal animationType='slide' transparent={true} visible={modalExercicioIndex === index} onRequestClose={CloseModal}>
                        <View style={styles.modalView}>
                            <Image style={{ width: "100%", height: "30%", resizeMode: "contain" }} source={getImageSource(favorito.Nome_Exercicio)}/>
                            <Text style={styles.modalText}>{favorito.Nome_Exercicio || "Nome do Exercicio"}</Text>
                            <Text style={{ fontSize: 15 }}><Text style={{ fontFamily: "Zing.rust" }}>INSTRUÇÃO:</Text> {favorito.Descricao || "Descrição não disponível"}</Text>
                            <Text style={{ marginTop: "5%", fontSize: 15}}><Text style={{fontFamily: "Zing.rust"}}>Foco Muscular:</Text> {favorito.Foco_Muscular || "Foco Muscular não disponível"}</Text>
                            <Text style={{ marginTop: "3%", marginBottom: "3%", fontSize: 15}}><Text style={{fontFamily: "Zing.rust"}}>Repetições:</Text> {favorito.Repeticoes || "Repetições não disponíveis"}</Text>
                            <Text><Text style={{fontFamily: "Zing.rust", fontSize: 15 }}>Series:</Text> {favorito.Series || "Series não disponíveis"}</Text>

                            <TouchableOpacity style={styles.botoes} onPress={() => HandleRemoverFavorito(favorito)}>
                                <Text style={{ fontFamily: "Zing.rust" }}>Remover dos favoritos</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.botoes} onPress={() => HandleAdicionarTreino(favorito)}>
                                <Text style={{ fontFamily: "Zing.rust" }}>Adicionar a um treino</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.botoes} onPress={CloseModal}>
                                <Text style={{ fontFamily: "Zing.rust" }}>Fechar</Text>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                </View>
            ))}

            <Modal animationType='slide' transparent={true} visible={modalTreinoVisible} onRequestClose={() => setModalTreinoVisible(false)}>
                <KeyboardAwareScrollView style={styles.modalView} enableOnAndroid={true} extraScrollHeight={KeyboardVisible ? 150 : 0}>
                    <Text style={styles.modalText}>Escolha um dos seus treinos para adicionar o exercicio</Text>
                    {treinos.map((treino, index) => (
                        <TouchableOpacity key={index} style={styles.treinoContainer} onPress={() => HandleConfirmarAdicionarTreino(dados[0], treino)}>
                            <Text style={{ fontFamily: "Zing.rust" }}>{treino}</Text>
                        </TouchableOpacity>
                    ))}
                    <Text style={{ ...styles.modalText, marginTop: "10%" }}>Ou crie um treino novo</Text>
                    <TextInput style={styles.input} placeholder="Nome do novo treino" value={novoTreino} onChangeText={setNovoTreino}/>

                    <TouchableOpacity style={styles.botoes} onPress={() => HandleConfirmarAdicionarTreino(dados[0], 'Novo Treino')}>
                        <Text style={{ fontFamily: "Zing.rust" }}>Criar Novo Treino</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.botoes} onPress={() => setModalTreinoVisible(false)}>
                        <Text style={{ fontFamily: "Zing.rust" }}>Cancelar</Text>
                    </TouchableOpacity>
                </KeyboardAwareScrollView>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
        backgroundColor: '#fff',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    item: {
        marginBottom: 16,
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    itemTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
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

export default Favoritos;