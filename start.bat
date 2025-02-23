@echo off
echo Iniciando servidores...

:: Verifica se o argumento "debug" foi passado
if /i "%1"=="debug" (
    :: Inicia o ts-node (backend) em uma nova janela visível se "debug" for especificado
    start "Backend" npx ts-node --esm .\backend\src\index.mts
) else (
    :: Inicia o ts-node (backend) em background no mesmo terminal, redirecionando saída para nul
    start /b "" npx ts-node --esm .\backend\src\index.mts >nul 2>&1
)

:: Inicia o bedrock_server.exe no console atual
server\1.21.60\bedrock_server.exe

:: Quando o bedrock_server.exe for interrompido (Ctrl+C), finaliza o backend
echo Finalizando processos...
taskkill /F /IM ts-node.exe >nul 2>&1
taskkill /F /IM node.exe >nul 2>&1
exit