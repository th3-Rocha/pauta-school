# Brief do design system: Pauta · Teclado

> Cole este documento inteiro numa conversa com o Claude e **anexe junto estes arquivos do repositório**:
> `src/styles/tokens.css`, `src/lib/strings.ts`, `src/lib/cn.ts`, `src/components/music/markers.tsx`, `src/components/music/controls.tsx`, `src/components/music/Fretboard.tsx` e `src/components/music/ScoreFrame.tsx`.
> Ele entrega os arquivos novos e você traz de volta para o projeto.

---

## Quem você é nesta tarefa

Você é o designer de produto e engenheiro de front-end da **Pauta**, uma escola de música **gratuita e open source**, em português do Brasil. A Pauta já tem um design system pronto, feito para o curso de **guitarra**. Agora vai ganhar o curso de **teclado**.

Sua tarefa é **estender** esse design system com o que o teclado precisa, sem refazer o que já existe. O site precisa parecer um produto só: quem troca de guitarra para teclado percebe outro instrumento, mas a mesma escola.

## O produto (o que muda e o que não muda)

**Igual à guitarra:**
- **365 aulas diárias** (12 meses), de 30 a 45 minutos, do zero até tocar e improvisar com as duas mãos.
- **Zero vídeo.** Texto curto, som gerado no navegador, partitura interativa e um instrumento clicável.
- **Sem login.** Progresso no navegador, exportado como código hexadecimal.
- **Público:** adolescentes e adultos brasileiros que nunca estudaram música. **Tom:** um amigo que toca bem e explica sem enrolar.
- Cada aula tem os mesmos **4 blocos**: revisão espaçada, conceito, laboratório e ouvido/criação.

**Diferente na guitarra:**
- **Duas mãos ao mesmo tempo.** Mão direita (MD) e mão esquerda (ME) tocam coisas diferentes. A interface precisa separar as duas sempre.
- **Dedilhado de 1 a 5**, com o polegar = 1 (na guitarra, o polegar não é numerado e o indicador é o 1). Isso é fonte clássica de confusão: deixe explícito.
- **Partitura em sistema duplo** (clave de sol em cima, clave de fá embaixo, ligadas por chave). Não há tablatura.
- **Entrada do aluno:** o melhor caminho é um teclado **MIDI** ligado por USB (Web MIDI). Sem MIDI, o aluno toca **na tela** ou no **teclado do computador** (fileira A S D F… = teclas brancas, W E T Y U… = pretas). O microfone fica como último recurso, só para nota única.
- **Pedal de sustentação** e **dinâmica** (força da tecla, via MIDI) aparecem nas aulas.
- **Posição da mão:** o teclado não tem casas. Os exercícios dizem "polegar no Dó central" e a mão fica parada numa região de 5 teclas.
- **Celular:** um teclado inteiro não cabe em 360px. Isso é o maior desafio de layout deste brief.

## Stack (obrigatório, igual ao existente)

- **React 19 + TypeScript**, componentes de função.
- **Tailwind CSS v4**, tokens em `@theme` no `tokens.css` existente.
- Convenções do **shadcn/ui** (Radix, `cn()`, `cva`). Ícones **lucide-react**.
- **Sem bibliotecas novas.** Áudio, MIDI, detecção de altura e renderização da partitura **não são sua responsabilidade**. Os componentes são **visuais e controlados**: recebem dados por props e avisam eventos (`onPress`, `onRelease`, `onChange`).
- Roda como ilha React no **Astro**. Sem roteador, sem contexto global.

## O que reaproveitar (não reescreva)

Já existem e servem para o teclado sem mudança: `Button`, `ToggleGroup`, `Tabs`, `Dialog`, `Tooltip`, `Badge`, `Progress`, `Slider`, `Checkbox`, `Input`, `Callout`, `AppHeader`, `YearMap`, `LessonLayout`, `LessonBlock`, `SelfCheck`, `MilestoneCard`, `ProgressCodeDialog`, `Metronome`, `Drone`, `BackingTrackPlayer`, `EarTrainer`, `RhythmSlashes`, `Panel`, `LedToggle`, `PlayButton`.

**`markers.tsx` é a base de tudo que marca nota.** Use os mesmos `MarkerKind` (`root`, `deg-3`, `deg-5`, `deg-7`, `ext`, `in`, `tension`, `out`, `ghost`, `active`) e as mesmas cores de grau. Uma terça é amarela na guitarra e no teclado. Se precisar, adicione superfícies novas ao `MarkerSurface` (hoje `wood | page`), por exemplo `key-white` e `key-black`, sem quebrar as existentes.

## Direção visual

