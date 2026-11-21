# Brief do design system: Pauta · Canto (com o Chimera)

> Cole este documento inteiro numa conversa com o Claude e **anexe junto estes arquivos**:
>
> **Da Pauta:** `src/styles/tokens.css`, `src/lib/strings.ts`, `src/lib/cn.ts`, `src/components/music/markers.tsx`, `src/components/music/controls.tsx`, `src/components/music/PitchMeter.tsx`, `src/components/music/keyboard/Keyboard.tsx` (exemplo de "objeto físico") e `src/components/music/StaffNotes.tsx`.
>
> **Do Chimera** (github.com/jamesondh/chimera-vocal-synth): `src/ui/body.ts`, `src/ui/components/BodyPad.tsx`, `src/ui/colors.ts`, `src/ui/components/Keys.tsx`, `docs/ui-redesign.md` e **2 ou 3 prints de chimera.audio** (a cabeça 3D cantando, a tela Sing com o piano roll).
>
> Ele entrega os arquivos novos e você traz de volta para o projeto.

---

## Quem você é nesta tarefa

Você é o designer de produto e engenheiro de front-end da **Pauta**, uma escola de música **gratuita e open source**, em português do Brasil (com versão em inglês). A Pauta já tem um design system com cursos de **guitarra** e **teclado**, e um brief de **gaita**. Agora vai ganhar o curso de **canto**.

O canto tem uma diferença enorme dos outros cursos: **o instrumento é o corpo do aluno**, e ele não enxerga o próprio instrumento. Para resolver isso, a Pauta vai usar o **Chimera**, um sintetizador de voz open source (MIT) que **simula uma voz humana de verdade** (pulmões, pregas vocais, garganta, língua, lábios, nariz) e mostra tudo numa **cabeça 3D** feita de linhas que brilham. O Chimera é a "voz-guia" do curso: ele canta o exemplo, mostra por dentro o que acontece, e o aluno repete.

Sua tarefa é **estender** o design system com o que o canto precisa, sem refazer o que já existe, e **desenhar como o Chimera vive dentro da Pauta**. O aluno que troca de instrumento tem que reconhecer a mesma escola.

## O Chimera (o que ele é e o que ele faz)

Leia os arquivos anexados. O resumo:

- **Motor:** Rust compilado para WebAssembly, rodando num AudioWorklet. Nenhum som é gravado: tudo sai da simulação física das vias aéreas. Roda no navegador, no celular também.
- **Controles que importam para o curso** (todos já existem no motor):
  - **Fonte (pregas vocais):** altura (`f0`), pressão do ar (`pressure`), soprosidade (`breathiness`), tensão/voz apertada (`tension`), fry vocal (`fry`), aspereza (`roughness`), vibrato (`vibratoDepth`, `vibratoRate`), brilho (`brightness`).
  - **Articulação:** mandíbula (`jaw`), corpo e ponta da língua, raiz da língua, abertura, protrusão e largura dos lábios, **palato mole/véu** (`velum`, nasalidade), **altura da laringe** (`larynx`), epilaringe (o "twang"), falsas pregas.
  - **Telemetria ao vivo** (60×/s): altura real, pressão nos pulmões, fluxo de ar, área da glote (as pregas abrindo e fechando), pressão ao longo do tubo, nível de saída.
- **Vogais calibradas:** `i e ɛ a ɐ ɔ o u` (todas as orais do português) e mais 18. Vogais **nasais** saem com o til do IPA (`ã ẽ õ`). **Ainda não existe leitura de letra em português** (ele lê inglês, turco, coreano, russo e IPA). Para o começo do curso isso basta: vocalizes com vogais e sílabas simples ("ma", "nô", "lá") escritas em IPA por baixo. Desenhe pensando em sílabas, não em letras de música inteiras.
- **Telas que o Chimera já tem** e que a Pauta vai reaproveitar dentro dos seus componentes: a **cabeça 3D** (`AnatomyView3D`, gira com o mouse, pisca, mexe as sobrancelhas com a altura, infla as bochechas, **e se você "faz carinho" na cabeça dela, fecha os olhos e solta coraçõezinhos**), o **corte 2D** da cabeça (`AnatomyView`), o **tubo** (`TubeView`), o **espectro** (`SpectrumView`), as **pregas vocais em câmera lenta** (`Stroboscope`), o **mapa de vogais** (`VowelMap`) e o **piano roll** (`PianoRoll`).
- **O visual do Chimera** é fechado: "tela vetorial" estilo os monitores da NORAD em *WarGames*. Linhas finas que brilham em **fundo preto puro**, sem painéis preenchidos, fonte de traço único **Hershey Simplex** em maiúsculas. **Azul = corpo e estrutura. Âmbar = som** (pressão, fluxo, espectro). Verde, vermelho, rosa e branco = quatro "slots" de controle.

