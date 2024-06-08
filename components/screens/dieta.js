import { StatusBar } from 'expo-status-bar';
import { useState, useEffect, memo } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { useUser } from './usercontext.js';
import { db } from '../../services/FirebaseConfig.js';
import { getDoc, doc } from 'firebase/firestore';

const Dieta = ({ navigation }) => {
    const { idutilizador } = useUser();
    const [DadosNutricionais, setDadosNutricionais] = useState([]);
    const [Dieta, setDieta] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Buscar dados nutricionais do usuário
                const nutriRef = doc(db, 'Utilizador', idutilizador);
                const nutriSnapshot = await getDoc(nutriRef);

                if (nutriSnapshot.exists()) {
                    const dadosNutri = nutriSnapshot.data();
                    setDadosNutricionais(dadosNutri);
                } else {
                    console.log("Documento de dados nutricionais não encontrado para o usuário");
                }

                // Buscar dados da dieta do usuário
                const dietaRef = doc(db, 'Dieta', idutilizador);
                const dietaSnapshot = await getDoc(dietaRef);

                if (dietaSnapshot.exists()) {
                    const dietaData = dietaSnapshot.data();
                    setDieta(dietaData);
                } else {
                    console.log("Documento de dieta não encontrado para o usuário");
                }
            } catch (error) {
                console.error("Erro ao buscar dados: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [idutilizador]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Carregando...</Text>
            </View>
        );
    };

    return (
        <ScrollView contentContainerStyle={{height:"100%"}}>
            <Text style={{ textAlign: "center", marginTop: "15%", fontSize: 30, fontFamily: "Zing.rust" }}>Dados Nutricionais</Text>
            <TouchableOpacity style={{ position: "absolute", width: 30, height: 20, marginTop: "12%", marginLeft: "5%" }} onPress={() => navigation.navigate("Home")}>
                <Image style={styles.backimg} source={require("../icons/back_arrow.png")}></Image>
            </TouchableOpacity>
            {Dieta && (
    <View style={styles.itemContainer}>
        <Text style={styles.txt}><Text style={{fontFamily: "Zing.rust"}}>Calorias: </Text>{Dieta.Calorias} Gramas diarias</Text>
        <Text style={styles.txt}><Text style={{fontFamily: "Zing.rust"}}>Proteinas: </Text>{Dieta.Proteinas} Gramas diarias</Text>
        <Text style={styles.txt}><Text style={{fontFamily: "Zing.rust"}}>Carboidratos: </Text>{Dieta.Carboidrato} Gramas diarias</Text>
        <Text style={styles.txt}><Text style={{fontFamily: "Zing.rust"}}>Consumo de Agua: </Text>{Dieta.Consumo_Agua} Litros por dia</Text>
        <Text style={styles.txt}><Text style={{fontFamily: "Zing.rust"}}>Gorduras: </Text>{Dieta.Gorduras} Gramas diarias</Text>
        <Text style={styles.txt}><Text style={{fontFamily: "Zing.rust"}}>TMB: </Text>{Dieta.TMB} Gramas diarias</Text>
    </View>
)}

            <Text style={{ textAlign: "center", marginTop: "5%", fontSize: 30, fontFamily: "Zing.rust" }}>Dieta</Text>
            <TouchableOpacity onPress={() => alert("Mostrar Dieta")} style={styles.treino}>
                    <ImageBackground style={styles.backgroundimg} source={require("../imgs/div_semfundo_dieta.png")}>
                        <View>
                            <Text style={{marginTop:"7%",marginLeft:"5%",fontSize:23}}>Minha Dieta</Text>
                            <Text style={{marginLeft:"4%",fontSize:20}}>Veja aqui a{"\n"}Sua dieta</Text>
                        </View>
                    </ImageBackground>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("BuscarAlimentos")} style={styles.treino}>
                    <ImageBackground style={styles.backgroundimg} source={require("../imgs/div_semfundo_dieta.png")}>
                        <View>
                            <Text style={{marginTop:"7%",marginLeft:"5%",fontSize:23}}>Adicionar alimentos</Text>
                            <Text style={{marginLeft:"4%",fontSize:20}}>Adicione alimentos a{"\n"}Sua dieta</Text>
                        </View>
                    </ImageBackground>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    backimg: {
        width: 50,
        height: 50,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemContainer: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        marginHorizontal: 20,
        marginBottom: 10,
    },
    txt:{
        marginTop: "3%", 
        fontSize: 15
    },
    treino:{
        height:"17%",
        width:"85%",
        marginTop:"7%",
        alignSelf:"center",
        borderRadius:15,
        overflow: "hidden", // Para garantir que as bordas não sejam afetadas pela imagem de fundo
        borderWidth:1.5,
        borderColor:"rgba(0,0,0,0.5)",
    },
    backgroundimg:{
        flex:1,
        resizeMode:"cover",
    },
});

export default Dieta;
