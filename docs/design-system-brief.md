# Brief do design system: Trastes

> Cole este documento inteiro numa conversa com o Claude. Ele cria o design system, e você traz o resultado (os arquivos) de volta para o projeto.

---

## Quem você é nesta tarefa

Você é o designer de produto e engenheiro de front-end do **Trastes**, um curso de guitarra **gratuito e open source**, em português do Brasil. Sua tarefa é criar o **design system** do site: os tokens visuais e os componentes React prontos para usar. Outra sessão do Claude vai integrar os componentes ao site, então siga o formato de entrega à risca.

## O produto

- **365 aulas diárias** (12 meses) que levam alguém do zero absoluto até improvisar solos. Cada aula leva 30 a 45 minutos.
- **Zero vídeo.** O ensino acontece com texto curto, som gerado no navegador, tablatura e partitura interativas e um braço de guitarra clicável. Também há conferência das notas pelo microfone.
- **Sem login.** O progresso fica salvo no navegador. Para trocar de aparelho, o aluno exporta e importa um **código hexadecimal**.
- **Público:** adolescentes e adultos brasileiros que nunca estudaram música. Muitos acessam pelo celular, apoiado na estante com a guitarra no colo.
- **Tom:** um amigo que toca bem e explica sem enrolar. Nada infantil, nada de "academia de música" engessada.

## Stack (obrigatório)

- **React 19 + TypeScript**, componentes de função.
- **Tailwind CSS v4**, com tokens declarados em `@theme` dentro de um `tokens.css`.
- Convenções do **shadcn/ui** (Radix por baixo, `cn()` com clsx + tailwind-merge, variantes com `cva`).
- Ícones: **lucide-react**.
- **Não use** outras bibliotecas. Áudio, metrônomo, detecção de altura e renderização de partitura **não são sua responsabilidade**: os componentes musicais são **visuais e controlados** (recebem dados por props e avisam eventos por callbacks como `onPress`, `onChange`, `onPlay`).
- O site é gerado com **Astro**, e esses componentes rodam como "ilhas" React. Não dependa de roteador nem de contexto global.

## Direção visual

### Temas
- **Escuro por padrão** (o aluno estuda à noite, muitas vezes no quarto). O tema claro é obrigatório e tem que ser igualmente cuidado.
- Tokens semânticos (`--bg`, `--surface`, `--fg`, `--muted`, `--line`, `--accent`…) redefinidos por tema. Nenhuma cor literal nos componentes.

### Identidade
- Busque referências no **mundo físico da guitarra**: madeira do escala (jacarandá), trastes de níquel, marcações de madrepérola, botões de amplificador, tolex, cordas.
- **O braço da guitarra é um objeto físico.** Madeira, trastes e cordas mantêm a mesma cor nos dois temas, como uma foto.
- **Evite:** gradiente roxo-azul, fundo creme com serifa e acento terracota, emoji como ícone de seção, neon, cara de template de SaaS e cantos arredondados iguais em tudo.

### Ponto de partida (pode melhorar)
Já existe um protótipo funcional com estas escolhas. Pode evoluir, mas justifique se mudar:
- Fontes: **Bricolage Grotesque** (títulos), **Figtree** (texto), **JetBrains Mono** (tablatura, nomes de notas, BPM). Todas do Google Fonts.
- Acento: teal (`#0d7a70` no claro, `#3fd2c2` no escuro).
- Madeira `#3b2518`, mão (headstock) `#24160e`, trastes `#bdb9ae`, cordas `#e7dcc4`, madrepérola `#efe7d4`.

### Cores com significado musical (crítico)
Estas cores se repetem em **todos** os componentes musicais (braço, diagrama de acorde, tablatura, treino de ouvido). Defina-as como tokens próprios, com contraste suficiente sobre a madeira **e** sobre o fundo da página:

| Token | Significado |
|---|---|
| `--deg-root` | Tônica (1) |
| `--deg-3` | Terça (3 ou b3) |
| `--deg-5` | Quinta |
| `--deg-7` | Sétima |
| `--deg-ext` | Tensões (9, 11, 13) |
| `--note-in` | Nota da escala atual (ex.: pentatônica) |
| `--note-tension` | Da escala, mas tensa (meio tom de uma nota do acorde) |
| `--note-out` | Fora da escala |
| `--good` / `--warn` / `--bad` | Feedback: acertou, quase, errou |

Cor nunca pode ser o único sinal. Junto da cor vai sempre um texto (nome da nota ou grau), uma forma ou um padrão (ex.: tracejado na tônica).

## Componentes a entregar

### A. Fundamentos
1. `tokens.css`: cores (claro e escuro), tipografia (escala de tamanhos), espaçamento, raios, sombras, durações de animação, `prefers-reduced-motion`.
2. Página de referência (`DesignSystemPreview.tsx`) mostrando todos os tokens e componentes nos dois temas.

### B. Base (estilo shadcn, adaptados à identidade)
`Button` (primary, secondary, ghost, danger; tamanhos sm/md/lg; estado carregando), `ToggleGroup`, `Tabs`, `Dialog`, `Tooltip`, `Badge`, `Progress`, `Slider`, `Checkbox`, `Input`, `Callout` (variantes: `dica`, `atencao`, `autoavaliacao`, `teoria`).

