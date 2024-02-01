const error404 = document.querySelector('.not_found');
const mainBox = document.querySelector('.main-box');
const boxFive = document.querySelector('.boxFive');
const boxMensagem = document.querySelector('.boxMensagem');
const barraDeBusca = document.querySelector('.search');

function procurarCidade(){
    const cidadeParaConsultar = document.querySelector(".input-city").value;
    const hostname = window.location.hostname;

    fetch(`https://${hostname}/processar-dados`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify({ cidade: cidadeParaConsultar }),
    })
        .then((resposta) => resposta.json())
        .then((dados) => {
            
            barraDeBusca.classList.add('active');
            if(dados.dadosOpenWeatherHoje.cod == '404' || dados.dadosOpenWeatherHoje.cod == '400'){
                mainBox.classList.remove('active');
                boxFive.classList.remove('active');
                boxMensagem.classList.remove('active');
                error404.classList.add('active');
                return;
            }

            mainBox.classList.add('active');
            boxFive.classList.add('active');
            error404.classList.remove('active');
            preencherHTML(dados.dadosOpenWeatherHoje, dados.dadosOpenWeather5Dias)
            console.log('Dados da OpenWeather:', dados.dadosOpenWeatherHoje);
        })
        .catch((erro) => {
            console.error('Erro na solicitação:', erro);
        });
}

function preencherHTML(dadosHoje, dados5dias){
    nomeDiasDaSemana();
    preencherDadosHoje(dadosHoje);
    temperaturas5Dias(dados5dias);
    icone5Dias(dados5dias);
    probChuva5dias(dados5dias);
    gerarMensagem(gerarPrompt(dadosHoje.weather[0].description, dadosHoje.name, dadosHoje.sys.country, dadosHoje.main.feels_like))
}

function preencherDadosHoje(dados){
    document.querySelector("#main__cidade").innerHTML = 'Tempo em:<br>' + dados.name + " " + countryCodesToEmoji(dados.sys.country);
    document.querySelector("#main__temp").innerHTML = (dados.main.temp).toFixed() + "ºC";
    document.querySelector("#main__sens").innerHTML = "Sensação Térmica de " + (dados.main.feels_like).toFixed() + "º";
    document.querySelector("#main__desc").innerHTML = dados.weather[0].description;
    document.querySelector("#main__umidade").innerHTML = "Umidade: " + dados.main.humidity + "%";
    document.querySelector("#img-previsao").src = `/images/${dados.weather[0].icon}.png`;
}

function temperaturas5Dias(dados){
    let min, max;
    let linha = 0;

    dados.list.forEach((element, i) => {
        if(i == 0){
            min = element.main.temp_min;
            max = element.main.temp_max;
        }
        else {
            if( min >  element.main.temp_min)
                min = element.main.temp_min;
            if( max < element.main.temp_max)
                max = element.main.temp_max;
        }

        if( element.dt_txt.split(' ')[1] === "03:00:00"){
            document.querySelectorAll(".temp_five")[linha].textContent = max.toFixed() + "º / " + min.toFixed() + "º";
            min = 200;
            max = -200;
            linha++;
        }
    });
}


