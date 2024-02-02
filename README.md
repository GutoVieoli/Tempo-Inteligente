# 🌦️ Tempo Inteligente WebService

Bem-vindo ao **Tempo Inteligente**! 🚀 Este é um aplicativo web de previsão do tempo que leva a experiência a um novo patamar. Desenvolvido com ❤️ em JavaScript puro, utilizando o poderoso Express.js para criar uma API REST robusta, nossa aplicação é hospedada em um plano gratuito pela On Render.

O servidor estará acessível em [https://tempo-tech-ea0w.onrender.com](https://tempo-tech-ea0w.onrender.com).

## Como Funciona 🤖

### Frontend

O frontend, construído em JavaScript, HTML e CSS traz uma interface interativa e intuitiva para visualizar a previsão do tempo. Utilizando a API da OpenWeatherMap, os resultados são processados e selecionados cuidadosamente para apresentar informações claras e úteis. E não é só isso! A aplicação também utiliza a mágica da API da OpenAI para trazer mensagens personalizadas e envolventes para o tempo em sua região, tornando cada visita única. 🌟

### Backend

O coração da operação reside no backend, construído com Node.js e o framework Express. Este backend não só gerencia as chamadas à API da OpenWeatherMap como também processa e seleciona os dados, garantindo uma experiência eficiente e personalizada. A API da OpenAI é incorporada para adicionar um toque de magia, gerando mensagens criativas com base nas condições meteorológicas, cultura, natureza e costumes da região pesquisada pelo usuário. 🧙

## Como Iniciar 🚦

1. Clone este repositório:

   ```bash
   git clone https://github.com/GutoVieoli/Tempo-Inteligente.git
   cd Tempo-Inteligente
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:

   Crie um arquivo `.env` na raiz do projeto e adicione as seguintes variáveis:

   ```plaintext
   OPENWEATHER_API_KEY=your_openweather_api_key
   OPENAI_API_KEY=your_openai_api_key
   ```

   Substitua `your_openweather_api_key` e `your_openai_api_key` pelos seus respectivos valores.

4. Inicie o servidor:

   ```bash
   npm run start
   ```



Sinta-se à vontade para explorar, contribuir e personalizar com toda a liberdade! 🎉