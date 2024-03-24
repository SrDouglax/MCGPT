# MCGPT - Minecraft ChatGPT Integration

Este é um projeto que integra o ChatGPT ao chat de um servidor de Minecraft usando BDSX e uma API Express para gerenciar as respostas do ChatGPT.

## Funcionalidades Principais

- **Integração com o ChatGPT:** Os jogadores podem interagir com o servidor por meio do chat, e o servidor responde com mensagens geradas pelo ChatGPT com base nas interações dos jogadores.

- **Troca de Chats:** Os jogadores podem trocar entre os diferentes chats disponíveis no servidor usando o comando `/chat <id>`. Cada chat pode ter configurações específicas e respostas geradas pelo ChatGPT.

## Estrutura do Projeto

- `bdsx/`: Pasta contendo o código do servidor de Minecraft modificado com BDSX para integrar o ChatGPT ao chat do jogo.
  
- `backend/`: Pasta contendo o código da API Express que gerencia as respostas do ChatGPT e as interações dos jogadores nos diferentes chats.

## Pré-requisitos

- Node.js instalado na máquina local ou no servidor.
- Conta de API OpenAI para acessar o serviço do ChatGPT.

## Instalação e Uso

1. Clone o repositório para sua máquina local:

git clone https://github.com/-/MCGPT.git

2. Instale as dependências de cada parte do projeto:

- Para a parte do BDSX (servidor de Minecraft):
  ```
  cd bdsx
  npm install
  ```

- Para a parte do backend da IA (API Express):
  ```
  cd backend
  npm install
  ```

3. Configure as variáveis de ambiente:

- Crie um arquivo `.env` na pasta `backend/` e adicione suas credenciais de API OpenAI:

  ```
  OPENAI_API_KEY=SuaChaveDeAPIAqui
  ```

4. Execute cada parte do projeto:

- Para iniciar o servidor de Minecraft modificado com BDSX:
  ```
  cd bdsx
  ./bdsx.bash
  ```

- Para iniciar o backend da IA (API Express):
  ```
  cd backend
  pnpm start
  ```

5. No jogo, os jogadores podem usar o comando `/chat <id>` para trocar entre os chats disponíveis e interagir com o servidor.

## Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para enviar pull requests com melhorias, correções de bugs ou novas funcionalidades.

## Licença

Este projeto é licenciado sob a [MIT License](LICENSE).

## Autores

- [SrDouglax](https://github.com/seu-usuario)