### O triângulo de corpo (o ajuste mais importante)

O Chimera não tem só "voz de homem / de mulher / de criança". Tem um **corpo contínuo**, um ponto dentro de um **triângulo**: **adulto masculino** no canto de cima à esquerda, **adulta feminina** em cima à direita, **criança** embaixo. É o `BodyMix { female, child }` (cada um de 0 a 1, em passos de 5%):

- Pesos: masculino = `(1−c)(1−f)`, feminino = `(1−c)·f`, criança = `c`. Na ponta de baixo, `female` não importa.
- O corpo muda **tamanho do trato vocal, comprimento da faringe, tamanho da língua, largura dos lábios, comprimento das pregas vocais** e quanto tempo elas ficam abertas. Por isso muda o timbre, não só a altura.
- **Altura padrão** de cada ponta: 110 Hz (masc.), 205 Hz (fem.), 260 Hz (criança), misturadas em escala logarítmica. **Teclado** começa em C3 (masc.), A3 (fem.) ou C4 (criança), pela ponta mais próxima.
- **Mudar o corpo reconstrói a voz** (o motor monta um trato novo). Por isso o `BodyPad` mostra o corpo na hora enquanto você arrasta (`previewBody`) e **só reconstrói a voz quando você solta** (`setBody`). As setas andam 5% por vez.

**Na Pauta, isso vira o ajuste do instrumento.** Na guitarra o aluno escolhe a afinação. No canto, ele escolhe **qual voz o Chimera vai ter para cantar com ele**: perto da voz do aluno, para que o exemplo saia **na mesma região** e com um timbre parecido. Um menino de 10 anos ouve uma criança, uma contralto ouve uma voz feminina grave, e quem está no meio do caminho fica no meio do caminho.

**Cuidado com as palavras.** O triângulo fala de **som e tamanho do instrumento**, não de identidade. Os cantos podem ter nomes de corpo ("Adulto, mais grave", "Adulto, mais agudo", "Criança") com masculino/feminino como subtítulo, e o texto deve deixar claro que qualquer pessoa pode ficar em qualquer ponto. Pessoas trans, vozes em transição, adolescentes em muda vocal: todos acham um lugar no triângulo sem precisar escolher um rótulo.

## O instrumento (o que o curso ensina)

O currículo detalhado será escrito à parte (`docs/curricula/voice.md`). O design precisa dar conta destes temas:

- **Respiração e apoio:** inspirar sem subir os ombros, soltar o ar devagar e constante ("sss" longo), ritmo de respiração (4 inspira, 4 segura, 8 solta).
- **Afinação:** ouvir uma nota e cantar igual; subir e descer escalas; intervalos; segurar uma nota parada.
- **Extensão e tipo de voz:** nota mais grave e mais aguda confortável, tessitura (a região onde a voz mora), classificação (baixo, barítono, tenor, contralto, mezzo, soprano, voz infantil) **sempre como orientação, nunca como rótulo fixo**.
- **Vogais e ressonância:** as 7 vogais orais do português (`a é ê i ó ô u`) e as nasais; boca, língua e lábios em cada uma; laringe alta × baixa; nasalidade (véu).
- **Registros:** voz de peito, voz de cabeça, mix, falsete; a "quebra" entre eles.
- **Expressão:** vibrato, dinâmica (forte × fraco), ataque (suave, soprado, duro), legato, articulação de consoantes.
- **Saúde vocal:** aquecimento e desaquecimento, hidratação, nunca forçar, **parar se doer**, cuidado com rouquidão.

## O produto (o que muda e o que não muda)

**Igual aos outros cursos:** 365 aulas diárias em 12 meses, de 30 a 45 minutos (no canto, com **pausas obrigatórias**: a voz cansa), zero vídeo, sem login e com progresso em código hex. Cada aula tem os mesmos **4 blocos**: revisão espaçada, conceito, laboratório e ouvido/criação.

