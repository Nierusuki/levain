@echo off

cls 

bin\deno.exe run ^
    --allow-read --allow-write --allow-env --allow-net --allow-run ^
    src/levain.ts ^
    %*
