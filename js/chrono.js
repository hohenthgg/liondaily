/* ============================================================
   LIONS DAILY · cronocratores e hierarquia

   A hierarquia é a espinha do aplicativo inteiro:

     NATAL          o que é possível          (promessa)
       ↓
     CRONOCRATOR    o que está autorizado     (firdaria, senhor do ano)
       ↓
     CONTEXTO       o campo do período        (revolução, profecção)
       ↓
     GATILHO        o que ativa agora         (trânsito)
       ↓
     HOJE           o que disso é relevante   (recorte do dia)

   Nada sobe de nível sozinho: um trânsito só importa se toca algo que o
   natal prometeu e que o cronocrator do momento autoriza. É essa regra que
   decide o que aparece na tela inicial.
   ============================================================ */
(function (root) {
  "use strict";
  var S = root.Astro, T = root.Trad;
  var norm = S.norm, delta = S.delta;
  var DIA = S.MS_DIA;

  /* ---------- grau de certeza (item 25) ---------- */
  var CERTEZA = {
    tradicional: { rot: "TRADICIONAL", desc: "regra explícita nas fontes antigas" },
    derivado: { rot: "DERIVADO", desc: "consequência de regra tradicional aplicada a este mapa" },
    heuristico: { rot: "HEURÍSTICO", desc: "critério de organização nosso, defensável mas não canônico" },
    experimental: { rot: "EXPERIMENTAL", desc: "construção moderna, sem lastro na tradição" }
  };

  /* ---------- o nativo ---------- */
  var NATIVO = {
    nome: "Lions Daily",
    nascimento: new Date(Date.UTC(1994, 7, 17, 9, 0)),   /* 06:00 −03 */
    dataLocal: "17 de agosto de 1994, 06:00 (UTC−3)",
    lugar: "Pouso Alegre, MG, Brasil",
    lat: -22.2270778, lon: -45.9393716, alt: 850
  };

  /* Local ATUAL — separado do natal (item 17). Persistido. */
  var LOCAL_ATUAL = { nome: NATIVO.lugar, lat: NATIVO.lat, lon: NATIVO.lon, alt: NATIVO.alt, herdado: true };
  try {
    var g = JSON.parse(localStorage.getItem("lions-local") || "null");
    if (g && typeof g.lat === "number") { LOCAL_ATUAL = g; LOCAL_ATUAL.herdado = false; }
  } catch (e) { }
  function definirLocalAtual(nome, lat, lon, alt) {
    LOCAL_ATUAL = { nome: nome, lat: lat, lon: lon, alt: alt || 0, herdado: false };
    try { localStorage.setItem("lions-local", JSON.stringify(LOCAL_ATUAL)); } catch (e) { }
    return LOCAL_ATUAL;
  }
  function localAtual() { return LOCAL_ATUAL; }

  /* ============================================================
     MAPA NATAL — calculado uma vez, na carga
     ============================================================ */
  var MAPA = (function () {
    var d = NATIVO.nascimento;
    var ceu = S.ceu(d);
    var h = S.casas(d, NATIVO.lat, NATIVO.lon);
    var seita = S.seita(ceu["Sol"].lon, h.cusps);
    var lotes = T.lotes(ceu, h.asc, seita);

    var pontos = {};
    Object.keys(ceu).forEach(function (k) { pontos[k] = ceu[k].lon; });
    pontos["Ascendente"] = h.asc; pontos["Meio-do-Céu"] = h.mc;

    var m = {
      quando: d, ceu: ceu, casas: h, seita: seita, lotes: lotes, pontos: pontos,
      signoASC: T.SIGNOS[T.signoDe(h.asc)],
      regenteASC: T.REGENTE[T.SIGNOS[T.signoDe(h.asc)]],
      aspectos: T.aspectosDo(ceu, S.CLASSICOS),
      recepcoes: T.recepcoes(ceu, seita, S.CLASSICOS)
    };
    /* que casas cada planeta rege — a origem de toda significação */
    m.rege = {};
    for (var i = 1; i <= 12; i++) {
      var r = T.REGENTE[T.SIGNOS[T.signoDe(h.cusps[i - 1])]];
      (m.rege[r] = m.rege[r] || []).push(i);
    }
    /* dignidade e condição de cada planeta */
    m.condicao = {};
    S.CLASSICOS.forEach(function (p) {
      m.condicao[p] = {
        essencial: T.dignidadeEssencial(p, ceu[p].lon, seita),
        acidental: T.condicaoAcidental(p, ceu[p], {
          cusps: h.cusps, solLon: ceu["Sol"].lon, seita: seita, todas: ceu
        })
      };
    });
    /* pontos completos, para estrelas e antiscia */
    var todos = {};
    Object.keys(pontos).forEach(function (k) { todos[k] = pontos[k]; });
    Object.keys(lotes).forEach(function (k) { todos["Lote de " + k] = lotes[k]; });
    m.todosPontos = todos;
    m.estrelas = T.estrelasEm(todos, d, 1.5);
    var pa = {};
    Object.keys(ceu).forEach(function (k) { pa[k] = ceu[k]; });
    pa["Ascendente"] = { lon: h.asc, speed: 0 }; pa["Meio-do-Céu"] = { lon: h.mc, speed: 0 };
    m.antiscia = T.contatosAntiscia(pa, S.CLASSICOS.concat(["Ascendente", "Meio-do-Céu"]), 3);
    return m;
  })();

  function idadeEm(d) { return (d - NATIVO.nascimento) / (365.2425 * DIA); }
  function casaDe(l) { return S.casaDe(l, MAPA.casas.cusps); }

  /* ============================================================
     FIRDARIA · mapa noturno começa pela Lua
     ============================================================ */
  var FIRD_ORDEM = [
    ["Lua", 9], ["Saturno", 11], ["Júpiter", 12], ["Marte", 7],
    ["Sol", 10], ["Vênus", 8], ["Mercúrio", 13], ["Nodo Norte", 3], ["Nodo Sul", 2]
  ];
  var FIRD_ORDEM_DIURNA = [
    ["Sol", 10], ["Vênus", 8], ["Mercúrio", 13], ["Lua", 9],
    ["Saturno", 11], ["Júpiter", 12], ["Marte", 7], ["Nodo Norte", 3], ["Nodo Sul", 2]
  ];
  var FIRD = (MAPA.seita === "noturno" ? FIRD_ORDEM : FIRD_ORDEM_DIURNA);
  /* a ordem dos sub-períodos segue a mesma sequência, começando pelo senhor maior */
  var FIRD_PLANETAS = FIRD.filter(function (f) { return f[0].indexOf("Nodo") < 0; }).map(function (f) { return f[0]; });

  var FIRDARIA = (function () {
    var out = [], idade = 0;
    for (var ciclo = 0; ciclo < 2; ciclo++) {
      for (var i = 0; i < FIRD.length; i++) {
        var lorde = FIRD[i][0], anos = FIRD[i][1];
        var per = { lorde: lorde, anos: anos, de: idade, ate: idade + anos, subs: [] };
        if (FIRD_PLANETAS.indexOf(lorde) >= 0) {
          var passo = anos / 7, base = FIRD_PLANETAS.indexOf(lorde), a = idade;
          for (var k = 0; k < 7; k++) {
            var sub = FIRD_PLANETAS[(base + k) % 7];
            per.subs.push({ lorde: sub, de: a, ate: a + passo });
            a += passo;
          }
        }
        out.push(per);
        idade += anos;
      }
    }
    return out;
  })();

  function dataDaIdade(anos) { return new Date(NATIVO.nascimento.getTime() + anos * 365.2425 * DIA); }

  function firdariaEm(d) {
    var a = idadeEm(d);
    for (var i = 0; i < FIRDARIA.length; i++) {
      var p = FIRDARIA[i];
      if (a >= p.de && a < p.ate) {
        var sub = null;
        for (var k = 0; k < p.subs.length; k++)
          if (a >= p.subs[k].de && a < p.subs[k].ate) sub = p.subs[k];
        return {
          maior: p, sub: sub,
          fimMaior: dataDaIdade(p.ate), fimSub: sub ? dataDaIdade(sub.ate) : dataDaIdade(p.ate),
          inicioMaior: dataDaIdade(p.de), inicioSub: sub ? dataDaIdade(sub.de) : dataDaIdade(p.de),
          certeza: "tradicional", fonte: "firdaria persa; sequência noturna a partir da Lua"
        };
      }
    }
    return null;
  }

  /* ============================================================
     PROFECÇÃO ANUAL · whole-sign a partir do signo do Ascendente
     ============================================================ */
  function aniversarioDe(idade) {
    /* o retorno solar é o marco exato; o aniversário civil é aproximação */
    return dataDaIdade(idade);
  }
  function profeccaoEm(d) {
    var a = Math.floor(idadeEm(d));
    if (a < 0) a = 0;
    var sgASC = T.signoDe(MAPA.casas.asc);
    var sg = (sgASC + a) % 12;
    var signo = T.SIGNOS[sg];
    var senhor = T.REGENTE[signo];
    var casa = (a % 12) + 1;
    /* que planetas natais estão nesse signo — testemunhas do ano */
    var ocupantes = S.CLASSICOS.filter(function (p) { return T.signoDe(MAPA.ceu[p].lon) === sg; });
    return {
      idade: a, casa: casa, signo: signo, signoIdx: sg, senhorDoAno: senhor,
      ocupantes: ocupantes,
      posSenhor: MAPA.ceu[senhor],
      casaNatalDoSenhor: casaDe(MAPA.ceu[senhor].lon),
      condicaoSenhor: MAPA.condicao[senhor],
      inicio: aniversarioDe(a), fim: aniversarioDe(a + 1),
      certeza: "tradicional",
      fonte: "profecção anual de signo inteiro; o senhor do signo profectado é o senhor do ano"
    };
  }

  /* ============================================================
     REVOLUÇÃO SOLAR · com casas PRÓPRIAS (item 6)
     O erro corrigido: antes, os planetas da revolução eram classificados
     nas cúspides natais. A revolução tem seu próprio ascendente; a leitura
     correta é dupla — casas da revolução E sobreposição sobre o natal.
     ============================================================ */
  var _cacheRS = {};
  function revolucaoDe(ano, lat, lon) {
    lat = lat == null ? LOCAL_ATUAL.lat : lat;
    lon = lon == null ? LOCAL_ATUAL.lon : lon;
    var ch = ano + "|" + lat.toFixed(3) + "|" + lon.toFixed(3);
    if (_cacheRS[ch]) return _cacheRS[ch];
    var rs = S.revolucaoSolar(MAPA.ceu["Sol"].lon, ano, lat, lon);
    if (!rs) return null;

    var seitaRS = S.seita(rs.planetas["Sol"].lon, rs.casas.cusps);
    var r = {
      ano: ano, utc: rs.utc, lat: lat, lon: lon,
      planetas: rs.planetas, casas: rs.casas, seita: seitaRS,
      /* leitura 1 — as casas DA REVOLUÇÃO */
      proprias: {}, /* planeta → casa na revolução */
      /* leitura 2 — sobreposição sobre o natal */
      sobreNatal: {}, /* planeta da revolução → casa natal onde cai */
      certeza: "tradicional"
    };
    S.CLASSICOS.concat(["Nodo Norte"]).forEach(function (p) {
      if (!rs.planetas[p]) return;
      r.proprias[p] = S.casaDe(rs.planetas[p].lon, rs.casas.cusps);
      r.sobreNatal[p] = casaDe(rs.planetas[p].lon);
    });
    /* o ascendente da revolução caindo numa casa natal é um dos
       testemunhos mais citados da técnica */
    r.ascSobreNatal = casaDe(rs.casas.asc);
    r.mcSobreNatal = casaDe(rs.casas.mc);
    r.signoASC = T.SIGNOS[T.signoDe(rs.casas.asc)];
    r.regenteASC = T.REGENTE[r.signoASC];
    r.casaDoRegente = S.casaDe(rs.planetas[r.regenteASC].lon, rs.casas.cusps);
    r.condicaoRegente = {
      essencial: T.dignidadeEssencial(r.regenteASC, rs.planetas[r.regenteASC].lon, seitaRS),
      acidental: T.condicaoAcidental(r.regenteASC, rs.planetas[r.regenteASC], {
        cusps: rs.casas.cusps, solLon: rs.planetas["Sol"].lon, seita: seitaRS, todas: rs.planetas
      })
    };
    r.aspectos = T.aspectosDo(rs.planetas, S.CLASSICOS);
    /* trânsitos da revolução aos pontos natais — é aqui que o ano toca a promessa */
    r.aoNatal = [];
    S.CLASSICOS.forEach(function (pt) {
      Object.keys(MAPA.pontos).forEach(function (pn) {
        var a = T.aspectoEntre(pt, rs.planetas[pt], pn, { lon: MAPA.pontos[pn], speed: 0 }, 0.75);
        if (a) r.aoNatal.push(a);
      });
    });
    r.aoNatal.sort(function (a, b) { return a.orbe - b.orbe; });
    _cacheRS[ch] = r;
    return r;
  }

  /* A revolução VIGENTE é a última já ocorrida, não a do ano civil.
     Entre 1º de janeiro e o aniversário, quem está no ar é a do ano anterior. */
  function revolucaoVigente(quando, lat, lon) {
    var ano = quando.getUTCFullYear();
    var r = revolucaoDe(ano, lat, lon);
    if (r && r.utc <= quando) return r;
    return revolucaoDe(ano - 1, lat, lon);
  }

  /* Prioridade de leitura da revolução — a ordem que a técnica manda seguir.
     Antes o app listava tudo em pé de igualdade; isto é o que muda. */
  function prioridadeRevolucao(r, prof) {
    var passos = [];
    passos.push({
      ordem: 1, rot: "Ascendente da revolução",
      valor: T.fmtLonNome(r.casas.asc) + " — cai na casa natal " + r.ascSobreNatal,
      leitura: "O ascendente da revolução diz de onde o ano é olhado. Caindo sobre a casa natal " +
        r.ascSobreNatal + ", o ano tende a ser vivido pelos assuntos dessa casa.",
      certeza: "tradicional"
    });
    passos.push({
      ordem: 2, rot: "Regente do ascendente da revolução",
      valor: r.regenteASC + " na casa " + r.casaDoRegente + " da revolução (" +
        T.fmtLonNome(r.planetas[r.regenteASC].lon) + ")",
      leitura: "Quem conduz o ano e por que campo o conduz. Condição essencial " +
        sinal(r.condicaoRegente.essencial.pontos) + ", acidental " +
        sinal(r.condicaoRegente.acidental.pontos) + ".",
      certeza: "tradicional"
    });
    if (prof) passos.push({
      ordem: 3, rot: "Senhor do ano (profecção) na revolução",
      valor: prof.senhorDoAno + " na casa " + (r.proprias[prof.senhorDoAno] || "—") +
        " da revolução, sobre a casa natal " + (r.sobreNatal[prof.senhorDoAno] || "—"),
      leitura: "A profecção elege o senhor do ano; a revolução mostra em que estado ele chega. " +
        "Este é o cruzamento que decide o tom do período.",
      certeza: "tradicional"
    });
    passos.push({
      ordem: 4, rot: "Luminares da revolução",
      valor: "Sol casa " + r.proprias["Sol"] + " · Lua casa " + r.proprias["Lua"] +
        " (sobre o natal: " + r.sobreNatal["Sol"] + " e " + r.sobreNatal["Lua"] + ")",
      leitura: "O Sol marca o campo de propósito do ano; a Lua, o de rotina e humor.",
      certeza: "tradicional"
    });
    var fortes = r.aoNatal.filter(function (a) { return a.orbe < 2; }).slice(0, 5);
    if (fortes.length) passos.push({
      ordem: 5, rot: "Contatos da revolução com o natal",
      valor: fortes.map(function (a) { return a.a + " " + a.glifo + " " + a.b + " (" + T.fmtGrau(a.orbe) + ")"; }).join(" · "),
      leitura: "Os pontos natais que o ano encosta. Só estes acendem promessa natal.",
      certeza: "derivado"
    });
    return passos;
  }
  function sinal(n) { return (n > 0 ? "+" : "") + n; }

  /* ============================================================
     TRÂNSITOS · com aplicativo/separativo e tempo de perfeição (item 8)
     ============================================================ */
  function transitosAoNatal(quando, opts) {
    opts = opts || {};
    var fator = opts.fator == null ? 0.75 : opts.fator;     /* orbe apertado para trânsito */
    var ceu = S.ceu(quando);
    var alvos = opts.alvos || Object.keys(MAPA.pontos);
    var out = [];
    S.CLASSICOS.forEach(function (pt) {
      alvos.forEach(function (pn) {
        var a = T.aspectoEntre(pt, ceu[pt], pn, { lon: MAPA.pontos[pn], speed: 0 }, fator);
        if (!a) return;
        a.transitante = pt; a.natal = pn;
        a.lonTransito = ceu[pt].lon; a.lonNatal = MAPA.pontos[pn];
        a.retrogrado = ceu[pt].speed < 0;
        out.push(a);
      });
    });
    /* tempo de perfeição só para o que está aplicando: é o que ainda vai acontecer */
    if (opts.comPerfeicao !== false) {
      out.forEach(function (a) {
        if (!a.aplicando) return;
        var janela = a.transitante === "Lua" ? 3 : a.transitante === "Saturno" ? 400 : 200;
        var t = S.perfeicaoAoPonto(a.transitante, a.lonNatal, a.angulo, quando, janela);
        if (t) { a.perfeicao = t; a.diasAtePerfeicao = (t - quando) / DIA; }
      });
    }
    return out.sort(function (x, y) { return x.orbe - y.orbe; });
  }

  /* ============================================================
     CADEIA DE SIGNIFICAÇÃO (item 2)
     Vale para qualquer planeta, em qualquer contexto. Sete elos.
     ============================================================ */
  function cadeiaDeSignificacao(planeta, quando) {
    quando = quando || new Date();
    var pos = MAPA.ceu[planeta];
    if (!pos) return null;
    var cond = MAPA.condicao[planeta];
    var sg = T.signoDe(pos.lon), signo = T.SIGNOS[sg];
    var casa = casaDe(pos.lon);
    var pn = S.posicaoNaCasa(pos.lon, MAPA.casas.cusps);
    var regidas = MAPA.rege[planeta] || [];
    var termo = T.termoDe(pos.lon);
    var cad = T.cadeiaDispositores(planeta, MAPA.ceu);
    var asp = MAPA.aspectos.filter(function (a) { return a.a === planeta || a.b === planeta; });
    var rec = MAPA.recepcoes.filter(function (r) { return r.a === planeta || r.b === planeta; });
    var est = MAPA.estrelas.filter(function (e) { return e.ponto === planeta; });
    var anti = MAPA.antiscia.filter(function (x) { return (x.a === planeta || x.b === planeta) && x.vale; });

    /* quando ele manda */
    var mandatos = [];
    FIRDARIA.forEach(function (p) {
      if (p.lorde === planeta) mandatos.push({
        tipo: "firdaria maior", de: dataDaIdade(p.de), ate: dataDaIdade(p.ate),
        idade: p.de.toFixed(0) + "–" + p.ate.toFixed(0) + " anos"
      });
    });
    regidas.forEach(function (h) {
      /* anos em que a profecção cai numa casa que ele rege */
      var sgASC = T.signoDe(MAPA.casas.asc);
      for (var a = 0; a < 90; a++) {
        if (T.REGENTE[T.SIGNOS[(sgASC + a) % 12]] === planeta) {
          if (!mandatos.some(function (m) { return m.tipo === "senhor do ano" && m.idade === a + " anos"; }))
            mandatos.push({ tipo: "senhor do ano", idade: a + " anos", de: dataDaIdade(a), ate: dataDaIdade(a + 1) });
        }
      }
    });

    var trans = transitosAoNatal(quando, { alvos: [planeta], comPerfeicao: true });
    var transDele = transitosAoNatal(quando, { comPerfeicao: false }).filter(function (t) { return t.transitante === planeta; });

    return {
      planeta: planeta,
      elos: [
        {
          n: 1, rot: "O que é", certeza: "tradicional",
          resumo: null   /* preenchido pelo corpus interpretativo */
        },
        {
          n: 2, rot: "De que é significador", certeza: "tradicional",
          casas: regidas,
          resumo: regidas.length
            ? "Rege " + regidas.map(function (h) { return "a casa " + h; }).join(" e ") +
              ". Tudo o que acontecer a " + planeta + " diz respeito a esses assuntos."
            : planeta + " não rege nenhuma cúspide neste mapa: significa por si, não por delegação."
        },
        {
          n: 3, rot: "Onde está", certeza: "tradicional",
          signo: signo, casa: casa, termo: termo.senhor, face: T.faceDe(pos.lon).senhor,
          posicaoNaCasa: pn,
          resumo: T.fmtLonNome(pos.lon) + ", casa " + casa + ", termo de " + termo.senhor +
            (pn.naCuspide ? " — a " + T.fmtGrau(pn.paraProxima) + " da cúspide da casa " + pn.naCuspide : "")
        },
        {
          n: 4, rot: "Com que força", certeza: "tradicional",
          essencial: cond.essencial, acidental: cond.acidental,
          resumo: "Dignidade essencial " + sinal(cond.essencial.pontos) +
            " (" + (cond.essencial.itens.concat(cond.essencial.debilidades)
              .map(function (i) { return i.tipo; }).join(", ") || "nenhuma") + "); " +
            "condição acidental " + sinal(cond.acidental.pontos) + "."
        },
        {
          n: 5, rot: "De quem depende", certeza: "tradicional",
          dispositor: cond.essencial.dispositor, cadeia: cad,
          resumo: cond.essencial.dispositor === planeta
            ? "Dispõe de si mesmo — não deve satisfação a ninguém."
            : "Está no domicílio de " + cond.essencial.dispositor + ", que o dispõe. " +
              "Cadeia: " + cad.cadeia.join(" → ") + (cad.tipo === "ciclo" ? " → (fecha o círculo)" : " (em domicílio próprio)") + "."
        },
        {
          n: 6, rot: "Com quem fala", certeza: "tradicional",
          aspectos: asp, recepcoes: rec, estrelas: est, antiscia: anti,
          resumo: asp.length
            ? asp.map(function (a) {
                var o = a.a === planeta ? a.b : a.a;
                return a.glifo + " " + o + " (" + T.fmtGrau(a.orbe) + ")";
              }).join(" · ")
            : "Sem aspectos dentro do orbe."
        },
        {
          n: 7, rot: "Quando manda", certeza: "tradicional",
          mandatos: mandatos.sort(function (a, b) { return a.de - b.de; }),
          resumo: mandatos.length + " períodos da vida em que este planeta é cronocrator."
        },
        {
          n: 8, rot: "O que o toca agora", certeza: "derivado",
          recebendo: trans, emitindo: transDele,
          resumo: trans.length
            ? trans.slice(0, 3).map(function (t) {
                return t.transitante + " " + t.glifo + " (" + T.fmtGrau(t.orbe) + ", " +
                  (t.aplicando ? "aplicando" : "separando") + ")";
              }).join(" · ")
            : "Nada em trânsito dentro do orbe."
        }
      ]
    };
  }

  /* ============================================================
     PROMESSAS NATAIS por regência × posição
     Uma promessa nasce da relação entre o que um planeta ADMINISTRA
     (as casas que rege) e o CAMPO em que ele executa (a casa que ocupa).
     Só é registrada com dois ou mais testemunhos natais convergentes —
     sem isso é coincidência de tabela, não promessa.

     Este é o filtro do módulo preditivo: um contato de direção ou de
     progressão que não corresponda a nenhuma promessa é registrado como
     contato, nunca como acontecimento.
     ============================================================ */
  var _promessas = null;
  function promessasNatais() {
    if (_promessas) return _promessas;
    var out = [];
    /* casas onde a vida se concentra: as ocupadas pelos pontos vitais */
    var vitais = {};
    ["Sol", "Lua"].forEach(function (p) { vitais[casaDe(MAPA.ceu[p].lon)] = 1; });
    vitais[casaDe(MAPA.lotes["Fortuna"])] = 1;
    vitais[casaDe(MAPA.lotes["Espírito"])] = 1;
    vitais[1] = 1; vitais[10] = 1;

    S.CLASSICOS.forEach(function (p) {
      var rege = MAPA.rege[p] || [];
      if (!rege.length) return;
      var cond = MAPA.condicao[p], ocupa = cond.acidental.casa;
      var casas = rege.slice();
      if (casas.indexOf(ocupa) < 0) casas.push(ocupa);

      var testemunhos = [{
        tipo: "regência × posição",
        txt: "regente da casa " + rege.join(" e da casa ") + " posto na casa " + ocupa
      }];
      var dignificado = cond.essencial.itens.some(function (i) {
        return i.tipo === "domicílio" || i.tipo === "exaltação";
      });
      if (dignificado) testemunhos.push({
        tipo: "dignidade", txt: p + " em " +
          cond.essencial.itens.map(function (i) { return i.tipo; }).join(" e ")
      });
      if ([1, 4, 7, 10].indexOf(ocupa) >= 0) testemunhos.push({
        tipo: "angularidade", txt: p + " angular, na casa " + ocupa
      });
      var recs = MAPA.recepcoes.filter(function (r) {
        return (r.a === p || r.b === p) && r.mutua;
      });
      if (recs.length) testemunhos.push({
        tipo: "recepção", txt: "recepção mútua com " +
          recs.map(function (r) { return r.a === p ? r.b : r.a; }).join(" e ")
      });
      var apoios = MAPA.aspectos.filter(function (a) {
        return (a.a === p || a.b === p) && a.natureza !== "tenso";
      });
      apoios.forEach(function (a) {
        var o = a.a === p ? a.b : a.a, orege = MAPA.rege[o] || [];
        testemunhos.push({
          tipo: "aspecto favorável",
          txt: p + " " + a.glifo + " " + o + (orege.length ? " (regente da casa " + orege.join(" e ") + ")" : "")
        });
      });
      if (casas.some(function (h) { return vitais[h]; })) testemunhos.push({
        tipo: "ponto vital", txt: "um luminar ou lote principal ocupa o mesmo campo de casas"
      });
      if (testemunhos.length < 2) return;

      /* A ordem da classificação importa: a debilidade essencial e a combustão
         vêm antes da angularidade. Um planeta em exílio numa casa angular age
         em cena aberta — mas continua sem apoio do lugar, e é isso que decide
         se a promessa se cumpre por si ou por circunstância. */
      var tensos = MAPA.aspectos.filter(function (a) {
        return (a.a === p || a.b === p) && a.natureza === "tenso";
      });
      var debil = cond.essencial.debilidades.some(function (d) {
        return d.tipo === "exílio" || d.tipo === "queda";
      });
      var peregrino = cond.essencial.peregrino;
      var combusto = cond.acidental.itens.some(function (i) { return i.tipo === "combusto"; });
      var recForte = recs.some(function (r) { return r.forte; });
      var estado;
      if (debil || combusto) estado = "condicional";
      else if (dignificado || (recForte && !peregrino)) estado = "forte";
      else if (tensos.length && testemunhos.length >= 3) estado = "conflitiva";
      else estado = "disponível";

      /* a que tema de vida a promessa pertence */
      var tema = null, melhorTema = 0;
      (root.Corpus ? root.Corpus.TEMAS : []).forEach(function (t) {
        var sc = 0;
        t.casas.forEach(function (h) { if (rege.indexOf(h) >= 0) sc += 2; if (ocupa === h) sc += 1; });
        (t.apoio || []).forEach(function (h) { if (casas.indexOf(h) >= 0) sc += 0.5; });
        if (t.significador === p) sc += 1;
        if (sc > melhorTema) { melhorTema = sc; tema = t; }
      });

      out.push({
        id: "prom-" + p, planeta: p, rege: rege, ocupa: ocupa, casas: casas,
        estado: estado, testemunhos: testemunhos, tema: tema,
        dignificado: dignificado, debil: debil, combusto: combusto, peregrino: peregrino,
        titulo: rege.indexOf(ocupa) >= 0
          ? cap(CASA_CURTO(ocupa)) + " como campo central"
          : cap(CASA_CURTO(rege[0])) + " por meio de " + CASA_CURTO(ocupa),
        /* quando o planeta rege a casa que ocupa, dizer que o tema "se
           desenvolve por meio de si mesmo" seria literal e vazio */
        enunciado: rege.length === 1 && rege[0] === ocupa
          ? p + " rege a casa " + ocupa + " e a ocupa: " + CASA_CURTO(ocupa) +
            " é ao mesmo tempo o que ele administra e onde executa — tema central, " +
            "que não depende de intermediário para se manifestar."
          : p + " rege a casa " + rege.join(" e a casa ") +
            " e ocupa a casa " + ocupa + ": " +
            rege.filter(function (h) { return h !== ocupa; }).map(CASA_CURTO).join(" e ") +
            " tendem a se desenvolver por meio de " + CASA_CURTO(ocupa) +
            (rege.indexOf(ocupa) >= 0 ? ", casa que o próprio planeta também administra" : "") + ".",
        entrega: estado === "forte"
          ? "Entrega com apoio próprio: o significador tem de onde tirar o que promete."
          : estado === "condicional"
          ? "Entrega dependente: " +
            (debil ? p + " está em " + cond.essencial.debilidades.map(function (d) { return d.tipo; }).join(" e ")
                   : p + " está combusto") +
            " e precisa de recepção ou de circunstância favorável para cumprir o que rege."
          : estado === "conflitiva"
          ? "Entrega disputada: há testemunhos fortes e aspecto tenso ao mesmo tempo; o tema anda, mas custa."
          : "Entrega disponível, sem reforço essencial nem debilidade marcantes" +
            (peregrino ? " — " + p + " é peregrino, e depende do que lhe for emprestado" : "") + ".",
        certeza: "derivado"
      });
    });
    var ordem = { forte: 0, "disponível": 1, conflitiva: 2, condicional: 3 };
    out.sort(function (a, b) { return ordem[a.estado] - ordem[b.estado]; });
    return (_promessas = out);
  }
  function CASA_CURTO(h) {
    return (root.Corpus && root.Corpus.CASA_CURTO[h]) || ("assuntos da casa " + h);
  }
  function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

  /* ============================================================
     PRÓXIMA VIRADA · quando a configuração do momento muda
     ============================================================ */
  function proximaVirada(agora) {
    var cands = [];
    var fd = firdariaEm(agora), pr = profeccaoEm(agora);

    if (fd) {
      cands.push({ quando: fd.fimSub, o_que: "firdaria: " + fd.maior.lorde + "/" + (fd.sub ? fd.sub.lorde : "—") + " termina", camada: "cronocrator", peso: 3 });
      cands.push({ quando: fd.fimMaior, o_que: "firdaria maior de " + fd.maior.lorde + " termina", camada: "cronocrator", peso: 4 });
    }
    cands.push({ quando: pr.fim, o_que: "profecção passa à casa " + (pr.casa % 12 + 1) + ", senhor do ano " + T.REGENTE[T.SIGNOS[(pr.signoIdx + 1) % 12]], camada: "contexto", peso: 3 });

    /* Sol: termo, signo, casa */
    var solLon = S.lon("Sol", agora);
    var tm = T.termoDe(solLon);
    var fimTermo = S.cruzaLongitude("Sol", T.signoDe(solLon) * 30 + tm.ate, agora, 40);
    if (fimTermo) cands.push({ quando: fimTermo, o_que: "Sol passa ao termo de " + proximoTermoSenhor(solLon), camada: "gatilho", peso: 1 });
    var fimSigno = S.cruzaLongitude("Sol", (T.signoDe(solLon) + 1) * 30, agora, 40);
    if (fimSigno) cands.push({ quando: fimSigno, o_que: "Sol entra em " + T.SIGNOS[(T.signoDe(solLon) + 1) % 12], camada: "gatilho", peso: 2 });
    var hAtual = casaDe(solLon);
    var cuspProx = MAPA.casas.cusps[hAtual % 12];
    var fimCasa = S.cruzaLongitude("Sol", cuspProx, agora, 60);
    if (fimCasa) cands.push({ quando: fimCasa, o_que: "Sol em trânsito entra na casa natal " + (hAtual % 12 + 1), camada: "gatilho", peso: 2 });

    /* Lua: mudança de signo */
    var lonLua = S.lon("Lua", agora);
    var luaSai = S.cruzaLongitude("Lua", (T.signoDe(lonLua) + 1) * 30, agora, 3);
    if (luaSai) cands.push({ quando: luaSai, o_que: "Lua entra em " + T.SIGNOS[(T.signoDe(lonLua) + 1) % 12], camada: "hoje", peso: 0 });

    cands = cands.filter(function (c) { return c.quando && c.quando > agora; });
    cands.sort(function (a, b) { return a.quando - b.quando; });
    return cands;
  }
  function proximoTermoSenhor(lon) {
    var sg = T.signoDe(lon), t = T.TERMOS[sg], d = norm(lon) % 30;
    for (var i = 0; i < t.length; i++) if (d < t[i][1]) return i < 4 ? t[i + 1][0] : "(próximo signo)";
    return "(próximo signo)";
  }

  /* ============================================================
     BRIEFING DIÁRIO (item 1)
     Um único texto que responde: o que é importante agora, por quê,
     e qual é a origem natal disso.
     ============================================================ */
  function briefing(agora) {
    agora = agora || new Date();
    var fd = firdariaEm(agora);
    var pr = profeccaoEm(agora);
    var rs = revolucaoVigente(agora);
    var ceu = S.ceu(agora);
    var hp = S.horaPlanetaria(agora, LOCAL_ATUAL.lat, LOCAL_ATUAL.lon, LOCAL_ATUAL.alt);

    /* ---- quem está autorizado a falar hoje ---- */
    var autorizados = {};
    function autoriza(p, motivo, peso) {
      if (!p || p.indexOf("Nodo") === 0) return;
      autorizados[p] = autorizados[p] || { planeta: p, motivos: [], peso: 0 };
      autorizados[p].motivos.push(motivo);
      autorizados[p].peso += peso;
    }
    if (fd) {
      autoriza(fd.maior.lorde, "senhor maior da firdaria", 4);
      if (fd.sub) autoriza(fd.sub.lorde, "sub-período da firdaria", 3);
    }
    autoriza(pr.senhorDoAno, "senhor do ano pela profecção", 4);
    if (rs) autoriza(rs.regenteASC, "regente do ascendente da revolução", 3);
    autoriza(MAPA.regenteASC, "regente do ascendente natal", 2);
    if (hp) autoriza(hp.regente, "regente da hora planetária", 1);

    /* ---- gatilhos: trânsitos que tocam pontos natais ---- */
    var trans = transitosAoNatal(agora, { fator: 0.75 });

    /* Um trânsito só é RELEVANTE se satisfaz a hierarquia:
       o ponto natal tocado precisa ter promessa (rege alguma casa ou é
       luminar/ângulo) E o planeta envolvido precisa estar autorizado
       por alguma camada de tempo. Sem isso, é ruído. */
    var relevantes = [], contexto = [];
    trans.forEach(function (t) {
      var autT = autorizados[t.transitante];
      var autN = autorizados[t.natal];
      var eAngulo = t.natal === "Ascendente" || t.natal === "Meio-do-Céu";
      var eLuminar = t.natal === "Sol" || t.natal === "Lua";
      var regeAlgo = (MAPA.rege[t.natal] || []).length > 0;
      var promessa = eAngulo || eLuminar || regeAlgo;
      var nivel = (autT ? autT.peso : 0) + (autN ? autN.peso : 0);
      var reg = { t: t, nivel: nivel, promessa: promessa, porQue: [] };
      if (autT) reg.porQue.push(t.transitante + " é " + autT.motivos[0]);
      if (autN) reg.porQue.push(t.natal + " natal é " + autN.motivos[0]);
      if (promessa && nivel > 0 && t.orbe < 3) relevantes.push(reg);
      else contexto.push(reg);
    });
    /* aplicando antes de separando: o que ainda vai perfazer é o que opera.
       Depois, quem tem mais autorização de camada; por fim, o orbe. */
    relevantes.sort(function (a, b) {
      if (a.t.aplicando !== b.t.aplicando) return a.t.aplicando ? -1 : 1;
      if (b.nivel !== a.nivel) return b.nivel - a.nivel;
      return a.t.orbe - b.t.orbe;
    });

    /* ---- tema dominante ---- */
    var ordAut = Object.keys(autorizados).map(function (k) { return autorizados[k]; })
      .sort(function (a, b) { return b.peso - a.peso; });
    var dominante = ordAut[0] || null;
    var casasDominante = dominante ? (MAPA.rege[dominante.planeta] || []) : [];

    /* ---- a Lua como agenda do dia (item 8) ---- */
    var agenda = T.agendaDaLua(agora, MAPA.ceu, S.CLASSICOS);

    var viradas = proximaVirada(agora);

    return {
      agora: agora, local: LOCAL_ATUAL,
      camadas: {
        natal: { signoASC: MAPA.signoASC, regenteASC: MAPA.regenteASC, seita: MAPA.seita },
        cronocrator: fd, contexto: { profeccao: pr, revolucao: rs },
        gatilhos: relevantes, ruido: contexto,
        hoje: { ceu: ceu, hora: hp, lua: agenda, fase: S.fase(agora) }
      },
      autorizados: ordAut,
      dominante: dominante,
      casasDominante: casasDominante,
      /* a virada de destaque é a primeira que muda de fato a configuração —
         a Lua trocando de signo é hoje, não é virada */
      proximaVirada: viradas.filter(function (v) { return v.peso >= 2; })[0] || viradas[0] || null,
      proximosEventos: viradas.slice(0, 8),
      certeza: "derivado",
      nota: "A seleção do que aparece aqui é nossa: a tradição fornece as camadas, " +
        "não a regra de prioridade entre elas. O critério está descrito em 'como isto foi decidido'."
    };
  }

  /* ============================================================
     LINHA DO TEMPO REAL (item 5)
     Eventos com instante, não barras de porcentagem inventadas.
     Cada faixa é PRIMÁRIO, SECUNDÁRIO ou CONTEXTO — categoria, não número.
     ============================================================ */
  var NIVEL = { PRIMARIO: "primário", SECUNDARIO: "secundário", CONTEXTO: "contexto" };

  function linhaDoTempo(de, ate) {
    var ev = [];
    /* mudanças de firdaria */
    FIRDARIA.forEach(function (p) {
      var d = dataDaIdade(p.de);
      if (d >= de && d <= ate) ev.push({
        quando: d, nivel: NIVEL.PRIMARIO, camada: "cronocrator",
        titulo: "Firdaria de " + p.lorde,
        detalhe: p.anos + " anos sob " + p.lorde + (MAPA.rege[p.lorde] ? ", senhor das casas " + MAPA.rege[p.lorde].join(" e ") : ""),
        certeza: "tradicional"
      });
      p.subs.forEach(function (s) {
        var ds = dataDaIdade(s.de);
        if (ds >= de && ds <= ate && s.de !== p.de) ev.push({
          quando: ds, nivel: NIVEL.SECUNDARIO, camada: "cronocrator",
          titulo: "Sub-firdaria " + p.lorde + " / " + s.lorde,
          detalhe: "capítulo de " + s.lorde + " dentro da era de " + p.lorde,
          certeza: "tradicional"
        });
      });
    });
    /* profecções */
    var a0 = Math.max(0, Math.floor(idadeEm(de))), a1 = Math.ceil(idadeEm(ate));
    for (var a = a0; a <= a1 && a < 100; a++) {
      var d = dataDaIdade(a);
      if (d < de || d > ate) continue;
      var pr = profeccaoEm(new Date(d.getTime() + DIA));
      ev.push({
        quando: d, nivel: NIVEL.PRIMARIO, camada: "contexto",
        titulo: "Profecção · casa " + pr.casa + " (" + pr.signo + ")",
        detalhe: "senhor do ano: " + pr.senhorDoAno + ", natal na casa " + pr.casaNatalDoSenhor,
        certeza: "tradicional"
      });
    }
    ev.sort(function (x, y) { return x.quando - y.quando; });
    return ev;
  }

  /* Coincidências: quando duas camadas viram no mesmo intervalo curto.
     É o caso do item 29 — profecção e firdaria mudando juntas. */
  function coincidencias(de, ate, janelaDias) {
    janelaDias = janelaDias || 45;
    var ev = linhaDoTempo(de, ate).filter(function (e) { return e.nivel !== NIVEL.CONTEXTO; });
    var out = [];
    for (var i = 0; i < ev.length; i++)
      for (var j = i + 1; j < ev.length; j++) {
        if (ev[j].quando - ev[i].quando > janelaDias * DIA) break;
        if (ev[i].camada === ev[j].camada) continue;
        out.push({
          de: ev[i].quando, ate: ev[j].quando,
          dias: Math.round((ev[j].quando - ev[i].quando) / DIA),
          eventos: [ev[i], ev[j]],
          nota: "Duas camadas mudam em " + Math.round((ev[j].quando - ev[i].quando) / DIA) +
            " dias. A tradição não hierarquiza automaticamente: lê-se a firdaria como pano de fundo " +
            "da década e a profecção como recorte do ano — quando colidem, o ano recebe o tom novo da era."
        });
      }
    return out;
  }

  root.Chrono = {
    CERTEZA: CERTEZA, NIVEL: NIVEL, NATIVO: NATIVO, MAPA: MAPA, FIRDARIA: FIRDARIA,
    idadeEm: idadeEm, casaDe: casaDe, dataDaIdade: dataDaIdade, aniversarioDe: aniversarioDe,
    firdariaEm: firdariaEm, profeccaoEm: profeccaoEm,
    revolucaoDe: revolucaoDe, revolucaoVigente: revolucaoVigente,
    prioridadeRevolucao: prioridadeRevolucao,
    transitosAoNatal: transitosAoNatal, cadeiaDeSignificacao: cadeiaDeSignificacao,
    proximaVirada: proximaVirada, briefing: briefing, promessasNatais: promessasNatais,
    linhaDoTempo: linhaDoTempo, coincidencias: coincidencias,
    localAtual: localAtual, definirLocalAtual: definirLocalAtual
  };
})(window);
