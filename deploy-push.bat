@echo off
REM ================================================================
REM  Touch Furniture - push to GitHub (Vercel auto-deploys)
REM  Just double-click this file, or run it from the project folder.
REM ================================================================
cd /d "%~dp0"

echo Wiring GitHub remote...
git remote set-url origin https://github.com/bahaaabdalla/touch-furniture.git 2>nul || git remote add origin https://github.com/bahaaabdalla/touch-furniture.git

echo Staging changes...
git add -A

echo Committing...
git commit -m "Front-end polish + mobile: preloader, compact header, category chips, framed collections, bolder type"

echo Setting branch to main...
git branch -M main

echo Pushing to GitHub (Vercel will build automatically)...
git push -u origin main --force

echo.
echo ================================================================
echo  Done. Open your Vercel dashboard to watch the build.
echo ================================================================
pause