**Diferente:**
- **A entrada do aluno é o microfone.** O app detecta a altura (uma nota por vez), o desvio em cents, o volume e, quando der, uma estimativa da vogal (F1/F2). Os componentes precisam lidar com: nota firme, nota oscilando, deslizando até a nota ("scoop"), **oitava errada** (muito comum, e deve contar como acerto parcial com explicação), silêncio, ruído de fundo e voz soprada demais para medir.
- **Existem duas vozes na tela:** a do **Chimera (guia)** e a do **aluno**. Elas precisam ser diferentes sempre, e nunca só pela cor (linha cheia × tracejada, rótulo, forma do marcador).
- **O aluno não olha para o instrumento, mas olha para a tela:** pode cantar de pé, longe do celular. Alvos grandes, leitura de longe, como o metrônomo.
- **O Chimera mostra o que o aluno não vê:** a cabeça por dentro, as pregas vibrando, o ar passando. É o "braço da guitarra" do canto.

## Como o Chimera aparece na Pauta

Esta é a parte que você precisa **inventar**. A regra geral: a Pauta continua sendo a Pauta (fundo grafite, teal, cartões), e o Chimera é **um objeto físico dentro dela**, como o braço da guitarra e o teclado: tem a **mesma cara nos dois temas**, porque é uma tela.

1. **O Chimera mora num "monitor".** Uma moldura da Pauta com a tela preta do Chimera dentro, com as linhas brilhando. **Dentro do monitor vale o visual do Chimera** (preto puro, azul/âmbar, Hershey). **Fora dele vale a Pauta.** Não pinte a Pauta de *WarGames* nem coloque o Chimera num cartão claro.
2. **Âmbar liga os dois mundos.** No Chimera, âmbar é som. Na Pauta, a **linha do Chimera (guia) é âmbar** em todos os gráficos de canto, e a **linha do aluno é teal** (o acento da Pauta). Isso precisa funcionar também no tema claro (proponha um âmbar escuro que passe AA).
3. **Ele aparece de vez em quando, de propósito.** Não é mascote que fica pulando na tela. Proponha as regras, mas a ideia é:
   - **Grande** na abertura do curso, no ajuste de voz e nos conceitos que precisam ver por dentro (pregas, laringe, véu, vogais).
   - **Médio, ao lado do exercício,** quando ele canta o exemplo ("ouça e veja"), e some quando é a vez do aluno.
   - **Pequeno, num canto ("cameo"),** em momentos especiais: marco do mês, primeira nota afinada, sequência de dias. Pode cantar uma notinha de comemoração **só se o aluno tocar nele**. Fazer carinho na cabeça dele faz aparecer os coraçõezinhos (isso já existe no Chimera: deixe esse segredo à vista para quem achar).
   - **Nunca** cobre o exercício, nunca toca som sozinho, nunca aparece mais de uma vez por bloco sem ser chamado, e sempre pode ser fechado.
4. **É pesado, então carrega quando precisa.** O motor (wasm) e a cabeça 3D (three.js) só carregam quando o monitor entra na tela. Desenhe os estados: **carregando**, **pronto (parado)**, **cantando**, **sem 3D** (sem WebGL, celular fraco, `prefers-reduced-motion` ou economia de bateria: usa o **corte 2D**, que é leve, ou um perfil estático), **sem som** (o áudio ainda não foi liberado pelo navegador: botão "Tocar para ouvir") e **erro**.
5. **Crédito visível.** Uma linha discreta perto do monitor: "Voz: Chimera · MIT · Jameson Hodge" com link. É obrigação da licença e um bom gesto.

## Stack (obrigatório, igual ao existente)

- **React 19 + TypeScript**, componentes de função. **Tailwind CSS v4**, tokens em `@theme` no `tokens.css` existente. Convenções do **shadcn/ui** (Radix, `cn()`, `cva`). Ícones **lucide-react**.
- **Sem bibliotecas novas nos seus componentes.** O código do Chimera (com three.js) vai ficar numa pasta separada (`src/vendor/chimera/`) e é integrado por nós depois. **Você não importa three.js nem o motor.**
- Áudio, microfone, detecção de altura e o motor **não são sua responsabilidade**. Os componentes são **visuais e controlados**: recebem dados por props e avisam eventos por callbacks.
- O lugar da cabeça é um **slot**: o `ChimeraStage` recebe `children` (nós passamos a cabeça de verdade). Na vitrine, use um **substituto desenhado em SVG** (um perfil de cabeça em linhas azuis no preto, com boca e um "brilho" âmbar quando `singing`), para dar para avaliar o layout sem o motor.
- Ilhas React no **Astro**. Sem roteador nem contexto global.

