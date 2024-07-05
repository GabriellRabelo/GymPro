import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, FlatList, Modal } from 'react-native';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc, arrayUnion } from 'firebase/firestore';
import moment from "moment"

const BuscarAlimentos = ({ navigation, route }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [error, setError] = useState('');
    const ApplicationID = "2789eaf4";
    const ApplicationKey = "3f62b14c007ff041778df5d37c7b0a58";
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const dia = route.params.Dia;

    const traducao = async (texto, idiomaOrigem, idiomaDestino) => {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${idiomaOrigem}&tl=${idiomaDestino}&dt=t&q=${encodeURI(texto)}`;
        try {
            const response = await axios.get(url);
            const data = response.data;

            const textoTraduzido = data[0][0][0];
            return textoTraduzido;
        } catch (error) {
            console.error("Erro ao traduzir o texto:", error);
            return null;
        }
    };

    const fetchFoodData = async () => {
        try {
            console.log("Consultando tradução para:", query);
            const queryEn = await traducao(query, 'pt', 'en');
            console.log("Tradução:", queryEn);
            if (!queryEn) {
                setError('Erro ao traduzir o texto. Tente novamente.');
                return;
            }
    
            const edamamResponse = await axios.get('https://api.edamam.com/api/food-database/v2/parser', {
                params: {
                    app_id: ApplicationID,
                    app_key: ApplicationKey,
                    ingr: queryEn
                }
            });
    
            console.log("Resposta da API Edamam:", edamamResponse.data);
            if (edamamResponse.data.hints.length === 0) {
                setError('Nenhum resultado encontrado. Tente outra pesquisa.');
                return;
            }
    
            const parsedResults = await Promise.all(edamamResponse.data.hints.map(async hint => {
                const foodNamePt = await traducao(hint.food.label, 'en', 'pt');
    
                return {
                    foodName: foodNamePt,
                    calories: hint.food.nutrients.ENERC_KCAL ? hint.food.nutrients.ENERC_KCAL.toFixed(1) : "N/A",
                    proteins: hint.food.nutrients.PROCNT ? hint.food.nutrients.PROCNT.toFixed(1) : "N/A",
                    carbs: hint.food.nutrients.CHOCDF ? hint.food.nutrients.CHOCDF.toFixed(1) : "N/A",
                    fats: hint.food.nutrients.FAT ? hint.food.nutrients.FAT.toFixed(1) : "N/A",
                };
            }));
    
            setResults(parsedResults);
            setError('');
        } catch (err) {
            console.error("Erro ao buscar dados:", err);
            setError('Erro ao buscar dados. Tente novamente.');
        }
    };
    

    const handleModalandSave = (item) => {
        setSelectedItem(item);
        setModalVisible(true);
    };

    const saveToFirebase = async (item, refeicao, selectedDate) => {
        try {
            const auth = getAuth();
            const user = auth.currentUser;
            if (user) {
                const userId = user.uid;
                const db = getFirestore();
    
                // Formate a data selecionada no mesmo formato utilizado no Firestore
                const formattedDate = moment(dia).format('YYYY-MM-DD');
    
                const docRef = doc(db, 'Refeicoes', userId);
    
                await setDoc(docRef, {
                        [formattedDate]: {
                        [refeicao]: arrayUnion({ ...item })
                    }
                }, { merge: true });
    
                alert('Adicionado com sucesso!');
                // Limpar estado local após salvar
                setResults([]);
                setQuery('');
                setModalVisible(false);
            }
        } catch (error) {
            console.error('Erro ao adicionar alimento:', error);
        }
    };


    return (
        <View style={styles.container}>
            <Text style={{ textAlign: "center", marginTop: "23%", fontSize: 30 }}>Pesquise Alimentos</Text>
            <Text style={{ textAlign: "center", marginTop: "2%" }}>Pesquise por alimentos ou pratos para os adicionar a sua dieta!</Text>
            <TouchableOpacity style={{ position: "absolute", width: 30, height: 20, marginTop: "12%", marginLeft: "5%" }} onPress={() => navigation.navigate("Dieta")}>
                <Image style={styles.backimg} source={require("../icons/back_arrow.png")}></Image>
            </TouchableOpacity>

            <TextInput
                style={styles.search}
                placeholder="Pesquise"
                value={query}
                onChangeText={setQuery}
                onSubmitEditing={fetchFoodData}
            />

            <TouchableOpacity style={{ marginTop: 20, borderWidth: 1, padding: 10, borderRadius: 15, alignSelf:"center",marginBottom:10 }} onPress={fetchFoodData}>
                <Text>Buscar alimento</Text>
            </TouchableOpacity>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <FlatList
                data={results}
                style={{ width: "100%" }}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.resultItem}>
                        <Text style={styles.foodName}>{item.foodName}</Text>
                        <Text><Text style={styles.resulttext}>Quantidade: </Text>Por 100 gramas ou por unidade</Text>
                        <Text style={{ marginTop: 5, fontSize: 15 }}><Text style={styles.resulttext}>Calorias: </Text>{item.calories}</Text>
                        <Text style={{ marginTop: 5, fontSize: 15 }}><Text style={styles.resulttext}>Proteínas: </Text>{item.proteins} g</Text>
                        <Text style={{ marginTop: 5, fontSize: 15 }}><Text style={styles.resulttext}>Carboidratos: </Text>{item.carbs} g</Text>
                        <Text style={{ marginTop: 5, fontSize: 15 }}><Text style={styles.resulttext}>Gorduras: </Text>{item.fats} g</Text>
                        <TouchableOpacity style={styles.saveButton} onPress={() => handleModalandSave(item)}>
                            <Text>Salvar</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />

            
            <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                <View style={styles.modalView}>

                    <Text style={styles.modalText}>Em qual refeição deseja adicionar esse alimento ?</Text>

                    <TouchableOpacity style={styles.div} onPress={() => saveToFirebase(selectedItem, "Pequeno Almoço")}>
                        <Text style={styles.modalTxt}>Pequeno Almoço</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.div} onPress={() => saveToFirebase(selectedItem, "Almoço")}>
                         <Text style={styles.modalTxt}>Almoço</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.div} onPress={() => saveToFirebase(selectedItem, "Lanche")}>
                        <Text style={styles.modalTxt}>Lanche</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.div} onPress={() => saveToFirebase(selectedItem, "Jantar")}>
                        <Text style={styles.modalTxt}>Jantar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.botoes} onPress={() => setModalVisible(false)}>
                        <Text style={{ fontFamily: "Zing.rust" }}>Fechar</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    div:{
        alignSelf:"center",
        width:"90%",
        borderWidth:1,
        borderRadius:15,
        padding:20,
        marginBottom:20
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 20,
        fontFamily: "Zing.rust"
    },
    modalTxt: {
        textAlign: 'center',
        fontSize: 20,
        fontFamily: "Zing.rust"
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
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
        borderRadius: 10,
    },
    backimg: {
        width: 50,
        height: 50,
    },
    search: {
        alignSelf: "center",
        marginTop: "5%",
        padding: "2%",
        width: "70%",
        borderWidth: 1,
        borderRadius: 20,
    },
    error: {
        color: 'red',
        marginTop: 10,
    },
    resultItem: {
        borderWidth: 1,
        borderRadius: 15,
        padding: 10,
        marginVertical: 5,
        width: '70%',
        alignItems: 'center',
        alignSelf: "center"
    },
    resulttext: {
        fontFamily: "Zing.rust",
        fontSize: 15,
        marginBottom: 10
    },
    foodName: {
        fontFamily: "Zing.rust",
        fontSize: 20,
        marginBottom: 10
    },
    saveButton: {
        marginTop: 10,
        padding: 10,
        borderWidth: 1,
        borderRadius: 15,
        width: "50%",
        alignItems: "center"
    },
});

export default BuscarAlimentos;
