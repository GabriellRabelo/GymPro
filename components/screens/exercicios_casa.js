import { useState } from 'react';
import { StyleSheet, Text, View, Image,TouchableOpacity, Dimensions, Platform } from 'react-native';
import { useFonts } from "expo-font";
import "firebase/firestore";


const { width, height } = Dimensions.get('window');

const Exercicios = ({ navigation }) => {
  const [ShowBack, setShowBack] = useState(true);

  const [fontsLoaded] = useFonts({
    "Zing.rust": require("../../assets/fonts/zing.rust-demo-base.otf")
  });

  if (!fontsLoaded) {
    return undefined;
  }

  const handleBuscarExercicios = (musculo) => {
    navigation.navigate("Exercicio_Casa", { musculo: musculo });
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Exercícios em casa</Text>
      </View>
      <View style={styles.bodyContainer}>
        <Image style={styles.bodyImg} source={require("../imgs/Home_Body_Front.png")}/>
        <View style={styles.overlay}>
          {ShowBack ? (
            <View style={styles.musclesContainer}>
              {musclesFront.map((muscle, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.muscleButton, muscle.style]}
                  onPress={() => handleBuscarExercicios(muscle.name)}
                >
                  <Text style={styles.txt}>{muscle.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.musclesContainer}>
              {musclesBack.map((muscle, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.muscleButton, muscle.style]}
                  onPress={() => handleBuscarExercicios(muscle.name)}
                >
                  <Text style={styles.txt}>{muscle.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          <TouchableOpacity style={styles.toggleButtonCasa} onPress={() => navigation.navigate("Exercicios")}>
            <Image style={{...styles.toggleImage,alignSelf:"center"}} source={require("../icons/gym.png")} />
            <Text style={styles.toggleText}>Exercício no ginasio</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const musclesFront = [
  { name: 'Peito', label: 'Peito', style: { top: '14%', left: '66%' } },
  { name: 'Abdomen', label: 'Abdômen', style: { top: '27%', left: '68%' } },
  { name: 'Cardio', label: 'Cardio', style: { top: '60%', left: '75%' } },
  { name: 'Gemeos', label: 'Gêmeos', style: { top: '63%', left: '20%',width:"17%" } },
  { name: 'Quadríceps', label: 'Pernas', style: { top: '48%', left: '15%',width:"18%" } },
  { name: 'Triceps', label: 'Tríceps', style: { top: '24%', left: '17%' } },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: '20%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    marginTop: '9%',
    marginLeft: '7%',
    fontSize: 30,
    fontFamily: 'Zing.rust',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '5%',
  },
  img: {
    width: 30,
    height: 30,
    position: 'absolute',
    right: '10%',
  },
  bodyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bodyImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    marginBottom:"20%"
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  musclesContainer: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  muscleButton: {
    position: 'absolute',
    width: '15%',
  },
  txt: {
    fontFamily: "Zing.rust",
    fontSize: 15,
    textAlign: 'center',
  },
  toggleButtonCasa: {
    position: 'absolute',
    width: '25%',
    height: '5%',
    bottom: Platform.OS === 'ios' ? '5%' : '10%',
    left: '40%',
    textAlign:"center",
    justifyContent: 'center',
  },
  toggleImage: {
    width: 30,
    height: 30,
  },
  toggleText: {
    fontSize: 15,
    fontFamily: "Zing.rust",
    marginTop: 6,
  },
});

export default Exercicios;
