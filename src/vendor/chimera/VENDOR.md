# Chimera (vendored)

Código copiado de https://github.com/jamesondh/chimera-vocal-synth, commit `caf270a` (2026-11-20), licença MIT (ver `LICENSE`, © Jameson Hodge).

- `wasm/chimera.wasm`: compilado desse commit com `cargo build -p chimera-wasm --release --target wasm32-unknown-unknown`.
- Fontes e dados em `public/`: Hershey Simplex (CC0/WTFPL, `public/fonts/AVHERSHEY-LICENSE.txt`), Archivo (OFL, `public/fonts/OFL.txt`), CMUdict (`public/data/CMUDICT-LICENSE.txt`).
- `main.tsx` removido (a Pauta monta as vistas pela ilha `src/components/music/voice/ChimeraLive.tsx`).
- Para atualizar: copie `src/` de novo por cima, recompile o wasm e registre o commit aqui.
