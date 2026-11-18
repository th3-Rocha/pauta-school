# Brief do design system: Pauta · Gaita

> Cole este documento inteiro numa conversa com o Claude e **anexe junto estes arquivos do repositório**:
> `src/styles/tokens.css`, `src/lib/strings.ts`, `src/lib/cn.ts`, `src/components/music/markers.tsx`, `src/components/music/controls.tsx`, `src/components/music/PitchMeter.tsx`, `src/components/music/keyboard/Keyboard.tsx` (como exemplo de "objeto físico") e `src/components/music/StaffNotes.tsx`.
> Ele entrega os arquivos novos e você traz de volta para o projeto.

---

## Quem você é nesta tarefa

Você é o designer de produto e engenheiro de front-end da **Pauta**, uma escola de música **gratuita e open source**, em português do Brasil (com versão em inglês). A Pauta já tem um design system com cursos de **guitarra** e **teclado**. Agora vai ganhar o curso de **gaita** (harmônica diatônica).

Sua tarefa é **estender** o design system com o que a gaita precisa, sem refazer o que já existe. O aluno que troca de instrumento tem que reconhecer a mesma escola.

## O instrumento (o que o curso ensina)

- **Gaita diatônica de 10 furos**, afinação **Richter**, em **Dó (C)** no começo. Depois o aluno usa gaitas em outros tons (A, G, D, F…), e todos os desenhos precisam se ajustar ao tom escolhido.
- Cada furo tem **duas notas**: uma **soprando** e uma **puxando** o ar (aspirando). Na gaita em Dó:

| Furo | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|---|
| Sopra | C4 | E4 | G4 | C5 | E5 | G5 | C6 | E6 | G6 | C7 |
| Puxa | D4 | G4 | B4 | D5 | F5 | A5 | B5 | D6 | F6 | A6 |

- **Bends (curvar a nota):** mudando a forma da boca e da garganta, a nota abaixa. Na gaita em Dó, os bends puxando ficam nos furos **1 (½ tom), 2 (até 1 tom), 3 (até 1½), 4 (½) e 6 (½)**; os bends soprando nos furos **8 (½), 9 (½) e 10 (até 1 tom)**. Os furos 5 e 7 praticamente não curvam. Bends são o coração do blues e o ponto mais difícil do curso: precisam de **visualização muito clara** e de **conferência pelo microfone**.
- **Overblows/overdraws** (notas extras) aparecem só no fim do ano, como tópico avançado.
- **Posições:** a mesma gaita toca em tons diferentes. **1ª posição** (Dó na gaita em Dó, músicas folclóricas), **2ª posição ou "cross harp"** (Sol na gaita em Dó, o som do blues), 3ª posição (Ré menor). O aluno precisa de uma ferramenta que responda "**qual gaita eu uso para tocar no tom X na posição Y?**".
- **Técnicas de boca:** **bico** (pucker, lábios em biquinho) e **bloqueio de língua** (tongue blocking: a língua tampa furos para tocar uma nota só, oitavas e "slaps"). Além disso, mãos em concha para efeito **wah** e vibrato de garganta.
- **Notação de gaita (tablatura):** número do furo, sopro sem sinal ou com seta para cima, **puxada com sinal de menos** ou seta para baixo, e **apóstrofos para bend**: `4` sopra 4, `-4` puxa 4, `-3'` bend de meio tom, `-3''` de um tom, `-3'''` de um tom e meio. Use essa convenção (é a mais comum na internet) e mostre as setas como alternativa visual.

## O produto (o que muda e o que não muda)

**Igual à guitarra e ao teclado:** 365 aulas diárias em 12 meses, de 30 a 45 minutos, zero vídeo, sem login e com progresso em código hex. Cada aula tem os mesmos **4 blocos**: revisão espaçada, conceito, laboratório e ouvido/criação.

**Diferente:**
- **A entrada do aluno é o microfone.** Não existe MIDI na gaita. O app detecta a altura (uma nota por vez) e o desvio em cents. Os componentes precisam lidar com: nota limpa, **duas ou três notas ao mesmo tempo** (o aluno ainda não isolou o furo), silêncio, nota oscilando e bend no meio do caminho.
- **O ar é o "arco" do instrumento:** soprar e puxar se alternam o tempo todo. A interface precisa sempre dizer **a direção do ar**, e nunca só pela cor.
- **Não dá para olhar o instrumento enquanto toca** (ele está na boca). O aluno lê a tela de frente, com a gaita na mão: alvos grandes, leitura de longe, como o metrônomo.
- **Celular:** a gaita tem só 10 furos e cabe deitada numa tela de 360px. Aproveite isso: o diagrama da gaita é o componente principal e tem que funcionar inteiro no celular em pé.

## Stack (obrigatório, igual ao existente)

- **React 19 + TypeScript**, componentes de função. **Tailwind CSS v4**, tokens em `@theme` no `tokens.css` existente. Convenções do **shadcn/ui** (Radix, `cn()`, `cva`). Ícones **lucide-react**.
- **Sem bibliotecas novas.** Áudio, microfone e detecção de altura **não são sua responsabilidade**. Os componentes são **visuais e controlados**: recebem a leitura do microfone por props (`{ midi, cents, level } | null`) e avisam eventos por callbacks.
- Ilhas React no **Astro**. Sem roteador nem contexto global.

