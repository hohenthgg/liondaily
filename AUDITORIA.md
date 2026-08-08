# Lions Daily — auditoria e reconstrução

Registro do que foi encontrado ao auditar a versão anterior, do que foi corrigido
e de como o aplicativo passou a ser organizado. Serve de referência para conferir
qualquer afirmação da interface.

---

## 1. A hierarquia que passou a organizar tudo

```
NATAL          o que é possível          promessa
  ↓
CRONOCRATOR    o que está autorizado     firdaria, senhor do ano
  ↓
CONTEXTO       o campo do período        revolução, profecção
  ↓
GATILHO        o que ativa agora         trânsito
  ↓
HOJE           o que disso é relevante   recorte do dia
```

Nada sobe de nível sozinho. Um trânsito só aparece na tela inicial se toca um
ponto que o mapa promete **e** envolve um planeta que alguma camada de tempo
autoriza. O resto fica na gaveta "outros contatos, sem autorização de camada" —
visível para conferência, nunca como testemunho.

Os dois modos não se misturam:

- **HOJE** — guia diário. Sintetiza. Responde *o que importa agora, por quê, e
  de onde no mapa isso vem*.
- **MAPA** — consulta natal. Aprofunda. Seis abas: Mapa, Técnica, Perfil,
  Promessas, Saúde, Guia.

---

## 2. Erros encontrados e corrigidos

### 2.1 Efemérides com erro de até 7′ *(precisão)*

A versão anterior calculava as posições por aproximação kepleriana própria.
No instante natal, Saturno saía a `340,038°` contra `340,1546°` da efeméride de
referência — **7 minutos de arco de erro**, o bastante para trocar um termo.

Substituído pelo **Astronomy Engine** (Don Cross, MIT — VSOP87/ELP2000
truncados), vendorizado em `vendor/astronomy.min.js`. Conferência das sete
longitudes natais contra a referência:

| planeta  | calculado  | referência | Δ     |
|----------|-----------|------------|-------|
| Sol      | 144,2368  | 144,2372   | 0,02′ |
| Lua      | 275,0385  | 275,0388   | 0,02′ |
| Mercúrio | 148,7243  | 148,7248   | 0,03′ |
| Vênus    | 190,0766  | 190,0778   | 0,07′ |
| Marte    |  90,3749  |  90,3749   | 0,00′ |
| Júpiter  | 217,7816  | 217,7818   | 0,01′ |
| Saturno  | 340,1538  | 340,1546   | 0,05′ |

O nó lunar diverge da referência antiga em 1,47′. É a nossa conta que está
certa: usamos o **nó médio** pela série de Meeus (47.7); a diferença é o erro
residual da efeméride caseira anterior. Continua sendo o nó **médio**, e não o
verdadeiro, porque é o médio que a carta de referência usa — entre um e outro
há até 1°40′, o suficiente para mudar de casa.

### 2.2 Revolução solar sem casas próprias *(o erro conceitual mais grave)*

Os planetas da revolução eram classificados **nas cúspides natais**. Isso é uma
contradição: a revolução é uma carta levantada para o instante do retorno, com
ascendente e casas próprios. Os dados guardados nem sequer continham cúspides da
revolução — só `asc` e `mc` —, de modo que as casas da revolução nunca foram
calculáveis.

Agora a revolução é calculada por resolução do instante exato em que o Sol volta
ao grau natal (conferido: erro de **0,8 segundo de arco**), com cúspides próprias
para o lugar em que o nativo está, e a leitura é **dupla e separada**: casas da
revolução de um lado, sobreposição sobre o natal do outro. A aba mostra as duas
colunas lado a lado.

Foi acrescentada a **ordem de leitura** que a técnica manda seguir, em cinco
passos numerados: ascendente da revolução → seu regente → senhor do ano da
profecção dentro da revolução → luminares → contatos com o natal. Antes tudo
aparecia em pé de igualdade.

Um detalhe que estava errado por tabela: a revolução exibida era a do **ano
civil**. Entre 1º de janeiro e o aniversário, quem está no ar é a do ano
anterior. Corrigido.

### 2.3 Estrelas fixas: orbe inconsistente e contatos fixados à mão

O texto da interface prometia "orbe de até 1°" e o código filtrava por `1.5`.
Além disso, os contatos eram **pares planeta→estrela escritos à mão**, com as
longitudes já precessadas para 1994 — nada era detectado, tudo era declarado.

Agora há um **detector dinâmico**: catálogo de 58 estrelas em longitude e
latitude eclípticas J2000, precessão de 50,29″/ano aplicada à época pedida, e
varredura de todos os pontos do mapa contra todo o catálogo. Orbe único e
explícito:

- **núcleo** — até 1°00′
- **secundário** — de 1°00′ a 1°30′
- acima disso não existe

