# Prompt de pesquisa: currículo de Canto da Pauta (12 meses, 365 aulas)

> Cole tudo abaixo da linha num Deep Research. O resultado vira `docs/curricula/voice.md`, no mesmo formato de `guitar.md` e `keyboard.md`. Se der para anexar arquivos, anexe `docs/curricula/keyboard.md` (modelo de formato) e `docs/design-system-brief-voice.md` (o que a interface vai ter).

---

## Tarefa

Pesquise e escreva o **currículo-base de um curso de canto de 12 meses, com uma aula por dia (365 aulas)**, para a **Pauta**, uma escola de música online **gratuita e open source**, em **português do Brasil**. O curso leva o aluno do **zero absoluto** (inclusive quem "acha que canta desafinado") até um **nível intermediário sólido e autônomo**: canta afinado e no tempo, conhece a própria voz, usa os registros sem forçar, lê uma melodia simples, faz segunda voz e interpreta uma canção com intenção.

Escreva **tudo em português do Brasil**, em linguagem clara e direta, com frases curtas. Termos técnicos em inglês só quando forem os usados na área (belt, twang, SOVT), sempre explicados na primeira vez.

## O formato do produto (não muda)

- **365 aulas diárias em 12 meses:** meses 1 a 11 com 30 aulas (dias 1–330), mês 12 com 35 (dias 331–365). **Um desafio no fim de cada mês** (o "marco de verificação").
- **Zero vídeo.** Só texto curto, diagramas, áudio gerado e exercícios interativos.
- **Cada aula tem 4 blocos:** (1) **revisão espaçada** (algo de 7 e de 30 dias atrás), (2) **conceito** (um microconceito), (3) **laboratório** (prática guiada) e (4) **ouvido e criação**.
- **Duração:** nos outros cursos são 30 a 45 minutos. Para a voz, **pesquise e recomende** uma duração segura por fase (carga vocal), com **pausas de voz** dentro da aula.
- **Sem login, sem professor.** O aluno estuda sozinho. Tudo que um professor de canto corrigiria precisa virar **protocolo de autocorreção** escrito.
- **Público:** qualquer pessoa. Adultos de todas as vozes, **crianças** e **adolescentes em muda vocal**, e pessoas trans (voz em transição, com ou sem hormônio). O currículo precisa dizer o que muda para cada um desses grupos, onde houver diferença.
- **Exemplos e repertório:** só **originais** ou de **domínio público** (cantigas de roda, folclore brasileiro, hinos e canções antigas, spirituals, árias e canções em domínio público). Os métodos citados servem de **parâmetro de nível**, nunca de fonte para copiar.

## As ferramentas que o curso vai ter (use-as no plano)

**1. O microfone do aluno.** O app mede, ao vivo: a **altura** (nota e desvio em cents), o **volume**, a **clareza** (voz limpa × soprada/ruído) e, de forma aproximada, os **formantes F1/F2** (para estimar a vogal). Também detecta **oitava errada**, nota deslizando ("scoop"), vibrato (velocidade e profundidade) e estabilidade de uma nota longa.
**O app não consegue** saber com segurança: registro (peito, cabeça, mix), tensão na garganta, postura, apoio respiratório, se a laringe subiu, se dói. **Para tudo isso, proponha protocolos** (sensações para checar, espelho, mão no corpo, gravar e ouvir, comparar com o exemplo).

**2. O Chimera, a voz-guia.** Um sintetizador de voz open source que **simula uma voz humana por física** (pulmões, pregas vocais, trato vocal, língua, lábios, véu palatino, nariz). Ele **canta os exemplos** e mostra numa **cabeça 3D** (e num corte 2D) o que acontece por dentro, ao vivo: pregas vocais abrindo e fechando (estroboscópio), o ar e a pressão no tubo, o espectro, o mapa de vogais. Os controles dele que o curso pode usar:
- **Fonte:** altura, pressão do ar, soprosidade, voz apertada (tensão), fry vocal, aspereza, vibrato (profundidade e velocidade), brilho.
- **Articulação:** mandíbula, língua (corpo, ponta, raiz), lábios (abertura, arredondamento, largura), **véu palatino** (nasalidade), **altura da laringe**, **epilaringe** (twang), falsas pregas.
- **Corpo da voz:** um **triângulo contínuo** entre adulto masculino, adulta feminina e criança. Isso muda o tamanho do trato vocal e das pregas, então muda o timbre, não só a altura. O aluno escolhe um ponto parecido com a própria voz e o Chimera canta na região dele.
- **Vogais:** tem as 7 orais do português (`a é ê i ó ô u`) e as nasais. **Ainda não lê letra em português:** canta vocalizes, sílabas simples e IPA. Para as canções, o curso precisa de outra solução (o aluno canta a letra; o Chimera dá a melodia em "lá" ou em sílabas). Diga **em que mês a falta de letra em português começa a pesar** e o que fazer até lá.

Para **cada mês**, diga **o que o Chimera demonstra** (ex.: "laringe alta × baixa na mesma nota", "a mesma vogal com e sem véu aberto", "peito × cabeça mudando a tensão e a fase aberta") e **o que o microfone checa**.