### Identidade do teclado
- A guitarra usa o **mundo físico da guitarra** (jacarandá, trastes de níquel, madrepérola). O teclado usa o **mundo físico do piano**: teclas de marfim e ébano, o **feltro vermelho** atrás das teclas, a caixa em laca preta, o brilho do verniz, o metal dos pedais.
- **O teclado é um objeto físico.** Teclas, feltro e caixa mantêm as mesmas cores nos dois temas, como uma foto, igual ao braço da guitarra.
- **Não mude** a interface comum: fundo, superfícies, texto, acento teal e feedback continuam os mesmos. O que muda é só o objeto.
- **Evite:** teclado de desenho infantil colorido, teclas com gradiente "plástico 2010", sombra exagerada, cara de app de karaokê, notas caindo em neon de jogo de ritmo.

### Tokens novos (proponha os valores)
Fixos nos dois temas, como os da madeira:

| Token | O quê |
|---|---|
| `--key-white` | Tecla branca (marfim, não branco puro) |
| `--key-white-pressed` | Tecla branca afundada |
| `--key-black` | Tecla preta (ébano) |
| `--key-black-pressed` | Tecla preta afundada |
| `--key-edge` | Separação entre teclas brancas |
| `--felt` | Faixa de feltro atrás das teclas |
| `--case` | Caixa do instrumento (laca) |
| `--pedal` | Metal dos pedais |
| `--hand-right` | Mão direita |
| `--hand-left` | Mão esquerda |

As notas marcadas precisam ter contraste suficiente **sobre a tecla branca e sobre a tecla preta**. Mão direita e mão esquerda **nunca** se distinguem só pela cor: use também a letra (**D** / **E**), a posição (MD acima do teclado, ME abaixo) ou a forma.

## Componentes a entregar

### A. Fundamentos
1. Adições ao `tokens.css` (só o bloco novo, marcado com comentário `/* Teclado */`).
2. Adições ao `strings.ts`: chaves novas `keyboard`, `grandStaff`, `keyChord`, `pianoRoll`, `handPosition`, `midi`, `pedal`, `chordCheck` e `keyFix`, no mesmo padrão das existentes.
3. Uma seção nova na `DesignSystemPreview.tsx` ("Teclado") mostrando tudo abaixo nos dois temas. Entregue só o componente da seção (`KeyboardPreviewSection.tsx`), e eu encaixo.

### B. Componentes musicais do teclado

1. **`Keyboard`** (o mais importante, equivalente ao `Fretboard`)
   - Props: `from` e `to` (MIDI, ex.: 48–72), `markers` (lista `{ midi, kind, label?, hand?: "right" | "left", finger?: 1|2|3|4|5 }`), `pressed` (MIDI tocadas agora, vindas do MIDI ou do toque), `handZones` (ex.: `{ hand: "right", from: 60, to: 67, label: "Posição de Dó" }`), `showNoteNames` (`none | c-only | all`), `naming` (`sharp | flat`), `computerKeys` (mostra a letra do teclado do computador em cada tecla), `pedal` (sustentação ligada), `onPress(midi, velocity?)`, `onRelease(midi)`.
   - Visual: proporção real das teclas (pretas mais curtas e estreitas, agrupadas 2 + 3), feltro em cima, tecla afundando no toque, Dó central marcado e rotulado ("Dó central"), número do dedo dentro do marcador, cor/letra da mão.
   - **Feedback de execução:** marcador alvo + tecla pressionada, com três estados visíveis (acertou, tecla errada, faltou), reaproveitando `--good`, `--bad` e `ghost`.
   - **Celular:** rolagem horizontal sem cortar, botões "← oitava" / "oitava →", modo **compacto** de uma oitava e meia que segue a `handZone` ativa, e um aviso discreto "Deite o celular para ver mais teclas". Teclas brancas com pelo menos 44px de largura no modo de toque.
   - Teclado: setas movem o foco entre teclas, Enter/Espaço tocam.
   - Polifonia: várias teclas pressionadas ao mesmo tempo (acordes) sem travar o visual.

2. **`KeyChord`** (equivalente ao `ChordDiagram`)
   - Mini teclado de 1 a 2 oitavas com as notas do acorde, nome (`C`, `Am7`), **inversão** ("1ª inversão"), graus ou nomes nas teclas e dedilhado sugerido.
   - **Modo condução de vozes:** mostra o acorde anterior em `ghost` e o próximo cheio, com setas ou marcação indicando qual dedo se move e qual fica parado (o equivalente teclado do modo multiponto da guitarra). Inclua legenda.
   - Variante com as duas mãos: ME com o baixo, MD com o acorde.

3. **`GrandStaffFrame`** (estende o `ScoreFrame`)
   - Moldura para a partitura em sistema duplo (o desenho vem do alphaTab). Os controles do `ScoreFrame` continuam iguais (tocar, velocidade de 50 a 100%, loop, metrônomo, contagem) e ganham **mão isolada**: `ambas | só MD | só ME`, com a outra mão tocando de fundo ou muda.
   - Rótulo das claves para iniciante ("clave de sol: mão direita", "clave de fá: mão esquerda") que pode ser escondido.

