const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 3000;
app.use(cors());
app.use(bodyParser.json());

app.post("/api/calculo-dados-nutricionais",(req,res) =>{ //API para calcular os dados recebidos do front
    try{
        const dadosrecebidos = req.body;
        const dadoscalculados = CalcularDados(dadosrecebidos);
        console.log("Finalmente funciona");
        //Enviar resposta devolta ao cliente
        res.json({ dados:"teste" });
    }
    catch(error){
        console.error("Erro ao calcular dados: ",error);
        res.status(500).json({error: "Erro interno do servidor"})
    }
});

app.listen(port, () => {
    console.log(`Servidor está ouvindo na porta ${port}`);
});

const CalcularDados = (dados) =>{
    console.log("Funciona");
};
