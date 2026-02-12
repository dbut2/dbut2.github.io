---
title: "Building a GBA Emulator in Go"
date: 2026-02-12
draft: false
tags: []
---
<div id="sapphire-emulator" style="text-align:center;">
    <canvas id="sapphire-canvas" style="width:480px;height:320px;image-rendering:pixelated;border:2px solid #444;border-radius:4px;"></canvas>
    <p style="margin-top:8px;font-size:0.85em;color:#888;">
        <b>Controls:</b> Z=A &nbsp; X=B &nbsp; Enter=Start &nbsp; Backspace=Select &nbsp; Arrows=D-pad &nbsp; A=L &nbsp; S=R
    </p>
    <script src="/sapphire_wasm_exec.js"></script>
    <script>
        const go = new Go();
        WebAssembly.instantiateStreaming(fetch("/sapphire.wasm"), go.importObject).then((result) => {
            go.run(result.instance);
        });
    </script>
</div>