Acrescentado um aviso que faltava: estrelas com latitude eclíptica alta (Dubhe a
50°, Alphecca a 44°, Vega a 62°) recebem etiqueta dizendo que a conjunção é
**apenas em longitude** — no céu, estrela e planeta não se encontram, e a
tradição paranatelôntica pediria outra conta.

### 2.4 Antiscia: graus contra minutos

Mesmo problema de fronteira. A matemática foi reconferida e documentada no
código:

- antiscion = reflexão no eixo dos solstícios → `180° − λ`
  (15° Gêmeos = 75° → 105° = 15° Câncer; mesma declinação ✓)
- contra-antiscion = reflexão no eixo dos equinócios → `360° − λ`
  (10° Touro = 40° → 320° = 20° Aquário; declinações opostas ✓)

O contato de contra-antiscion entre Sol e Júpiter, apresentado antes como
válido, está a **2°01′** — fora de qualquer orbe defensável. Continua listado,
mas na gaveta "fora do orbe adotado", com a explicação. Neste mapa **não há
nenhum contato de antiscia dentro de 1°30′**, e a tela diz isso.

### 2.5 Horas planetárias presas a Pouso Alegre

A latitude estava fixa em `-22.2271`. Agora o **local atual** é separado do
**local natal**, é editável pelo menu (por coordenadas ou por GPS) e fica
guardado. A revolução solar é levantada para o local atual, e a busca de janelas
eletivas também. As quatro referências de lugar ficaram distintas: natal, atual,
revolução e eletiva.

O dia planetário passou a começar corretamente **no nascer do Sol**, não à
meia-noite — por isso, antes da aurora, o regente do dia ainda é o do dia
anterior.

### 2.6 Aspectos sem aplicativo/separativo nem tempo de perfeição

Havia só orbe. Um aspecto que já passou era mostrado igual a um que está para
acontecer. Agora cada aspecto declara se está **aplicando** (a distância ao
ângulo exato diminui — é o que opera) ou **separando**, e todo aspecto aplicando
recebe a **data e hora da perfeição**, resolvida por bisseção. Na tela HOJE, os
aplicando vêm primeiro.

A Lua ganhou o papel que a tradição lhe dá: **agenda temporal**. A tela mostra o
que ela ainda perfaz antes de sair do signo, na ordem, e avisa quando está
**vazia de curso**.

### 2.7 Condição planetária rasa

Havia apenas etiquetas soltas de dignidade. Agora existe um motor completo:

- **essencial** — domicílio +5, exaltação +4 (com grau exato), triplicidade +3
  (Dorotheus, por seita), termo +2 (egípcios), face +1 (caldaica), exílio −5,
  queda −4, peregrino −5
- **acidental** — casa e angularidade, alegria, velocidade, retrogradação,
  estacionário, cazimi / combusto / sob os raios / livre dos raios, oriental e
  ocidental, seita e **hayz**, sítio entre maléficos
- **recepções** — simples e mútuas, com distinção entre mútua forte (domicílio
  ou exaltação dos dois lados) e menor
- **cadeia de dispositores** — até fechar em domicílio próprio ou em ciclo

Neste mapa aparecem três recepções mútuas fortes que a versão anterior não
mostrava: Lua–Marte, Vênus–Saturno e Marte–Júpiter.

### 2.8 Casas em Placidus, reimplementadas e conferidas

Recalculadas do zero por iteração de semiarco. Erro máximo contra as cúspides de
referência: **19 segundos de arco** nas doze. Acima de 66° de latitude o semiarco
degenera e o sistema cai para Porfírio, dizendo que caiu.

---

## 3. O que foi reposicionado, não corrigido

Coisas que não estavam erradas por cálculo, mas prometiam mais do que podiam.

### 3.1 Os 48 eixos → **EXPERIMENTAL**

Não vêm da tradição. São uma grade moderna que converte testemunhos do mapa em
polaridades de comportamento. Retiradas as porcentagens de posição e a
"confiança 78%", que davam ao resultado uma cara de psicometria. No lugar:
**cinco faixas nomeadas** (sem inclinação clara / leve / consistente / marcada /
muito marcada), uma frase sobre a convergência dos testemunhos, e a **lista crua
dos testemunhos** que produziram o resultado — para poder ser conferida e
descartada.

### 3.2 Temperamento → **DERIVADO**

Os testemunhos são os que a tradição manda pesar (Ascendente e seu senhor, Lua e
sua fase, estação, planetas que tocam Ascendente e Lua). **Os pesos entre eles
são nossos.** Por isso o bloco leva o selo derivado, e não tradicional. As
proporções viraram escalas qualitativas: `acentuadamente quente`,
`acentuadamente seco` — não `73%`.

### 3.3 Saúde → correspondências, e nada além

Removido o gráfico de tendência a doenças. Nele, uma correspondência simbólica
aparecia com forma de estimativa de risco, o que é uma promessa que a astrologia
não pode cumprir e que a interface não tinha o direito de sugerir. Ficaram as
correspondências históricas — melotesia (signo → região do corpo), funções
planetárias de Culpeper, o excesso característico do humor e o regime que a
tradição galênica prescrevia contra ele — com aviso explícito no topo.

