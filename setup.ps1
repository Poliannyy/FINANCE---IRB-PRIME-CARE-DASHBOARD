# Script de Configuração Inicial - IRB Prime Care Finance

$projectDir = "$PSScriptRoot"
$backendDir = "$PSScriptRoot/backend"

Write-Host "--- Iniciando instalação de dependências ---" -ForegroundColor Cyan

# 1. Dependências do Front-end
Write-Host "`n[1/2] Instalando dependências do Front-end (Next.js)..." -ForegroundColor Yellow
cd $projectDir
npm install
cd ..

# 2. Dependências do Back-end
Write-Host "`n[2/2] Configurando Back-end (Python 3.12)..." -ForegroundColor Yellow
cd $backendDir

# Tenta localizar o Python 3.12
$pythonExe = py -3.12 -c "import sys; print(sys.executable)" 2>$null
if (-not $pythonExe) {
    $pythonExe = "python"
    Write-Host "Aviso: Python 3.12 não encontrado via 'py -3.12'. Usando 'python' padrão." -ForegroundColor DarkYellow
} else {
    Write-Host "Python 3.12 localizado: $pythonExe" -ForegroundColor Green
}

# Cria venv se não existir
if (-not (Test-Path "venv")) {
    Write-Host "Criando ambiente virtual (venv)..."
    & $pythonExe -m venv venv
}

# Instala requirements
Write-Host "Instalando pacotes do requirements.txt..."
.\venv\Scripts\python.exe -m pip install --upgrade pip
.\venv\Scripts\python.exe -m pip install -r requirements.txt

cd ..\..

Write-Host "`n--- Configuração concluída com sucesso! ---" -ForegroundColor Green
Write-Host "Agora você pode usar o start.ps1 para iniciar o sistema."
