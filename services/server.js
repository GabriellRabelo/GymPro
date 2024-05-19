const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
const port = 3000;
app.use(cors());
app.use(bodyParser.json());

app.post("/api/mostrar-exercicio-selecionado", async (req, res) => {
    try {
        const musculo = req.body.musculo;
        const url = "https://api.api-ninjas.com/v1/exercises?muscle=" + musculo;

        console.log("Funciona o dos exercicios");

        const response = await axios.get(url, {
            headers: {
                "X-Api-Key": "VuGnV8ysXwptdzaQIV2ujA==7pmx8JRwqeEZKMsH",
                "Content-Type": "application/json",
            },
        });
        res.json(response.data);
    } catch (error) {
        console.error("Aconteceu o seguinte erro: ", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});


app.post("/api/calculo-dados-nutricionais",(req,res) =>{ //API para calcular os dados recebidos do front
    try{
        const dadosrecebidos = req.body;
        const dadoscalculados = CalcularDados(dadosrecebidos);
        console.log("Finalmente funciona");
        res.json({ dados:"teste" });
    }
    catch(error){
        console.error("Erro ao calcular dados: ",error);
        res.status(500).json({error: "Erro interno do servidor"})
    }
});


app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor está ouvindo em todas as interfaces de rede na porta ${port}`);
});


const CalcularDados = (dados) =>{
    console.log("Funciona");
};