4. **`PianoRoll`**
   - Visualização simples de notas como barras horizontais sobre o eixo do tempo, alinhada com um `Keyboard` embaixo. É o "ver a música antes de ler a partitura" das primeiras semanas.
   - Props: `notes` (`{ midi, start, duration, hand, finger? }` em tempos), `position` (tempo atual), `from`/`to`, `pxPerBeat`. Linhas de compasso, cor e letra da mão, número do dedo na barra.
   - Nada de neon nem efeito de jogo: é uma partitura simplificada, sóbria.

5. **`HandPosition`**
   - Card que mostra onde a mão começa: trecho do teclado, os 5 dedos numerados sobre as teclas, nome da posição ("Posição de Dó, polegar no Dó central"). Versões MD, ME e as duas.
   - Inclui o desenho dos números dos dedos de 1 a 5 com o polegar destacado e a nota "no teclado o polegar é o 1".

6. **`MidiStatus`**
   - Indicador da fonte de entrada: `midi` (nome do aparelho), `computador`, `tela`, `microfone`. Estados do MIDI: `sem-suporte`, `pedir-permissao`, `nenhum-aparelho`, `conectado`, `negado`. Botão "Conectar teclado MIDI" e texto curto explicando que funciona com qualquer teclado USB e que nada é enviado.
   - Mostra um "LED" que pisca quando chega nota (ajuda a saber se o cabo funciona).

7. **`PedalIndicator`**
   - Pedal de sustentação ligado/desligado, e a marcação de pedal da partitura (Ped. … \*) em versão visual para o laboratório. Se o aluno não tem pedal, permite segurar uma tecla do computador (Espaço).

8. **`ChordCheck`** (substitui o `PitchMeter` no teclado)
   - Compara o acorde alvo com as notas que o aluno está segurando: notas certas, faltando e sobrando, e o resultado ("C maior, 1ª inversão: certo"). Inclui o estado "conecte um MIDI ou toque na tela".

9. **`KeyFixPuzzle`** (equivalente ao `NoteFixPuzzle`)
   - "Ache a nota errada" numa frase curta mostrada como fichas com o nome da nota e o dedo. Ficha selecionada, botões "← meio tom" e "meio tom →", dica e estado de resolvido.

10. **`DynamicsMeter`** (opcional, se der tempo)
    - Mostra a força de cada nota recebida do MIDI (velocity) contra uma faixa alvo (`p`, `mf`, `f`). Serve às aulas de dinâmica.

## Regras de qualidade (as mesmas do sistema)

- **Acessibilidade:** contraste AA, foco visível, tudo operável por teclado, `aria-label` em português ("Dó 4, tecla branca, dedo 1, mão direita"), alvos de toque de pelo menos 44px nos controles principais, `prefers-reduced-motion`.
- **Celular primeiro:** testado a 360px, sem rolagem horizontal da página (só dentro do teclado, do piano roll e da partitura).
- **Texto em português**, claro e direto. Todo texto fixo vem do objeto `strings`.
- **Nomes das notas:** padrão brasileiro com opção de cifra. Dó, Ré, Mi, Fá, Sol, Lá, Si **e** C D E F G A B, escolhido por prop (`noteNames: "solfejo" | "cifra"`). Oitava no padrão científico (Dó central = C4).
- **Sem estado de negócio:** nada de `localStorage`, fetch, Web MIDI ou áudio dentro dos componentes.
- Tipos TypeScript exportados para todas as props. Mantenha os nomes e o estilo de código dos arquivos anexados.

## Formato de entrega

Entregue **cada arquivo num bloco de código separado**, com o caminho completo na primeira linha como comentário:

```
src/styles/tokens.css                      (só o bloco /* Teclado */ a adicionar)
src/lib/strings.ts                         (só as chaves novas)
src/components/music/markers.tsx           (se mudar: arquivo inteiro)
src/components/music/keyboard/<Nome>.tsx   (Keyboard, KeyChord, GrandStaffFrame, PianoRoll, ...)
src/components/music/keyboard/KeyboardPreviewSection.tsx
```

Depois dos arquivos, inclua:
1. As decisões de design (paleta do teclado, como resolveu MD × ME, como resolveu o celular).
2. Qualquer mudança em arquivo existente e por quê.
3. O que ficou de fora ou precisa de decisão.

Se não couber tudo numa resposta, entregue em partes, nesta ordem: **tokens e strings → Keyboard → KeyChord e HandPosition → GrandStaffFrame e PianoRoll → o resto → preview**. Avise no fim de cada parte o que falta.
