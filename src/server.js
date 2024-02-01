const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static(__dirname));

const porta = process.env.PORT || 3000;
const keyWeather = process.env.KEY_WEATHER;
const keyOpenai = process.env.OPENAI_API_KEY;


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
})

app.post('/processar-dados', async (req, res) => {
    try{
        const cidade = req.body.cidade;
        const dadosOpenWeatherHoje = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${keyWeather}&lang=pt_br&units=metric`).then( resposta => resposta.json() );
        const dadosOpenWeather5Dias = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cidade}&appid=${keyWeather}&lang=pt_br&units=metric`).then( resposta => resposta.json() );
        res.json({ dadosOpenWeatherHoje, dadosOpenWeather5Dias })
    } catch (erro) {
        console.error('Erro ao processar dados:', erro);
        res.status(500).json({ erro: 'Erro ao processar dados' });
    }
})


app.post('/processar-mensagem', async (req, res) => {
    
    try{
        const conteudoPrompt = req.body.conteudoPrompt;
        const dadosGPT = await fetch("https://api.openai.com/v1/chat/completions", {
    
            method: "POST",
    
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer " + keyOpenai,
            },
    
            body: JSON.stringify({
                model: "gpt-3.5-turbo", //Modelo
                messages: [{ role: "system", content: conteudoPrompt }],
                max_tokens: 256, // Tamanho da resposta
                temperature: 0.8 // Criatividade na resposta
            }),
        })
        const dadosGPTJson = await dadosGPT.json();
        res.json( dadosGPTJson )
    } catch (erro) {
        console.error('Erro ao processar dados:', erro);
        res.status(500).json({ erro: 'Erro ao processar dados' });        
    }

})


app.listen(porta, () => {
    console.log('Servidor iniciado na porta', porta);
})