### Formatos dos dados (use exatamente estes tipos)

```ts
/** O corpo do Chimera: igual ao BodyMix dele. */
export type VoiceBody = { female: number; child: number }; // 0..1 cada, passos de 0.05

/** Uma leitura do microfone, ou null em silêncio. */
export type VoiceReading = {
  hz: number;
  midi: number;      // com fração: 60.3 = Dó 4 + 30 cents
  cents: number;     // desvio da nota mais próxima, -50..50
  level: number;     // 0..1
  clarity: number;   // 0..1 (abaixo de ~0.6: soprado/ruído, não confie na altura)
  formants?: { f1: number; f2: number }; // quando der para estimar a vogal
} | null;

/** O que o Chimera está fazendo agora (vem da telemetria dele). */
export type GuideState = {
  status: "loading" | "idle" | "singing" | "no-audio" | "no-3d" | "error";
  midi?: number;      // a nota que ele está cantando
  syllable?: string;  // "ma", "ê"...
  level?: number;     // 0..1, para o brilho
};

/** Extensão do aluno, em MIDI. */
export type VoiceRange = { low: number; high: number; comfortLow: number; comfortHigh: number };
```

## O que reaproveitar (não reescreva)

Base, curso e música que já existem: `Button`, `ToggleGroup`, `Tabs`, `Dialog`, `Tooltip`, `Badge`, `Progress`, `Slider`, `Checkbox`, `Input`, `Callout`, `AppHeader`, `YearMap`, `LessonLayout`, `LessonBlock`, `SelfCheck`, `MilestoneCard`, `ProgressCodeDialog`, `Metronome`, `Drone`, `BackingTrackPlayer`, `EarTrainer`, `StaffNotes`, `Panel`, `LedToggle`, `PlayButton`, **`PitchMeter`** (base do medidor de afinação) e **`Keyboard`** (para mostrar extensão e notas).

**`markers.tsx` continua sendo a base de tudo que marca nota**: mesmos `MarkerKind` e mesmas cores de grau (uma terça é amarela em qualquer instrumento). Se precisar, acrescente superfícies novas ao `MarkerSurface` (ex.: `roll`, `ladder`) sem quebrar as existentes.

**Textos:** todo texto fixo vai para chaves novas no objeto `strings` **em português e em inglês** (entregue os dois blocos: um para `strings.ts`, outro para `strings-en.ts`). Os nomes de nota seguem o idioma: Dó Ré Mi em português, C D E em inglês (`noteName` de `src/lib/piano.ts` já faz isso). No canto, use também **solfejo** (Dó Ré Mi Fá Sol Lá Si) como sílaba cantada.

## Direção visual

### Identidade do canto
- Fora do monitor: a Pauta de sempre. O que dá a cara do canto são **as duas linhas de voz** (âmbar = guia, teal = você), **as ondas e o ar** (respiração), e o **monitor do Chimera**.
- **O corpo é o instrumento:** onde for desenhar pessoas (respiração, postura, boca), use **traço de linha simples**, sem rosto detalhado, sem gênero marcado, sem idade marcada (a não ser no triângulo).
- **Não mude a interface comum:** fundo, superfícies, texto, acento teal e feedback continuam os mesmos.
- **Evite:** microfone de karaokê, notas musicais flutuando, palco com holofote, clichê de "estrela pop", ilustração médica realista de garganta (o Chimera já faz isso, e melhor), barra de "pontuação de karaokê".

### Tokens novos (proponha os valores)
Fixos nos dois temas (são da tela do Chimera):

| Token | O quê |
|---|---|
| `--stage-bg` | Fundo do monitor (preto puro) |
| `--stage-frame` | Moldura do monitor |
| `--stage-body` | Azul do Chimera (corpo, estrutura) |
| `--stage-sound` | Âmbar do Chimera (som) |
| `--stage-glow` | Brilho em volta das linhas |

