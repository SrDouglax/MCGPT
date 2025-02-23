# MCGPT

Este projeto integra o ChatGPT dentro de um servidor BDS (Bedrock Dedicated Server) do Minecraft. A cada mensagem enviada no chat do jogo, o ChatGPT responde automaticamente. O projeto é composto por dois servidores: um backend que gerencia as requisições ao ChatGPT e o servidor BDS que executa o jogo Minecraft.

## Requisitos

- [Node.js](https://nodejs.org/) (versão 16 ou superior)
- [npm](https://www.npmjs.com/) (gerenciador de pacotes do Node.js)
- [Git](https://git-scm.com/) (para clonar o repositório)
- Uma conta na [OpenAI](https://platform.openai.com/) para obter a chave da API

## Instalação

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/SrDouglax/MCGPT.git
   cd MCGPT
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

## Configuração

1. **Crie o arquivo `.env`:**
   - Copie o arquivo de exemplo fornecido:
     ```bash
     cp .env.example .env
     ```
   - Abra o arquivo `.env` e substitua `OPENAI_API_KEY` pela sua chave da API da OpenAI:
     ```
     OPENAI_API_KEY="sua_chave_da_api_aqui"
     ```

## Execução do Projeto

Para iniciar os servidores, execute o script `start.bat`:

```bash
start.bat
```

- **O que acontece:**

  - O script inicia dois servidores:
    - **Backend:** Responsável por lidar com as requisições ao ChatGPT.
    - **Servidor BDS:** Executa o jogo Minecraft.
  - Os logs do servidor BDS serão exibidos no console atual.
  - O backend roda em segundo plano, processando as mensagens do chat.

- **Parar os servidores:**
  - Pressione `Ctrl+C` no console do servidor BDS para encerrar ambos os servidores.

## Desenvolvimento

Se você alterar algo no código, siga estas etapas para implantar as mudanças localmente:

1. **Atualize o projeto:**

   - Execute o comando de implantação local:
     ```bash
     npm run local-deploy
     ```

2. **Reinicie os servidores:**
   - Execute novamente o `start.bat` para aplicar as alterações.

## Observações

- Certifique-se de que a chave da API da OpenAI esteja correta no arquivo `.env` para que o ChatGPT funcione.
