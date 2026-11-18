# Currículos

Um arquivo por instrumento, com o mesmo nome do `id` em `src/data/instruments.ts`:

| Instrumento | Arquivo | Status |
|---|---|---|
| Guitarra | `guitar.md` | pronto, mês 1 publicado |
| Teclado | `keyboard.md` | pronto, aulas 1 e 2 publicadas |
| Gaita | `harmonica.md` | a escrever |
| Violão | `acoustic-guitar.md` | a escrever |
| Baixo | `bass.md` | a escrever |
| Ukulele | `ukulele.md` | a escrever |
| Bateria | `drums.md` | a escrever |
| Canto | `voice.md` | a escrever |

Use `guitar.md` como modelo: 12 meses, 365 aulas, um desafio por mês, exemplos originais ou de domínio público.

## Notas por instrumento

- **Canto (`voice`)**: vamos usar o [Chimera](https://github.com/jamesondh/chimera-vocal-synth) (MIT), sintetizador de voz por modelagem física com a cabeça 3D que mostra garganta, língua e lábios em tempo real. Plano: trazer o motor e o visualizador para uma pasta própria (mantendo a licença e o commit de origem) e montar componentes da Pauta em cima, começando por um protótipo em `/voice-lab`. Ele ainda não canta em português (inglês, coreano, russo), o que não atrapalha o começo do curso (afinação, respiração, vogais).
