@echo off
SETLOCAL EnableDelayedExpansion
TITLE IRB Prime Care Finance - Sistema Unificado

echo ==========================================
echo   IRB Prime Care Finance - Inicializando
echo ==========================================

:: 1. Configuracao do Backend
echo [+] Configurando Backend...
cd backend

:: Cria venv se nao existir
if not exist venv (
    echo [!] Criando ambiente virtual...
    python -m venv venv
)

:: Tenta instalar dependencias
echo [!] Verificando dependencias...
.\venv\Scripts\python.exe -m pip install -r requirements.txt --quiet
if %errorlevel% neq 0 (
    echo [X] Erro ao instalar dependencias do Python. 
    echo     Certifique-se de ter as 'Visual C++ Build Tools' instaladas.
    echo     Continuando tentativa de inicio...
)

:: Inicia o Backend em nova janela
echo [>] Iniciando API (FastAPI) na porta 8000...
start "Backend API" cmd /c ".\venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000"

cd ..

:: 2. Configuracao do Frontend
echo [+] Configurando Frontend...
if not exist node_modules (
    echo [!] Instalando dependencias do Node...
    call npm install --silent
)

:: Inicia o Frontend em nova janela
echo [>] Iniciando Frontend (Next.js) na porta 3000...
start "Frontend Dashboard" cmd /c "npm run dev"

echo ==========================================
echo   SISTEMA EM INICIALIZACAO
echo ==========================================
echo   API: http://localhost:8000
echo   App: http://localhost:3000
echo ==========================================
echo.
echo Pressione qualquer tecla para encerrar este script de monitoramento...
pause > nul
