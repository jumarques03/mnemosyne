@echo off
chcp 65001 >nul
title Mnemosyne
cd /d "%~dp0"

echo ==========================================
echo   Mnemosyne - Arte em conversa
echo ==========================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo O Node.js nao foi encontrado neste computador.
  echo Instale a versao LTS em https://nodejs.org e abra este arquivo de novo.
  echo.
  pause
  exit /b 1
)

if not exist node_modules (
  echo Instalando as dependencias. Isso so acontece na primeira vez...
  call npm install --include=dev
  if errorlevel 1 (
    echo.
    echo Nao foi possivel instalar as dependencias. Confira a internet e tente de novo.
    pause
    exit /b 1
  )
)

if not exist .env (
  (
    echo # Cole a chave da OpenAI logo depois do sinal de =, sem espacos e sem aspas.
    echo # Depois salve com Ctrl+S e feche o Bloco de Notas.
    echo OPENAI_API_KEY=
    echo OPENAI_MODEL=gpt-4o-mini
  ) > .env
)

findstr /r /c:"^OPENAI_API_KEY=..*" .env >nul
if errorlevel 1 (
  echo A chave da OpenAI ainda nao foi informada.
  echo Vai abrir o Bloco de Notas: cole a chave depois de OPENAI_API_KEY=, salve e feche.
  echo.
  start /wait notepad .env
  findstr /r /c:"^OPENAI_API_KEY=..*" .env >nul
  if errorlevel 1 (
    echo Aviso: nenhuma chave foi salva. O site abre, mas o chat nao vai responder.
    echo Para colocar a chave depois, abra o arquivo .env desta pasta no Bloco de Notas.
    echo.
  )
)

echo Preparando o site...
call npm run build >nul
if errorlevel 1 (
  echo.
  echo Nao foi possivel preparar o site. Rode "npm run build" para ver o erro.
  pause
  exit /b 1
)

echo.
echo Tudo pronto! O navegador vai abrir em http://localhost:3001
echo Para encerrar, feche esta janela.
echo.
start "" powershell -WindowStyle Hidden -Command "Start-Sleep -Seconds 4; Start-Process 'http://localhost:3001'"
call npm run server

echo.
echo O servidor parou.
pause
