# Chimera (vendored)

Código copiado de https://github.com/jamesondh/chimera-vocal-synth, commit `caf270a` (2026-11-20), licença MIT (ver `LICENSE`, © Jameson Hodge).

- `wasm/chimera.wasm`: compilado desse commit com `cargo build -p chimera-wasm --release --target wasm32-unknown-unknown`.
- Fontes e dados em `public/`: Hershey Simplex (CC0/WTFPL, `public/fonts/AVHERSHEY-LICENSE.txt`), Archivo (OFL, `public/fonts/OFL.txt`), CMUdict (`public/data/CMUDICT-LICENSE.txt`).
- `main.tsx` removido (a Pauta monta as vistas pela ilha `src/components/music/voice/ChimeraLive.tsx`).
- Para atualizar: copie `src/` de novo por cima, recompile o wasm e registre o commit aqui.

## Mudanças da Pauta no código do Chimera

- `ui/render/anatomy.ts` e `ui/components/AnatomyView.tsx`: prop `bare` no corte 2D. Sem os números (formantes, medidas, slots) e com a cabeça centrada ocupando a tela toda. Ao atualizar o Chimera, reaplicar.
- A cor (rosa do canto) não muda o código: é trocada ao carregar, em `src/components/music/voice/ChimeraLive.tsx` (`PAUTA_PALETTE`).