Por tema (claro e escuro):

| Token | O quê |
|---|---|
| `--voice-guide` | Linha e marcadores do Chimera nos gráficos da Pauta (âmbar) |
| `--voice-you` | Linha e marcadores do aluno (teal) |
| `--voice-target` | Faixa de tolerância do alvo |
| `--breath-in` / `--breath-out` / `--breath-hold` | Fases da respiração |
| `--register-chest` / `--register-head` / `--register-mix` | Registros (sempre com rótulo junto) |

**Guia e aluno nunca se distinguem só pela cor:** guia = linha **tracejada** com marcador quadrado e rótulo "Chimera", aluno = linha **cheia** com marcador redondo e rótulo "Você".

## Componentes a entregar

### A. Fundamentos
1. Adições ao `tokens.css` (só o bloco `/* Canto */`, com a ponte `@theme inline` como foi feito para o teclado).
2. Chaves novas em `strings` (PT e EN): `voice`, `voiceBody`, `voiceRange`, `pitchMatch`, `breath`, `vowels`, `registers`, `vocalHealth`, `chimera`.
3. `VoicePreviewSection.tsx`: a seção da vitrine mostrando tudo nos dois temas, com o substituto SVG da cabeça.
4. `src/lib/voice.ts`: funções puras com tipos exportados.
   - Corpo: `bodyWeights`, `bodyLabel` (PT/EN), `defaultF0(body)` (110/205/260 Hz, mistura logarítmica), `keyboardBase(body)` (C3/A3/C4 pela ponta mais próxima), `toUV`/`fromUV` do triângulo (copie a matemática do `BodyPad.tsx` do Chimera), `snap(0.05)`.
   - **`suggestBody(medianSpeakingHz, range?)`**: um ponto sugerido no triângulo a partir da voz falada do aluno (e da extensão, se houver). Documente a regra que escolher.
   - Extensão: `classifyRange(range)` → tipos possíveis com a faixa típica de cada um e **um nível de confiança** (nunca uma resposta só); `tessitura(range)`.
   - Afinação: `hzToMidi`, `midiToHz`, `centsOff`, `sameNoteAnyOctave(a, b)`, `transposeToRange(notes, range)` (leva um exercício para a região do aluno, por oitava ou por tom).
   - Vogais do português: tabela `a é ê i ó ô u` + `ã ẽ ĩ õ ũ`, com IPA, palavra de exemplo ("pá, pé, vê, vi, pó, avô, tu") e F1/F2 aproximados **por corpo** (masc./fem./criança), e `nearestVowel(f1, f2, body)`.

### B. Componentes do Chimera na Pauta

1. **`ChimeraStage`** (o monitor)
   - A moldura da Pauta com a tela preta do Chimera dentro. `children` = a cabeça (ou o substituto). Props: `guide: GuideState`, `size: "hero" | "inline" | "cameo"`, `caption?` (legenda embaixo, ex.: "Repare: a laringe sobe na nota aguda"), `onStartAudio()`, `view: "3d" | "2d"`, `onViewChange`, `controls?` (chips do Chimera: pressão, fluxo, medidas).
   - Todos os estados listados em "Como o Chimera aparece". O crédito do Chimera fica aqui.
   - Celular: `hero` ocupa a largura toda em 4:5; `inline` vira 16:9 acima do exercício; `cameo` é um círculo de 72px.

2. **`ChimeraCameo`**
   - A aparição pequena: entra de um canto com animação curta (sem animação em `prefers-reduced-motion`), com um balão de uma frase ("Primeira nota afinada!"). Tocar nele: canta uma nota curta. Arrastar o ponteiro em cima da cabeça: carinho, coraçõezinhos. Botão de fechar. Props: `message`, `open`, `onClose`, `onTouch`, `onPet`.
   - Defina a **regra de frequência** (quando aparece e quando não) num comentário no topo do arquivo e no texto de decisões.

