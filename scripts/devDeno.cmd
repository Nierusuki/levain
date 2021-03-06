@echo off

set denoPath=%1
if "a%denoPath%" == "a" (
    echo.
    echo Where should I find deno.exe?
    exit /b 1
)

SETLOCAL
set myPath=%~dp0
set levainRoot=%myPath%..

if not exist %levainRoot%\bin (
    mkdir %levainRoot%\bin
)

REM if not exist %levainRoot%\bin\deno.exe (
    copy %denoPath%\deno.exe %levainRoot%\bin
REM )

if exist %levainRoot%\dist rmdir /q/s %levainRoot%\dist
if exist %levainRoot%\levain.bundle.js del %levainRoot%\levain.bundle.js

set DENO_DIR=%levainRoot%\bin
%levainRoot%\bin\deno.exe -V info
%levainRoot%\bin\deno.exe cache --unstable --reload %levainRoot%\levain.ts
::%levainRoot%\bin\deno.exe bundle --unstable --reload %levainRoot%\levain.ts %levainRoot%\levain.bundle.js
if errorlevel 1 exit /b %ERRORLEVEL%

::rmdir %levainRoot%\bin\deps /q /s
::rmdir %levainRoot%\bin\gen /q /s

echo.
echo Deno cache ok
echo.

ENDLOCAL
