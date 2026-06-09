@echo off
echo ============================================
echo   Garagem CV — Servidor Backend
echo ============================================
echo.

echo Instalando dependencias...
pip install -r requirements.txt

echo.
echo Iniciando servidor na porta 5000...
echo Acesse o frontend abrindo o arquivo index.html no navegador.
echo Para parar o servidor, pressione Ctrl+C
echo.

python app.py
pause
