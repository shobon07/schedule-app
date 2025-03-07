@echo off
cd /d %~dp0
echo アプリを起動しています...
echo ブラウザで http://localhost:3000 を開いてください
start http://localhost:3000
serve -s build