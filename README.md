# MCGPT

This project integrates ChatGPT into a BDS (Bedrock Dedicated Server) Minecraft server. For every message sent in the game’s chat, ChatGPT responds automatically. The project consists of two servers: a backend that manages requests to ChatGPT and the BDS server that runs the Minecraft game.

## Requirements

- [Node.js](https://nodejs.org/) (version 16 or higher)
- [Git](https://git-scm.com/) (to clone the repository)
- An [OpenAI](https://platform.openai.com/) account to obtain an API key

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/SrDouglax/MCGPT.git
   cd MCGPT
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## Configuration

1. **Create the `.env` file:**
   - Copy the provided example file:
     ```bash
     cp .env.example .env
     ```
   - Open the `.env` file and replace `OPENAI_API_KEY` with your OpenAI API key:
     ```
     OPENAI_API_KEY="your_api_key_here"
     ```

## Running the Project

To start the servers, run the `start.bat` script:

```bash
start.bat
```

- **What happens:**

  - The script starts two servers:
    - **Backend:** Handles requests to ChatGPT.
    - **BDS Server:** Runs the Minecraft game.
  - The BDS server logs will be displayed in the current console.
  - The backend runs in the background, processing chat messages.

- **Stopping the servers:**
  - Press `Ctrl+C` in the BDS server console to shut down both servers.

## Development

If you make changes to the code, follow these steps to deploy the changes locally:

1. **Update the project:**

   - Run the local deployment command:
     ```bash
     npm run local-deploy
     ```

2. **Restart the servers:**
   - Run `start.bat` again to apply the changes.

## Notes

- Ensure the OpenAI API key in the `.env` file is correct for ChatGPT to work properly.