function icone5Dias(dados){
    let periodo = [];
    let dias = 0;
    let noites = 0;

    dados.list.forEach( (previa, i) => {
        if(i != 0 && previa.sys.pod != dados.list[i-1].sys.pod){
            //console.log("Icone escolhido: " + escolherIconeDoTempo(periodo) + ", dia " + dias);

            if(dados.list[i-1].sys.pod == 'd' && dias < 5){
                if( Number(escolherIconeDoTempo(periodo)) <= 9){
                    document.querySelectorAll(".diaIcon_five")[dias].src = `/images/0${escolherIconeDoTempo(periodo)}d.png`;
                }
                else{
                    document.querySelectorAll(".diaIcon_five")[dias].src = `/images/${escolherIconeDoTempo(periodo)}d.png`;
                }
                dias++;
            }

            else if(dados.list[i-1].sys.pod == 'n' && noites < 5){
                if( Number(escolherIconeDoTempo(periodo)) <= 9){
                    document.querySelectorAll(".noiteIcon_five")[noites].src = `/images/0${escolherIconeDoTempo(periodo)}n.png`;
                    if(dias == 0){
                        document.querySelectorAll(".diaIcon_five")[dias].src = `/images/0${escolherIconeDoTempo(periodo)}d.png`;
                        dias++
                    }
                }
                else {
                    document.querySelectorAll(".noiteIcon_five")[noites].src = `/images/${escolherIconeDoTempo(periodo)}n.png`;
                    if(dias == 0){
                        document.querySelectorAll(".diaIcon_five")[dias].src = `/images/${escolherIconeDoTempo(periodo)}d.png`;
                        dias++
                    }
                }
                noites++;
            }

            //console.log("Virou o periodo");
            periodo = [];
        }

        periodo.push(parseInt(previa.weather[0].icon));
    })
}

function escolherIconeDoTempo(icones) {
    // Contar a frequência de cada ícone
    const frequencia = icones.reduce((contagem, icone) => {
        contagem[icone] = (contagem[icone] || 0) + 1;
        return contagem;
    }, {});

    // Encontrar o ícone mais frequente
    let maxFreq = 0;
    let iconeEscolhido = '';
    for (const icone in frequencia) {
        if (frequencia[icone] > maxFreq) {
            maxFreq = frequencia[icone];
            iconeEscolhido = icone;
        }
    }

    // Lista de ícones empatados em frequência
    const empatados = Object.keys(frequencia).filter(icone => frequencia[icone] === maxFreq);

    if (empatados.length === 1) {
        // Sem empate, retorna o mais frequente
        return iconeEscolhido;
    } else if (empatados.length === 2) {
        // Empate entre dois, retorna o de menor valor numérico (assumindo que representa condição mais "limpa")
        return Math.min(...empatados.map(Number)).toString();
    } else {
        // Empate entre três ou mais, retorna o do meio
        const empatadosOrdenados = empatados.sort((a, b) => a - b);
        return empatadosOrdenados[Math.floor(empatadosOrdenados.length / 2)];
    }
}

function probChuva5dias(dados){
    let porcentagem = 0;
    let somaMM = 0;
    let dias = 0;

    dados.list.forEach( (previa, i) => {
        porcentagem = previa.pop > porcentagem ? previa.pop : porcentagem;
        if(previa.hasOwnProperty('rain'))
            somaMM += parseFloat(previa.rain['3h']);
        if(i != 0 && previa.dt_txt.split(' ')[1] == "03:00:00"){
            //console.log('Probabilidade de chuva: ' + porcentagem);
            //console.log('Quantidade de chuva: ' + somaMM);
            somaMM = porcentagem > 0.1 && somaMM < 1 ? 1 : somaMM;
            document.querySelectorAll('.chuva_five')[dias].innerHTML = `${Math.round(porcentagem * 100)}%<br>${Math.round(somaMM)}mm`;
            dias++;
            porcentagem = 0;
            somaMM = 0;
        }
    })
}


function nomeDiasDaSemana(){
    const diasDaSemana = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
    let hoje = new Date();
   
    for (let i = 1; i < 5; i++) {
        let indiceDia = (hoje.getDay() + i) % 7;
        document.querySelectorAll(".dia_five")[i].textContent = diasDaSemana[indiceDia];
    }
}


function countryCodesToEmoji(countryCode) {
    // A char code for regional indicator symbol letter A
    const base = 127462 - 'A'.charCodeAt(0);
    
    // Split the country code into two letters and convert them to the corresponding emoji
    return String.fromCodePoint(base + countryCode.charCodeAt(0))
    + String.fromCodePoint(base + countryCode.charCodeAt(1));
}