/* ============================================================
   LIONS DAILY · motor tradicional
   Dignidades essenciais e acidentais, recepções, seita, lotes,
   estrelas fixas, antiscia. Tudo com fonte declarada.

   Regra da casa: cada resultado carrega um GRAU DE CERTEZA.
     tradicional — está nas fontes (Ptolomeu, Dorotheus, Lilly, Abu Ma'shar)
     derivado    — segue de regra tradicional aplicada ao mapa
     heuristico  — critério nosso, defensável mas não canônico
     experimental— construção moderna sem lastro tradicional
   ============================================================ */
(function (root) {
  "use strict";
  var S = root.Astro;
  var norm = S.norm, delta = S.delta;

  var SIGNOS = ["Áries", "Touro", "Gêmeos", "Câncer", "Leão", "Virgem",
                "Libra", "Escorpião", "Sagitário", "Capricórnio", "Aquário", "Peixes"];
  var GLIFO_SIGNO = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];
  var ELEMENTO = ["fogo", "terra", "ar", "água"];
  var MODO = ["cardinal", "fixo", "mutável"];
  var GLIFO = {
    "Sol": "☉", "Lua": "☽", "Mercúrio": "☿", "Vênus": "♀", "Marte": "♂",
    "Júpiter": "♃", "Saturno": "♄", "Nodo Norte": "☊", "Nodo Sul": "☋",
    "Fortuna": "⊗", "Ascendente": "AS", "Meio-do-Céu": "MC"
  };

  function signoDe(l) { return Math.floor(norm(l) / 30); }
  function elementoDe(sg) { return ELEMENTO[sg % 4]; }
  function modoDe(sg) { return MODO[sg % 3]; }

  /* ---------- domicílios e exílios ---------- */
  var REGENTE = {
    "Áries": "Marte", "Touro": "Vênus", "Gêmeos": "Mercúrio", "Câncer": "Lua",
    "Leão": "Sol", "Virgem": "Mercúrio", "Libra": "Vênus", "Escorpião": "Marte",
    "Sagitário": "Júpiter", "Capricórnio": "Saturno", "Aquário": "Saturno", "Peixes": "Júpiter"
  };
  var DOMICILIO = {
    "Sol": ["Leão"], "Lua": ["Câncer"], "Mercúrio": ["Gêmeos", "Virgem"],
    "Vênus": ["Touro", "Libra"], "Marte": ["Áries", "Escorpião"],
    "Júpiter": ["Sagitário", "Peixes"], "Saturno": ["Capricórnio", "Aquário"]
  };
  var EXILIO = {};
  Object.keys(DOMICILIO).forEach(function (p) {
    EXILIO[p] = DOMICILIO[p].map(function (s) { return SIGNOS[(SIGNOS.indexOf(s) + 6) % 12]; });
  });
  /* exaltação com o grau exato (Ptolomeu) */
  var EXALTACAO = {
    "Sol": ["Áries", 19], "Lua": ["Touro", 3], "Mercúrio": ["Virgem", 15],
    "Vênus": ["Peixes", 27], "Marte": ["Capricórnio", 28], "Júpiter": ["Câncer", 15],
    "Saturno": ["Libra", 21], "Nodo Norte": ["Gêmeos", 3]
  };
  var QUEDA = {};
  Object.keys(EXALTACAO).forEach(function (p) {
    var s = EXALTACAO[p][0];
    QUEDA[p] = SIGNOS[(SIGNOS.indexOf(s) + 6) % 12];
  });

  /* triplicidades de Dorotheus: [diurno, noturno, participante] por elemento */
  var TRIPLICIDADE = {
    "fogo": ["Sol", "Júpiter", "Saturno"],
    "terra": ["Vênus", "Lua", "Marte"],
    "ar": ["Saturno", "Mercúrio", "Júpiter"],
    "água": ["Vênus", "Marte", "Lua"]
  };

  /* termos egípcios */
  var TERMOS = {
    0: [["Júpiter", 6], ["Vênus", 14], ["Mercúrio", 21], ["Marte", 26], ["Saturno", 30]],
    1: [["Vênus", 8], ["Mercúrio", 15], ["Júpiter", 22], ["Saturno", 26], ["Marte", 30]],
    2: [["Mercúrio", 7], ["Júpiter", 14], ["Vênus", 21], ["Saturno", 25], ["Marte", 30]],
    3: [["Marte", 6], ["Júpiter", 13], ["Mercúrio", 20], ["Vênus", 27], ["Saturno", 30]],
    4: [["Saturno", 6], ["Mercúrio", 13], ["Vênus", 19], ["Júpiter", 25], ["Marte", 30]],
    5: [["Mercúrio", 7], ["Vênus", 13], ["Júpiter", 18], ["Saturno", 24], ["Marte", 30]],
    6: [["Saturno", 6], ["Vênus", 11], ["Júpiter", 19], ["Mercúrio", 24], ["Marte", 30]],
    7: [["Marte", 6], ["Júpiter", 14], ["Vênus", 21], ["Mercúrio", 27], ["Saturno", 30]],
    8: [["Júpiter", 8], ["Vênus", 14], ["Mercúrio", 19], ["Saturno", 25], ["Marte", 30]],
    9: [["Vênus", 6], ["Mercúrio", 12], ["Júpiter", 19], ["Marte", 25], ["Saturno", 30]],
    10: [["Saturno", 6], ["Mercúrio", 12], ["Vênus", 20], ["Júpiter", 25], ["Marte", 30]],
    11: [["Vênus", 8], ["Júpiter", 14], ["Mercúrio", 20], ["Marte", 26], ["Saturno", 30]]
  };
  function termoDe(l) {
    var sg = signoDe(l), d = norm(l) % 30, de = 0, t = TERMOS[sg];
    for (var i = 0; i < t.length; i++) {
      if (d < t[i][1]) return { senhor: t[i][0], de: de, ate: t[i][1], signo: sg };
      de = t[i][1];
    }
    return { senhor: t[4][0], de: t[3][1], ate: 30, signo: sg };
  }
  /* faces (decanatos) na ordem caldaica, começando em Marte a 0° de Áries */
  var CALDEU = ["Marte", "Sol", "Vênus", "Mercúrio", "Lua", "Saturno", "Júpiter"];
  function faceDe(l) {
    var idx = Math.floor(norm(l) / 10);
    return { senhor: CALDEU[idx % 7], de: idx * 10 % 30, ate: (idx * 10 % 30) + 10 };
  }

  /* ============================================================
     DIGNIDADE ESSENCIAL · pontuação de Lilly
     ============================================================ */
  function dignidadeEssencial(planeta, l, seita) {
    var sg = signoDe(l), signo = SIGNOS[sg], grau = norm(l) % 30;
    var itens = [], pontos = 0;

    if ((DOMICILIO[planeta] || []).indexOf(signo) >= 0) {
      itens.push({ tipo: "domicílio", peso: 5, nota: "em casa própria — dispõe de si" }); pontos += 5;
    }
    var ex = EXALTACAO[planeta];
    if (ex && ex[0] === signo) {
      var exato = Math.abs(grau - ex[1]) < 1;
      itens.push({ tipo: "exaltação", peso: 4, nota: exato ? "no grau exato da exaltação" : "honrado como hóspede" });
      pontos += 4;
    }
    var trip = TRIPLICIDADE[elementoDe(sg)];
    var idxTrip = seita === "diurno" ? 0 : 1;
    if (trip[idxTrip] === planeta) {
      itens.push({ tipo: "triplicidade", peso: 3, nota: "senhor da triplicidade " + (seita === "diurno" ? "diurna" : "noturna") });
      pontos += 3;
    } else if (trip[2] === planeta) {
      itens.push({ tipo: "triplicidade (participante)", peso: 3, nota: "coadjuvante da triplicidade" });
      pontos += 3;
    }
    var tm = termoDe(l);
    if (tm.senhor === planeta) { itens.push({ tipo: "termo", peso: 2, nota: "nos próprios termos" }); pontos += 2; }
    var fc = faceDe(l);
    if (fc.senhor === planeta) { itens.push({ tipo: "face", peso: 1, nota: "na própria face — o mínimo abrigo" }); pontos += 1; }

    var debilidades = [];
    if ((EXILIO[planeta] || []).indexOf(signo) >= 0) {
      debilidades.push({ tipo: "exílio", peso: -5, nota: "em signo contrário à sua natureza" }); pontos -= 5;
    }
    if (QUEDA[planeta] === signo) {
      debilidades.push({ tipo: "queda", peso: -4, nota: "desprestigiado, age sem apoio" }); pontos -= 4;
    }
    var peregrino = itens.length === 0 && debilidades.length === 0;
    if (peregrino) {
      debilidades.push({ tipo: "peregrino", peso: -5, nota: "sem dignidade alguma no lugar — hóspede sem carta" });
      pontos -= 5;
    }
    return {
      pontos: pontos, itens: itens, debilidades: debilidades, peregrino: peregrino,
      signo: signo, termo: tm, face: fc,
      dispositor: REGENTE[signo],
      certeza: "tradicional", fonte: "Lilly, Christian Astrology I, tabela de dignidades"
    };
  }

  /* Cadeia de dispositores: quem manda em quem, até fechar num ciclo
     ou num planeta em domicílio. É a espinha da cadeia de significação. */
  function cadeiaDispositores(planeta, posicoes) {
    var visto = [], atual = planeta;
    for (var i = 0; i < 12; i++) {
      if (visto.indexOf(atual) >= 0) {
        return { cadeia: visto, fim: atual, tipo: visto[visto.length - 1] === atual ? "próprio domicílio" : "ciclo" };
      }
      visto.push(atual);
      var pos = posicoes[atual];
      if (!pos) return { cadeia: visto, fim: atual, tipo: "interrompida" };
      var disp = REGENTE[SIGNOS[signoDe(pos.lon)]];
      if (disp === atual) return { cadeia: visto, fim: atual, tipo: "próprio domicílio" };
      atual = disp;
    }
    return { cadeia: visto, fim: atual, tipo: "longa" };
  }

  /* ============================================================
     CONDIÇÃO ACIDENTAL · a força que vem do lugar e do estado
     ============================================================ */
  var FORCA_CASA = { 1: 5, 10: 5, 7: 4, 4: 4, 11: 4, 2: 3, 5: 3, 9: 2, 3: 1, 8: -2, 6: -2, 12: -5 };
  var ANGULAR = [1, 4, 7, 10], SUCEDENTE = [2, 5, 8, 11];
  var ALEGRIA = { "Mercúrio": 1, "Lua": 3, "Vênus": 5, "Marte": 6, "Sol": 9, "Júpiter": 11, "Saturno": 12 };
  var VELOCIDADE_MEDIA = {
    "Sol": 0.9856, "Lua": 13.176, "Mercúrio": 1.383, "Vênus": 1.2,
    "Marte": 0.524, "Júpiter": 0.083, "Saturno": 0.033
  };

  function condicaoAcidental(planeta, pos, ctx) {
    /* ctx: {cusps, solLon, seita, todas} */
    var itens = [], pontos = 0;
    var pn = S.posicaoNaCasa(pos.lon, ctx.cusps);
    var casa = pn.casa;

    var fc = FORCA_CASA[casa] || 0;
    pontos += fc;
    itens.push({
      tipo: "casa " + casa, peso: fc,
      nota: ANGULAR.indexOf(casa) >= 0 ? "casa angular — o planeta age em cena aberta"
        : SUCEDENTE.indexOf(casa) >= 0 ? "casa sucedente — age com apoio, sem protagonismo"
        : "casa cadente — age de bastidores, com menos alcance"
    });
    if (ALEGRIA[planeta] === casa) {
      pontos += 2;
      itens.push({ tipo: "alegria", peso: 2, nota: "na casa de sua alegria — trabalha à vontade" });
    }
    if (pn.naCuspide) {
      itens.push({
        tipo: "na cúspide", peso: 0,
        nota: "a " + fmtGrau(pn.paraProxima) + " da cúspide da casa " + pn.naCuspide +
              " — a tradição já lhe atribui parte dos assuntos dessa casa"
      });
    }

    /* movimento */
    if (planeta !== "Sol" && planeta !== "Lua") {
      if (pos.speed < 0) {
        pontos -= 5;
        itens.push({ tipo: "retrógrado", peso: -5, nota: "anda para trás: o assunto volta, repete-se, pede revisão antes de avançar" });
      } else if (Math.abs(pos.speed) < VELOCIDADE_MEDIA[planeta] * 0.35) {
        pontos -= 2;
        itens.push({ tipo: "estacionário", peso: -2, nota: "quase parado — véspera ou rescaldo de mudança de direção" });
      } else if (Math.abs(pos.speed) > VELOCIDADE_MEDIA[planeta]) {
        pontos += 2;
        itens.push({ tipo: "veloz", peso: 2, nota: "acima da velocidade média: age depressa" });
      }
    }
    if (planeta === "Lua") {
      if (pos.speed > VELOCIDADE_MEDIA["Lua"]) { pontos += 2; itens.push({ tipo: "veloz", peso: 2, nota: "Lua rápida: os assuntos correm" }); }
      else { pontos -= 2; itens.push({ tipo: "lenta", peso: -2, nota: "Lua lenta: os assuntos demoram" }); }
    }

    /* relação com o Sol */
    if (planeta !== "Sol") {
      var el = Math.abs(delta(pos.lon, ctx.solLon));
      if (el <= 0.2833) {
        pontos += 5;
        itens.push({ tipo: "cazimi", peso: 5, nota: "no coração do Sol (dentro de 17′) — a tradição o tem por fortalecido, não queimado" });
      } else if (el <= 8.5) {
        pontos -= 5;
        itens.push({ tipo: "combusto", peso: -5, nota: "queimado pelo Sol a " + fmtGrau(el) + " — o assunto fica invisível, absorvido pela vontade solar" });
      } else if (el <= 17) {
        pontos -= 4;
        itens.push({ tipo: "sob os raios", peso: -4, nota: "sob os raios do Sol a " + fmtGrau(el) + " — age encoberto" });
      } else {
        pontos += 5;
        itens.push({ tipo: "livre dos raios", peso: 5, nota: "fora do alcance do Sol — visível e autônomo" });
      }
      /* oriental (nasce antes do Sol) / ocidental */
      var d = delta(pos.lon, ctx.solLon);
      itens.push({
        tipo: d < 0 ? "oriental" : "ocidental", peso: 0,
        nota: d < 0 ? "nasce antes do Sol — mostra-se cedo, na primeira metade da vida do assunto"
                    : "põe-se depois do Sol — amadurece tarde"
      });
    }

    /* seita: hayz é a condição ótima */
    var hemisferio = casa >= 7 && casa <= 12 ? "acima" : "abaixo";
    var diurnoPl = ["Sol", "Júpiter", "Saturno"].indexOf(planeta) >= 0;
    var noturnoPl = ["Lua", "Vênus", "Marte"].indexOf(planeta) >= 0;
    if (diurnoPl || noturnoPl) {
      var daSeita = (diurnoPl && ctx.seita === "diurno") || (noturnoPl && ctx.seita === "noturno");
      var sgMasc = signoDe(pos.lon) % 2 === 0;
      if (daSeita) {
        var hayz = (diurnoPl && hemisferio === "acima" && sgMasc) ||
                   (noturnoPl && hemisferio === "abaixo" && !sgMasc);
        pontos += hayz ? 3 : 2;
        itens.push({
          tipo: hayz ? "hayz" : "da seita", peso: hayz ? 3 : 2,
          nota: hayz ? "em hayz — seita, hemisfério e gênero do signo concordam: a melhor condição possível"
                     : "pertence à seita do mapa (" + ctx.seita + ") — joga em casa"
        });
      } else {
        pontos -= 2;
        itens.push({ tipo: "fora da seita", peso: -2, nota: "contrária à seita " + ctx.seita + " do mapa — age em terreno alheio" });
      }
    }

    /* sitiado entre maléficos */
    if (ctx.todas && planeta !== "Marte" && planeta !== "Saturno") {
      var sitio = sitiado(pos.lon, ctx.todas);
      if (sitio) { pontos -= 5; itens.push({ tipo: "sitiado", peso: -5, nota: "entre " + sitio[0] + " e " + sitio[1] + ", sem escapatória por corpo" }); }
    }

    return {
      pontos: pontos, itens: itens, casa: casa, posicaoNaCasa: pn,
      certeza: "tradicional", fonte: "Lilly, tabela de fortitudes e debilidades acidentais"
    };
  }

  function sitiado(l, todas) {
    var mal = ["Marte", "Saturno"], antes = null, depois = null;
    for (var i = 0; i < mal.length; i++) {
      var m = todas[mal[i]]; if (!m) continue;
      var d = delta(m.lon, l);
      if (d < 0 && d > -15 && (!antes || d > antes[1])) antes = [mal[i], d];
      if (d > 0 && d < 15 && (!depois || d < depois[1])) depois = [mal[i], d];
    }
    return (antes && depois) ? [antes[0], depois[0]] : null;
  }

  /* ============================================================
     RECEPÇÕES · item 7. Quem hospeda quem.
     ============================================================ */
  function dignidadesDe(planeta, l, seita) {
    var sg = signoDe(l), signo = SIGNOS[sg], out = [];
    if ((DOMICILIO[planeta] || []).indexOf(signo) >= 0) out.push("domicílio");
    if (EXALTACAO[planeta] && EXALTACAO[planeta][0] === signo) out.push("exaltação");
    var trip = TRIPLICIDADE[elementoDe(sg)];
    if (trip[seita === "diurno" ? 0 : 1] === planeta) out.push("triplicidade");
    if (termoDe(l).senhor === planeta) out.push("termo");
    if (faceDe(l).senhor === planeta) out.push("face");
    return out;
  }

  function recepcoes(posicoes, seita, planetas) {
    var lista = [], nomes = planetas || S.CLASSICOS;
    for (var i = 0; i < nomes.length; i++) {
      for (var j = i + 1; j < nomes.length; j++) {
        var a = nomes[i], b = nomes[j];
        if (!posicoes[a] || !posicoes[b]) continue;
        /* A recebe B se A tem dignidade no lugar de B */
        var aRecebeB = dignidadesDe(a, posicoes[b].lon, seita);
        var bRecebeA = dignidadesDe(b, posicoes[a].lon, seita);
        if (!aRecebeB.length && !bRecebeA.length) continue;
        var mutua = aRecebeB.length > 0 && bRecebeA.length > 0;
        var forte = mutua &&
          aRecebeB.some(function (d) { return d === "domicílio" || d === "exaltação"; }) &&
          bRecebeA.some(function (d) { return d === "domicílio" || d === "exaltação"; });
        lista.push({
          a: a, b: b, aRecebeB: aRecebeB, bRecebeA: bRecebeA,
          mutua: mutua, forte: forte,
          nota: mutua
            ? (forte ? "recepção mútua por " + aRecebeB[0] + " e " + bRecebeA[0] +
                       " — cada um está no lugar do outro; podem trocar de posição e sustentar-se"
                     : "recepção mútua menor (" + aRecebeB.join(", ") + " / " + bRecebeA.join(", ") +
                       ") — apoio real, mas discreto")
            : aRecebeB.length
              ? a + " recebe " + b + " por " + aRecebeB.join(", ") + " — " + a + " acolhe o assunto de " + b
              : b + " recebe " + a + " por " + bRecebeA.join(", ") + " — " + b + " acolhe o assunto de " + a,
          certeza: "tradicional"
        });
      }
    }
    return lista.sort(function (x, y) { return (y.forte ? 2 : y.mutua ? 1 : 0) - (x.forte ? 2 : x.mutua ? 1 : 0); });
  }

  /* ============================================================
     ASPECTOS · com aplicativo/separativo e tempo de perfeição
     ============================================================ */
  var ASPECTOS = [
    { nome: "Conjunção", ang: 0, glifo: "☌", orbe: 8, natureza: "fusão" },
    { nome: "Sextil", ang: 60, glifo: "⚹", orbe: 6, natureza: "suave" },
    { nome: "Quadratura", ang: 90, glifo: "□", orbe: 8, natureza: "tenso" },
    { nome: "Trígono", ang: 120, glifo: "△", orbe: 8, natureza: "suave" },
    { nome: "Oposição", ang: 180, glifo: "☍", orbe: 8, natureza: "tenso" }
  ];

  /* Aspecto entre dois corpos móveis. Aplicativo = a distância ao ângulo
     exato está diminuindo. É o que a tradição considera operante. */
  function aspectoEntre(nomeA, posA, nomeB, posB, fator) {
    fator = fator == null ? 1 : fator;
    var s = Math.abs(delta(posA.lon, posB.lon));
    for (var i = 0; i < ASPECTOS.length; i++) {
      var asp = ASPECTOS[i], orbeMax = asp.orbe * fator;
      var orbe = Math.abs(s - asp.ang);
      if (orbe > orbeMax) continue;
      /* velocidade relativa da separação angular */
      var vel = (posA.speed || 0) - (posB.speed || 0);
      var sinal = delta(posA.lon, posB.lon) >= 0 ? 1 : -1;
      var derivadaSep = sinal * vel;
      var aplicando = (s < asp.ang) ? derivadaSep > 0 : derivadaSep < 0;
      return {
        aspecto: asp.nome, glifo: asp.glifo, angulo: asp.ang, natureza: asp.natureza,
        orbe: orbe, exato: orbe < 0.1667,
        aplicando: aplicando, separando: !aplicando,
        partil: orbe < 1,
        a: nomeA, b: nomeB
      };
    }
    return null;
  }

  /* Todos os aspectos de um conjunto de posições */
  function aspectosDo(posicoes, nomes, fator) {
    var out = [];
    for (var i = 0; i < nomes.length; i++)
      for (var j = i + 1; j < nomes.length; j++) {
        if (!posicoes[nomes[i]] || !posicoes[nomes[j]]) continue;
        var a = aspectoEntre(nomes[i], posicoes[nomes[i]], nomes[j], posicoes[nomes[j]], fator);
        if (a) out.push(a);
      }
    return out.sort(function (x, y) { return x.orbe - y.orbe; });
  }

  /* Agenda da Lua: o que ela ainda perfaz antes de sair do signo.
     A "via combusta" da tradição horária, transposta ao dia. Item 8. */
  /* Uma única varredura para a frente: a longitude da Lua é calculada uma vez
     por passo e comparada contra todos os alvos e ângulos de uma vez. Custa
     ~120 posições lunares em vez das ~1600 de uma busca por par. */
  function agendaDaLua(quando, posicoesFixas, nomesFixos) {
    var lonLua = S.lon("Lua", quando);
    var fimSigno = (Math.floor(lonLua / 30) + 1) * 30;
    var diasAte = norm(fimSigno - lonLua) / 13.176;
    var fim = new Date(quando.getTime() + diasAte * S.MS_DIA);
    var passo = 0.02;                                   /* ~29 min */
    var alvos = [];
    nomesFixos.forEach(function (n) {
      if (!posicoesFixas[n]) return;
      ASPECTOS.forEach(function (a) {
        alvos.push({ alvo: n, lon: posicoesFixas[n].lon, asp: a });
      });
    });
    function off(l, alvo) {
      var s = delta(l, alvo.lon);
      var d1 = delta(s, alvo.asp.ang), d2 = delta(s, -alvo.asp.ang);
      return Math.abs(d1) <= Math.abs(d2) ? d1 : d2;
    }
    var eventos = [];
    var tAnt = quando, lAnt = lonLua;
    var ant = alvos.map(function (a) { return off(lAnt, a); });
    for (var acc = passo; acc <= diasAte + passo; acc += passo) {
      var t = new Date(quando.getTime() + Math.min(acc, diasAte) * S.MS_DIA);
      var l = S.lon("Lua", t);
      for (var i = 0; i < alvos.length; i++) {
        var v = off(l, alvos[i]);
        if (ant[i] * v <= 0 && Math.abs(ant[i] - v) < 45) {
          /* interpola linearmente: em meia hora a Lua anda ~0,27°, erro < 1 min */
          var f = Math.abs(ant[i]) / (Math.abs(ant[i]) + Math.abs(v) || 1);
          var tt = new Date(tAnt.getTime() + f * (t - tAnt));
          eventos.push({
            quando: tt, alvo: alvos[i].alvo, aspecto: alvos[i].asp.nome,
            glifo: alvos[i].asp.glifo, natureza: alvos[i].asp.natureza
          });
        }
        ant[i] = v;
      }
      tAnt = t; lAnt = l;
      if (acc >= diasAte) break;
    }
    eventos.sort(function (a, b) { return a.quando - b.quando; });
    return {
      saiDoSigno: fim, signoAtual: SIGNOS[signoDe(lonLua)],
      proximoSigno: SIGNOS[Math.floor(norm(fimSigno) / 30) % 12],
      eventos: eventos,
      vaziaDeCurso: eventos.length === 0,
      certeza: "tradicional",
      fonte: "curso da Lua até o fim do signo — Lilly, questões horárias"
    };
  }

  /* ============================================================
     ANTISCIA · auditado (item 15)

     Antiscion = reflexão no eixo dos solstícios (0° Câncer / 0° Capricórnio).
       Refletir em 90°: a′ = 2·90 − a = 180 − a.
       Confere: 15° Gêmeos (75°) → 180−75 = 105° = 15° Câncer. Os dois graus
       têm a mesma declinação e o mesmo comprimento de dia. ✓
     Contra-antiscion = reflexão no eixo dos equinócios (0° Áries / 0° Libra).
       Refletir em 0°: a′ = −a = 360 − a.
       Confere: 10° Touro (40°) → 320° = 20° Aquário. Declinações opostas. ✓
       Equivale a antiscion(a) + 180°.

     Orbes — a confusão que existia no app antigo era entre GRAUS e MINUTOS:
     o texto prometia "orbe de até 1°" e o código filtrava por 1,5. Aqui a
     regra é única e explícita: núcleo até 1°00′, secundário de 1°00′ a 1°30′.
     ============================================================ */
  function antiscion(l) { return norm(180 - l); }
  function contraAntiscion(l) { return norm(360 - l); }

  /* Camadas de orbe. `limite` é o teto do que se registra; o que passa de
     1°30′ vai marcado como FORA do orbe adotado — aparece para conferência,
     nunca como testemunho. Como antiscion é involutivo (antiscion do antiscion
     é o ponto de partida), basta testar cada par uma vez. */
  function camadaAntiscia(orbe) {
    return orbe <= 1 ? "núcleo" : orbe <= 1.5 ? "secundário" : "fora do orbe";
  }
  function contatosAntiscia(posicoes, nomes, limite) {
    limite = limite == null ? 3 : limite;
    var out = [];
    for (var i = 0; i < nomes.length; i++) {
      for (var j = i + 1; j < nomes.length; j++) {
        var a = nomes[i], b = nomes[j];
        if (!posicoes[a] || !posicoes[b]) continue;
        var la = posicoes[a].lon, lb = posicoes[b].lon;
        var dA = Math.abs(delta(antiscion(la), lb));
        if (dA <= limite) out.push({
          tipo: "antiscion", a: a, b: b, orbe: dA,
          camada: camadaAntiscia(dA), vale: dA <= 1.5,
          nota: "o antiscion de " + a + " cai sobre " + b +
                " — a tradição lê como conjunção oculta: agem juntos sem se verem"
        });
        var dC = Math.abs(delta(contraAntiscion(la), lb));
        if (dC <= limite) out.push({
          tipo: "contra-antiscion", a: a, b: b, orbe: dC,
          camada: camadaAntiscia(dC), vale: dC <= 1.5,
          nota: "o contra-antiscion de " + a + " cai sobre " + b +
                " — oposição oculta: um desfaz o que o outro faz, sem confronto declarado"
        });
      }
    }
    return out.sort(function (x, y) { return x.orbe - y.orbe; });
  }

  /* ============================================================
     LOTES HERMÉTICOS
     ============================================================ */
  function lotes(posicoes, asc, seita) {
    var P = posicoes, diurno = seita === "diurno";
    var L = {};
    L["Fortuna"] = norm(asc + (diurno ? P["Lua"].lon - P["Sol"].lon : P["Sol"].lon - P["Lua"].lon));
    L["Espírito"] = norm(asc + (diurno ? P["Sol"].lon - P["Lua"].lon : P["Lua"].lon - P["Sol"].lon));
    L["Eros"] = norm(asc + (diurno ? P["Vênus"].lon - L["Espírito"] : L["Espírito"] - P["Vênus"].lon));
    L["Necessidade"] = norm(asc + (diurno ? L["Fortuna"] - P["Mercúrio"].lon : P["Mercúrio"].lon - L["Fortuna"]));
    L["Coragem"] = norm(asc + (diurno ? L["Fortuna"] - P["Marte"].lon : P["Marte"].lon - L["Fortuna"]));
    L["Vitória"] = norm(asc + (diurno ? P["Júpiter"].lon - L["Espírito"] : L["Espírito"] - P["Júpiter"].lon));
    L["Nêmesis"] = norm(asc + (diurno ? L["Fortuna"] - P["Saturno"].lon : P["Saturno"].lon - L["Fortuna"]));
    return L;
  }

  /* ============================================================
     ESTRELAS FIXAS · detector dinâmico (item 14)
     Catálogo em longitude/latitude eclíptica J2000; precessão de
     50,29″/ano aplicada à longitude. Varre TODOS os pontos do mapa
     contra TODAS as estrelas, com orbes consistentes:
       núcleo     ≤ 1°00′
       secundário 1°00′ – 1°30′
     Estrelas com latitude eclíptica alta são sinalizadas: a conjunção
     é só em longitude, e a tradição paranatelôntica pediria outra conta.
     ============================================================ */
  var CATALOGO = [
    ["Alpheratz", "α Andromedae", 14.30, 25.68, 2.07, "Júpiter / Vênus", "O cavalo solto: independência, mobilidade, honra ganha por iniciativa própria."],
    ["Baten Kaitos", "ζ Ceti", 21.95, -20.33, 3.7, "Saturno", "O ventre da baleia: quedas e transportes forçados; mudança de sorte por causa externa."],
    ["Mirach", "β Andromedae", 30.40, 25.93, 2.06, "Vênus", "Beleza receptiva, amor à harmonia, dons que atraem sem esforço; devoção."],
    ["Sheratan", "β Arietis", 33.97, 8.48, 2.64, "Marte / Saturno", "O chifre: audácia que fere; força de ataque, e o perigo de gastá-la à toa."],
    ["Hamal", "α Arietis", 37.67, 9.97, 2.0, "Marte / Saturno", "A cabeça do carneiro: comando por violência ou por dureza; independência áspera."],
    ["Almach", "γ Andromedae", 44.23, 27.75, 2.10, "Vênus", "Honra e estima ganhas por artes e prazeres; talento que agrada."],
    ["Menkar", "α Ceti", 44.32, -12.58, 2.5, "Saturno", "A mandíbula: doenças da garganta, provações herdadas, o peso do coletivo."],
    ["Zaurak", "γ Eridani", 53.82, -28.53, 2.9, "Saturno", "O barco do rio: melancolia e medo da morte; profundidade triste."],
    ["Algol", "β Persei", 56.17, 22.42, 2.1, "Saturno / Júpiter", "A cabeça da Medusa, a mais temida da tradição — e a mais intensa. Concentra paixão e poder, e a capacidade de encarar o que os outros desviam o olhar. Sombra: perder a cabeça."],
    ["Alcyone", "η Tauri (Plêiades)", 59.98, 4.05, 2.87, "Lua / Marte", "As Plêiades: visão, choro e ambição; algo se vê cedo demais e custa caro."],
    ["Aldebaran", "α Tauri", 69.78, -5.47, 0.85, "Marte", "Estrela real, guardiã do Oriente: honra, coragem e êxito — sob a condição de manter a integridade; a queda vem por perdê-la."],
    ["Rigel", "β Orionis", 76.83, -31.12, 0.12, "Júpiter / Marte", "O pé do caçador: ensino, invenção técnica, honra duradoura pelo próprio ofício."],
    ["Bellatrix", "γ Orionis", 80.95, -16.82, 1.6, "Marte / Mercúrio", "A guerreira: sucesso rápido seguido de reviravolta; língua afiada."],
    ["Capella", "α Aurigae", 81.85, 22.87, 0.08, "Marte / Mercúrio", "A cabra do cocheiro: curiosidade inquieta, aprendizado incessante, cargos de confiança."],
    ["Alnilam", "ε Orionis", 83.47, -24.50, 1.7, "Júpiter / Saturno", "O cinturão: fama breve e trabalho de escala; a honra que passa."],
    ["Polaris", "α Ursae Minoris", 88.57, 66.10, 2.0, "Saturno / Vênus", "A estrela do norte: direção fixa, herança espiritual, doença e legado."],
    ["Betelgeuse", "α Orionis", 88.75, -16.03, 0.5, "Marte / Mercúrio", "O ombro do gigante: fortuna marcial, êxito por bravura, honra que dura."],
    ["Menkalinan", "β Aurigae", 89.92, 21.50, 1.9, "Marte / Mercúrio", "O ombro do cocheiro: perícia em conduzir forças que poderiam disparar; reação rápida sob pressão. Sombra: desgaste e disputas — a rédea firme, ou o carro tomba."],
    ["Sirius", "α Canis Majoris", 104.08, -39.60, -1.46, "Júpiter / Marte", "A mais brilhante do céu: guardiã, fama, altos cargos — e o calor que a tradição associa à canícula."],
    ["Castor", "α Geminorum", 110.23, 10.08, 1.58, "Mercúrio", "O gêmeo mortal: engenho, escrita, viagens; súbita perda de honra e recuperação."],
    ["Pollux", "β Geminorum", 113.22, 6.68, 1.15, "Marte", "O gêmeo imortal: audácia e combate; competição levada a sério."],
    ["Procyon", "α Canis Minoris", 115.78, -16.02, 0.38, "Mercúrio / Marte", "O cão que precede: ascensão rápida por atividade, seguida de queda se faltar cautela."],
    ["Praesepe", "M44 (Presépio)", 127.33, 1.08, 3.7, "Marte / Lua", "A manjedoura: multidão e névoa; assuntos que se embaralham e olhos que se turvam."],
    ["Acubens", "α Cancri", 133.63, -5.08, 4.3, "Saturno / Mercúrio", "A garra: atividade insistente e o gosto por refúgio; escrita paciente."],
    ["Dubhe", "α Ursae Majoris", 135.48, 49.68, 1.8, "Marte", "A ursa que aponta o norte: presença física marcante, força persistente, fundo selvagem que não se domestica. Sombra: destruir por falta de causa."],
    ["Alphard", "α Hydrae", 147.28, -22.38, 2.0, "Saturno / Vênus", "O solitário da serpente: sabedoria e paixão intensa; risco de excesso e de veneno."],
    ["Al Jabhah", "η Leonis", 147.75, 4.87, 3.5, "Saturno / Mercúrio", "A fronte do Leão: seriedade de pensamento, voz que impõe respeito, responsabilidade cedo. Sombra: rigidez e sucesso que pede revisão."],
    ["Regulus", "α Leonis", 149.83, 0.47, 1.35, "Marte / Júpiter", "Estrela real, o Coração do Leão: comando, honra e grandeza — com a cláusula clássica de que a queda vem da vingança."],
    ["Zosma", "δ Leonis", 161.32, 14.33, 2.5, "Saturno / Vênus", "O dorso: benefício por sofrimento; medo, e a capacidade de suportar o que fere."],
    ["Denebola", "β Leonis", 171.62, 12.27, 2.1, "Saturno / Vênus", "A cauda: juízo rápido, boas resoluções e desgraça por precipitação; contraria a nobreza herdada."],
    ["Alkaid", "η Ursae Majoris", 176.93, 54.38, 1.86, "Lua / Marte", "A ponta do carro: destruição e luto; também a capacidade de encerrar."],
    ["Porrima", "γ Virginis", 190.16, 2.80, 2.7, "Mercúrio / Vênus", "A deusa da profecia: antevisão e conselho; graça social e inteligência que percebe antes dos outros para onde as coisas caminham. Sombra: usar essa leitura para agradar em vez de dizer o que é."],
    ["Vindemiatrix", "ε Virginis", 190.36, 16.20, 2.8, "Saturno / Mercúrio", "A vindimadeira, estrela da colheita — e da maturidade que se paga com perda. Concentra, aprofunda e amadurece o que toca, mas cobra em melancolia e desgostos afetivos."],
    ["Algorab", "δ Corvi", 193.47, -12.18, 2.9, "Marte / Saturno", "O corvo: repulsa, malícia e mentira; também a esperteza que sobrevive."],
    ["Spica", "α Virginis", 203.83, -2.05, 0.98, "Vênus / Marte", "A espiga: a mais benéfica do céu. Dons, ciência, e proteção que não se explica."],
    ["Arcturus", "α Bootis", 204.23, 30.75, -0.04, "Marte / Júpiter", "O guardião da ursa: prosperidade por trabalho próprio; navegação em terreno difícil."],
    ["Khambalia", "λ Virginis", 216.97, -0.45, 4.5, "Mercúrio / Marte", "A garra torta: mudanças rápidas e argumentação afiada; lógica veloz e talento polêmico. Sombra: discutir por esporte e mudar de rumo cedo demais."],
    ["Alphecca", "α Coronae Borealis", 222.30, 44.32, 2.2, "Vênus / Mercúrio", "A joia da coroa: honra, dignidade artística e poderes de cura."],
    ["Zuben Elgenubi", "α Librae", 225.08, 0.33, 2.75, "Saturno / Marte", "O prato sul: doença crônica, obstáculo e o preço do desequilíbrio."],
    ["Zuben Eschamali", "β Librae", 229.37, 8.50, 2.6, "Júpiter / Mercúrio", "O prato norte, o prato do bem — tida como a de melhor fortuna da constelação. Honra, distinção e um senso de justiça que atrai boa reputação."],
    ["Unukalhai", "α Serpentis", 232.07, 25.52, 2.6, "Saturno / Marte", "O pescoço da serpente: acidente, veneno e sabedoria comprada caro."],
    ["Ras Algethi", "α Herculis", 256.10, 37.28, 3.1, "Mercúrio / Marte", "A cabeça do herói: força de vontade, saúde robusta e temperamento indomável."],
    ["Sabik", "η Ophiuchi", 257.97, 7.20, 2.4, "Saturno / Vênus", "Gasto de energia em causas perdidas; também a medicina e o que cura."],
    ["Rasalhague", "α Ophiuchi", 262.45, 35.85, 2.1, "Saturno / Vênus", "O condutor da serpente: perversão e infortúnio na tradição; e o saber médico."],
    ["Lesath", "υ Scorpii", 264.00, -14.00, 2.7, "Mercúrio / Marte", "O ferrão: cirurgia, corte, veneno — o que se aplica com precisão."],
    ["Antares", "α Scorpii", 279.77, -4.57, 1.06, "Marte / Júpiter", "Estrela real, guardiã do Ocidente, o rival de Marte: coragem obstinada e destrutividade; honra militar e o risco de teimosia."],
    ["Facies", "M22", 278.28, -1.83, 5.1, "Sol / Marte", "O rosto do arqueiro: violência e cegueira na tradição; foco absoluto que não vê ao redor."],
    ["Nunki", "σ Sagittarii", 282.23, -3.45, 2.1, "Júpiter / Mercúrio", "A palavra do mar: mensagem verdadeira, ofício religioso ou de escrita."],
    ["Vega", "α Lyrae", 285.32, 61.73, 0.03, "Vênus / Mercúrio", "A lira: dom artístico, magia e idealismo; carisma que se ouve."],
    ["Altair", "α Aquilae", 301.78, 29.30, 0.77, "Marte / Júpiter", "A águia: ousadia, ascensão brusca e posição conquistada de assalto."],
    ["Sadalsuud", "β Aquarii", 323.38, 8.62, 2.9, "Saturno / Mercúrio", "A mais afortunada das afortunadas: sorte que chega por caminhos estranhos."],
    ["Deneb Algedi", "δ Capricorni", 323.55, -2.60, 2.9, "Saturno / Júpiter", "A cauda da cabra: justiça, lei e um destino que ora protege ora fere."],
    ["Sadalmelik", "α Aquarii", 333.28, 10.65, 3.0, "Saturno / Mercúrio", "A sorte do rei: perseguição e causa perdida; também o direito público."],
    ["Fomalhaut", "α Piscis Austrini", 333.87, -21.13, 1.16, "Vênus / Mercúrio", "Estrela real, guardiã do Sul: idealismo e êxito, com a cláusula de que só dura se a causa for limpa."],
    ["Deneb Adige", "α Cygni", 335.33, 59.92, 1.25, "Vênus / Mercúrio", "O cisne: talento artístico, mente clara e viagem por água."],
    ["Achernar", "α Eridani", 345.32, -59.35, 0.5, "Júpiter", "O fim do rio: sucesso em cargos públicos e religião; beneficência."],
    ["Markab", "α Pegasi", 353.48, 19.40, 2.5, "Marte / Mercúrio", "A sela: honra por trabalho duro e perigo por fogo, arma ou queda."],
    ["Scheat", "β Pegasi", 359.37, 31.13, 2.4, "Marte / Mercúrio", "A perna: infortúnio por água e extrema má sorte na tradição; também o pensamento independente."]
  ].map(function (r) {
    return { nome: r[0], estrela: r[1], lonJ2000: r[2], lat: r[3], mag: r[4], natureza: r[5], simbolo: r[6] };
  });

  var PRECESSAO_ANO = 50.2877 / 3600;   /* graus por ano tropical */
  function lonEstrela(st, quando) {
    var anos = (S.jd(quando) - 2451545.0) / 365.25;
    return norm(st.lonJ2000 + PRECESSAO_ANO * anos);
  }

  /* Varredura: todos os pontos contra todo o catálogo.
     Devolve contatos ordenados por orbe. */
  function estrelasEm(pontos, quando, orbeMax) {
    orbeMax = orbeMax == null ? 1.5 : orbeMax;
    var out = [];
    var chaves = Object.keys(pontos);
    for (var i = 0; i < CATALOGO.length; i++) {
      var st = CATALOGO[i], lst = lonEstrela(st, quando);
      for (var k = 0; k < chaves.length; k++) {
        var nome = chaves[k], l = pontos[nome];
        if (typeof l !== "number") continue;
        var orbe = Math.abs(delta(lst, l));
        if (orbe > orbeMax) continue;
        out.push({
          estrela: st.nome, designacao: st.estrela, natureza: st.natureza,
          simbolo: st.simbolo, mag: st.mag, latEcl: st.lat,
          ponto: nome, lonEstrela: lst, lonPonto: l, orbe: orbe,
          nucleo: orbe <= 1,
          foraDaEcliptica: Math.abs(st.lat) > 10,
          certeza: "tradicional"
        });
      }
    }
    return out.sort(function (a, b) { return a.orbe - b.orbe; });
  }

  /* ---------- formatação ---------- */
  function fmtGrau(x) {
    var g = Math.floor(Math.abs(x)), m = Math.round((Math.abs(x) - g) * 60);
    if (m === 60) { m = 0; g++; }
    return (x < 0 ? "-" : "") + g + "°" + String(m).padStart(2, "0") + "′";
  }
  function fmtLon(l) {
    l = norm(l);
    var sg = Math.floor(l / 30), d = l % 30, g = Math.floor(d), m = Math.floor((d - g) * 60);
    return g + "° " + GLIFO_SIGNO[sg] + "︎ " + String(m).padStart(2, "0") + "′";
  }
  function fmtLonNome(l) {
    l = norm(l);
    var sg = Math.floor(l / 30), d = l % 30, g = Math.floor(d), m = Math.floor((d - g) * 60);
    return g + "°" + String(m).padStart(2, "0") + "′ de " + SIGNOS[sg];
  }

  root.Trad = {
    SIGNOS: SIGNOS, GLIFO_SIGNO: GLIFO_SIGNO, GLIFO: GLIFO, ELEMENTO: ELEMENTO, MODO: MODO,
    REGENTE: REGENTE, DOMICILIO: DOMICILIO, EXILIO: EXILIO, EXALTACAO: EXALTACAO, QUEDA: QUEDA,
    TRIPLICIDADE: TRIPLICIDADE, TERMOS: TERMOS, ASPECTOS: ASPECTOS, CATALOGO: CATALOGO,
    signoDe: signoDe, elementoDe: elementoDe, modoDe: modoDe,
    termoDe: termoDe, faceDe: faceDe,
    dignidadeEssencial: dignidadeEssencial, condicaoAcidental: condicaoAcidental,
    dignidadesDe: dignidadesDe, recepcoes: recepcoes, cadeiaDispositores: cadeiaDispositores,
    aspectoEntre: aspectoEntre, aspectosDo: aspectosDo, agendaDaLua: agendaDaLua,
    antiscion: antiscion, contraAntiscion: contraAntiscion, contatosAntiscia: contatosAntiscia,
    lotes: lotes, estrelasEm: estrelasEm, lonEstrela: lonEstrela, camadaAntiscia: camadaAntiscia,
    fmtGrau: fmtGrau, fmtLon: fmtLon, fmtLonNome: fmtLonNome
  };
})(window);