## O que reaproveitar (não reescreva)

Base, curso e música que já existem: `Button`, `ToggleGroup`, `Tabs`, `Dialog`, `Tooltip`, `Badge`, `Progress`, `Slider`, `Checkbox`, `Input`, `Callout`, `AppHeader`, `YearMap`, `LessonLayout`, `LessonBlock`, `SelfCheck`, `MilestoneCard`, `ProgressCodeDialog`, `Metronome`, `Drone`, `BackingTrackPlayer`, `EarTrainer`, `RhythmSlashes`, `StaffNotes`, `Panel`, `LedToggle`, `PlayButton`, **`PitchMeter`** (base do medidor de bend).

**`markers.tsx` continua sendo a base de tudo que marca nota**: mesmos `MarkerKind` e mesmas cores de grau (uma terça é amarela em qualquer instrumento). Se precisar, acrescente superfícies novas ao `MarkerSurface` (ex.: `comb`, `cover`) sem quebrar as existentes.

**Textos:** todo texto fixo vai para chaves novas no objeto `strings` **em português e em inglês** (entregue os dois blocos: um para `strings.ts`, outro para `strings-en.ts`). Os nomes de nota seguem o idioma: Dó Ré Mi em português, C D E em inglês (`noteName` de `src/lib/piano.ts` já faz isso).

## Direção visual

### Identidade da gaita
- Busque o **mundo físico da gaita**: **placas de cobertura cromadas** com furos de ventilação, o **pente** (comb, de plástico preto ou madeira), as **palhetas de latão** (reeds) visíveis pelos furos, os números gravados em cima dos furos, o brilho do metal escovado. Referência de clima: blues, bar, estrada, mas sem clichê.
- **A gaita é um objeto físico.** Metal, pente e palhetas ficam com as mesmas cores nos dois temas, como o braço da guitarra e o teclado.
- **Não mude a interface comum:** fundo, superfícies, texto, acento teal e feedback continuam os mesmos.
- **Evite:** gaita de desenho infantil, gradiente cromado exagerado com brilho de plástico, sépia de "velho oeste", fontes "western", fumaça e chapéu.

### Tokens novos (proponha os valores)
Fixos nos dois temas:

| Token | O quê |
|---|---|
| `--harp-cover` | Placa de cobertura (cromo escovado) |
| `--harp-cover-shine` | Reflexo do metal |
| `--harp-comb` | Pente (padrão: plástico preto; prever variante madeira) |
| `--harp-hole` | Furo (o vazio escuro) |
| `--harp-reed` | Palheta de latão |
| `--harp-engraving` | Números gravados |
| `--air-blow` | Soprar |
| `--air-draw` | Puxar |
| `--bend` | Nota curvada (bend) |

**Soprar e puxar nunca se distinguem só pela cor**: use sempre também a **posição** (sopro em cima do furo, puxada embaixo), a **seta** (↑ sopra, ↓ puxa) e o **sinal** da tab (`-` para puxada). Bend usa o apóstrofo e uma forma própria (ex.: marcador "achatado" ou com a curva).

## Componentes a entregar

### A. Fundamentos
1. Adições ao `tokens.css` (só o bloco `/* Gaita */`, com a ponte `@theme inline` como foi feito para o teclado).
2. Chaves novas em `strings` (PT e EN): `harmonica`, `harpTab`, `bend`, `breath`, `position`, `singleNote`, `embouchure`.
3. `HarmonicaPreviewSection.tsx`: a seção da vitrine mostrando tudo nos dois temas.
4. `src/lib/harmonica.ts`: o mapa de notas por tom de gaita (Richter), os bends disponíveis por furo, a conversão tab ↔ MIDI (`"-3''"` → nota), e a tabela de posições (`harpForSong(songKey, position)` e o inverso). Funções puras, com tipos exportados.

### B. Componentes da gaita

1. **`Harmonica`** (o principal, equivalente ao `Fretboard` e ao `Keyboard`)
   - A gaita vista de frente: 10 furos numerados, a **fileira de sopro em cima** e a **de puxada embaixo**, cada uma com o nome da nota, e **os bends disponíveis** de cada furo desenhados como degraus abaixo da puxada (furos 1–6) ou acima do sopro (8–10).
   - Props: `harpKey` (tom da gaita, padrão C), `markers` (lista `{ hole, air: "blow" | "draw", bend?: 0 | 1 | 2 | 3, kind, label? }`), `active` (o que o microfone está ouvindo agora, no mesmo formato), `range` (destaque de furos, ex.: "furos 4 a 7"), `showNoteNames`, `showBends`, `onPress(hole, air, bend)` para tocar o som de referência.
   - Feedback: alvo + tocado com estados **certo**, **nota vizinha** (furo errado), **sopro/puxada trocado**, **bend incompleto**, reaproveitando `--good`, `--warn` e `--bad`.
   - Celular: cabe inteiro a 360px em pé. Em telas largas, mostra o desenho do metal com mais detalhe.

