@echo off
cd /d C:\dev\my-app

wrangler deploy
if errorlevel 1 (
  echo my-app 배포 실패
  exit /b 1
)

node C:\dev\shared\scripts\notify-telegram.js "my-app 배포 완료"