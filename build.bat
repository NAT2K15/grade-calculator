@echo off
REM Build the Grade Calculator executable using pkg

echo Preparing to build executable...

REM Build the executable for Windows x64 using Node.js 18
pkg index.js --targets node18-win-x64

echo Build complete! Check for index-win.exe or similar output file.