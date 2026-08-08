/* ============================================================
   LIONS DAILY · corpus interpretativo
   Só texto e tabelas. Nenhum cálculo, nenhuma marcação de tela.
   Fontes: Lilly, Dorotheus, Abu Ma'shar, Ptolomeu (leitura objetiva);
   Olavo de Carvalho, Barbault, Hamaker-Zondag, Greene, Sasportas
   (leitura subjetiva); Culpeper e Galeno (temperamento e correspondências).
   ============================================================ */
(function (root) {
  "use strict";

  var NATUREZA = {
 "Júpiter":"protegido, na medida em que Júpiter é o grande protetor",
 "Vênus":"suavizado, na medida em que Vênus é a benéfica menor — favor, gosto e conciliação",
 "Saturno":"exigente, na medida em que Saturno é o senhor das provações — pede estrutura, tempo e paciência",
 "Marte":"cortante, na medida em que Marte é o maléfico menor — pede coragem e cuidado com a pressa",
 "Sol":"exposto à luz, na medida em que o Sol é o rei — dá honra, visibilidade e autoridade",
 "Mercúrio":"negociável, na medida em que Mercúrio é o mensageiro — toma a cor de quem o toca",
 "Lua":"ondulante, na medida em que a Lua é a senhora das marés — tudo vem em ciclos"};

  var CASA_ASSUNTO = {1:"corpo, vitalidade e identidade",2:"dinheiro, posses e sustento",3:"irmãos, estudos curtos e comunicação",
 4:"lar, família, raízes e imóveis",5:"filhos, prazer, criatividade e romance",6:"saúde, rotina e trabalho cotidiano",
 7:"casamento, parcerias e contratos",8:"heranças, dívidas, crises e transformação",9:"viagens longas, religião, lei e ensino",
 10:"carreira, reputação e autoridade",11:"amigos, grupos, aliados e projetos",12:"isolamento, retiro e inimigos ocultos"};

  var CASA_CURTO = {1:"vitalidade e identidade",2:"dinheiro e sustento",3:"comunicação e estudos",4:"lar e família",
 5:"filhos e criatividade",6:"saúde e rotina",7:"parcerias e contratos",8:"crises e heranças",
 9:"viagens e ensino",10:"carreira e reputação",11:"amigos e projetos",12:"retiro e isolamento"};

  var CASA_EVOCA = {1:"corpo, identidade e novos começos",2:"dinheiro, sustento e recursos próprios",
 3:"estudos, palavra, irmãos e deslocamentos",4:"casa, família, raízes e fundações",
 5:"criatividade, força e poder de ação, produção e prazer",6:"saúde, rotina, serviço e ajustes do cotidiano",
 7:"casamento, parcerias, contratos e o outro",8:"crises, medos, perdas, mudanças súbitas e heranças",
 9:"longas viagens, fé, estudo superior e lei",10:"carreira, reputação e autoridade",
 11:"amigos, alianças, projetos e esperanças",12:"recolhimento, bastidores e inimigos ocultos"};

  var OLAVO = {"Sol-1": "A Casa I trata da autoimagem e da aparência imediata do indivíduo; o Sol aqui configura a \"Inteligência Intuitiva Autônoma\". Para essa pessoa, o primeiro dado seguro que ela obtém é sobre si mesma: a própria imagem, contemplada ou apenas pensada, aparece como algo óbvio e inquestionável. O conhecimento de si parece tão natural que ela tem a impressão de se conhecer desde sempre e, por se sentir transparente aos próprios olhos, supõe-se igualmente transparente aos demais, achando inverossímil que alguém seja diferente dela.\n\nFaz parte da sua natureza não se preocupar de imediato em agradar ou não: autorreferencia-se o tempo todo, nunca estranha o próprio comportamento e o usa como modelo para captar o comportamento alheio. Sua biografia e os papéis que já desempenhou funcionam como chave de compreensão do mundo — como se a própria vida fosse o molde a partir do qual, por semelhanças e diferenças, as outras vidas se formassem.\n\nO traço fundamental dessa autoimagem é a liberdade: o indivíduo se vê como criador do próprio mundo, um centro que irradia livremente, tendo como informação básica, a cada instante, o repertório do que pode fazer e ser. Em contrapartida, quando não é o centro dos acontecimentos, nada intui espontaneamente: precisa de esforço para compreender o que o outro espera dele, pois a percepção da perspectiva alheia nunca é imediata — exige aprendizado.\n\nSíntese do autor: \"Intui primordialmente e toma como modelo de toda percepção da realidade sua auto-imagem.\" Exemplos: Santa Teresa de Ávila, Abraham Lincoln, Richard Wagner, Renoir, Rimbaud, Debussy, Toulouse-Lautrec e Guimarães Rosa.", "Lua-5": "A Casa V representa o conhecimento que o indivíduo tem de suas possibilidades de ação num dado momento — a consciência do poder pessoal, o domínio das situações que se podem conquistar ou perder. Com a Lua nessa casa, o indivíduo valoriza as situações de desafio porque acredita que é nelas que encontrará a felicidade: deseja a vitória e sente prazer no próprio ato de conquistar.\n\nO ponto central é a circularidade entre emoção e desempenho: o estado emocional determina a capacidade de enfrentar desafios, e vice-versa. A pessoa está feliz ou infeliz conforme o próprio desempenho e, ao mesmo tempo, o desempenho depende de ela estar feliz ou infeliz. Por isso, alternadamente pode sentir-se muito capaz ou muito incapaz, independentemente de motivos objetivos que justifiquem uma coisa ou outra.\n\nDisso decorre que a demonstração efetiva da sua capacidade depende de uma coincidência rara: é preciso que se encontrem, ao mesmo tempo, a oportunidade externa, a capacidade real e a motivação subjetiva.\n\nSíntese do autor: \"Sente como fonte principal de motivação ou desmotivação qualquer fato ou situação que interprete como um desafio à sua capacidade.\" Exemplos: Andersen, Cézanne, Rodin, Guilherme II, Matisse, Ravel, Picasso, Chevalier, Hemingway, Malraux e Mário Ferreira dos Santos.", "Vênus-2": "A Casa II refere-se ao conhecimento do mundo físico e dos dados sensíveis presentes — formas, cores, cheiros, sons, pesos, texturas — no confronto do indivíduo com o que o cerca. Com Vênus nessa casa, o indivíduo guarda na memória os dados sensíveis agradáveis captados do mundo físico, abstraindo-se dos desagradáveis, e utiliza esse acervo para otimizar as sensações do dia a dia.\n\nEle enxerga no ambiente físico as possibilidades que estejam de acordo com sua expectativa, aquelas capazes de satisfazer seu equilíbrio sensorial. O autor resume essa disposição na fórmula \"imaginação harmônica das sensações\": a fantasia trabalha continuamente a favor de uma experiência sensorial embelezada e gratificante do mundo material.\n\nHá, porém, um reverso: se um estado emocional invencivelmente depressivo se instala, ele se expressa com muita facilidade numa imagem alterada do mundo físico. A sensação generalizada de feiura do ambiente passa a exprimir, com nitidez física, o estado interior — o mundo externo torna-se o espelho da depressão.\n\nSíntese do autor: \"Imagina poder moldar sempre em sentido proveitoso ou gratificante tudo o que afete o seu equilíbrio sensorial.\" Exemplos: Alexandre Dumas, Lincoln, Mark Twain, Renoir, Toulouse-Lautrec e Camus.", "Marte-11": "A Casa XI refere-se aos projetos futuros do indivíduo, aos planos de vida e ao modo como ele concebe o próprio devir. Com Marte nessa casa, o indivíduo sente-se ameaçado por qualquer oposição ou questionamento dirigido a algo que está se propondo — algo que quer ser ou fazer — e por qualquer coisa que se interponha entre ele e seus planos.\n\nSua reação característica é tentar remover prontamente o obstáculo: há pressa, urgência em chegar ao objetivo proposto. Ele não quer perder tempo pensando, negociando ou transigindo; quer agir logo, desencadeando efeitos que o levem aonde deseja chegar. Essa mesma disposição tem dois desdobramentos opostos: pode levá-lo a abandonar, num repente, projetos longamente acalentados, mas também pode dar-lhe a capacidade de adaptar de improviso uma situação fortuita, amoldando-a aos seus planos.\n\nSe o indivíduo não for ambicioso, poderá agir no sentido de destruir as próprias possibilidades futuras, antes que outras pessoas o façam.\n\nSíntese do autor: \"Reage de maneira pronta, exteriorizada e fugaz a qualquer informação que afete sua visão de futuro.\" Exemplos: Napoleão, Schubert, Balzac, Emerson, Cézanne, Hardy, Jung, Graciliano Ramos, Koestler e Camus.", "Júpiter-3": "A Casa III refere-se ao pensamento e à linguagem — ao estabelecimento de relações entre as coisas, de modo a representar uma coisa por outra, no jogo de signo e significado. Com Júpiter nessa casa, o indivíduo tem uma autoconfiança ilimitada na própria capacidade de aprendizagem e de fazer associações entre ideias e conceitos.\n\nEssa confiança estende-se à comunicação: ele confia na sua capacidade de transmitir aos outros o que pensa e aprende, e de persuadir o interlocutor de qualquer coisa que queira. Não se deixa abater por argumentações contrárias; se muda de ideia, precisa sentir-se ele mesmo o autor da mudança. Quer estar livre para pensar o que quiser e confia na eficácia da própria palavra, no seu poder de convencer.\n\nEssa confiança é espontânea, dogmática e totalmente independente de ter ou não fundamento. Será a capacidade intelectual real do indivíduo que decidirá se ela resultará em eficácia genuína no aprender e no falar, ou numa inépcia verbosa.\n\nSíntese do autor: \"Age como se tivesse o poder de amoldar a seus propósitos o curso do raciocínio — seu ou alheio.\" Exemplos: Leonardo da Vinci, Santa Teresa de Ávila, Rimbaud, Debussy, Chaplin, Hemingway e Mário Ferreira dos Santos.", "Saturno-7": "A Casa VII trata da apreensão do eu através da relação com o outro — o conhecimento por espelhismo, as expectativas bilaterais e a definição mútua de papéis. Com Saturno nessa casa, o indivíduo focaliza a atenção no outro e constata, perplexo, que cada pessoa o vê de uma forma diferente. Os outros funcionam como espelhos e, diante de tantas imagens, torna-se difícil obter uma imagem coerente de si mesmo. Ele compara incessantemente as muitas imagens colhidas ao longo da vida, tentando uma síntese inevitavelmente problemática, o que dificulta as tomadas de posição momentâneas.\n\nOs outros lhe parecem reais, enquanto ele próprio se sente insubstancial, escorregadio. Em tudo o que faz sente-se observado por espectadores, reais ou imaginários, e procura corresponder às diferentes expectativas deles. A cada comparação de comportamentos, tenta extrair uma regra que explique o passado e prepare o futuro — uma espécie de código moral e jurídico para si mesmo. Tentando agradar a todos, torna-se vulnerável a que os outros lhe \"grudem\" a máscara que quiserem.\n\nNa relação, confiar e desconfiar é sempre desconfortável: qualquer falha do outro vira motivo de desconfiança, e ele oscila entre a rigidez no exigir e uma benevolência sem critério. Não há espelho estável de si no outro, pois não há uniformidade na conduta alheia; agindo por tentativa e erro, erra até consolidar conclusões gerais válidas. A aporia da posição: \"Se cada 'outro' me vê como uma forma diferente, eu então não sou nada? Serei apenas um conjunto de imagens?\"\n\nExemplos: Pasteur, Mussolini e Graciliano Ramos."};

  var BARBAULT_SIGNO = {"Sol": ["Leão", "O leonino é uma força da natureza, muitas vezes de constituição atlética e animada por um temperamento bilioso. Um forte, são, que vai ao encontro da vida, confiante, feliz, natural, com uma abundância vital que lhe dá aprumo, envergadura, certeza, audácia, uma sede de conquista, de domínio, de ambições. É um apaixonado: impulso do Eu, expansão vital, sentimento de grandeza, orgulho, necessidade de prestígio, caráter magnânimo e altaneiro; ambição realizadora visível, forças íntimas mobilizadas a serviço de uma paixão principal, de um ideal dominante que se torna a alma da sua vida; sentido do mando, do poder, das responsabilidades. Risco de inflação do Eu, com necessidade de ser olhado, apreciado, admirado."], "Lua": ["Capricórnio", "O instinto feminino, e sobretudo maternal, acha-se empobrecido e sujeito à sublimação social (paixão profissional). A sensibilidade é recalcada, reprimida ou disciplinada. Contribui para o celibato ou para o casamento de interesse ou pela razão. A fuga diante do amor em Napoleão é característica desta posição."], "Mercúrio": ["Leão", "Inteligência soldada à vontade e às necessidades vitais; encarnando-se na matéria viva do indivíduo, ilumina e prolonga a sua ação sem metafísica nem sutilezas dialéticas. Espírito lúcido e lógico, que precisa de conhecer melhor para melhor gozar; vistas largas e vista penetrante — o relance de olhos — para agir em plena clareza e transformar em consciência a sua mais ampla experiência de vida."], "Vênus": ["Libra", "Alma afetuosa e amável; doçura, bondade, sentido estético, amor de caráter delicado, requintado, harmonioso. Conhece a hesitação perante o amor, pois a sua atração é temperada por um jogo de entusiasmos e contenções, de desejos e temores. O ser precisa de socializar a sua paixão, de fazê-la desabrochar no quadro das conveniências e dos costumes: é feito para o casamento, a união."], "Marte": ["Câncer", "A agressividade marciana em queda e desarmada, recalcada ou simplesmente passiva — a defesa passiva, a tenacidade, à maneira das tenazes do caranguejo que não larga. É possível a compensação, como em Byron que, enfermo, quis ser e foi nadador, boxeador, esgrimista, guerreiro. De modo geral, a agressividade volta-se contra o sujeito ou exerce-se no interior, no meio íntimo. Posição pouco propícia às conquistas exteriores, sobretudo militares."], "Júpiter": ["Escorpião", "É o poder da águia do astro e do signo que se afirma: magnetismo, vontade, autoridade, ambição, instinto criador, qualidade soberana. A intensa pulsão vital de Luís XIV e de Napoleão reside em parte nesta posição, neles dominante."], "Saturno": ["Peixes", "Símbolo da solidão, da prisão escura de onde a alma queria escapar; tende para a complacência mórbida e para o masoquismo. Predisposição para o sacrifício (Huysmans, Leconte de Lisle, Newton, Schopenhauer)."]};

  var BARBAULT_CASA = {"Sol": [1, "Coeficiente de atividade ou de atratividade; propício para tomar o leme do seu destino, impor-se pelo seu magnetismo pessoal, manifestar uma aptidão com eficácia ou realizar pelos seus próprios meios; dá relevo à personalidade. Particularidades solares tanto mais salientes quanto mais o astro está perto do Ascendente. Bem colocado, o Sol é fator de elevação, ascensão, distinção, valorização da personalidade — numa palavra, de êxito."], "Lua": [5, "O astro da fecundidade no setor dos filhos: contando na vida o amor de um ou mais filhos. Diversidade nos prazeres e distrações; possibilidade de ligações amorosas fáceis, inconstantes, numerosas."], "Mercúrio": [1, "Coeficiente de retração do instinto e de cerebralização que facilita a adaptação à vida; fator de inteligência. Particularidades mercurianas tanto mais pronunciadas quanto mais o astro está perto do Ascendente. É-se aquilo que se pensa. Bem situado, o astro dá facilidade de adaptação, um à-vontade que permite viver agradavelmente."], "Vênus": [2, "Cria uma associação afetiva entre o amor e o dinheiro. A fortuna está em parte ligada à vida sentimental; aquisições (ou perdas) vindas de pessoas amáveis e amadas; posição significativa de presentes, dádivas. Atitude pecuniária harmoniosa e equilibrada, que permite viver materialmente de modo satisfatório, além de suscitar a intervenção da roda de socorro em caso de necessidade; facilidade para ganhar."], "Marte": [11, "A amizade é um transporte espontâneo, muitas vezes impulsivo, de sentimentos generosos, francos e expansivos, que não exclui os entusiasmos irracionais, as pressões tirânicas, os excessos apaixonados ou as rivalidades na emulação. A amizade é um esporte ambivalente que conduz, em dissonância, às disputas entre amigos, às rupturas violentas, aos entusiasmos de curta duração."], "Júpiter": [3, "Favorece as relações com o meio, no qual o indivíduo se afirma e do qual tira bons proveitos. Favorece igualmente os estudos; sucessos nos exames. Pode permitir o êxito no domínio das comunicações, relações e deslocamentos; proteção na estrada, apesar do desejo de nela afirmar o seu poder."], "Saturno": [7, "Incompatibilidade da natureza do astro e das afetações deste setor. A menos que seja harmônico — e nesse caso estabiliza uma união calma, de razão ou de interesse —, Saturno é um obstáculo ao casamento: celibato, casamento tardio e difícil de realizar, um impedimento na realização da união desejada, uma união sem amor ou infeliz, ou mesmo a destruição da união por separação ou viuvez. Igualmente contrário às associações, que podem causar infortúnio."]};

  var GUIA = {
 planetas:{t:"Os planetas — os atores",sub:"quem age",dupla:true,
  intro:"Cada planeta pode ser lido em dois registros: o objetivo da tradição — pessoas, ofícios e coisas do mundo que ele significa — e o subjetivo moderno, em que o planeta é imanentizado como uma faculdade da alma.",
  itens:[
   ["☉","Sol","Reis, príncipes e toda autoridade; honras, dignidades e ofícios de comando; o ouro; a vitalidade e o coração; no mapa diurno, o pai. Onde está, mostra de onde vem a honra do nativo.","O centro da consciência: a identidade que integra as demais funções, o senso de propósito e a vontade de ser alguém — o herói da própria narrativa, aquilo em torno do qual a psique se organiza."],
   ["☽","Lua","O povo e as multidões, a mãe, as rainhas; viagens, águas, navegações; o corpo e seus fluxos; tudo o que muda depressa. Rege as concepções, os partos e a vida comum.","O inconsciente pessoal: hábito, memória e necessidade de segurança; o modo de reagir antes de pensar; a criança interna e o que o corpo pede para se sentir em casa."],
   ["☿","Mercúrio","Escribas, mercadores, mensageiros e advogados; contratos, contas, cartas e caminhos; os jovens; quando aflito, ladrões e trapaças. Toma a natureza de quem o configura.","A função cognitiva: linguagem, análise e mediação; a razão discursiva que nomeia a experiência e negocia entre os mundos — como a mente conecta e traduz."],
   ["♀","Vênus","As mulheres, o casamento e os prazeres; artes, música, adornos, perfumes; a paz e os acordos; joias e coisas belas. Benéfica menor: concilia o que Marte corta.","A função de relação e de valoração: eros, gosto e capacidade de amar; o que atrai e o que se acha belo — o critério afetivo com que a psique diz sim."],
   ["♂","Marte","Soldados, cirurgiões e ferreiros; o ferro e o fogo; feridas, febres, disputas e guerras; quando bem posto, a coragem que vence. Maléfico menor: corta para separar.","A agressividade constitutiva: assertividade, desejo e defesa do território do eu; a faculdade de dizer não, competir e romper — sem ela, a identidade não se afirma."],
   ["♃","Júpiter","Juízes, clérigos, nobres e conselheiros; as leis, a religião e a riqueza; honras públicas e favores; a fertilidade e os filhos. Benéfico maior: onde toca, amplia e protege.","A função de sentido: fé, expansão da consciência e busca de significado; a confiança de que a vida tem direção — o otimismo estrutural que abre futuro."],
   ["♄","Saturno","Velhos, camponeses, monges e coveiros; terras, minas, edifícios antigos; prisões, dívidas longas e heranças; a morte e o que dura. Maléfico maior: pesa, atrasa e consolida.","O princípio de estrutura e limite: o tempo interno, o superego, o medo que disciplina; a faculdade de renunciar, esperar e amadurecer — o que dá forma por subtração."]]},
 signos:{t:"Os signos — a narrativa solar",sub:"como agem",ciclo:true,
  intro:"Os doze signos contam a história do Sol ao longo do ano: cada um é um capítulo da luz nas estações — e o figurino que o ator veste carrega o clima desse capítulo. As menções são do Manual Prático de Astrologia, de Barbault.",
  itens:[]},
 casas:{t:"As casas — os cenários",sub:"onde agem",dupla:true,
  intro:"Objetivamente (Lilly), as casas são os lugares do mundo: pessoas, bens e acontecimentos. Subjetivamente, são estruturas da psique que organizam a experiência — mudam a forma como percebemos cada província da vida.",
  itens:[
   ["1","Casa 1 · Ascendente","A vida e o corpo do nativo: compleição, estatura, aparência e temperamento; o início de tudo o que se pergunta.","A autoimagem e o comportamento: a lente inaugural pela qual o mundo entra — o personagem que se veste antes de qualquer cena."],
   ["2","Casa 2","Os bens móveis: dinheiro, ganho e perda, o que se possui e se carrega; os ajudantes da fortuna.","O sistema axiológico: a forma de perceber o meio material — o que conta como substância, o que tem valor e quanto vale cada coisa."],
   ["3","Casa 3","Irmãos, vizinhos e parentes próximos; cartas, mensagens e as viagens curtas; os caminhos conhecidos.","A mente concreta e o mundo imediato: como se nomeia, conecta e circula informação no território familiar."],
   ["4","Casa 4","O pai; terras, casas, lavouras e tudo o que está sob a terra; as fundações e o fim de todas as coisas.","A base psíquica: memória familiar, chão interno e sentimento de origem — de onde se parte e para onde tudo recolhe."],
   ["5","Casa 5","Filhos e gravidezes; prazeres, banquetes, jogos e teatros; embaixadores e presentes.","A expressão criativa do eu: o poder de gerar, brincar e se mostrar — a consciência do próprio poder de ação."],
   ["6","Casa 6","Doenças e suas causas; criados e subordinados; o gado miúdo; tios e tias paternos.","A autorregulação: rotina, serviço e a relação psique-corpo — como o cotidiano ajusta (ou adoece) o organismo."],
   ["7","Casa 7","O casamento e o cônjuge; sócios e contratos; os inimigos declarados; processos e duelos.","O outro como espelho: onde a psique projeta o que não reconhece em si — todo encontro é também um retrato."],
   ["8","Casa 8","A morte, sua qualidade e natureza; os bens do cônjuge e dos outros; heranças, dívidas e o medo.","A experiência de perda e fusão: as crises que dissolvem a estrutura do eu para reconstruí-la — o que só se ganha entregando algo."],
   ["9","Casa 9","Viagens longas e o estrangeiro; a religião, o clero e os sonhos; a lei e o saber superior.","A função de cosmovisão: o mapa mental do mundo, a busca do sentido maior — a moldura filosófica que dá norte à experiência."],
   ["10","Casa 10","Reis, honras e ofícios; a dignidade e a profissão; a mãe, em Lilly; juízes e o comando.","A persona pública e a vocação: a imagem entregue ao coletivo e a ambição que estrutura o projeto de vida."],
   ["11","Casa 11","Amigos e amizades; as esperanças e a confiança; o favor dos reis e seus conselheiros.","O pertencimento: o futuro imaginado em conjunto — grupos, alianças e a esperança como função psíquica."],
   ["12","Casa 12","Inimigos ocultos, feiticeiros e delatores; prisões, exílios e aflições; o gado graúdo.","O inconsciente e os bastidores: a autossabotagem, o que age sem rosto — e o retiro que restaura quando aceito."]]},
 aspectos:{t:"Os aspectos — os diálogos",sub:"como se relacionam",
  intro:"Os aspectos são os ângulos entre planetas: o modo como os atores contracenam. Suaves fluem; tensos dramatizam — e é a tensão que move a trama.",
  itens:[["☌","Conjunção (0°)","Os atores dividem a mesma marca de palco: fusão de significados, para o bem ou para o mal."],
   ["⚹","Sextil (60°)","Diálogo cordial com esforço leve: oportunidade que precisa de um gesto."],
   ["□","Quadratura (90°)","Conflito dramático: fricção que exige ação e produz história."],
   ["△","Trígono (120°)","Cumplicidade: fluxo fácil, talento que corre sozinho."],
   ["☍","Oposição (180°)","Frente a frente: polaridade, negociação entre dois extremos."]]},
 estrelas:{t:"As estrelas fixas — os coros",sub:"o que intensifica",
  intro:"Fora da roda dos planetas, as estrelas fixas não regem casas nem fazem aspectos: em conjunção apertada (≈1°), colorem o ponto tocado com uma imagem mítica antiga. São o coro grego ao fundo da cena.",
  itens:[["✧","Como ler","Só conjunções apertadas contam. A estrela dá a imagem; o planeta, o assunto. Magnitude alta = voz mais forte."],
   ["✧","No seu mapa","Oito coros cantam: Porrima e Vindemiatrix em Vênus, Dubhe no Ascendente, Algol no Meio-do-Céu, Menkalinan em Marte, Al Jabhah em Mercúrio, Khambalia em Júpiter e Zuben Eschamali no Nodo Norte — veja a sub-aba Estrelas fixas no Natal."]]},
 regencia:{t:"A regência — o diretor",sub:"quem dirige a temporada",
  intro:"Nem todo ator pesa o mesmo o tempo todo. As técnicas de tempo elegem, período a período, um planeta como regente — o diretor da temporada. Toda a peça passa a ser lida a partir dele.",
  itens:[["♄","Firdaria","Divide a vida em períodos de anos por planeta (mapa noturno começa na Lua). O senhor maior dá o tom da era; o submenor, o capítulo."],
   ["1","Profecção","A cada aniversário o Ascendente avança uma casa: o ano ativa aquele cenário, e o regente da casa é o senhor do ano."],
   ["☉","Revolução solar","A carta do instante em que o Sol volta ao grau natal: o mapa do ano, lido sobre o natal."],
   ["✦","Termos","Dentro de cada signo, faixas de graus pertencem a um planeta. O Sol em trânsito, andando pelos termos, evoca os assuntos das casas que o senhor do termo rege."]]}
};

  var SIGNO_CICLO = ["Simboliza o fogo original que se manifesta à entrada da primavera, o jorrar das forças brutas da vida: desabrochar dos botões, saída dos rebentos da terra, cio dos animais; começo, renovação, impulso.", "Simboliza na natureza a condensação do ímpeto do Carneiro, a materialização das forças criadoras, sendo esta segunda parte da primavera a da vegetação maciça, das verdes pastagens e dos primeiros frutos.", "Simboliza na natureza, após a eclosão do Carneiro e a encarnação do Touro, a conquista aérea da vegetação pela ramagem e a folhagem — a plenitude da função clorofiliana.", "Simboliza na natureza o primeiro estágio do verão: a formação das sementes e o triunfo das forças geratrizes maternas; as águas-mães, com a seiva inflando os tecidos da natureza em plena fecundidade.", "Simboliza na natureza a culminação vegetal, a plenitude do fruto, toda a magnificência da maturidade sob o mais brilhante sol do ano, em analogia com o apogeu dos meios-dias de verão.", "Simboliza na natureza o termo de um longo processo: a semente dá aqui a espiga madura, pronta a ser ceifada; é a ceifa e o armazenamento, quando tudo seca, se seleciona e se delimita.", "Simboliza na natureza o equilíbrio dos dias e das noites, com a ascensão do mundo noturno e o declínio da luz e do calor; os últimos frutos soltam-se das árvores — crepúsculo outonal de repouso e paz.", "Simboliza na natureza o fim da vegetação, a queda e a decomposição das folhas: a destruição das formas exteriores em favor de um processo de fermentação e desagregação.", "Desde a provação do Escorpião a vegetação já não existe: a energia opera uma projeção do que o Escorpião acumulou, destinando-o a um fim ascendente.", "Simboliza na natureza o despojamento, o silêncio, a concentração do inverno em sua severa grandeza; o estágio da semente enterrada no solo — uma meia-noite celeste no solstício.", "Simboliza na natureza a primeira assimilação da semente novamente semeada, que se integra no meio terrestre; mundo das afinidades eletivas, cujo resultado é a fraternidade universal.", "Simboliza na natureza o estado transitório entre o inverno que acaba e a primavera que se prepara, mundo do impreciso: as cheias invernais, dilúvio purificador, e a imensidão oceânica das águas."];

  var LOTE_INFO = {
 "Fortuna":{pl:"Lua",g:"⊗",form:"ASC + Sol − Lua",
  sig:"O lote da Lua: o corpo, a fortuna concreta, a maré dos bens e da saúde — aquilo que vem sem ser pedido. É o mais usado de todos: dele derivam casas lunares e o firdar do corpo. Onde cai, a vida material flui e reflui."},
 "Espírito":{pl:"Sol",g:"☉",form:"ASC + Lua − Sol",
  sig:"O lote do Sol, também chamado daimon: a alma, a intenção, a carreira do espírito — aquilo que se conquista por escolha própria. É o contrapeso exato da Fortuna: o que a vontade faz, e não o que a maré traz."},
 "Eros":{pl:"Vênus",g:"♀",form:"ASC + Espírito − Vênus",
  sig:"O lote de Vênus: desejo, amor e apetite — o que a alma quer abraçar. Mostra por onde o afeto e a atração conduzem a vida, e os prazeres que dão sentido ao esforço do Espírito."},
 "Necessidade":{pl:"Mercúrio",g:"☿",form:"ASC + Mercúrio − Fortuna",
  sig:"O lote de Mercúrio: constrangimentos, dívidas, disputas e o que a vida obriga — inimizades, contas e guerras de palavra. Onde cai, o nativo negocia com o inevitável; bem administrado, vira perícia."},
 "Coragem":{pl:"Marte",g:"♂",form:"ASC + Marte − Fortuna",
  sig:"O lote de Marte: audácia, força e traição enfrentada — o campo de batalha pessoal. Mostra onde é preciso ousar, e de onde podem vir os golpes; a mesma casa que pede coragem é a que a fabrica."},
 "Vitória":{pl:"Júpiter",g:"♃",form:"ASC + Espírito − Júpiter",
  sig:"O lote de Júpiter: fé, aliança, prêmio e sucesso nas disputas — a mão que o céu estende. Onde cai, chegam apoios, patronos e a confiança que decide competições a favor do nativo."},
 "Nêmesis":{pl:"Saturno",g:"♄",form:"ASC + Saturno − Fortuna",
  sig:"O lote de Saturno: os fundos do destino — perdas, exílios, lutos e o que fica escondido até cobrar. Onde cai, a vida exige contas de longo prazo; é também o lote da justiça que alcança."}};

  var ABU_LOTES = {"Fortuna": "Abu Ma'shar chama-o de Lote da Lua e de 'Ascendente' do nativo. Indica a alma e sua boa fortuna, suas potências, a vida e os corpos, bens, riqueza e pobreza, ouro e prata, reputação e elevação, autoridade e reis, o bem e o mal, e o início das obras e das coisas buscadas. É o mais nobre e preeminente dos lotes — como o Sol entre os planetas.", "Espírito": "Chamado Lote do Invisível (do Ausente) ou Lote do Sol. Vem logo após a Fortuna e indica o corpo e a alma e suas condições, religião e profecia, piedade e devoção, segredos, pensamento, a consciência íntima, as coisas ocultas e ausentes, o louvor e o senso de honra. Junto com a Fortuna é o mais excelente dos lotes: de dia a Fortuna é mais evidente; de noite, o Invisível prevalece — e este mapa é noturno.", "Eros": "O Lote de Vênus, 'que compreende amor e familiaridade' — derivado dos lotes dos dois luminares, pois a harmonia entre as pessoas se dá pelo amor. Indica paixão, desejo, afeição, a busca daquilo de que a alma gosta e se deleita, o fortalecimento do amor, os assuntos de sexo e cônjuges, a familiaridade, a diversão, o prazer e a amenidade.", "Necessidade": "O Lote de Mercúrio, dito 'lote da pobreza e dos poucos estratagemas'. Indica pobreza, luta, medo, ódio, abundância de conflito, inimigos, ira e disputa — mas também comércio, compra e venda, astúcia, estratagemas, escrita, cálculo e a busca das ciências, inclusive a dos astros. Abu Ma'shar liga a pobreza à esperteza necessária para obter o que se precisa.", "Coragem": "O Lote de Marte, 'que compreende coragem e ousadia' — a audácia e a tomada de riscos pertencem ao Marte noturno, e são boas fortunas da alma. Indica comando, valentia, tomada de risco, coragem, força e ousadia; e também severidade, rudeza, insolência, pressa, matança, roubo, obras vis, astúcia e engano.", "Vitória": "O Lote de Júpiter, 'que compreende prosperidade e auxílio'. Indica poder, vitória, auxílio, prosperidade, generosidade e bons desfechos; retidão, busca da religião, juramentos e obediência a Deus, amor ao bem, busca de justiça e decisões legais entre o povo, conhecimento e sábios, esperança, boas obras e a parceria entre as pessoas.", "Nêmesis": "O Lote de Saturno, apelidado 'o pesado, o oneroso'. Indica a preservação e a profundidade de pensamento, a religião e a vida ascética; tudo o que se perdeu, foi roubado, fugiu ou caiu em poço ou no mar; os mortos e o modo da morte; terras e semeadura, construção e reparos; apuros, avareza, boa e má fama, a velhice, fardos, prisões e grilhões — e o resgate deles."};

  var TEMP_INFO = {
 "colérico":{el:"fogo",q:"quente e seco",humor:"bile amarela",est:"verão",idade:"juventude",
  virtudes:"Agudo de espírito, audaz e sem acanhamento; eloquente, corajoso e de coração firme. Concepção rápida e ambiciosa — os pensamentos aspiram sempre a fortunas maiores. Ama a ação acima do repouso e resolve depressa o que outros adiam.",
  sombras:"A ira acende rápido (e apazigua rápido); apressado, briguento e dado à zombaria. Impaciência com quem é lento, dificuldade em transigir, tendência a atropelar o processo para chegar ao fim.",
  irma:"A mesma pressa que o faz atropelar é a raiz da sua capacidade de decidir sob pressão, quando os outros travam.",
  regime:"Excesso de calor e secura: peça <b>frio e úmido</b>. Evite excessos de picante, álcool e exposição ao calor; prefira alimentos frescos e aquosos, banhos mornos, hidratação abundante e descanso real entre esforços."},
 "melancólico":{el:"terra",q:"frio e seco",humor:"bile negra",est:"outono",idade:"meia-idade",
  virtudes:"Cogitação profunda, prudência e constância na escolha; estudioso, cauteloso, capaz de sustentar um propósito por anos. Sensibilidade elevada e vocação contemplativa — no perigo real, revela sangue-frio e coragem estoica.",
  sombras:"Solitário e taciturno; retém a ira por muito tempo e não mira em coisas pequenas. Desconfiança, apreensão antecipada — sofre mais com o que imagina do que com a realidade.",
  irma:"A apreensão do melancólico é a mesma raiz do seu estoicismo diante do perigo verdadeiro.",
  regime:"Excesso de frio e secura: peça <b>calor e umidade</b>. Evite jejuns longos, vigílias e o isolamento prolongado; procure companhia, ambientes aquecidos, comida quente e úmida, e exercício moderado e regular."},
 "sanguíneo":{el:"ar",q:"quente e úmido",humor:"sangue",est:"primavera",idade:"infância",
  virtudes:"Alegre, jovial, generoso e compassivo; corajoso sem se ofender, sociável, eloquente e persuasivo. Entusiasmo fácil, vivacidade mental e confiança no futuro — por isso realiza e vence.",
  sombras:"Volúvel e inconstante, promete mais do que cumpre; entrega-se aos prazeres sensuais e ao excesso de confiança. Muitos amigos, poucos vínculos profundos.",
  irma:"A mesma leveza que o torna inconstante é a que impede a dor de lhe grudar no coração.",
  regime:"Excesso de calor e umidade: peça <b>frio e secura</b>. Modere a mesa e a bebida, evite o sedentarismo confortável e imponha alguma disciplina de horário — o risco é o abuso, não a falta."},
 "fleumático":{el:"água",q:"frio e úmido",humor:"fleuma",est:"inverno",idade:"velhice",
  virtudes:"Gentil, quieto e amante da paz; nem irascível, nem fraudulento. Estável, recatado e sóbrio, com notável ausência de malícia — sustenta o cotidiano sem atrito.",
  sombras:"Pesado e lento, avesso ao esforço; memória fraca e sonolência. Foge do conflito e custa a mudar hábitos, mesmo os que lhe fazem mal.",
  irma:"A mesma lentidão que parece indolência é o que lhe dá a serenidade que os outros não alcançam.",
  regime:"Excesso de frio e umidade: peça <b>calor e secura</b>. Exercício vigoroso e diário, alimentos quentes e secos, ambientes arejados e secos, e combate ativo ao excesso de sono."}
};

  var TEMP_GLIFO = {"colérico":"\u2609","sanguíneo":"\u2643","melancólico":"\u2644","fleumático":"\u263D"};

  var COMPOSTO_INVALIDO = {"sanguíneo-colérico":"colérico","colérico-sanguíneo":"colérico",
 "melancólico-fleumático":"fleumático","fleumático-melancólico":"fleumático"};

  var NAT_TEMP = {"Sol":"colérico","Marte":"colérico","Júpiter":"sanguíneo","Saturno":"melancólico","Mercúrio":"melancólico","Lua":"fleumático","Vênus":"fleumático"};

  var AX_NAT = {
 act:{mars:1,sun:.7,jupiter:.5,mercury:.3,venus:-.3,moon:-.4,saturn:-1},
 speed:{mercury:1,moon:.8,mars:.6,venus:.1,sun:0,jupiter:-.2,saturn:-1},
 persist:{saturn:1,sun:.6,jupiter:.3,venus:.1,mars:-.2,mercury:-.7,moon:-1},
 bold:{mars:1,jupiter:.7,sun:.5,mercury:0,venus:-.3,moon:-.5,saturn:-1},
 irrit:{mars:1,saturn:.5,sun:.3,mercury:.1,moon:-.2,jupiter:-.6,venus:-1},
 intens:{mars:1,sun:.6,saturn:.5,moon:.2,mercury:-.2,jupiter:-.5,venus:-.8},
 press:{saturn:1,sun:.7,mars:.4,jupiter:.3,mercury:-.3,venus:-.5,moon:-1},
 emot:{moon:1,venus:.8,jupiter:.3,mars:.1,sun:-.1,mercury:-.6,saturn:-1},
 extro:{jupiter:1,sun:.8,venus:.5,mars:.4,mercury:.2,moon:-.4,saturn:-1},
 domin:{sun:1,mars:.9,saturn:.4,jupiter:.3,mercury:-.2,moon:-.6,venus:-1},
 social:{venus:1,jupiter:.9,mercury:.4,moon:.2,sun:.1,mars:-.4,saturn:-1},
 trust:{jupiter:1,venus:.7,sun:.5,moon:0,mercury:-.3,mars:-.6,saturn:-1},
 bond:{venus:1,moon:.8,saturn:.5,sun:.2,jupiter:-.2,mercury:-.6,mars:-.8},
 express:{mercury:1,venus:.7,jupiter:.6,moon:.4,sun:.2,mars:0,saturn:-1},
 sensi:{moon:1,venus:.7,mercury:.2,jupiter:0,sun:-.3,mars:-.7,saturn:-.9},
 abstr:{saturn:.8,jupiter:.7,mercury:.5,moon:.3,sun:-.2,venus:-.5,mars:-1},
 analys:{mercury:1,saturn:.8,mars:.4,sun:-.1,venus:-.4,moon:-.7,jupiter:-1},
 concen:{saturn:1,sun:.6,mars:.4,venus:0,jupiter:-.5,mercury:-.7,moon:-1},
 order:{saturn:1,mercury:.6,sun:.4,venus:.2,jupiter:-.4,mars:-.7,moon:-.9},
 optim:{jupiter:1,venus:.7,sun:.6,mercury:.1,moon:-.1,mars:-.3,saturn:-1},
 ambit:{sun:1,mars:.8,saturn:.6,jupiter:.4,mercury:0,venus:-.5,moon:-.7},
 ideal:{jupiter:1,moon:.6,venus:.5,sun:.2,mercury:-.3,mars:-.6,saturn:-1},
 giving:{jupiter:1,venus:.8,sun:.4,moon:.3,mercury:-.2,mars:-.4,saturn:-1},
 honor:{sun:1,jupiter:.8,saturn:.4,mars:.3,venus:0,moon:-.3,mercury:-1},
 expand:{jupiter:1,sun:.6,mars:.5,mercury:.2,moon:-.2,venus:-.3,saturn:-1},
 hedon:{venus:1,jupiter:.8,moon:.5,sun:.2,mercury:-.2,mars:-.4,saturn:-1},
 tradi:{saturn:1,sun:.6,jupiter:.4,venus:.2,moon:0,mercury:-.6,mars:-.8},
 auton:{mars:1,sun:.8,saturn:.5,mercury:.2,jupiter:-.2,venus:-.6,moon:-1},
 assert:{mars:1,sun:.7,saturn:.3,mercury:0,jupiter:-.3,moon:-.6,venus:-1},
 selfctl:{saturn:1,mercury:.5,sun:.3,venus:0,jupiter:-.4,moon:-.7,mars:-1},
 compet:{mars:1,sun:.7,saturn:.3,mercury:.1,jupiter:-.3,moon:-.6,venus:-1},
 resist:{saturn:1,sun:.7,mars:.6,jupiter:.3,venus:-.4,mercury:-.5,moon:-1},
 cohes:{sun:1,saturn:.7,mars:.4,venus:.1,jupiter:-.2,moon:-.7,mercury:-1},
 transp:{jupiter:1,sun:.8,mars:.5,venus:.2,moon:-.3,mercury:-.6,saturn:-1}};

  var AX_ELE = {
 act:{fogo:1,ar:.5,terra:-.5,agua:-.9},speed:{ar:1,fogo:.8,agua:-.4,terra:-1},
 persist:{terra:1,agua:.5,fogo:-.5,ar:-.9},bold:{fogo:1,ar:.4,terra:-.5,agua:-.8},
 irrit:{fogo:1,agua:.2,terra:-.4,ar:-.6},intens:{fogo:.8,agua:1,terra:-.3,ar:-.9},
 press:{terra:1,fogo:.3,ar:-.4,agua:-.9},emot:{agua:1,fogo:.3,ar:-.5,terra:-.8},
 extro:{fogo:1,ar:.8,terra:-.5,agua:-.9},domin:{fogo:1,terra:.3,ar:-.2,agua:-.8},
 social:{ar:1,fogo:.6,agua:-.2,terra:-.6},trust:{fogo:.8,ar:.5,terra:-.4,agua:-.9},
 bond:{agua:1,terra:.7,fogo:-.5,ar:-.9},express:{ar:1,fogo:.8,agua:-.2,terra:-.8},
 sensi:{agua:1,ar:.2,fogo:-.5,terra:-.8},abstr:{ar:1,agua:.6,fogo:-.2,terra:-1},
 analys:{terra:1,ar:.6,fogo:-.5,agua:-.9},concen:{terra:1,agua:.4,fogo:-.5,ar:-1},
 order:{terra:1,ar:.2,agua:-.4,fogo:-.9},optim:{fogo:1,ar:.5,terra:-.5,agua:-.7},
 ambit:{fogo:1,terra:.5,ar:-.2,agua:-.7},ideal:{agua:.8,fogo:.7,ar:.2,terra:-1},
 giving:{fogo:.8,ar:.5,agua:.2,terra:-1},honor:{fogo:1,agua:.3,ar:-.3,terra:-.8},
 expand:{fogo:1,ar:.6,agua:-.3,terra:-1},hedon:{agua:.7,ar:.5,fogo:.4,terra:-.9},
 tradi:{terra:1,agua:.5,ar:-.7,fogo:-.5},auton:{fogo:1,ar:.3,terra:-.3,agua:-1},
 assert:{fogo:1,terra:.2,ar:-.3,agua:-.9},selfctl:{terra:1,ar:.3,agua:-.4,fogo:-1},
 compet:{fogo:1,terra:.3,ar:-.2,agua:-.9},resist:{terra:1,fogo:.5,ar:-.5,agua:-.9},
 cohes:{fogo:.7,terra:.8,agua:-.6,ar:-1},transp:{fogo:1,ar:.4,terra:-.2,agua:-.9}};

  var AX_MOD = {
 act:{cardinal:1,mutavel:.3,fixo:-.8},speed:{mutavel:1,cardinal:.5,fixo:-1},
 persist:{fixo:1,cardinal:-.2,mutavel:-1},bold:{cardinal:1,mutavel:-.2,fixo:-.4},
 irrit:{cardinal:.7,fixo:.2,mutavel:-.6},intens:{fixo:.8,cardinal:.5,mutavel:-.9},
 press:{fixo:1,cardinal:.2,mutavel:-.9},emot:{mutavel:.6,cardinal:.2,fixo:-.5},
 extro:{cardinal:.8,mutavel:.5,fixo:-.8},domin:{cardinal:1,fixo:.3,mutavel:-.9},
 social:{mutavel:.7,cardinal:.4,fixo:-.7},trust:{mutavel:.4,cardinal:.3,fixo:-.6},
 bond:{fixo:1,cardinal:-.2,mutavel:-1},express:{mutavel:.8,cardinal:.4,fixo:-.7},
 sensi:{mutavel:.6,cardinal:0,fixo:-.6},abstr:{mutavel:.8,fixo:.1,cardinal:-.7},
 analys:{mutavel:.6,fixo:.3,cardinal:-.6},concen:{fixo:1,cardinal:.1,mutavel:-1},
 order:{fixo:.9,cardinal:.2,mutavel:-1},optim:{cardinal:.5,mutavel:.4,fixo:-.6},
 ambit:{cardinal:1,fixo:.4,mutavel:-.8},ideal:{mutavel:.7,cardinal:.2,fixo:-.7},
 giving:{mutavel:.5,cardinal:.3,fixo:-.7},honor:{fixo:.7,cardinal:.5,mutavel:-.8},
 expand:{cardinal:.7,mutavel:.6,fixo:-1},hedon:{mutavel:.5,fixo:.4,cardinal:-.6},
 tradi:{fixo:1,cardinal:-.2,mutavel:-.9},auton:{cardinal:1,fixo:.2,mutavel:-.8},
 assert:{cardinal:1,fixo:.3,mutavel:-.9},selfctl:{fixo:.8,cardinal:.1,mutavel:-1},
 compet:{cardinal:1,fixo:.3,mutavel:-.8},resist:{fixo:1,cardinal:.2,mutavel:-1},
 cohes:{fixo:1,cardinal:.3,mutavel:-1},transp:{cardinal:.6,mutavel:.3,fixo:-.7}};

  var AXES48 = [
 ["Atividade–Passividade","físico","act",["asc","ruler","moon","mars","lord","modes"]],
 ["Rapidez–Deliberação","físico","speed",["asc","ruler","moon","mercury","lord","modes"]],
 ["Iniciativa–Reatividade","físico","act",["asc","ruler","h1","mars","moon","modes"]],
 ["Persistência–Variabilidade","físico","persist",["asc","ruler","moon","mars","saturn","lord"]],
 ["Audácia–Cautela","físico","bold",["asc","ruler","mars","moon"]],
 ["Irritabilidade–Serenidade","físico","irrit",["asc","ruler","mars","venus"]],
 ["Intensidade–Moderação","físico","intens",["asc","ruler","venus","jupiter","lord","h1","algol"]],
 ["Tolerância à pressão–Saturação","físico","press",["asc","ruler","moon","saturn","sun"]],
 ["Resistência–Suscetibilidade","físico","resist",["asc","ruler","saturn","mars","moon"]],
 ["Resiliência–Vulnerabilidade","físico","resist",["asc","ruler","sun","moon","jupiter"]],
 ["Execução–Procrastinação","físico","act",["asc","ruler","mars","saturn","lord"]],
 ["Autocontrole–Impulsividade","físico","selfctl",["asc","ruler","saturn","mars","moon"]],
 ["Emotividade–Reserva afetiva","emocional","emot",["asc","ruler","moon","venus"]],
 ["Vinculação–Desapego","emocional","bond",["asc","ruler","h7ruler","moon","venus","modes"]],
 ["Expressividade afetiva–Reticência","emocional","express",["asc","ruler","rulerHouse","moon","mercury","h1"]],
 ["Sensibilidade–Blindagem","emocional","sensi",["asc","ruler","moon","venus","h1"]],
 ["Confiança–Vigilância","emocional","trust",["asc","ruler","sun","moon","mars"]],
 ["Hedonismo–Ascetismo","emocional","hedon",["asc","ruler","venus","jupiter","saturn"]],
 ["Generosidade–Economia","emocional","giving",["asc","ruler","jupiter","venus","h2ruler"]],
 ["Idealismo–Pragmatismo","emocional","ideal",["asc","ruler","jupiter","moon","saturn","elems"]],
 ["Assertividade–Conciliação","emocional","assert",["asc","ruler","mars","venus","sun"]],
 ["Competição–Cooperação","emocional","compet",["asc","ruler","mars","venus","h7ruler"]],
 ["Autonomia–Dependência","emocional","auton",["asc","ruler","sun","mars","h7ruler","moon"]],
 ["Otimismo–Pessimismo","emocional","optim",["asc","ruler","jupiter","saturn","moon"]],
 ["Abstração–Concretude","mental","abstr",["asc","ruler","elems","mercury","h1","cadent","h12"]],
 ["Análise–Síntese","mental","analys",["asc","ruler","mercury","jupiter","saturn","moon","h3ruler","h9ruler"]],
 ["Concentração–Dispersão","mental","concen",["asc","ruler","mercury","saturn","jupiter","moon","sun"]],
 ["Sequencialidade–Apreensão global","mental","analys",["asc","ruler","mercury","saturn","modes"]],
 ["Exame crítico–Receptividade simbólica","mental","analys",["asc","mercury","saturn","moon","h9ruler"]],
 ["Retenção–Improvisação","mental","persist",["asc","ruler","saturn","mercury","moon","modes"]],
 ["Flexibilidade cognitiva–Dogmatismo","mental","speed",["asc","ruler","mercury","jupiter","saturn","modes"]],
 ["Imaginação simbólica–Literalidade","mental","ideal",["asc","ruler","moon","mercury","h12","elems"]],
 ["Transparência–Reserva estratégica","mental","transp",["asc","ruler","mercury","jupiter","saturn","h12"]],
 ["Coesão identitária–Multiplicidade","mental","cohes",["asc","ruler","sun","mercury","modes"]],
 ["Honra–Utilidade","mental","honor",["asc","ruler","sun","jupiter","mercury"]],
 ["Tradição–Experimentação","mental","tradi",["asc","ruler","saturn","jupiter","modes"]],
 ["Ordem–Espontaneidade","comportamental","order",["asc","ruler","saturn","mercury","modes"]],
 ["Disciplina–Inconstância","comportamental","order",["asc","ruler","saturn","moon","lord","modes"]],
 ["Rigidez–Maleabilidade","comportamental","persist",["asc","ruler","saturn","mars","modes"]],
 ["Estabilidade–Mudança","comportamental","persist",["asc","ruler","saturn","moon","elems","modes"]],
 ["Planejamento–Ação emergente","comportamental","order",["asc","ruler","saturn","mercury","mars"]],
 ["Controle–Entrega","comportamental","selfctl",["asc","ruler","saturn","sun","moon"]],
 ["Perfeccionismo–Suficiência","comportamental","order",["asc","ruler","mercury","saturn","h6ruler"]],
 ["Ambição–Contentamento","comportamental","ambit",["asc","ruler","sun","mars","h10ruler","saturn"]],
 ["Expansão–Conservação","comportamental","expand",["asc","ruler","jupiter","saturn","modes"]],
 ["Extroversão–Introversão","comportamental","extro",["asc","ruler","rulerHouse","lord","h1","cadent"]],
 ["Dominação–Acomodação","comportamental","domin",["asc","ruler","rulerHouse","sun","mars"]],
 ["Sociabilidade–Seletividade","comportamental","social",["asc","ruler","jupiter","h1","lord"]]];

  var AX_FAM = {"físico":["♂","corpo, vitalidade e reação"],"emocional":["☽","afeto, vínculo e confiança"],
 "mental":["☿","pensamento, foco e símbolo"],"comportamental":["♄","vontade, ordem e mundo"]};

  var SIGN_CORPO = ["cabeça e face","pescoço e garganta","braços, mãos e pulmões","peito e estômago",
 "coração e coluna","ventre e intestinos","rins e região lombar","órgãos internos e eliminação",
 "quadris e coxas","joelhos, pele e ossos","pernas e circulação","pés e sistema linfático"];

  var PL_FUNCAO = {"Sol":"vitalidade, coração e calor vital","Lua":"líquidos, estômago e ritmo do sono",
 "Mercúrio":"sistema nervoso, fala e respiração","Vênus":"rins, garganta e equilíbrio hormonal",
 "Marte":"sangue, inflamações e musculatura","Júpiter":"fígado, nutrição e metabolismo",
 "Saturno":"ossos, pele, dentes e processos crônicos"};

  var HUMOR_EXCESSO = {"colérico":"excesso de calor e secura: tende a consumir reservas depressa, com inflamação e irritação",
 "sanguíneo":"excesso de calor e umidade: tende à plenitude, ao congestionamento e ao excesso",
 "melancólico":"excesso de frio e secura: tende ao ressecamento, à retenção e à lentidão",
 "fleumático":"excesso de frio e umidade: tende ao acúmulo de líquidos, à lentidão e ao torpor"};

  /* ---- narrativa solar das estações (leitura dos signos) ---- */
  var ESTACOES = [
    "o Sol irrompe: início da primavera, o broto que fura a terra",
    "plena primavera: a seiva estabiliza, a terra floresce e retém",
    "fim da primavera: a luz se ramifica, tudo se comunica e circula",
    "solstício de verão: a luz culmina e reflui para dentro, para as águas e o lar",
    "pleno verão: o esplendor da luz madura, o fruto no auge do calor",
    "fim do verão: a colheita — separar o grão da palha, medir e guardar",
    "equinócio de outono: dia e noite se pesam, a luz busca o equilíbrio",
    "outono profundo: a folha cai e fermenta, a vida se concentra na semente",
    "fim do outono: o fogo recolhe-se em chama interior que aponta ao longe",
    "solstício de inverno: a noite culmina, a terra nua sustenta o cume",
    "pleno inverno: o ar cristalino, o mundo pensado antes de renascer",
    "fim do inverno: o degelo — as águas dissolvem as formas e preparam o novo"
  ];

  /* ============================================================
     PROMESSAS NATAIS por tema de vida
     Cada tema declara: por que casas se lê, qual o significador natural,
     que lote pertence ao assunto, e o que a tradição manda observar.
     O aplicativo cruza isto com o mapa e produz a promessa concreta.
     ============================================================ */
  var TEMAS = [
    { id: "corpo", nome: "Corpo e vitalidade", glifo: "♂", casas: [1, 6], apoio: [8],
      significador: "Sol", coSignificador: "Lua", lote: "Fortuna",
      pergunta: "Que constituição, que resistência, que ritmo de energia?",
      comoLer: "Lê-se pelo Ascendente e seu regente, pelos luminares e pelo grau do Ascendente. A casa 6 mostra o que desregula; a 8, o que consome." },
    { id: "dinheiro", nome: "Dinheiro e sustento", glifo: "♀", casas: [2], apoio: [8, 11],
      significador: "Júpiter", coSignificador: "Vênus", lote: "Fortuna",
      pergunta: "De onde vem o sustento e com que estabilidade?",
      comoLer: "A casa 2 e seu regente dizem o modo de ganhar; a 8, o dinheiro alheio; a 11, o que vem por favor e aliança. O Lote da Fortuna localiza a maré material." },
    { id: "palavra", nome: "Estudos, palavra e irmãos", glifo: "☿", casas: [3], apoio: [9],
      significador: "Mercúrio", coSignificador: null, lote: "Necessidade",
      pergunta: "Como se aprende, como se fala, como se circula?",
      comoLer: "Casa 3 e Mercúrio para o pensamento curto e o entorno; casa 9 para a doutrina. A condição de Mercúrio decide se a palavra convence ou se dispersa." },
    { id: "lar", nome: "Lar, origem e fim", glifo: "☽", casas: [4], apoio: [10],
      significador: "Saturno", coSignificador: "Lua",
      pergunta: "Que chão sustenta, que herança pesa, onde tudo recolhe?",
      comoLer: "Casa 4 e seu regente para as fundações; Saturno é o significador natural do pai e da terra. O eixo 4–10 é uma balança: o que se recebe contra o que se constrói." },
    { id: "criacao", nome: "Filhos, prazer e criação", glifo: "☉", casas: [5], apoio: [11],
      significador: "Júpiter", coSignificador: "Vênus", lote: "Eros",
      pergunta: "O que se gera, o que dá prazer, onde se mostra o próprio poder?",
      comoLer: "Casa 5, seu regente e Júpiter (fertilidade). Vênus e o Lote de Eros para o apetite. Planetas na 5 dizem em que registro a criação acontece." },
    { id: "trabalho", nome: "Trabalho, rotina e serviço", glifo: "☿", casas: [6], apoio: [10, 2],
      significador: "Mercúrio", coSignificador: "Marte",
      pergunta: "Qual é o ofício diário e o que ele cobra do corpo?",
      comoLer: "Casa 6 para a rotina e os subordinados; cruzada com a 10 (ofício) e a 2 (o que rende). Casa cadente: age por acumulação, não por golpe." },
    { id: "uniao", nome: "União, sociedade e adversários", glifo: "♀", casas: [7], apoio: [1],
      significador: "Vênus", coSignificador: "Lua", lote: "Eros",
      pergunta: "Como se encontra o outro — em contrato, em afeto, em disputa?",
      comoLer: "Casa 7 e seu regente; Vênus para o casamento em carta masculina. O eixo 1–7 é o mesmo assunto visto dos dois lados: quem sou eu para o outro." },
    { id: "perdas", nome: "Perdas, dívidas e heranças", glifo: "♄", casas: [8], apoio: [2, 12],
      significador: "Saturno", coSignificador: "Marte", lote: "Nêmesis",
      pergunta: "O que se perde, o que se herda, o que se paga a longo prazo?",
      comoLer: "Casa 8 e seu regente; o Lote de Nêmesis para os fundos do destino. A tradição lê aqui morte, medo e o dinheiro que vem de fora." },
    { id: "doutrina", nome: "Fé, viagem e doutrina", glifo: "♃", casas: [9], apoio: [3],
      significador: "Júpiter", coSignificador: "Sol",
      pergunta: "Que visão de mundo organiza tudo o mais?",
      comoLer: "Casa 9 e seu regente; Júpiter como significador natural da lei e da religião. O eixo 3–9 opõe o saber próximo ao saber que exige distância." },
    { id: "oficio", nome: "Ofício, honra e reputação", glifo: "☉", casas: [10], apoio: [1, 6],
      significador: "Sol", coSignificador: "Saturno", lote: "Espírito",
      pergunta: "Que lugar público, que autoridade, que obra?",
      comoLer: "Meio-do-Céu, seu regente, e os planetas angulares. O Lote do Espírito diz o que se conquista por escolha, contra o que a Fortuna traz sem pedir." },
    { id: "amigos", nome: "Amigos, alianças e esperanças", glifo: "♃", casas: [11], apoio: [5],
      significador: "Júpiter", coSignificador: null, lote: "Vitória",
      pergunta: "Quem apoia, o que se espera, que futuro se projeta?",
      comoLer: "Casa 11 e seu regente; o Lote de Vitória para o auxílio que chega. É a casa do favor — e da esperança como faculdade." },
    { id: "bastidores", nome: "Retiro, bastidores e inimigos ocultos", glifo: "♄", casas: [12], apoio: [6, 8],
      significador: "Saturno", coSignificador: null, lote: "Nêmesis",
      pergunta: "O que age sem rosto, o que sabota, o que restaura no recolhimento?",
      comoLer: "Casa 12 e seu regente. Planetas aqui agem de bastidores: perdem visibilidade, não força. Casa da autossabotagem e do retiro voluntário." }
  ];

  /* ---- índice de busca por tópico (item 4) ---- */
  var BUSCA = [
    ["dinheiro", "dinheiro"], ["renda", "dinheiro"], ["salário", "dinheiro"], ["sustento", "dinheiro"],
    ["ganho", "dinheiro"], ["fortuna", "dinheiro"], ["posses", "dinheiro"], ["bens", "dinheiro"],
    ["amor", "uniao"], ["casamento", "uniao"], ["relacionamento", "uniao"], ["namoro", "uniao"],
    ["cônjuge", "uniao"], ["sócio", "uniao"], ["parceria", "uniao"], ["inimigo declarado", "uniao"],
    ["divórcio", "uniao"], ["separação", "uniao"], ["contrato", "uniao"],
    ["saúde", "corpo"], ["doença", "corpo"], ["corpo", "corpo"], ["vitalidade", "corpo"],
    ["energia", "corpo"], ["cansaço", "corpo"], ["sono", "corpo"], ["temperamento", "corpo"],
    ["trabalho", "trabalho"], ["emprego", "trabalho"], ["rotina", "trabalho"], ["serviço", "trabalho"],
    ["chefe", "oficio"], ["carreira", "oficio"], ["profissão", "oficio"], ["reputação", "oficio"],
    ["honra", "oficio"], ["fama", "oficio"], ["autoridade", "oficio"], ["ambição", "oficio"],
    ["estudo", "palavra"], ["curso", "palavra"], ["escrita", "palavra"], ["comunicação", "palavra"],
    ["irmão", "palavra"], ["irmã", "palavra"], ["vizinho", "palavra"], ["viagem curta", "palavra"],
    ["família", "lar"], ["pai", "lar"], ["mãe", "lar"], ["casa", "lar"], ["imóvel", "lar"],
    ["mudança", "lar"], ["terra", "lar"], ["raiz", "lar"], ["origem", "lar"],
    ["filho", "criacao"], ["filha", "criacao"], ["gravidez", "criacao"], ["criação", "criacao"],
    ["arte", "criacao"], ["prazer", "criacao"], ["jogo", "criacao"], ["desejo", "criacao"],
    ["dívida", "perdas"], ["herança", "perdas"], ["perda", "perdas"], ["morte", "perdas"],
    ["medo", "perdas"], ["crise", "perdas"], ["imposto", "perdas"], ["empréstimo", "perdas"],
    ["religião", "doutrina"], ["fé", "doutrina"], ["filosofia", "doutrina"], ["viagem", "doutrina"],
    ["estrangeiro", "doutrina"], ["mudança de país", "doutrina"], ["lei", "doutrina"], ["justiça", "doutrina"],
    ["amigo", "amigos"], ["amizade", "amigos"], ["grupo", "amigos"], ["esperança", "amigos"],
    ["futuro", "amigos"], ["projeto", "amigos"], ["apoio", "amigos"],
    ["retiro", "bastidores"], ["solidão", "bastidores"], ["inimigo oculto", "bastidores"],
    ["sabotagem", "bastidores"], ["segredo", "bastidores"], ["prisão", "bastidores"], ["hospital", "bastidores"]
  ];

  /* ============================================================
     CORRESPONDÊNCIAS DE SAÚDE (item 13)
     São CORRESPONDÊNCIAS HISTÓRICAS, não diagnóstico e não risco.
     A medicina astrológica de Culpeper e da tradição galênica associava
     signo a região do corpo e planeta a função. Registramos as associações
     como tal; não há gráfico de probabilidade porque não há probabilidade
     a mostrar.
     ============================================================ */
  var SAUDE_AVISO =
    "Isto não é diagnóstico nem estimativa de risco. São correspondências " +
    "simbólicas registradas pela tradição médica antiga (Galeno, Culpeper), " +
    "aqui listadas como referência histórica e como vocabulário do mapa. " +
    "Qualquer sintoma é assunto de médico, não de carta.";

  var HUMOR_REGIME = {
    "colérico": "A tradição prescrevia o contrário do excesso: frescor e umidade — repouso, água, alimentos frios e úmidos, evitar o meio-dia e o esforço em jejum.",
    "sanguíneo": "Equilíbrio já favorável; a advertência clássica é contra o excesso de abundância — comer e beber demais, dispersar-se em muitas frentes.",
    "melancólico": "Contra o frio e a secura: calor e umidade — banho quente, companhia, alimento nutritivo, movimento regular, luz do dia.",
    "fleumático": "Contra o frio e a umidade: calor e secura — exercício, especiarias, ambientes secos, rotina que não deixe a energia estagnar."
  };

  /* ============================================================
     ELETIVA · testemunhos de uma janela (item 10)
     Cada testemunho é uma regra tradicional com resposta verificável.
     Nada de nota agregada sem mostrar de onde veio.
     ============================================================ */
  var ELETIVA_REGRAS = [
    { id: "lua-vazia", rot: "Lua não vazia de curso", peso: 3, certeza: "tradicional",
      fonte: "Lilly: 'a Lua vazia de curso nada perfaz'",
      nota: "Se a Lua não faz mais nenhum aspecto antes de sair do signo, a tradição diz que o assunto não anda." },
    { id: "lua-benefico", rot: "Lua aplicando a benéfico", peso: 3, certeza: "tradicional",
      fonte: "Dorotheus, eleições",
      nota: "A Lua conduz o assunto ao planeta a que se aplica. Aplicando a Júpiter ou Vênus, entrega em boas mãos." },
    { id: "lua-malefico", rot: "Lua livre de maléfico", peso: 3, certeza: "tradicional",
      fonte: "Dorotheus, eleições",
      nota: "Lua aplicando a Marte ou Saturno por conjunção, quadratura ou oposição desaconselha o início." },
    { id: "senhor-forte", rot: "Regente do assunto dignificado", peso: 3, certeza: "tradicional",
      fonte: "Lilly, das eleições",
      nota: "O regente da casa do assunto precisa de dignidade essencial ou, ao menos, não estar peregrino nem em queda." },
    { id: "senhor-livre", rot: "Regente do assunto fora dos raios", peso: 2, certeza: "tradicional",
      fonte: "Lilly, da combustão",
      nota: "Combusto, o significador age sem ser visto — péssimo para o que precisa de reconhecimento." },
    { id: "senhor-direto", rot: "Regente do assunto direto", peso: 2, certeza: "tradicional",
      fonte: "tradição comum",
      nota: "Retrógrado, o assunto volta atrás: bom para retomar, ruim para inaugurar." },
    { id: "hora-concorde", rot: "Hora planetária concorde", peso: 2, certeza: "tradicional",
      fonte: "tradição das horas planetárias",
      nota: "A hora regida pelo planeta do assunto (ou por um benéfico) reforça a eleição." },
    { id: "angular", rot: "Regente do assunto angular", peso: 2, certeza: "tradicional",
      fonte: "Lilly, das fortitudes acidentais",
      nota: "Angular, o significador age em cena aberta; cadente, nos bastidores." },
    { id: "asc-limpo", rot: "Ascendente livre de maléfico", peso: 2, certeza: "tradicional",
      fonte: "tradição das eleições",
      nota: "Maléfico sobre o grau ascendente marca o começo com o seu sinal." },
    { id: "via-combusta", rot: "Lua fora da via combusta", peso: 1, certeza: "heuristico",
      fonte: "uso horário; a extensão exata varia entre autores",
      nota: "Trecho entre 15° de Libra e 15° de Escorpião. Autores divergem sobre os limites, por isso pesa pouco." }
  ];

  /* ---- glossário mínimo, usado nos rodapés das explicações ---- */
  var GLOSSARIO = {
    "dignidade essencial": "A força que um planeta tem pelo lugar do zodíaco em que está: domicílio, exaltação, triplicidade, termo, face — ou, ao contrário, exílio e queda.",
    "condição acidental": "A força que vem da situação e não do signo: a casa, a velocidade, a relação com o Sol, a companhia dos outros planetas.",
    "recepção": "Um planeta recebe outro quando tem dignidade no lugar onde o outro está — como hospedar em casa própria. Mútua, quando os dois se hospedam.",
    "dispositor": "O regente do signo em que um planeta está. Quem manda no lugar manda no hóspede.",
    "seita": "A divisão do céu em partido diurno (Sol, Júpiter, Saturno) e noturno (Lua, Vênus, Marte). Este mapa é noturno.",
    "cronocrator": "O planeta que governa um período de tempo — pela firdaria, pela profecção ou pela revolução.",
    "profecção": "A cada aniversário o Ascendente avança um signo inteiro. O regente do signo alcançado é o senhor do ano.",
    "firdaria": "Divisão persa da vida em períodos planetários. Em mapa noturno começa pela Lua.",
    "revolução solar": "A carta do instante em que o Sol volta exatamente ao grau que ocupava no nascimento.",
    "termo": "Faixa de graus dentro de um signo pertencente a um planeta. Cinco por signo, na divisão egípcia.",
    "antiscion": "O grau simétrico em relação ao eixo dos solstícios. Age como conjunção oculta.",
    "aplicando": "O aspecto ainda vai se perfazer: a distância ao ângulo exato está diminuindo. É o que opera.",
    "separando": "O aspecto já se perfez e se desfaz: registra o que passou, não o que vem.",
    "combusto": "A menos de 8°30′ do Sol. O planeta age encoberto pela vontade solar.",
    "cazimi": "A menos de 17′ do Sol, no coração. A tradição o tem por fortalecido, não queimado.",
    "peregrino": "Sem dignidade nenhuma no lugar onde está. Hóspede sem carta de apresentação.",
    "hayz": "Condição ótima: o planeta concorda com a seita do mapa, com o hemisfério e com o gênero do signo."
  };

  root.Corpus = {
    NATUREZA: NATUREZA, CASA_ASSUNTO: CASA_ASSUNTO, CASA_CURTO: CASA_CURTO, CASA_EVOCA: CASA_EVOCA,
    OLAVO: OLAVO, BARBAULT_SIGNO: BARBAULT_SIGNO, BARBAULT_CASA: BARBAULT_CASA,
    GUIA: GUIA, SIGNO_CICLO: SIGNO_CICLO, ESTACOES: ESTACOES,
    LOTE_INFO: LOTE_INFO, ABU_LOTES: ABU_LOTES,
    TEMP_INFO: TEMP_INFO, TEMP_GLIFO: TEMP_GLIFO, COMPOSTO_INVALIDO: COMPOSTO_INVALIDO,
    NAT_TEMP: NAT_TEMP, HUMOR_REGIME: HUMOR_REGIME,
    AX_NAT: AX_NAT, AX_ELE: AX_ELE, AX_MOD: AX_MOD, AXES48: AXES48, AX_FAM: AX_FAM,
    SIGN_CORPO: SIGN_CORPO, PL_FUNCAO: PL_FUNCAO, HUMOR_EXCESSO: HUMOR_EXCESSO,
    SAUDE_AVISO: SAUDE_AVISO,
    TEMAS: TEMAS, BUSCA: BUSCA, ELETIVA_REGRAS: ELETIVA_REGRAS, GLOSSARIO: GLOSSARIO
  };

})(window);
