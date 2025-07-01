@echo off
chcp 65001 > nul
echo Starting Cyber Railway Dev Server with Emoji/Symbol Test...
echo Opening http://localhost:5173/emoji-test
start http://localhost:5173/emoji-test
npm run dev