3. **`VoiceBodyPicker`** (o triângulo, versão Pauta)
   - O `BodyPad` do Chimera crescido: triângulo grande com as três pontas rotuladas (texto e um ícone simples de silhueta **sem gênero marcado**, só de tamanho), a grade de 5% (linhas de "mesma idade" e "mesma divisão"), o ponto atual, e o texto do corpo ("Masc. 40 · Fem. 30 · Criança 30%").
   - **Arrastar mostra na hora, soltar aplica** (`onPreview(body)` / `onCommit(body)`), com um estado curto de "ajustando a voz…" enquanto o motor reconstrói (`applying`).
   - **Sugestão pela voz do aluno:** um ponto fantasma tracejado "sugerido pela sua voz", com o botão "Usar sugestão". Fluxo: "Fale uma frase normalmente" → o app mede → aparece a sugestão.
   - Botão **"Ouvir"**: o Chimera canta uma frase curta naquele corpo (`onListen`).
   - Atalhos: os três cantos como chips, e as setas do teclado andam 5% (esquerda/direita: masc./fem., cima/baixo: adulto/criança), Home volta ao padrão.
   - Fica ao lado (ou acima, no celular) de um `ChimeraStage` que mostra a cabeça mudando de tamanho enquanto arrasta.
   - É o **ajuste de instrumento** do canto: vai na página `/setup` e no primeiro dia do curso. Precisa explicar em uma frase por que isso importa ("O Chimera vai cantar na sua região, com uma voz parecida com a sua").

4. **`VoiceRangeFinder`**
   - O teste de extensão: "deslize da sua nota mais grave até a mais aguda, sem forçar". Um `Keyboard` (ou escada vertical) com a nota atual acendendo, as marcas de **mais grave** e **mais aguda** que o aluno alcançou, e a faixa **confortável** (que o aluno ajusta arrastando). No fim: a tessitura e os tipos de voz prováveis, com o aviso "isso é um ponto de partida, a voz muda com o treino".
   - Etapas: grave → agudo → confortável → resultado. Sempre com **"Pare se sentir desconforto"** visível.

5. **`PitchRoll`** (o principal, equivalente ao `Fretboard` e ao `Keyboard`)
   - O piano roll do canto: notas-alvo como barras com a sílaba dentro, a **linha do Chimera** (tracejada, âmbar) quando ele canta, a **linha do aluno** (cheia, teal) ao vivo, a faixa de tolerância em cents, e o cursor do tempo.
   - Eixo vertical: nomes das notas (ou solfejo), **centrado na tessitura do aluno**. Rolagem horizontal suave com o tempo.
   - Estados por nota: afinada, **baixa**, **alta**, **oitava abaixo/acima (vale meio ponto)**, deslizou até a nota, não cantou.
   - Modos: "ouça" (só o Chimera), "junto" (os dois), "sua vez" (só você, com a linha do Chimera apagada como fantasma).
   - Props controladas: `notes: { midi, t0, t1, syllable }[]`, `guideTrace`, `youTrace`, `now`, `range`, `tolerance`, `mode`, `results`.

6. **`MatchNote`** (estende o `PitchMeter`)
   - Uma nota só: o Chimera canta, o aluno repete. Medidor grande de cents legível de longe, com setas "suba um pouco / desça um pouco", **detecção de oitava** ("Você cantou a mesma nota, uma oitava abaixo. Vale! Para o exercício, tente na oitava de cima") e tempo segurando a nota afinada (anel que enche).

7. **`BreathCoach`**
   - Ciclos de respiração (inspira / segura / solta) com um círculo que cresce e esvazia, contagem grande e o padrão (4-4-8, 4-7-8…). No "solta", usa o volume do microfone num "sss" para mostrar se o ar sai **constante** (linha reta = bom, serra = irregular).
   - Mostra o **ar do Chimera** junto, quando ele está no monitor (a pressão nos pulmões vem da telemetria).

8. **`VowelMapPT`**
   - O trapézio das vogais (do jeito dos foneticistas: anterior à esquerda, aberta embaixo) com as **7 vogais orais do português** e as nasais, cada uma com a palavra de exemplo. O ponto do aluno (pelos formantes, quando houver) com rastro curto, e a vogal mais próxima destacada. Tocar numa vogal: o Chimera canta e a cabeça mostra a boca e a língua.
   - Ao lado, mini desenhos da **boca de frente** (aberta, arredondada, esticada) para cada vogal, em linha.

