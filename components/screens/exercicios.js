import { useState } from 'react';
import { StyleSheet, Text, View, Image,TouchableOpacity, Dimensions, Platform } from 'react-native';
import { useFonts } from "expo-font";
import "firebase/firestore";
const { width, height } = Dimensions.get('window');

const ExerciciosCasa = ({ navigation }) => {
  const [ShowBack, setShowBack] = useState(true);

  const [fontsLoaded] = useFonts({
    "Zing.rust": require("../../assets/fonts/zing.rust-demo-base.otf")
  });

  if (!fontsLoaded) {
    return undefined;
  }

  const ToggleImg = () => {
    setShowBack(!ShowBack);
  }

  const handleBuscarExercicios = (musculo) => {
    navigation.navigate("Exercicio", { musculo: musculo });
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Exercícios</Text>
      </View>
      <View style={styles.bodyContainer}>
        <Image style={styles.bodyImg} source={ShowBack ? require("../imgs/Body_Front.png") : require("../imgs/Body_Back.png")}/>
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
          <TouchableOpacity style={styles.toggleButton} onPress={ToggleImg}>
            <Image style={styles.toggleImage} source={require("../icons/Girar.png")} />
            <Text style={styles.toggleText}>Girar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toggleButtonCasa} onPress={() => navigation.navigate("ExerciciosCasa")}>
            <Image style={{...styles.toggleImage,alignSelf:"center"}} source={require("../icons/casa_workout.png")} />
            <Text style={styles.toggleText}>Treinos em casa</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const musclesFront = [
  { name: 'Peito', label: 'Peito', style: { top: '13%', left: '66%' } },
  { name: 'Abdomen', label: 'Abdômen', style: { top: '26%', left: '68%' } },
  { name: 'Antebraço', label: 'Antebraço', style: { top: '32%', left: '68%',width:"18%" } },
  { name: 'Adutores', label: 'Adutores', style: { top: '44%', left: '72%' } },
  { name: 'Cardio', label: 'Cardio', style: { top: '59%', left: '75%' } },
  { name: 'Abdutores', label: 'Abdutores', style: { top: '39%', left: '13%',width:"17%" } },
  { name: 'Quadríceps', label: 'Quadríceps', style: { top: '47%', left: '15%',width:"18%" } },
  { name: 'Oblíquos', label: 'Oblíquos', style: { top: '32%', left: '15%' } },
  { name: 'Bíceps', label: 'Bíceps', style: { top: '23%', left: '17%' } },
  { name: 'Ombros', label: 'Ombros', style: { top: '11%', left: '17%' } },
];

const musclesBack = [
  { name: 'Trapezio', label: 'Trapézio', style: { top: '21%', left: '64%' } },
  { name: 'Costas', label: 'Costas', style: { top: '30%', left: '66%' } },
  { name: 'Isquiotibiais', label: 'Isquiotibiais', style: { top: '50%', left: '65%', width:"21%" } },
  { name: 'Cardio', label: 'Cardio', style: { top: '56%', left: '66%' } },
  { name: 'Gemeos', label: 'Gêmeos', style: { top: '52%', left: '20%' } },
  { name: 'Gluteos', label: 'Glúteos', style: { top: '44%', left: '19%' } },
  { name: 'Lombar', label: 'Lombar', style: { top: '31%', left: '19%' } },
  { name: 'Triceps', label: 'Tríceps', style: { top: '20%', left: '20%' } },
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
  toggleButton: {
    position: 'absolute',
    width: '20%',
    height: '5%',
    bottom: Platform.OS === 'ios' ? '5%' : '10%',
    left: '40%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleButtonCasa: {
    position: 'absolute',
    width: '20%',
    height: '5%',
    bottom: Platform.OS === 'ios' ? '5%' : '10%',
    left: '10%',
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

export default ExerciciosCasa;
