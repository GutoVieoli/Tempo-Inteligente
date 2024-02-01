const gerarPrompt = (tempo, cidade, pais, temperatura) => {
  const options = { weekday: 'long', month: 'short', day: 'numeric'};
  const data = new Date().toLocaleString('pt-BR', options);
  const hora = new Date().getHours();
  const conteudo = "Hoje é " + data + " às " + hora + "h de um dia que está " + tempo + " na regiao de " + cidade + " " + pais + ", fazendo " + temperatura + " graus celsius, crie uma mensagem personalizada sobre o tempo, considerando a epoca do ano, dia da semana e Tempo, Costumes, comida e natureza da cidade. A mensagem deve ser muito bem resumida e breve, de apenas um parágrafo e em portugues";

  return conteudo;
}


function gerarMensagem(conteudoPrompt){

    const hostname = window.location.hostname;
    fetch(`https://${hostname}/processar-mensagem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify({ conteudoPrompt: conteudoPrompt }),
    })
        // Acessa o then quando obtiver resposta
        .then((resposta) => resposta.json())
        .then((dados) => {
            console.log(dados);
            document.getElementById("mensagemPersonalizada").textContent = dados.choices[0].message.content;
            boxMensagem.classList.add('active');
        })
        // Retorna catch quando gerar erro
        .catch(() => {
            // Enviar o texto da resposta para a página HTML
            console.log( "Sem resposta" );
            boxMensagem.classList.remove('active');
        });

}




