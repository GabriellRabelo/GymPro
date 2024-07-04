import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Dimensions, TouchableWithoutFeedback, SafeAreaView, View, Text, TouchableOpacity, Modal, ActivityIndicator, Image } from 'react-native';
import moment from 'moment';
import Swiper from 'react-native-swiper';
import "firebase/firestore";
import { db } from '../../services/FirebaseConfig.js';
import { getAuth } from 'firebase/auth';
import { getDoc, doc, updateDoc, setDoc } from 'firebase/firestore';
import { ScrollView } from 'react-native-gesture-handler';

const { width } = Dimensions.get('window');

const Calendario = () => {

  const swiper = useRef();
  const [value, setValue] = useState(new Date());
  const [week, setWeek] = useState(0);
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [secondModalVisible, setSecondModalVisible] = useState(false);
  const [thirdModalVisible, setthirdModalVisible] = useState(false);
  const [infoModalVisible, setinfoModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [musculos, setMusculos] = useState([]);
  const [selectedTreinos, setSelectedTreinos] = useState([]);
  const [dayTreinos, setDayTreinos] = useState([]);
  const [selectedTreino, setSelectedTreino] = useState(null);
  const [exercicios, setExercicios] = useState([]);
  const [selectedExercicio, setSelectedExercicio] = useState(null);


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

  const fetchTreinos = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (user) {
        const userId = user.uid;
        const docRef = doc(db, 'treinos', userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
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

  const fetchDayTreinos = async (date) => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (user) {
        const userId = user.uid;
        const formattedDate = moment(date).format('YYYY-MM-DD');
        const calendarRef = doc(db, 'Calendario', userId);

        const calendarDoc = await getDoc(calendarRef);
        if (calendarDoc.exists()) {
          const calendarData = calendarDoc.data();
          const treinosForDay = calendarData[formattedDate]?.Treinos || [];
          setDayTreinos(treinosForDay);
        } else {
          setDayTreinos([]);
        }
      } else {
        console.error('Usuário não autenticado');
      }
    } catch (error) {
      console.error('Erro ao buscar treinos do dia:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveTreinos = async () => {
    try {
        setLoading(true);
        const user = auth.currentUser;
        if (user) {
            const userId = user.uid;
            const formattedDate = moment(value).format('YYYY-MM-DD');
            const calendarRef = doc(db, 'Calendario', userId);

            const calendarDoc = await getDoc(calendarRef);
            if (calendarDoc.exists()) {
                const calendarData = calendarDoc.data();
                const existingTreinos = calendarData[formattedDate]?.Treinos || [];
                const updatedTreinos = Array.from(new Set([...existingTreinos, ...selectedTreinos]));

                await updateDoc(calendarRef, {
                    [formattedDate]: {
                        Treinos: updatedTreinos
                    }
                });
            } else {
                await setDoc(calendarRef, {
                    [formattedDate]: {
                        Treinos: selectedTreinos
                    }
                });
            }

            setModalVisible(false);
            setSelectedTreinos([]);
            fetchDayTreinos(value);  // Fetch the updated list of treinos for the day
        } else {
            console.error('Usuário não autenticado');
        }
    } catch (error) {
        console.error('Erro ao salvar Treinos:', error);
    } finally {
        setLoading(false);
    }
};


  const removeTreino = async (treinoToRemove) => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (user) {
        const userId = user.uid;
        const formattedDate = moment(value).format('YYYY-MM-DD');
        const calendarRef = doc(db, 'Calendario', userId);
  
        const calendarDoc = await getDoc(calendarRef);
        if (calendarDoc.exists()) {
          const calendarData = calendarDoc.data();
          const existingTreinos = calendarData[formattedDate]?.Treinos || [];
  
          // Remove the selected treino from the list
          const updatedTreinos = existingTreinos.filter(treino => treino !== treinoToRemove);
  
          await updateDoc(calendarRef, {
            [formattedDate]: {
              Treinos: updatedTreinos
            }
          });
  
          fetchDayTreinos(value);  // Fetch the updated list of treinos for the day
          setSecondModalVisible(false);
        } else {
          console.error('Documento do calendário não encontrado');
        }
      } else {
        console.error('Usuário não autenticado');
      }
    } catch (error) {
      console.error('Erro ao remover treino:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyLastWeekWorkouts = async () => {
    try {
      setLoading(true);
      const user = auth.currentUser;
      if (user) {
        const userId = user.uid;
        const lastWeekStart = moment(value).subtract(1, 'week').startOf('week');
        const currentWeekStart = moment(value).startOf('week');
        const calendarRef = doc(db, 'Calendario', userId);
  
        const calendarDoc = await getDoc(calendarRef);
        if (calendarDoc.exists()) {
          const calendarData = calendarDoc.data();
  
          for (let i = 0; i < 7; i++) {
            const lastWeekDate = moment(lastWeekStart).add(i, 'days').format('YYYY-MM-DD');
            const currentWeekDate = moment(currentWeekStart).add(i, 'days').format('YYYY-MM-DD');
            const treinosForLastWeekDate = calendarData[lastWeekDate]?.Treinos || [];
            
            // Só copia se houver treinos no dia da semana passada
            if (treinosForLastWeekDate.length > 0) {
              await updateDoc(calendarRef, {
                [currentWeekDate]: {
                  Treinos: treinosForLastWeekDate
                }
              });
            }
          }
  
          fetchDayTreinos(value);  // Atualiza os treinos do dia atual
        } else {
          console.error('Documento do calendário não encontrado');
        }
      } else {
        console.error('Usuário não autenticado');
      }
    } catch (error) {
      console.error('Erro ao copiar treinos da semana anterior:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTreinos();
  }, []);

  useEffect(() => {
    fetchDayTreinos(value);
  }, [value]);

  const handleSelectTreino = (treino) => {
    setSelectedTreinos(prevState => {
      if (prevState.includes(treino)) {
        return prevState.filter(item => item !== treino);
      } else {
        return [...prevState, treino];
      }
    });
  };

  const handleOpenSecondModal = (treino) => {
    setSelectedTreino(treino);
    setSecondModalVisible(true);
    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;
      const docRef = doc(db, 'treinos', userId);
      getDoc(docRef).then(docSnap => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setExercicios(data[treino]);
          setSelectedMuscle(treino);
        }
      }).catch(error => {
        console.error('Erro ao buscar exercícios:', error);
      });
    }
  };

  const handleOpenThirdModal = (exercicio) => {
    setSelectedExercicio(exercicio);
    setthirdModalVisible(true);
  };

  const handleOpeninfoModal = () => {
    setinfoModalVisible(true);
  };

  const AddTreinos = () => {
    setModalVisible(true);
    fetchTreinos();
  }
  
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={{ alignSelf: "center", marginTop: "5%", fontSize: 30, fontFamily: "Zing.rust" }}>Calendário</Text>
        </View>

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
                      <View style={[styles.item, isActive && { backgroundColor: '#111', borderColor: '#111', }]}>
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
          <TouchableOpacity onPress={() => copyLastWeekWorkouts()} style={{marginLeft:"90%",marginTop:"-11%",marginBottom:"3%"}}>
            <Image style={{width:30,height:30}} source={require("../icons/Copy.png")}></Image>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleOpeninfoModal()} style={{marginLeft:"75%",marginTop:"-11%",marginBottom:"3%",width:"10%"}}>
            <Image style={{width:30,height:30}} source={require("../icons/info.png")}></Image>
          </TouchableOpacity>
          <View style={styles.placeholder}>
            <View style={styles.placeholderInset}>
              <Text style={{fontFamily: "Zing.rust",fontSize:20,marginBottom:"5%"}}>Seu treino para este dia:</Text>
              {dayTreinos.length > 0 ? (
                dayTreinos.map((treino, index) => (
                  <TouchableOpacity key={index} style={styles.muscleButton} onPress={() => handleOpenSecondModal(treino)}>
                    <Text style={{ fontFamily: "Zing.rust", fontSize: 18 }}>{treino}</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.noTreinosText}>Nenhum treino para este dia</Text>
              )}
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity onPress={() => AddTreinos()}>
            <View style={styles.btn}>
              <Text style={styles.btnText}>Adicionar Treino</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <ScrollView style={styles.modalView}>
          <Text style={styles.modalTitle}>Qual treino deseja adicionar neste dia?</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            musculos.length > 0 ? (
              musculos.map((musculo, index) => (
                <TouchableOpacity
                  key={index} style={[ styles.muscleButton,
                    selectedTreinos.includes(musculo) && { backgroundColor: '#ddd' }
                  ]}
                  onPress={() => handleSelectTreino(musculo)}
                >
                  <Text style={{ fontFamily: "Zing.rust", fontSize: 18 }}>{musculo}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text>Nenhum treino encontrado.</Text>
            )
          )}
          <TouchableOpacity style={{...styles.modalButton, marginTop:"5%"}} onPress={saveTreinos}>
            <Text style={styles.modalButtonText}>Salvar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{...styles.modalButton, marginBottom:"20%"}} onPress={() => setModalVisible(false)}>
            <Text style={styles.modalButtonText}>Fechar</Text>
          </TouchableOpacity>

        </ScrollView>
      </Modal>

      <Modal animationType="slide" transparent={true} visible={secondModalVisible} onRequestClose={() => setSecondModalVisible(false)}>
        <ScrollView style={styles.modalView}>
          <Text style={styles.modalTitle}>Detalhes do Treino</Text>
            {exercicios.map((exercicio, index) => {
              return (
                <View key={index}>
                  <TouchableOpacity style={styles.treinoContainer} onPress={() => handleOpenThirdModal(exercicio)}>
                    <Text style={styles.treinoTitle}>{exercicio.Nome_Exercicio}</Text>
                    <Text style={{marginTop: 5}}><Text style={styles.txts}>Foco Muscular: </Text>{exercicio.Foco_Muscular}</Text>
                    <Text style={{marginTop: 5}}><Text style={styles.txts}>Séries: </Text>{exercicio.Series}</Text>
                    <Text style={{marginTop: 5}}><Text style={styles.txts}>Repetições: </Text>{exercicio.Repeticoes}</Text>
                    <Text style={{marginTop: 5}}><Text style={styles.txts}>Descrição: </Text>{exercicio.Descricao}</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
            <Modal animationType="slide" transparent={true} visible={thirdModalVisible} onRequestClose={() => setthirdModalVisible(false)}>
              <View style={styles.modalView}>
                {selectedExercicio && (
                  <>
                    <Text style={styles.modalText}>{selectedExercicio.Nome_Exercicio}</Text>
                    <Image style={{ width: "100%", height: "30%", resizeMode: "contain" }} source={getImageSource(selectedExercicio.Nome_Exercicio)}/>
                    <Text style={{marginTop:10}}><Text style={styles.txts}>INSTRUÇÃO: </Text>{selectedExercicio.Descricao}</Text>
                    <Text style={{marginTop:10}}><Text style={styles.txts}>Foco Muscular: </Text>{selectedExercicio.Foco_Muscular}</Text>
                    <Text style={{marginTop:10}}><Text style={styles.txts}>Repetições:</Text> {selectedExercicio.Repeticoes}</Text>
                    <Text style={{marginTop:10}}><Text style={styles.txts}>Series:</Text> {selectedExercicio.Series}</Text>
                  </>
                )}
                <TouchableOpacity style={styles.modalButton} onPress={() => setthirdModalVisible(false)}>
                  <Text style={{ fontFamily: "Zing.rust", color:"white" }}>Fechar</Text>
                </TouchableOpacity>
              </View>
            </Modal>

            <TouchableOpacity style={{...styles.modalButton}} onPress={() => setSecondModalVisible(false)}>
              <Text style={styles.modalButtonText}>Fechar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{...styles.modalButton,marginBottom:"30%"}} onPress={() => removeTreino(selectedTreino)}>
              <Text style={{ fontFamily: "Zing.rust", color:"white" }}>Remover treino deste dia</Text>
            </TouchableOpacity>
        </ScrollView>

      </Modal>

      <Modal animationType="slide" transparent={true} visible={infoModalVisible} onRequestClose={() => setinfoModalVisible(false)}>
          <ScrollView style={styles.modalView}>
            <View>
              <Text style={{ textAlign: "center", marginTop: "5%", fontSize: 30, fontFamily: "Zing.rust" }}>Informações importantes</Text>
              <Text style={styles.infotext}>Antes de criar seu próprio plano de treino, recomendamos fortemente que você consulte um profissional de educação física. Ele está capacitado para avaliar suas necessidades individuais e criar um plano de treino seguro e eficaz, adequado aos seus objetivos e condições físicas.</Text>
              <View style={styles.infodivider}></View>
            </View>
            
            <View>
              <Text style={{ textAlign: "center", marginTop: "5%", fontSize: 30, fontFamily: "Zing.rust" }}>Dicas para seu plano de treino</Text>
              <Text style={styles.infotext}>Se você decidir criar seu próprio plano de treino, considere as seguintes dicas para garantir segurança e eficácia:</Text>
              <Text style={styles.infotext}><Text style={{fontWeight:"bold"}}>1- Avalie a sua condição física atual:</Text> Conheça seus limites e capacidades. Se você tiver qualquer condição médica ou lesão, consulte um médico antes de iniciar.</Text>
              <Text style={styles.infotext}><Text style={{fontWeight:"bold"}}>2- Defina Seus Objetivos:</Text> Seja específico sobre o que deseja alcançar (ganho de massa muscular, perda de peso, perda de peso, etc.).</Text>
              <Text style={styles.infotext}><Text style={{fontWeight:"bold"}}>3- Escolha Exercícios Balanceados:</Text> Inclua exercícios que trabalhem todos os grupos musculares principais (pernas, costas, peito, ombros, braços e abdômen).</Text>
              <Text style={styles.infotext}><Text style={{fontWeight:"bold"}}>4- Comece Devagar:</Text> Inicie com cargas leves e aumente gradualmente à medida que sua força e resistência melhorarem.</Text>
              <Text style={styles.infotext}><Text style={{fontWeight:"bold"}}>5- Estabeleça uma Rotina:</Text> Planeje sessões de treino de 3 a 4 vezes por semana, permitindo dias de descanso para recuperação muscular.</Text>
              <Text style={styles.infotext}><Text style={{fontWeight:"bold"}}>6- Aqueça e Alongue:</Text> Sempre comece com um aquecimento de 5 a 10 minutos e termine com alongamentos para prevenir lesões.</Text>
              <Text style={styles.infotext}><Text style={{fontWeight:"bold"}}>7- Monitore Seu Progresso:</Text> Registre seus treinos e ajuste seu plano conforme necessário.</Text>
              <View style={styles.infodivider}></View>
            </View>

            <View>
              <Text style={{ textAlign: "center", marginTop: "5%", fontSize: 30, fontFamily: "Zing.rust" }}>Planos de Treino Recomendados para Iniciantes</Text>
              <Text style={styles.infotext}><Text style={{fontWeight:"bold"}}>Full-Body (Corpo inteiro): </Text>Treinar o corpo inteiro em uma única sessão é excelente para iniciantes. Aqui está um exemplo:</Text>
              <Text style={styles.infotext}><Text style={{fontWeight:"bold"}}>Frequência:</Text> 3 vezes por semana (ex.: segunda, quarta e sexta)</Text>
              <Text style={styles.infotext}><Text style={{fontWeight:"bold"}}>Aquecimento:</Text> 5-10 minutos de cardio leve (caminhada rápida, corrida leve)</Text>
              <Text style={styles.infotext}><Text style={{fontWeight:"bold"}}>Agachamento com Peso Corporal:</Text> 3 séries de 12 repetições</Text>
              <Text style={styles.infotext}><Text style={{fontWeight:"bold"}}>Supino com Halteres:</Text> 3 séries de 12 repetições</Text>
              <Text style={styles.infotext}><Text style={{fontWeight:"bold"}}>Remada Curvada com Halteres:</Text> 3 séries de 12 repetições</Text>
              <Text style={styles.infotext}><Text style={{fontWeight:"bold"}}>Desenvolvimento de Ombros com Halteres:</Text> 3 séries de 12 repetições</Text>
              <Text style={styles.infotext}><Text style={{fontWeight:"bold"}}>Rosca Bíceps com Halteres:</Text> 3 séries de 12 repetições</Text>
              <Text style={styles.infotext}><Text style={{fontWeight:"bold"}}>Tríceps Testa com Halteres:</Text> 3 séries de 12 repetições</Text>
              <Text style={styles.infotext}><Text style={{fontWeight:"bold"}}>Prancha Abdominal:</Text> 3 séries de 30 segundos</Text>
              <Text style={styles.infotext}><Text style={{fontWeight:"bold"}}>Alongamento:</Text> 5-10 minutos</Text>
              <View style={styles.infodivider}></View>
            </View>

            <View>
              <Text style={styles.infotext}><Text style={{fontWeight:"bold"}}>Treino Dividido (Split Routine): </Text>Para aqueles que preferem focar em grupos musculares específicos em dias diferentes:</Text>
              <Text style={styles.infotext}><Text style={{fontWeight:"bold"}}>Frequência:</Text> 4 vezes por semana (ex.: segunda, terça, quinta e sexta)</Text>
              <Text style={{...styles.infotext,textAlign:"left"}}><Text style={{fontWeight:"bold"}}>Segunda-feira:</Text> Peito e Tríceps</Text>
              <Text style={{...styles.infotext,textAlign:"left"}}><Text style={{fontWeight:"bold"}}>Terça-feira:</Text> Costas e Bíceps</Text>
              <Text style={{...styles.infotext,textAlign:"left"}}><Text style={{fontWeight:"bold"}}>Quinta-feira:</Text> Pernas</Text>
              <Text style={{...styles.infotext,textAlign:"left"}}><Text style={{fontWeight:"bold"}}>Sexta-feira:</Text>  Ombros e Abdômen</Text>
              <View style={styles.infodivider}></View>
            </View>

            <View>
              <Text style={{ textAlign: "center", marginTop: "5%", fontSize: 30, fontFamily: "Zing.rust" }}>Conclusão</Text>
              <Text style={styles.infotext}>Criar um plano de treino adequado requer atenção aos detalhes e conhecimento das próprias limitações. Por isso, buscar orientação de um profissional de educação física é sempre a melhor opção para garantir que você atinja seus objetivos de maneira segura e eficaz.</Text>
            </View>
            <TouchableOpacity style={{...styles.modalButton, marginBottom:"30%"}} onPress={() => setinfoModalVisible(false)}>
              <Text style={{ fontFamily: "Zing.rust", color:"white" }}>Fechar</Text>
            </TouchableOpacity>
          </ScrollView>
        </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 24,
  },
  header: {
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1d1d1d',
    marginBottom: 12,
  },
  picker: {
    flex: 1,
    maxHeight: 74,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#999999',
    marginBottom: 12,
  },
  footer: {
    marginTop: 'auto',
    paddingHorizontal: 16,
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
  itemRow: {
    width: width,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
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
    borderColor: '#e5e7eb',
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
    marginTop:"50%"
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: 'black',
  },
  btnText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
    color: '#fff',
    fontFamily: "Zing.rust"
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 24,
    marginBottom: 10,
    alignSelf: "center",
    fontFamily: "Zing.rust"
  },
  modalButton: {
    padding: "5%",
    borderWidth: 1,
    borderRadius: 20,
    marginTop: "2%",
    alignSelf: "center",
    backgroundColor: "black",
  },
  modalButtonText: {
    color: 'white',
    fontSize: 18,
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
  muscleButton: {
    width: "90%",
    minHeight: 60,
    padding: "6%",
    marginTop: "8%",
    alignSelf: "center",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.7)",
    alignItems: "center"
  },
  treinoContainer: {
    marginVertical: 10,
    padding: 10,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 15,
    alignSelf:"center",
    width:"90%"
  },
  treinoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  txts:{
    fontFamily: "Zing.rust",
    fontSize:15,
},
modalText: {
  marginBottom: 15,
  textAlign: 'center',
  fontSize: 20,
  fontFamily: "Zing.rust"
},

infotext:{
  textAlign:"center",
  marginTop:"3%",
  fontSize:15
},
infodivider:{
  backgroundColor:"black",
  height:0.5,
  width:"100%",
  marginTop:"3%"
}
});

export default Calendario;