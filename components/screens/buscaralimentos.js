import { StatusBar } from 'expo-status-bar';
import { useState , useEffect , memo } from 'react';
import { StyleSheet, Text, View , Image,TextInput , TouchableOpacity } from 'react-native';
import {useFonts} from "expo-font";
import { useUser } from './usercontext.js';
import { searchFood } from './ApiAlimentos.js';

const BuscarAlimentos = () =>{

    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [selectedFood, setSelectedFood] = useState(null);

    /*
    useEffect(() => {
        if (query.length > 2) {
            const fetchData = async () => {
                try {
                    const data = await searchFood(query);
                    setResults(data.foods.food);
                } catch (error) {
                    console.error('Erro ao buscar alimentos:', error);
                }
            };

            fetchData();
        } else {
            setResults([]);
        }
    }, [query]);

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => setSelectedFood(item)}>
            <Text style={styles.resultItem}>{item.food_name}</Text>
        </TouchableOpacity>
    );
    */

    return(
        <View>
            <Text style={{ textAlign: "center", marginTop: "15%", fontSize: 30, fontFamily: "Zing.rust" }}>Pesquise Alimentos</Text>
            <Text style={{textAlign:"center",marginTop:"2%",fontFamily:"Zing.rust"}}>Pesquise por alimentos ou pratos para os adicionar a sua dieta!</Text>
            <TouchableOpacity style={{ position: "absolute", width: 30, height: 20, marginTop: "12%", marginLeft: "5%" }} onPress={() => navigation.navigate("Home")}>
                <Image style={styles.backimg} source={require("../icons/back_arrow.png")}></Image>
            </TouchableOpacity>

            <TextInput style={styles.search}>
                <Text>Pesquise</Text>
            </TextInput>
        </View>
    );
};

const styles = StyleSheet.create({
    backimg: {
        width: 50,
        height: 50,
    },
    search:{
        alignSelf:"center",
        marginTop:"5%",
        padding:"2%",
        width:"70%",
        borderWidth:1,
        borderRadius:20,
    }
});

export default BuscarAlimentos;