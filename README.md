# Pauta

Escola de música livre e open source. O primeiro curso é de guitarra (teclado, gaita e outros vêm depois): uma aula por dia durante um ano, do zero ao solo. Sem vídeo e sem cadastro. O som é gerado no navegador.

## Rodar

```bash
pnpm install
pnpm dev      # http://localhost:4321
pnpm build    # site estático em dist/
```

## Estrutura

| Pasta | O quê |
|---|---|
| `src/components/` | Design system (tokens em `src/styles/tokens.css`). Componentes visuais, sem áudio nem estado. |
| `src/app/` | Lógica do app: `audio.ts` (corda, metrônomo, afinador), `progress.ts` (localStorage + código hex), `Shell`, `HomeApp`, `LessonApp`. |
| `src/lessons/` | Aulas como dados (`guitar/m01/*.ts`, `guitar/m02.ts` … `m12.ts`, formato em `types.ts`) e os widgets interativos. Nova aula = novo objeto na lista do mês. As ferramentas para escrever aulas (escalas no braço, arpejos, 3NPS, levadas) ficam em `guitar/lib.ts`. |
| `src/lib/harmony.ts` | Teoria para o som: lê cifras, graus romanos e escalas. |
| `src/data/curriculum.ts` | Os 12 meses, desafios e títulos das aulas. |
| `docs/curricula/` | Um currículo por instrumento (`guitar.md`, `keyboard.md`, `harmonica.md`…). |
| `/design` | Vitrine do design system. |

## Código de progresso

São 122 caracteres hex: versão, um bit por aula concluída, o melhor BPM de cada mês e um CRC-16 que detecta código colado errado. Veja `src/app/progress.ts`.

## Licença

Código: MIT. Aulas: CC BY-SA 4.0.
