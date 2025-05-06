@echo off
echo Instalando dependências do projeto Biblioteca...
echo.

:: Verifica se o Python está instalado
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Erro: Python não encontrado. Por favor, instale o Python primeiro.
    echo Baixe em: https://www.python.org/downloads/
    pause
    exit /b
)

:: Atualiza o pip
echo Atualizando o pip...
python -m pip install --upgrade pip
if %errorlevel% neq 0 (
    echo Erro ao atualizar o pip.
    pause
    exit /b
)

:: Instala as dependências
echo Instalando Flask e TinyDB...
pip install flask tinydb
if %errorlevel% neq 0 (
    echo Erro ao instalar dependências.
    pause
    exit /b
)

:: Verifica a instalação
echo.
echo Verificando instalações...
flask --version >nul 2>&1
if %errorlevel% eq 0 (
    echo Flask instalado com sucesso!
) else (
    echo Falha na instalação do Flask.
)

python -c "import tinydb; print('TinyDB instalado com sucesso!')" 2>nul
if %errorlevel% neq 0 (
    echo Falha na instalação do TinyDB.
)

echo.
echo Todas as dependências foram instaladas!
echo.
pause