**3. As outras ferramentas da Pauta:** metrônomo, drone (nota contínua de referência), base de acompanhamento, treino de ouvido (intervalos, acordes, progressões), pauta com as notas, teclado na tela, gravador. Os exercícios planejados na interface são: piano roll de canto (guia + aluno), repetir uma nota, teste de extensão, treino de respiração, mapa de vogais do português, explicador "por dentro da voz", mapa de registros, medidor de vibrato, escada de solfejo e cartão de aquecimento. Se o currículo precisar de outro tipo de exercício, **proponha**.

## O que pesquisar

### 1. Mapa de níveis (parâmetro de chegada)
Compare os níveis de **iniciante absoluto** e **intermediário sólido (por volta do Grau 5)** em:
- **ABRSM Singing** e **ABRSM Singing for Musical Theatre**;
- **Trinity College London Rock & Pop Vocals** e **Trinity Singing**;
- **Rockschool (RSL) Vocals**;
- **Berklee** (Voice Department, ear training e Voice Lab) e **Musicians Institute** (Vocal);
- **Pedagogia brasileira de canto popular e erudito:** livros, métodos e cursos de referência no Brasil (conservatórios, universidades, cursos de canto popular). Liste os autores e obras que achar, **com as fontes**, e o que cada um traz. Não invente títulos; marque o que não conseguiu confirmar.
Monte uma **tabela de marcos por sistema** (como a Tabela 1 de `keyboard.md`): extensão exigida, escalas e arpejos, leitura à primeira vista, ouvido, repertório, improvisação, critérios de avaliação.

### 2. Abordagens técnicas (compare, não escolha uma escola só)
- **Pedagogia clássica** (bel canto, appoggio, passaggio, vogais modificadas).
- **Canto contemporâneo (CCM):** **Estill Voice Training** (as "figuras" e qualidades de voz), **Complete Vocal Technique (CVT)** (modos: neutro, curbing, overdrive, edge), **Speech Level Singing** e derivados, a pedagogia de **belt** com segurança.
- **Ciência da voz:** fonte-filtro, formantes, sintonia de formantes (formant tuning), o "singer's formant", registros como mecanismos laríngeos (M0, M1, M2), fase fechada/aberta, pressão subglótica. Autores como **Titze**, **Sundberg**, **Henrich** e outros que você achar.
- Onde as escolas **concordam** e onde **discordam**. Para um curso sem professor, recomende o caminho **mais seguro e mais fácil de autocorrigir**, e diga por quê.

### 3. Afinação e quem "canta desafinado"
- O que a pesquisa diz sobre **"poor-pitch singers"** e amusia (ex.: trabalhos de **Pfordresher**, **Dalla Bella** e outros): quantas pessoas realmente não conseguem, qual é o problema mais comum (percepção × produção × ligação entre as duas), e **o que funciona para melhorar**.
- **Feedback visual em tempo real** da altura (apps, piano roll, medidor de cents): o que os estudos mostram sobre ganho, retenção e dependência. **Com que frequência mostrar o feedback** (feedback contínuo × que vai sumindo, "faded feedback") para o aluno não ficar dependente da tela.
- **Oitava:** como lidar com o aluno cuja voz está numa oitava diferente da referência (homem cantando com voz feminina e o contrário, criança). Como o triângulo de corpo do Chimera ajuda.
- Tolerância de afinação razoável por fase (em cents), com fonte.

### 4. Respiração e apoio
O que é consenso e o que é mito (ex.: "respiração diafragmática", "apoio", "cantar com a barriga"). Exercícios com base em evidência, como medir progresso sem professor (tempo de "sss", estabilidade do volume no microfone).

### 5. Saúde vocal (obrigatório, com fontes)
- **Exercícios de trato vocal semiocluído (SOVT):** canudo, vibração de lábios e língua, "hum". Evidência e como usar no aquecimento.
- **Carga vocal e dose:** quanto tempo cantar por dia em cada fase, pausas, hidratação, o que cansa a voz.
- **Sinais de alerta** que fazem a aula mandar **parar e procurar otorrino ou fonoaudiólogo** (rouquidão que não passa em 2 semanas, dor, perda de agudos, falha na voz…). Escreva o texto exato do aviso.
- **Aquecimento e desaquecimento:** rotina curta com base em evidência.
- **Crianças:** extensão adequada por idade, o que não pedir.
- **Muda vocal (adolescentes):** fases, o que cantar e o que evitar, como o curso se adapta.
- **Vozes trans:** o que muda com testosterona; o que é treino de voz para afirmação de gênero (fala) × canto; cuidados. Com fontes de fonoaudiologia, em tom respeitoso e prático.

### 6. Ouvido, leitura e musicalidade para cantores
- **Solfejo:** dó fixo × dó móvel × números; qual usar no Brasil e por quê. Sinais de mão (Curwen/Kodály) servem sem vídeo?
- **Leitura à primeira vista cantada:** progressão de dificuldade e marcos.
- **Ritmo para cantores:** contar, subdividir, síncope, cantar no tempo da base.
- **Intervalos cantados**, arpejos, **cantar em terças**, **segunda voz**, cânones, harmonia vocal simples.
- **Improvisação vocal:** scat, variação melódica, ornamentos (melisma, riffs and runs) com segurança.

