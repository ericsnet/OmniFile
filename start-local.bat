@echo off
setlocal
cd /d "%~dp0"
where py >nul 2>nul
if %errorlevel%==0 (
  py -3 run_local.py
) else (
  python run_local.py
)
if errorlevel 1 (
  echo.
  echo Could not start OmniFile. Install Python 3 and try again.
  pause
)
endlocal