9. **`InsideTheVoice`** (explicador)
   - Moldura para as vistas do Chimera com **legendas em português** apontando as partes: pregas vocais, laringe, faringe, palato mole (véu), língua, lábios, cavidade nasal. Abas: **cabeça** (corte 2D ou 3D), **pregas** (estroboscópio), **tubo**, **espectro**. Cada aba com uma frase do que olhar.
   - Comparações lado a lado: "laringe alta × baixa", "com nariz × sem nariz", "peito × cabeça", "soprado × apertado". O Chimera canta a mesma nota dos dois jeitos.

10. **`RegisterGuide`**
    - O mapa dos registros sobre a extensão do aluno: faixas de peito, mix e cabeça (e falsete), com a **zona de passagem** marcada. Quando o microfone está ligado, mostra onde o aluno está. É **orientação visual**: o app não detecta o registro, então não finja que detecta.

11. **`VibratoMeter`**
    - A linha da altura do aluno numa nota longa, com a faixa saudável de vibrato (velocidade ~5–7 Hz, profundidade ~±30–100 cents) e os números ao vivo. Estados: sem vibrato, vibrato bom, **lento demais (balanço)**, **rápido demais (tremido)**.

12. **`SolfegeLadder`**
    - Escada vertical de Dó a Dó (graus com as cores de `markers.tsx`). O Chimera canta um degrau, o aluno repete; pulos de intervalo; o degrau certo acende quando o aluno chega. Ajusta a tônica à tessitura do aluno.

13. **`WarmupCard`**
    - Rotina de aquecimento (lábios vibrando, "hum", sirene, escalas curtas) como lista com tempo por item, o Chimera demonstrando cada um, e o lembrete de saúde vocal: água, pausas, **"parou de ser confortável? Pare."** Também o desaquecimento no fim da aula.

## Regras de qualidade (as mesmas do sistema)

- **Acessibilidade:** contraste AA (o âmbar no tema claro também), foco visível, tudo operável por teclado (o triângulo também), `aria-label` nos dois idiomas ("Corpo da voz: masculino 40%, feminino 30%, criança 30%"; "Nota alvo Sol 3, você está 20 cents abaixo"), alvos de toque de pelo menos 44px, `prefers-reduced-motion` (inclui o cameo e a cabeça girando).
- **Celular primeiro:** testado a 360px, sem rolagem horizontal da página. O monitor do Chimera fica acima do exercício, nunca ao lado.
- **Cor nunca é o único sinal** (guia × aluno, afinado × desafinado, fases da respiração, registros).
- **Sem estado de negócio:** nada de `localStorage`, fetch, microfone, áudio ou motor dentro dos componentes.
- **Gentileza:** canto é íntimo e muita gente tem vergonha da própria voz. Nada de nota de 0 a 100, nada de "errado" em vermelho grande na voz da pessoa. Feedback como direção ("um pouco mais alto"), não como julgamento.
- Tipos TypeScript exportados para todas as props. Mantenha os nomes (em inglês) e o estilo de código dos arquivos anexados.

## Formato de entrega

Entregue **cada arquivo num bloco de código separado**, com o caminho completo na primeira linha como comentário:

```
src/styles/tokens.css                       (só o bloco /* Canto */ a adicionar)
src/lib/strings.ts                          (só as chaves novas, em português)
src/lib/strings-en.ts                       (as mesmas chaves, em inglês)
src/lib/voice.ts
src/components/music/markers.tsx            (se mudar: arquivo inteiro)
src/components/music/voice/<Nome>.tsx       (ChimeraStage, VoiceBodyPicker, PitchRoll, ...)
src/components/music/voice/HeadPlaceholder.tsx   (o substituto SVG da cabeça)
src/components/music/voice/VoicePreviewSection.tsx
```

Depois dos arquivos, inclua:
1. As decisões de design: como o monitor do Chimera convive com a Pauta, as cores de guia × aluno nos dois temas, **a regra de quando o Chimera aparece**, como ficou o triângulo e os textos dele, como resolveu o celular.
2. Qualquer mudança em arquivo existente e por quê.
3. O que ficou de fora ou precisa de decisão (inclua o que você acha que precisa mudar ou ser exposto no Chimera para a integração funcionar).

Se não couber tudo numa resposta, entregue em partes, nesta ordem: **tokens, strings e `voice.ts` → ChimeraStage, HeadPlaceholder e ChimeraCameo → VoiceBodyPicker e VoiceRangeFinder → PitchRoll e MatchNote → BreathCoach e VowelMapPT → o resto → preview**. Avise no fim de cada parte o que falta.
