import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, FlatList, Platform, Linking } from 'react-native';
import axios from 'axios';
import qs from 'qs';

const BuscarAlimentos = ({ navigation }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [error, setError] = useState(null);
    const [accessToken, setAccessToken] = useState(null);

    const clientId = '483e0c1710f949f2b706ad016067cc0c';
    const clientSecret = '4bef190cd8fa460ea58459a1b91beaa5';

    useEffect(() => {
        const fetchAccessToken = async () => {
            try {
                const response = await axios.post(
                    'https://oauth.fatsecret.com/connect/token',
                    qs.stringify({
                        grant_type: 'client_credentials',
                        scope: 'basic'
                    }),
                    {
                        auth: {
                            username: clientId,
                            password: clientSecret
                        },
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    }
                );
                setAccessToken(response.data.access_token);
            } catch (error) {
                console.error('Authorization Error:', error);
                setError('Erro ao obter token de acesso. Tente novamente.');
            }
        };
        fetchAccessToken();
    }, []);

    const fetchFoodData = async () => {
        if (!accessToken) {
            setError('Token de acesso não disponível.');
            return;
        }

        try {
            const response = await axios.get('https://platform.fatsecret.com/rest/server.api', {
                params: {
                    method: 'foods.search',
                    search_expression: query,
                    format: 'json'
                },
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            const foods = response.data.foods.food;
            const foodDetails = await Promise.all(foods.map(async food => {
                const detailsResponse = await axios.get('https://platform.fatsecret.com/rest/server.api', {
                    params: {
                        method: 'food.get',
                        food_id: food.food_id,
                        format: 'json'
                    },
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                return detailsResponse.data.food;
            }));

            setResults(foodDetails);
        } catch (error) {
            console.error('Fetch Error:', error);
            setError('Erro ao buscar dados. Tente novamente.');
        }
    };

    const openRedirectUrl = () => {
        if (Platform.OS === 'android' && typeof Linking !== 'undefined') {
            Linking.openURL('com.GymPro://oauthredirect');
        } else {
            console.warn('Linking.openURL not supported or undefined on this platform');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={{ textAlign: "center", marginTop: "15%", fontSize: 30 }}>Pesquise Alimentos</Text>
            <Text style={{ textAlign: "center", marginTop: "2%" }}>Pesquise por alimentos ou pratos para os adicionar a sua dieta!</Text>
            <TouchableOpacity style={{ position: "absolute", width: 30, height: 20, marginTop: "12%", marginLeft: "5%" }} onPress={() => navigation.navigate("Home")}>
                <Image style={styles.backimg} source={require("../icons/back_arrow.png")}></Image>
            </TouchableOpacity>

            <TextInput
                style={styles.search}
                placeholder="Pesquise"
                value={query}
                onChangeText={setQuery}
                onSubmitEditing={fetchFoodData}
            />

            <TouchableOpacity style={{marginTop:20,borderWidth:1,padding:10,borderRadius:15}} onPress={openRedirectUrl}>
                <Text>Abrir aplicativo com redirectUrl</Text>
            </TouchableOpacity>

            {error && <Text style={styles.error}>{error}</Text>}

            <FlatList
                data={results}
                keyExtractor={(item) => item.food_id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.resultItem}>
                        <Text style={styles.foodName}>{item.food_name}</Text>
                        <Text>Calorias: {item.servings.serving[0].calories}</Text>
                        <Text>Proteínas: {item.servings.serving[0].protein}g</Text>
                        <Text>Carboidratos: {item.servings.serving[0].carbohydrate}g</Text>
                        <Text>Gorduras: {item.servings.serving[0].fat}g</Text>
                    </View>
                )}
            />
            
            <StatusBar style="auto" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
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
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        marginVertical: 5,
        width: '90%',
    },
    foodName: {
        fontWeight: 'bold',
    },
});

export default BuscarAlimentos;