### 3.4 Eletiva → busca de janela, não grafo

Removido o grafo 3D, que era decorativo. No lugar, uma **busca de janela real**:
escolhe-se o assunto, o aplicativo varre as próximas 72 horas de duas em duas
horas e mostra, para cada uma, **quais dos dez testemunhos tradicionais de
eleição são satisfeitos e quais não**, com a fonte de cada regra. O saldo
aparece, mas só porque cada parcela está visível na mesma linha: é a conta
aberta, não uma nota.

### 3.5 Linha do tempo → cronologia real

Removidas as barras de porcentagem, que sugeriam uma grandeza contínua onde só
há categorias. Cada evento tem **instante** e uma de três faixas: **PRIMÁRIO**
(a camada vira por inteiro), **SECUNDÁRIO** (subdivisão dentro da camada),
**CONTEXTO** (pano de fundo).

---

## 4. O que foi acrescentado

**Cadeia de significação** — vale para qualquer planeta, em oito elos: o que é,
de que é significador, onde está, com que força, de quem depende, com quem fala,
quando manda, o que o toca agora.

**Promessas natais por tema** — doze temas de vida, cada um declarando por quais
casas se lê, qual é o significador natural, que lote pertence ao assunto, a
condição do senhor, e em que idades a profecção aciona aquele tema.

**Busca por tópico** — mais de cem palavras-chave ("dinheiro", "casamento",
"herança", "chefe", "casa 7") levam direto à promessa natal, ao planeta ou ao
verbete do glossário. `Ctrl/⌘ + K`.

**Taxonomia de certeza** — quatro selos em toda afirmação:

| selo | significa |
|---|---|
| TRADICIONAL | regra explícita nas fontes antigas |
| DERIVADO | consequência de regra tradicional aplicada a este mapa |
| HEURÍSTICO | critério de organização nosso, defensável mas não canônico |
| EXPERIMENTAL | construção moderna, sem lastro na tradição |

**Divulgação progressiva** — três níveis em cada bloco: a conclusão, sempre
visível; `por quê`, com o raciocínio; `cálculo`, com os números crus.

**Estado contra evento** — distinção explícita. Estado tem duração e se mostra
com orbe ou intervalo; evento tem instante e se mostra com data e hora.

**"Como esta tela foi decidida"** — o critério de prioridade da tela inicial
escrito por inteiro, com os pesos, para poder ser contestado.

---

## 5. O que o aplicativo deliberadamente não faz

- não prevê acontecimentos — diz o que está ativo e por qual regra
- não dá nota a dias nem calcula "clima do dia"
- não mede personalidade
- não diagnostica

---

## 6. Arquitetura

Arquivo único de 220 KB dividido em módulos com responsabilidade declarada:

| arquivo | o que faz |
|---|---|
| `vendor/astronomy.min.js` | efemérides (Astronomy Engine, MIT) |
| `js/astro.js` | posições, Placidus, eventos por bisseção, revolução, horas planetárias |
| `js/tradition.js` | dignidades, condição, recepções, seita, lotes, estrelas, antiscia |
| `js/corpus.js` | só texto: Olavo, Barbault, Abu Ma'shar, guia, temperamento, eixos |
| `js/chrono.js` | firdaria, profecção, revolução, trânsitos, cadeia, briefing, cronologia |
| `js/perfil.js` | temperamento, 48 eixos, correspondências de saúde |
| `js/ui.js` | componentes e telas HOJE e MAPA |
| `js/telas.js` | telas Técnica, Perfil, Promessas, Saúde, Guia |
| `js/app.js` | navegação, busca, edição, sincronização |

Nenhuma dependência de rede: fontes do sistema, nada de CDN.

---

## 7. Testes conceituais

Vinte verificações rodam contra o aplicativo montado, no navegador:

- planeta a 0,001° depois da cúspide 5 cai na casa 5; 0,001° antes, na casa 4
- planeta a 3° da cúspide seguinte é sinalizado como "na cúspide"
- Mercúrio retrógrado é detectado, penalizado e sua estação é datada
- existe ano com senhor do ano em queda (idade 3, Marte), e o texto explica sem
  catastrofismo: o significador chega sem apoio do lugar, não que o ano será ruim
- coincidências entre profecção e firdaria são detectadas e explicadas
- estrela a 0°59′ → núcleo; a 1°29′ → secundário; a 1°31′ → não é contato
- recepções mútuas são detectadas
- mudar de local **não** muda o instante da revolução, mas **muda** o ascendente
- a hora planetária muda com o local
- o contra-antiscion Sol–Júpiter a 2°01′ fica fora do orbe e é rotulado como tal
- todo bloco carrega selo de certeza
- os 48 eixos não expõem porcentagem
- o temperamento vem em faixa nomeada
- a revolução tem casas próprias, distintas da sobreposição natal
