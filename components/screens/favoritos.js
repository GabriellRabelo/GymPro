import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Modal, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useUser } from './usercontext.js';
import { BuscarFavoritos, RemoverFavorito } from '../../services/HandleDataBase.js';

const Favoritos = ({ navigation }) => {
    const { idutilizador } = useUser();
    const [favoritos, setFavoritos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalExercicioIndex, setModalExercicioIndex] = useState(null);

    useEffect(() => {
        const fetchFavoritos = async () => {
            try {
                const DadosFavoritos = await BuscarFavoritos(idutilizador);
                setFavoritos(DadosFavoritos);
            } catch (error) {
                console.error("Erro ao buscar favoritos: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFavoritos();
    });

    const OpenModal = (index) => {
        setModalExercicioIndex(index); // Definir o índice do exercício clicado
    };

    const CloseModal = () => {
        setModalExercicioIndex(null); // Fechar a modal definindo o índice como null
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

    const handleRemoverFavorito = async (Id_Exercicio) => {
        try {
          await RemoverFavorito(idutilizador, Id_Exercicio);
          setFavoritos(favoritos.filter(exercicio => exercicio.Id_Exercicio !== Id_Exercicio));
          alert("Exercicio removido dos favoritos!");
          CloseModal();
        } catch (error) {
          console.error("Erro ao remover favorito: ", error);
        }
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
                        <Text style={{ textAlign: "center", fontSize: 20, fontFamily: "Zing.rust" }}>{favorito.Nome_Exercicio}</Text>
                    </TouchableOpacity>

                    <Modal animationType='slide' transparent={true} visible={modalExercicioIndex === index} onRequestClose={CloseModal}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>{favorito.Nome_Exercicio}</Text>
                            <Text style={{ fontSize: 15, fontFamily: "Zing.rust" }}><Text style={{ fontWeight: "bold" }}>INSTRUÇÃO:</Text> {favorito.Descricao}</Text>
                            <Text style={{ marginTop: "5%", fontSize: 15, fontFamily: "Zing.rust" }}><Text style={{ fontWeight: "bold" }}>Foco Muscular:</Text> {favorito.Foco_Muscular}</Text>
                            <Text style={{ marginTop: "3%", marginBottom: "3%", fontSize: 15, fontFamily: "Zing.rust" }}><Text style={{ fontWeight: "bold" }}>Repetições:</Text> {favorito.Repeticoes}</Text>
                            <Text style={{ fontFamily: "Zing.rust" }}><Text style={{ fontWeight: "bold", fontSize: 15 }}>Series:</Text> {favorito.Series}</Text>

                            <TouchableOpacity style={styles.botoes} onPress={() => handleRemoverFavorito(favorito.Id_Exercicio)}>
                                <Text style={{ fontFamily: "Zing.rust" }}>Remover dos favoritos</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.botoes} onPress={CloseModal}>
                                <Text style={{ fontFamily: "Zing.rust" }}>Adicionar a um treino</Text>
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

export default Favoritos;