2. **`HarpTab`** (tablatura de gaita)
   - Linha de números com sinais (`4 -4 5 -5 6 -6' 6`), **seta opcional** embaixo, ritmo embaixo de cada nota (as mesmas figuras do `StaffNotes`), barras de compasso, nota atual destacada, letra/sílaba opcional em cima.
   - Modos: só tab, tab + pauta (`StaffNotes` acima), tab + setas. Responsivo com quebra de linha por compasso.
   - Props controladas: `notes`, `active`, `done`, `wrong` (como o `StaffNotes`).

3. **`BreathIndicator`**
   - Mostra a direção do ar pedida agora e a próxima (↑ sopra / ↓ puxa), e a duração (barra que esvazia). Grande, legível de longe. Inclui um estado de **"respire"** (pausa) e um alerta de **"puxou demais / soprou demais"** para exercícios longos.

4. **`BendMeter`** (estende o `PitchMeter`)
   - Mostra a nota **sem bend** (ponto de partida), os **degraus de bend possíveis** daquele furo (½ tom, 1 tom, 1½) e onde a voz do aluno está entre eles, em cents. Alvo destacado. Estados: não começou, subindo/descendo, **chegou**, **passou do ponto**, **oscilando**.
   - Tem que ensinar visualmente que o bend é **descer a nota** com a boca, não soprar mais forte.

5. **`SingleNoteCheck`**
   - Diz se o aluno está tocando **uma nota limpa** ou **duas/três juntas** (o microfone manda `{ notes: number[], clarity }`). Mostra quais furos parecem estar soando e a dica do que ajustar (fechar mais os lábios, inclinar a gaita). É o primeiro exercício de qualquer aluno de gaita.

6. **`PositionWheel`**
   - Roda (círculo das quintas) que responde: "**quero tocar em Mi, na 2ª posição: uso gaita em Lá**". Também ao contrário: "com a gaita em Dó, a 1ª posição é Dó, a 2ª é Sol, a 3ª é Ré menor". Clicável, com teclado, e com a explicação curta de cada posição.

7. **`HarpKeyPicker`**
   - Escolhe o tom da gaita que o aluno tem (C, G, A, D, F, Bb, E…). Tudo na aula se ajusta. Inclui o aviso "a aula foi escrita para a gaita em Dó; com outra gaita, os números são os mesmos e o som muda de tom".

8. **`Embouchure`**
   - Ilustração da boca de perfil e de frente: **bico** e **bloqueio de língua** (língua cobrindo os furos da esquerda, nota saindo pelo canto direito), com legendas. Também a **concha das mãos** (aberta / fechada) para o efeito wah. Desenho próprio, simples, em linhas, sem estilo de foto.

9. **`HarpRiffPuzzle`** (equivalente ao `NoteFixPuzzle` e ao `KeyFixPuzzle`)
   - "Ache a nota errada" numa frase de tab: fichas, ficha selecionada, botões **furo ←/→**, **trocar sopro/puxada**, **bend +/−**, dica e estado de resolvido.

## Regras de qualidade (as mesmas do sistema)

- **Acessibilidade:** contraste AA, foco visível, tudo operável por teclado, `aria-label` nos dois idiomas ("Furo 4, puxando, bend de meio tom, Ré bemol 5"), alvos de toque de pelo menos 44px, `prefers-reduced-motion`.
- **Celular primeiro:** testado a 360px, sem rolagem horizontal da página.
- **Cor nunca é o único sinal** (sopro/puxada, bend, certo/errado).
- **Sem estado de negócio:** nada de `localStorage`, fetch, microfone ou áudio dentro dos componentes.
- Tipos TypeScript exportados para todas as props. Mantenha os nomes (em inglês) e o estilo de código dos arquivos anexados.

## Formato de entrega

Entregue **cada arquivo num bloco de código separado**, com o caminho completo na primeira linha como comentário:

```
src/styles/tokens.css                        (só o bloco /* Gaita */ a adicionar)
src/lib/strings.ts                           (só as chaves novas, em português)
src/lib/strings-en.ts                        (as mesmas chaves, em inglês)
src/lib/harmonica.ts
src/components/music/markers.tsx             (se mudar: arquivo inteiro)
src/components/music/harmonica/<Nome>.tsx    (Harmonica, HarpTab, BendMeter, ...)
src/components/music/harmonica/HarmonicaPreviewSection.tsx
```

Depois dos arquivos, inclua:
1. As decisões de design (paleta da gaita, como resolveu sopro × puxada × bend, como resolveu o celular).
2. Qualquer mudança em arquivo existente e por quê.
3. O que ficou de fora ou precisa de decisão.

Se não couber tudo numa resposta, entregue em partes, nesta ordem: **tokens, strings e `harmonica.ts` → Harmonica → HarpTab e BreathIndicator → BendMeter e SingleNoteCheck → o resto → preview**. Avise no fim de cada parte o que falta.