### C. Estrutura do curso
1. **`AppHeader`**: nome do curso, dia atual ("Dia 37 de 365"), botão de progresso, troca de tema.
2. **`YearMap`**: mapa dos 12 meses × 30 dias (o mês 12 tem 35). Cada dia tem estado: `bloqueado`, `disponivel`, `atual`, `concluido`, `marco` (desafio do fim do mês). Tem que funcionar no celular.
3. **`LessonLayout`**: página da aula com cabeçalho (mês, dia, título, tempo estimado, objetivos) e os **4 blocos fixos** em sequência:
   1. Revisão espaçada
   2. Conceito
   3. Laboratório (técnica e ritmo)
   4. Ouvido e criação

   Cada bloco tem duração sugerida e pode ser marcado como feito. No fim: "Concluir aula".
4. **`LessonBlock`**: o container de cada um dos 4 blocos.
5. **`SelfCheck`**: checklist de autoavaliação ("punho reto?", "polegar atrás do braço?").
6. **`MilestoneCard`**: o desafio de fim de mês (meta, critério de sucesso, BPM alvo, botão para tentar).
7. **`ProgressCodeDialog`**: mostra o código hexadecimal de progresso, com botão copiar, campo para colar outro código, validação ("código inválido: confira se colou inteiro") e resumo do que será importado ("Dia 37, 36 aulas concluídas"). O código tem cerca de 100 caracteres: mostre em grupos de 4, em fonte mono, quebrando linha no celular.

### D. Componentes musicais (os mais importantes)
Todos controlados, sem áudio interno. Precisam funcionar com toque no celular e com teclado.

1. **`Fretboard`**
   - Props: `tuning` (array de MIDI, aguda em cima por padrão), `frets` (0–24), `startFret`, `markers` (lista `{string, fret, label, kind}` com `kind` ∈ `root | deg-3 | deg-5 | deg-7 | ext | in | tension | out | ghost | active`), `highlightRange` (ex.: a "caixa" das casas 5–8), `showNoteNames`, `orientation` (`horizontal` padrão; `vertical` opcional para o celular), `onPress(string, fret)`.
   - Visual: madeira, trastes, marcações (3, 5, 7, 9, dupla na 12), números das casas, área das cordas soltas, espessura das cordas variando do grave ao agudo, animação curta no toque.
   - Responsivo: rolagem horizontal no celular sem cortar.
2. **`ChordDiagram`**
   - Diagrama vertical clássico com nome do acorde, casa inicial (em algarismo romano quando não começa na 1ª), X (abafada), O (solta), pestana, número do dedo ou grau dentro da bolinha.
   - **Modo multiponto**: marcadores ● ✕ ■ ▲ indicando a ordem de troca dos dedos (condução de vozes). Inclua legenda.
3. **`ScoreFrame`**: moldura visual para a partitura + tablatura (a renderização em si vem do alphaTab). Controles: tocar/pausar, velocidade (50–100%), loop de trecho, metrônomo ligado/desligado, contagem antes de começar.
4. **`RhythmSlashes`**: barras rítmicas com cifra em cima, compasso por compasso, indicando o tempo atual.
5. **`Metronome`**: BPM grande, −/+ e slider, toque para marcar o tempo (tap tempo), compasso (2/4, 3/4, 4/4, 6/8), **modo de clique** (todos os tempos, só o 1, só os contratempos, compasso mudo) e indicador visual da batida. Tem que ser usável de longe, com o celular na estante.
6. **`Drone`**: escolhe a nota de fundo e liga/desliga.
7. **`BackingTrackPlayer`**: nome da base, tom, BPM, sequência de acordes com o acorde atual destacado, play, loop.
8. **`EarTrainer`**: pergunta ("Que intervalo é esse?"), botão ouvir de novo, alternativas, feedback de acerto e erro, placar da sessão e barra até a meta de **80%**.
9. **`PitchMeter`**: visor tipo afinador para "toque a nota alvo" e "confira o bend". Mostra nota alvo, nota detectada e desvio em cents (−50 a +50), com zona de acerto. Inclua o estado "permita o microfone".
10. **`NoteFixPuzzle`**: o exercício "ache a nota errada". Tablatura em fichas clicáveis, ficha selecionada, botões "← 1 casa" e "1 casa →", dica, estado de resolvido.

## Regras de qualidade

- **Acessibilidade:** contraste AA, foco visível, tudo operável por teclado, `aria-label` em português, alvos de toque com pelo menos 44px nos controles principais e animações respeitando `prefers-reduced-motion`.
- **Celular primeiro:** testado a 360px de largura, sem rolagem horizontal da página (só dentro do braço e da partitura).
- **Texto da interface em português**, claro e direto ("Concluir aula", "Ouvir de novo", "Volte uma casa"). Todo texto fixo dos componentes vem de props ou de um objeto `strings` exportado, para traduzir para inglês depois.
- **Componentes sem estado de negócio:** nada de `localStorage`, fetch ou áudio dentro deles.
- Tipos TypeScript exportados para todas as props.

## Formato de entrega

Entregue **cada arquivo num bloco de código separado**, com o caminho completo na primeira linha como comentário. Use exatamente esta estrutura:

```
src/styles/tokens.css
src/lib/cn.ts
src/components/ui/<Base>.tsx          (Button, Dialog, ...)
src/components/course/<Curso>.tsx     (AppHeader, YearMap, LessonLayout, ...)
src/components/music/<Musical>.tsx    (Fretboard, ChordDiagram, ...)
src/components/DesignSystemPreview.tsx
```

Depois dos arquivos, inclua:
1. Uma lista curta das decisões de design (paleta, fontes, por quê).
2. As dependências npm exatas que os componentes usam.
3. O que ficou de fora ou precisa de decisão.

Se não couber tudo numa resposta, entregue em partes, nesta ordem: **fundamentos → musicais → curso → base**. Avise no fim de cada parte o que falta.