### 7. Português cantado (dicção)
- As **7 vogais orais e 5 nasais do português brasileiro** no canto: como abrir, como manter, modificação de vogal no agudo.
- Ditongos, **nasais** (onde a nasalidade começa e termina na nota), "r" e "s" regionais, consoantes no tempo certo (antes do tempo).
- Diferenças de dicção entre **canto popular brasileiro** e **canto lírico em português**. Referências brasileiras sobre dicção do português cantado (ex.: normas de pronúncia para o canto erudito brasileiro), com fontes.

### 8. Estilo e interpretação
O mínimo de cada estilo que um aluno intermediário deveria experimentar e **o que é seguro sem professor**: MPB, samba e bossa, sertanejo (inclusive a dupla em terças), gospel, pop, rock, musical, erudito leve. Interpretação: texto, intenção, dinâmica, frase, respiração no lugar certo, microfone.

### 9. Aprendizagem motora e o curso de 365 dias
Prática espaçada, intercalada e com variação **aplicadas ao canto**: estudos específicos de voz/canto, se houver. Como fazer um ano inteiro sem o aluno estagnar nem se machucar. Ensaio mental, gravar e ouvir, autoavaliação guiada.

## Formato do documento (siga esta ordem)

Título: `# Canto: currículo da Pauta (12 meses, 365 aulas)`. Abra com um bloco de citação dizendo que é uma síntese de referência e que os métodos citados são parâmetro de nível, não fonte para copiar. Depois, um resumo curto de iniciante × intermediário sólido e uma lista de **lacunas das fontes**.

1. **Mapa curricular:** os sistemas e a **Tabela 1: marcos por sistema**.
2. **O instrumento:** anatomia funcional sem jargão, fonte-filtro, registros, tipos de voz (como orientação, não rótulo), extensão e tessitura por grupo (homens, mulheres, crianças por idade, adolescentes em muda, pessoas trans), com uma **Tabela 2: extensões e tessituras de referência**.
3. **Técnica:** respiração e apoio, emissão e ataque, ressonância e vogais, registros e passagem, agilidade, vibrato, dinâmica. Com a **Tabela 3: escolas técnicas comparadas** (o que cada uma chama de quê).
4. **Afinação, ouvido e leitura:** a pesquisa de afinação, feedback visual, solfejo, leitura, harmonia vocal.
5. **Saúde vocal:** dose, aquecimento, SOVT, sinais de alerta (com o **texto pronto do aviso**), grupos especiais.
6. **Desenho de um curso de 365 aulas sem vídeo:** a ciência de aprendizagem aplicada, os **protocolos de autocorreção** (Tabela 4: o que o professor corrigiria → como o aluno checa sozinho → o que o app mede), e a duração da sessão por fase.
7. **Plano mestre da Pauta: 12 meses, 365 aulas.** Uma tabela com: **Mês (dias)**, **Referência de nível**, **Técnica e teoria principal**, **Prática**, **O que o Chimera demonstra**, **O que o microfone checa**, **Marco de verificação** (o desafio do mês, **medível pelo app sempre que der**: "segurar Sol 3 por 8 s dentro de ±25 cents"). Marque com **★** o que é material 100% da Pauta (lacuna das fontes).
8. **Detalhe do mês 1, dia a dia (30 aulas):** para cada dia, o título, o microconceito, o laboratório, o ouvido/criação e o que o app checa. O mês 1 precisa servir para **quem nunca cantou e tem vergonha**: o primeiro dia tem que dar uma vitória.
9. **Decisões pedagógicas críticas:** as escolhas que guiam o curso inteiro, com o porquê (ex.: quando o belt entra, quando a leitura entra, dó fixo ou móvel, quanto feedback visual).
10. **Notas do projeto:** como os passos da pesquisa viram os 4 blocos da aula; o que precisa existir no Chimera ou no app para o plano funcionar; o que muda no curso para crianças, adolescentes e vozes trans (trilhas, avisos, extensões); repertório de domínio público sugerido por mês (título, origem, por que serve).
11. **Fontes:** lista numerada com link de tudo que foi citado. Marque o que é estudo revisado por pares, o que é material oficial de exame e o que é fonte secundária.

## Regras

- **Cite a fonte** de cada número, regra ou afirmação técnica. Quando não achar fonte, diga "sem fonte" e marque como lacuna.
- **Não invente** livros, autores, estudos nem números. Prefira dizer que não achou.
- **Segurança vem primeiro:** nada que um aluno sozinho possa fazer e se machucar (distorção, belt alto, grito) entra sem preparo, aviso e limite claro.
- **Gentileza:** muita gente tem vergonha da própria voz. O texto pedagógico precisa encorajar sem infantilizar.
- **Nada protegido por direito autoral** como repertório. Canções conhecidas podem ser **citadas como referência de estilo**, nunca usadas como exercício.
- Prefira **tabelas** e listas curtas a parágrafos longos. O documento final deve ter entre 400 e 700 linhas de Markdown.
