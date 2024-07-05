import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, SafeAreaView, TouchableWithoutFeedback, Dimensions, Modal } from 'react-native';
import { db } from '../../services/FirebaseConfig.js';
import { getDoc, doc, collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import moment from 'moment';
import Swiper from 'react-native-swiper';

const { width } = Dimensions.get('window');

const Dieta = ({ navigation }) => {
    const [dados, setDados] = useState(null);
    const [refeicoes, setRefeicoes] = useState([]);
    const [selectedRefeicao, setSelectedRefeicao] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const auth = getAuth();
    const swiper = useRef();
    const [value, setValue] = useState(new Date());
    const [week, setWeek] = useState(0);
    const [nutrientesConsumidos, setNutrientesConsumidos] = useState({ calorias: 0, proteinas: 0, carboidratos: 0, gorduras: 0 });
    const [diferencaNutrientes, setDiferencaNutrientes] = useState({ calorias: 0, proteinas: 0, carboidratos: 0, gorduras: 0 });

    const weeks = React.useMemo(() => {
        const start = moment().add(week, 'weeks').startOf('week');
    
        return [-1, 0, 1].map(adj => {
          return Array.from({ length: 7 }).map((_, index) => {
            const date = moment(start).add(adj, 'week').add(index, 'day');
    
            return {
              weekday: date.format('ddd'),
              date: date.toDate(),
            };
          });
        });
      }, [week]);

    const fetchDieta = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
                const userId = user.uid;
                const docRef = doc(db, 'Dieta', userId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    console.log(data);
                    setDados(data);
                }
            }
        } catch (error) {
            console.error('Erro ao buscar dados nutricionais:', error);
        }
    };

    const fetchRefeicoes = async (date) => {
        try {
            const user = auth.currentUser;
            if (user) {
                const userId = user.uid;
                const formattedDate = moment(date).format('YYYY-MM-DD');
                const docRef = doc(db, 'Refeicoes', userId);
    
                const diaSnap = await getDoc(docRef);
                console.log('Dia Snapshot:', diaSnap.exists()); // Verifica se o documento existe
    
                if (diaSnap.exists()) {
                    const diaData = diaSnap.data();
                    console.log('Dia Data:', diaData); // Verifica os dados do documento
    
                    const refeicoesParaData = diaData[formattedDate] || {};
                    const refeicoesArray = Object.keys(refeicoesParaData).map(refeicao => ({
                        nome: refeicao,
                        alimentos: refeicoesParaData[refeicao] // array de alimentos
                    }));
                    console.log('Refeições Array:', refeicoesArray); // Verifica o array de refeições
    
                    setRefeicoes(refeicoesArray);
                } else {
                    console.log('Documento não encontrado para a data:', formattedDate);
                    setRefeicoes([]);
                }
            }
        } catch (error) {
            console.error('Erro ao buscar refeições:', error);
        }
    };
    

    useEffect(() => {
        fetchDieta();
    }, [auth]);

    useEffect(() => {
        fetchRefeicoes(value);
    }, [value, auth]);

    const handleOpenSecondModal = (refeicao) => {
        console.log('Refeição selecionada:', refeicao); // Verifica a refeição selecionada
        setSelectedRefeicao(refeicao);
        setModalVisible(true);
    };

    const calcularTotalNutrientes = (alimentos) => {
        const totais = alimentos.reduce((totais, alimento) => {
            return {
                calorias: totais.calorias + (parseFloat(alimento.calories) || 0),
                proteinas: totais.proteinas + (parseFloat(alimento.proteins) || 0),
                carboidratos: totais.carboidratos + (parseFloat(alimento.carbs) || 0),
                gorduras: totais.gorduras + (parseFloat(alimento.fats) || 0),
            };
        }, { calorias: 0, proteinas: 0, carboidratos: 0, gorduras: 0 });
    
        return {
            calorias: totais.calorias.toFixed(1),
            proteinas: totais.proteinas.toFixed(1),
            carboidratos: totais.carboidratos.toFixed(1),
            gorduras: totais.gorduras.toFixed(1),
        };
    };
    
    useEffect(() => {
        if (selectedRefeicao) {
            const totais = calcularTotalNutrientes(selectedRefeicao.alimentos);
            console.log('Totais de nutrientes:', totais);
        }
    }, [selectedRefeicao]);

    const totais = selectedRefeicao ? calcularTotalNutrientes(selectedRefeicao.alimentos) : { calorias: 0, proteinas: 0, carboidratos: 0, gorduras: 0 };

    const calcularTotalNutrientesDia = (refeicoes) => {
        const totais = refeicoes.reduce((totais, refeicao) => {
            return refeicao.alimentos.reduce((totais, alimento) => {
                return {
                    calorias: totais.calorias + (parseFloat(alimento.calories) || 0),
                    proteinas: totais.proteinas + (parseFloat(alimento.proteins) || 0),
                    carboidratos: totais.carboidratos + (parseFloat(alimento.carbs) || 0),
                    gorduras: totais.gorduras + (parseFloat(alimento.fats) || 0),
                };
            }, totais);
        }, { calorias: 0, proteinas: 0, carboidratos: 0, gorduras: 0 });
        
        return {
            calorias: totais.calorias.toFixed(1),
            proteinas: totais.proteinas.toFixed(1),
            carboidratos: totais.carboidratos.toFixed(1),
            gorduras: totais.gorduras.toFixed(1),
        };
    };

    const calcularDiferencaNutrientes = (dados, consumidos) => {
        return {
            calorias: (dados.Calorias - consumidos.calorias).toFixed(1),
            proteinas: (dados.Proteinas - consumidos.proteinas).toFixed(1),
            carboidratos: (dados.Carboidrato - consumidos.carboidratos).toFixed(1),
            gorduras: (dados.Gorduras - consumidos.gorduras).toFixed(1),
        };
    };

    useEffect(() => {
        if (refeicoes.length > 0) {
            const totaisConsumidos = calcularTotalNutrientesDia(refeicoes);
            setNutrientesConsumidos(totaisConsumidos);
            if (dados) {
                const diferenca = calcularDiferencaNutrientes(dados, totaisConsumidos);
                setDiferencaNutrientes(diferenca);
            }
        }
    }, [refeicoes, dados]);

    return (
        <SafeAreaView style={{flex:1}}>
            <ScrollView contentContainerStyle={{height:"100%"}}>
                <Text style={{ textAlign: "center", marginTop: "5%", fontSize: 30, fontFamily: "Zing.rust" }}>Dados Nutricionais</Text>
                <TouchableOpacity style={{ position: "absolute", width: 30, height: 20, marginTop: "3%", marginLeft: "5%" }} onPress={() => navigation.navigate("Home")}>
                    <Image style={styles.backimg} source={require("../icons/back_arrow.png")}></Image>
                </TouchableOpacity>
                <View style={styles.itemContainer}>
                <Text style={styles.txt}><Text style={{ fontFamily: "Zing.rust" }}>Calorias: </Text>{dados ? `${dados.Calorias} - ${nutrientesConsumidos.calorias} = ${diferencaNutrientes.calorias}` : 'Carregando...'}</Text>
                    <Text style={styles.txt}><Text style={{ fontFamily: "Zing.rust" }}>Proteínas: </Text>{dados ? `${dados.Proteinas} - ${nutrientesConsumidos.proteinas} = ${diferencaNutrientes.proteinas} g` : 'Carregando...'}</Text>
                    <Text style={styles.txt}><Text style={{ fontFamily: "Zing.rust" }}>Carboidratos: </Text>{dados ? `${dados.Carboidrato} - ${nutrientesConsumidos.carboidratos} = ${diferencaNutrientes.carboidratos} g` : 'Carregando...'}</Text>
                    <Text style={styles.txt}><Text style={{ fontFamily: "Zing.rust" }}>Consumo de Água: </Text>{dados ? `${dados.Consumo_Agua} Litros por dia` : 'Carregando...'}</Text>
                    <Text style={styles.txt}><Text style={{ fontFamily: "Zing.rust" }}>Gorduras: </Text>{dados ? `${dados.Gorduras} - ${nutrientesConsumidos.gorduras} = ${diferencaNutrientes.gorduras} g` : 'Carregando...'}</Text>
                    <Text style={styles.txt}><Text style={{ fontFamily: "Zing.rust" }}>TMB: </Text>{dados ? `${dados.TMB} Gramas diarias` : 'Carregando...'}</Text>
                </View>
                <Text style={{ textAlign: "center", marginTop: "1%", fontSize: 30, fontFamily: "Zing.rust" }}>Dieta</Text>

                <View style={styles.picker}>
                    <Swiper index={1} ref={swiper} loop={false} showsPagination={false}
                        onIndexChanged={ind => {
                        if (ind === 1) {
                            return;
                        }
                        setTimeout(() => {
                            const newIndex = ind - 1;
                            const newWeek = week + newIndex;
                            setWeek(newWeek);
                            setValue(moment(value).add(newIndex, 'week').toDate());
                            swiper.current.scrollTo(1, false);
                        }, 100);
                        }}>
                        {weeks.map((dates, index) => (
                        <View style={styles.itemRow} key={index}>
                            {dates.map((item, dateIndex) => {
                            const isActive =
                                value.toDateString() === item.date.toDateString();
                            return (
                                <TouchableWithoutFeedback key={dateIndex} onPress={() => setValue(item.date)}>
                                <View style={[styles.item, isActive && { backgroundColor: '#111', borderColor: '#111' }]}>
                                    <Text style={[styles.itemWeekday, isActive && { color: '#fff' }]}>
                                    {item.weekday}
                                    </Text>
                                    <Text style={[styles.itemDate, isActive && { color: '#fff' }]}>
                                    {item.date.getDate()}
                                    </Text>
                                </View>
                                </TouchableWithoutFeedback>
                            );
                            })}
                        </View>
                        ))}
                    </Swiper>
                </View>

                <View style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 24 }}>
                    <Text style={styles.subtitle}>{value.toDateString()}</Text>

                    <View style={styles.placeholder}>
                        <View style={styles.placeholderInset}>
                        <Text style={{fontFamily: "Zing.rust",fontSize:20,marginBottom:"5%"}}>Suas refeições de hoje:</Text>
                        {refeicoes.length > 0 ? (
                            refeicoes.map((refeicao, index) => (
                            <TouchableOpacity key={index} style={styles.muscleButton} onPress={() => handleOpenSecondModal(refeicao)}>
                                <Text style={{ fontFamily: "Zing.rust", fontSize: 18 }}>{refeicao.nome}</Text>
                            </TouchableOpacity>
                            ))
                        ) : (
                            <Text style={styles.noTreinosText}>Nenhuma refeição para o dia de hoje</Text>
                        )}
                        </View>
                    </View>
                </View>

                <TouchableOpacity onPress={() => navigation.navigate("BuscarAlimentos", {Dia: value.toDateString()})} style={styles.treino}>
                    <Text style={{textAlign:"center",fontSize:23}}>Adicionar alimentos</Text>
                </TouchableOpacity>
            </ScrollView>

    <Modal visible={modalVisible} animationType="slide">
        <ScrollView style={styles.modalView}>
            {selectedRefeicao && (
                <>
                    <Text style={styles.modalTitle}>{selectedRefeicao.nome}</Text>
                    {selectedRefeicao.alimentos && selectedRefeicao.alimentos.length > 0 ? (
                        selectedRefeicao.alimentos.map((alimento, index) => {
                            console.log('Alimento:', alimento); // Log detalhado do alimento
                            return (
                                <View key={index} style={styles.alimentoContainer}>
                                    <Text style={styles.alimentoText}><Text style={{fontFamily:"Zing.rust"}}>Alimento: </Text>{alimento.foodName}</Text>
                                    <View style={{borderWidth:1,width:"100%",borderStyle:"dashed",marginTop:10,marginBottom:10}}></View>
                                    <Text style={styles.alimentoText}><Text style={{fontFamily:"Zing.rust"}}>Calorias: </Text>{alimento.calories}</Text>
                                    <Text style={styles.alimentoText}><Text style={{fontFamily:"Zing.rust"}}>Proteínas: </Text>{alimento.proteins} g</Text>
                                    <Text style={styles.alimentoText}><Text style={{fontFamily:"Zing.rust"}}>Carboidratos: </Text>{alimento.carbs} g</Text>
                                    <Text style={styles.alimentoText}><Text style={{fontFamily:"Zing.rust"}}>Gorduras: </Text>{alimento.fats} g</Text>
                                </View>
                            );
                        })
                        
                    ) : (
                        <Text>Nenhum alimento encontrado para esta refeição.</Text>
                    )}
                </>
            )}

            <View style={styles.soma}>
                <Text style={{textAlign:"center",marginTop:"5%",fontFamily:"Zing.rust",fontSize:25}}>Total de nutrientes</Text>
                <Text style={{marginLeft:"5%",fontSize:20,marginTop:10}}><Text style={{fontFamily:"Zing.rust"}}>Calorias: </Text>{totais.calorias}</Text>
                <Text style={{marginLeft:"5%",fontSize:20,marginTop:10}}><Text style={{fontFamily:"Zing.rust"}}>Proteínas: </Text>{totais.proteinas} g</Text>
                <Text style={{marginLeft:"5%",fontSize:20,marginTop:10}}><Text style={{fontFamily:"Zing.rust"}}>Carboidratos: </Text>{totais.carboidratos} g</Text>
                <Text style={{marginLeft:"5%",fontSize:20,marginTop:10}}><Text style={{fontFamily:"Zing.rust"}}>Gorduras: </Text>{totais.gorduras} g</Text>
            </View>

            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.botoes}>
                <Text>Fechar</Text>
            </TouchableOpacity>
        </ScrollView>
    </Modal>

        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    backimg: {
        width: 50,
        height: 50,
    },
    soma:{
        width:"100%",
        borderTopWidth:2,
        borderStyle:"dashed",
        marginTop:10
    },
    muscleButton:{
        alignSelf:"center",
        marginTop:5,
        borderWidth:1,
        borderRadius:15,
        padding:10
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
        flexDirection:"row",
        flexWrap:"wrap"
    },
    botoes: {
        padding: "5%",
        borderWidth: 1,
        borderRadius: 20,
        marginTop: "5%",
        alignSelf: "center",
        marginBottom:"15%"
    },
    txt:{
        marginTop: "3%", 
        fontSize: 15,
        marginRight:10
    },
    treino:{
        width:"85%",
        marginTop:"7%",
        alignSelf:"center",
        borderRadius:15,
        borderWidth:1.5,
        padding:10,
        marginBottom:20
    },
    backgroundimg:{
        flex:1,
        resizeMode:"cover",
    },
    picker: {
        flex: 1,
        maxHeight: 74,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemRow: {
        width: width,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
    },
    item: {
        flex: 1,
        height: 50,
        marginHorizontal: 4,
        paddingVertical: 6,
        paddingHorizontal: 4,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: '#e3e3e3',
        flexDirection: 'column',
        alignItems: 'center',
    },
    itemWeekday: {
        fontSize: 13,
        fontWeight: '500',
        color: '#737373',
        marginBottom: 4,
    },
    itemDate: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111',
    },
    subtitle: {
        fontSize: 17,
        fontWeight: '600',
        color: '#999999',
        marginBottom: 18,
    },
    placeholder: {
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
        height: 400,
        marginTop: 0,
        padding: 0,
        backgroundColor: 'transparent',
    },
    placeholderInset: {
        borderWidth: 4,
        borderColor: 'rgba(0,0,0,0.3)',
        borderStyle: 'dashed',
        borderRadius: 9,
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
        padding: 16,
    },
    noTreinosText: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
        fontFamily: "Zing.rust",
        marginTop:"25%"
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
    closeButton: {
        alignSelf: 'flex-end',
        marginBottom: 20,
    },
    closeButtonText: {
        fontSize: 18,
        color: 'blue',
    },
    modalTitle: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 30,
        fontFamily: "Zing.rust"
    },
    alimentoContainer: {
        marginBottom: 15,
        alignSelf:"center",
        borderWidth:1,
        borderRadius:15,
        padding:10,
        width:"70%"
    },
    alimentoText: {
        fontSize: 18,
        marginTop:5
    },
});

export default Dieta;
