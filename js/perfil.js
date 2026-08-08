/* ============================================================
   LIONS DAILY · perfil — temperamento, eixos, correspondências de saúde

   Aqui mora tudo o que NÃO é cálculo astronômico nem regra canônica.
   Por isso cada bloco declara o que é:

     temperamento  DERIVADO      — modelo ponderado sobre testemunhos
                                   tradicionais; os pesos são nossos
     48 eixos      EXPERIMENTAL  — construção moderna, sem lastro antigo
     saúde         TRADICIONAL   — correspondências históricas, e só

   O que foi tirado de propósito: porcentagens de "confiança", barras que
   sugeriam medida psicométrica e qualquer gráfico com cara de diagnóstico.
   Escalas qualitativas dizem o mesmo sem fingir precisão que não existe.
   ============================================================ */
(function (root) {
  "use strict";
  var S = root.Astro, T = root.Trad, C = root.Chrono, K = root.Corpus;
  var MAPA = C.MAPA, norm = S.norm;

  /* ---------- qualidades elementares ---------- */
  var Q_FOGO = [1, 0, 1, 0], Q_TERRA = [0, 1, 1, 0], Q_AR = [1, 0, 0, 1], Q_AGUA = [0, 1, 0, 1];
  var ELEM_Q = [Q_FOGO, Q_TERRA, Q_AR, Q_AGUA];
  var ELEM_NOME = ["fogo", "terra", "ar", "água"];
  function elemQ(s) { return ELEM_Q[s % 4]; }
  var NAT_Q = {
    "Sol": Q_FOGO, "Marte": Q_FOGO, "Júpiter": Q_AR, "Saturno": Q_TERRA,
    "Mercúrio": Q_TERRA, "Lua": Q_AGUA, "Vênus": Q_AGUA
  };

  /* ============================================================
     TEMPERAMENTO · modelo ponderado (item 12)
     Os testemunhos são os que a tradição manda pesar (Ptolomeu, Lilly,
     Culpeper): Ascendente, seu regente, a Lua, a fase lunar, a estação
     e os planetas que tocam Ascendente e Lua. Os PESOS entre eles são
     escolha nossa — é isto que torna o resultado derivado, e não regra.
     ============================================================ */
  function temperamento() {
    var P = MAPA.ceu, ASC = MAPA.casas.asc;
    var Q = [0, 0, 0, 0], fatores = [];
    function add(q, w, rot, detalhe) {
      for (var i = 0; i < 4; i++) Q[i] += q[i] * w;
      fatores.push({ rot: rot, peso: w, q: q, detalhe: detalhe });
    }
    var sA = T.signoDe(ASC);
    add(elemQ(sA), 3, "Ascendente em " + T.SIGNOS[sA], "signo de " + ELEM_NOME[sA % 4]);
    var rl = T.REGENTE[T.SIGNOS[sA]];
    add(NAT_Q[rl], 3, "Senhor do Ascendente: " + rl, "natureza " + K.NAT_TEMP[rl]);
    var sL = T.signoDe(P["Lua"].lon);
    add(elemQ(sL), 2.5, "Lua em " + T.SIGNOS[sL], "signo de " + ELEM_NOME[sL % 4]);
    var el = norm(P["Lua"].lon - P["Sol"].lon);
    add(el < 90 ? Q_AR : el < 180 ? Q_FOGO : el < 270 ? Q_TERRA : Q_AGUA, 2,
      "Fase da Lua ao nascer",
      el < 90 ? "da nova ao quarto crescente" : el < 180 ? "do quarto crescente à cheia"
        : el < 270 ? "da cheia ao quarto minguante" : "do minguante à nova");
    var sS = T.signoDe(P["Sol"].lon), estIdx = Math.floor(sS / 3);
    add([Q_AR, Q_FOGO, Q_TERRA, Q_AGUA][estIdx], 2, "Estação do Sol",
      "Sol em " + T.SIGNOS[sS] + " — " + ["primavera", "verão", "outono", "inverno"][estIdx]);

    S.CLASSICOS.forEach(function (p) {
      var d = Math.abs(S.delta(P[p].lon, ASC));
      if (d <= 10) add(NAT_Q[p], 2, p + " conjunto ao Ascendente",
        "orbe " + T.fmtGrau(d) + " · natureza " + K.NAT_TEMP[p]);
    });
    S.CLASSICOS.forEach(function (p) {
      [["Ascendente", ASC], ["Lua", P["Lua"].lon]].forEach(function (par) {
        if (p === "Lua" && par[0] === "Lua") return;
        var d = Math.abs(S.delta(P[p].lon, par[1]));
        var angs = [0, 60, 90, 120, 180];
        for (var i = 0; i < angs.length; i++) {
          if (Math.abs(d - angs[i]) <= 6 && !(par[0] === "Ascendente" && angs[i] === 0 && d <= 10)) {
            add(NAT_Q[p], 1, p + " aspecta " + par[0], "natureza " + K.NAT_TEMP[p]);
            return;
          }
        }
      });
    });

    var qt = Q[0], fr = Q[1], sc = Q[2], um = Q[3];
    var pQ = qt / (qt + fr), pS = sc / (sc + um);
    var vet = [
      ["colérico", pQ * pS], ["sanguíneo", pQ * (1 - pS)],
      ["melancólico", (1 - pQ) * pS], ["fleumático", (1 - pQ) * (1 - pS)]
    ].sort(function (a, b) { return b[1] - a[1]; });

    /* escala qualitativa: quanto o primeiro se destaca do segundo */
    var margem = vet[0][1] - vet[1][1];
    var nitidez = margem > 0.15 ? "predominante" : margem > 0.06 ? "dominante, com mistura" : "misto";
    var chave = vet[0][0] + "-" + vet[1][0];
    return {
      Q: Q, quente: qt, frio: fr, seco: sc, umido: um,
      eixoCalor: faixa(pQ, "frio", "quente"),
      eixoUmidade: faixa(pS, "úmido", "seco"),
      vetor: vet, principal: vet[0][0], secundario: vet[1][0],
      nitidez: nitidez, margem: margem,
      colapso: K.COMPOSTO_INVALIDO[chave] || null,
      fatores: fatores,
      certeza: "derivado",
      nota: "Os testemunhos são tradicionais; a ponderação entre eles é nossa. " +
        "Trate como um retrato de tendência, não como medida."
    };
  }
  /* converte proporção contínua em faixa nomeada — sem número na tela */
  function faixa(p, baixo, alto) {
    if (p >= 0.68) return { rot: "acentuadamente " + alto, lado: alto, grau: 3 };
    if (p >= 0.57) return { rot: alto, lado: alto, grau: 2 };
    if (p > 0.43) return { rot: "equilibrado", lado: null, grau: 1 };
    if (p > 0.32) return { rot: baixo, lado: baixo, grau: 2 };
    return { rot: "acentuadamente " + baixo, lado: baixo, grau: 3 };
  }

  /* ============================================================
     48 EIXOS · EXPERIMENTAL (item 11)
     Mantidos porque descrevem bem o vocabulário do mapa, mas
     reposicionados: nada de porcentagem, nada de "confiança 78%".
     O que aparece é a inclinação em cinco faixas e a lista crua dos
     testemunhos que a produziram — o leitor julga.
     ============================================================ */
  var AXK = {
    sun: "Sol", moon: "Lua", mercury: "Mercúrio", venus: "Vênus",
    mars: "Marte", jupiter: "Júpiter", saturn: "Saturno"
  };
  var AX_EN = {};
  Object.keys(AXK).forEach(function (en) { AX_EN[AXK[en]] = en; });
  var SIGN_ELEM_K = ["fogo", "terra", "ar", "agua"], SIGN_MODE_K = ["cardinal", "fixo", "mutavel"];
  function elemK(s) { return SIGN_ELEM_K[s % 4]; }
  function modeK(s) { return SIGN_MODE_K[s % 3]; }

  function condMod(p) {
    var c = MAPA.condicao[p]; if (!c) return 1;
    var m = 1;
    if (c.essencial.itens.length) m *= 1.15;
    if (c.essencial.debilidades.length) m *= 0.78;
    if (MAPA.ceu[p].speed < 0) m *= 0.9;
    return m;
  }
  function senhorDaGenitura() {
    var melhor = null, bs = -99;
    S.CLASSICOS.forEach(function (p) {
      var c = MAPA.condicao[p], sc = c.essencial.pontos;
      if ([1, 10, 7, 4].indexOf(c.acidental.casa) >= 0) sc += 2;
      if (sc > bs) { bs = sc; melhor = p; }
    });
    return melhor;
  }
  function contagens() {
    var EL = { fogo: 0, terra: 0, ar: 0, agua: 0 }, MO = { cardinal: 0, fixo: 0, mutavel: 0 };
    S.CLASSICOS.forEach(function (p) {
      var s = T.signoDe(MAPA.ceu[p].lon);
      EL[elemK(s)]++; MO[modeK(s)]++;
    });
    return { EL: EL, MO: MO };
  }

  function testemunhos(prof, src) {
    var out = [];
    var nat = K.AX_NAT[prof] || K.AX_NAT.act;
    var ele = K.AX_ELE[prof] || K.AX_ELE.act;
    var mod = K.AX_MOD[prof] || K.AX_MOD.act;
    var P = MAPA.ceu, ASC = MAPA.casas.asc, ru = MAPA.regenteASC;
    var cnt = contagens(), EL = cnt.EL, MO = cnt.MO;
    function put(dir, w, txt) {
      if (dir != null && isFinite(dir) && w > 0)
        out.push({ dir: Math.max(-1, Math.min(1, dir)), peso: w, txt: txt });
    }
    src.forEach(function (sn) {
      var s, o, k, h;
      if (sn === "asc") {
        s = T.signoDe(ASC);
        put(ele[elemK(s)] * .6 + mod[modeK(s)] * .4, 3,
          "Ascendente em " + T.SIGNOS[s] + " (" + ELEM_NOME[s % 4] + ", " + T.MODO[s % 3] + ")");
      } else if (sn === "ruler") {
        o = P[ru]; s = T.signoDe(o.lon);
        put((nat[AX_EN[ru]] * .45 + ele[elemK(s)] * .35 + mod[modeK(s)] * .2) * condMod(ru), 3,
          "Regente do Ascendente (" + ru + ") em " + T.SIGNOS[s] + ", casa " + C.casaDe(o.lon));
      } else if (sn === "rulerHouse") {
        h = C.casaDe(P[ru].lon);
        var ang = [1, 4, 7, 10].indexOf(h) >= 0 ? 1 : [2, 5, 8, 11].indexOf(h) >= 0 ? 0 : -1;
        put(ang * .6, 1.2, "Regente do Ascendente em casa " + h +
          " (" + (ang > 0 ? "angular" : ang < 0 ? "cadente" : "sucedente") + ")");
      } else if (sn === "lord") {
        k = senhorDaGenitura(); o = P[k]; s = T.signoDe(o.lon);
        put((nat[AX_EN[k]] * .6 + ele[elemK(s)] * .4) * condMod(k), 1.5,
          "Senhor da genitura (" + k + ") em " + T.SIGNOS[s]);
      } else if (sn === "h1") {
        var ks = S.CLASSICOS.filter(function (p) { return C.casaDe(P[p].lon) === 1; });
        if (ks.length) put(ks.reduce(function (a, kk) { return a + nat[AX_EN[kk]] * condMod(kk); }, 0) / ks.length,
          2, "Na casa 1: " + ks.join(", "));
      } else if (sn === "modes") {
        var tm = MO.cardinal + MO.fixo + MO.mutavel || 1;
        put((MO.cardinal * mod.cardinal + MO.fixo * mod.fixo + MO.mutavel * mod.mutavel) / tm, 2,
          "Modos entre os sete: " + MO.cardinal + " cardinal · " + MO.fixo + " fixo · " + MO.mutavel + " mutável");
      } else if (sn === "elems") {
        var te = EL.fogo + EL.terra + EL.ar + EL.agua || 1;
        put((EL.fogo * ele.fogo + EL.terra * ele.terra + EL.ar * ele.ar + EL.agua * ele.agua) / te, 2,
          "Elementos entre os sete: " + EL.fogo + " fogo · " + EL.terra + " terra · " + EL.ar + " ar · " + EL.agua + " água");
      } else if (sn === "cadent") {
        var nc = S.CLASSICOS.filter(function (p) { return [3, 6, 9, 12].indexOf(C.casaDe(P[p].lon)) >= 0; }).length;
        if (nc) put(Math.min(1, nc / 3) * .7, 1, nc + " planeta(s) em casa cadente: puxa para dentro");
      } else if (sn === "h12") {
        var k12 = S.CLASSICOS.filter(function (p) { return C.casaDe(P[p].lon) === 12; });
        if (k12.length) put(Math.min(1, k12.length / 2) * .8, 1.2, "Na casa 12: " + k12.join(", ") + " — interioriza");
      } else if (sn === "algol") {
        var al = MAPA.estrelas.filter(function (e) { return e.estrela === "Algol"; })[0];
        if (al) put(1, 3, "Algol a " + T.fmtGrau(al.orbe) + " do " + al.ponto + " — eleva a intensidade");
      } else if (/^h(\d+)ruler$/.test(sn)) {
        var hn = +sn.match(/^h(\d+)ruler$/)[1];
        k = T.REGENTE[T.SIGNOS[T.signoDe(MAPA.casas.cusps[hn - 1])]];
        o = P[k]; s = T.signoDe(o.lon);
        put((nat[AX_EN[k]] * .6 + ele[elemK(s)] * .4) * condMod(k), 1.2,
          "Regente da casa " + hn + " (" + k + ") em " + T.SIGNOS[s] + ", casa " + C.casaDe(o.lon));
      } else if (AXK[sn]) {
        k = AXK[sn]; o = P[k]; s = T.signoDe(o.lon);
        var debs = MAPA.condicao[k].essencial.debilidades.map(function (d) { return d.tipo; });
        put((nat[sn] * .5 + ele[elemK(s)] * .3 + mod[modeK(s)] * .2) * condMod(k), 2,
          k + " em " + T.SIGNOS[s] + ", casa " + C.casaDe(o.lon) + (debs.length ? " (" + debs.join(", ") + ")" : ""));
      }
    });
    return out;
  }

  /* faixas qualitativas da inclinação — cinco, não cem */
  function inclinacao(raw) {
    var a = Math.abs(raw);
    if (a < .08) return { rot: "sem inclinação clara", grau: 0 };
    if (a < .20) return { rot: "leve", grau: 1 };
    if (a < .38) return { rot: "consistente", grau: 2 };
    if (a < .60) return { rot: "marcada", grau: 3 };
    return { rot: "muito marcada", grau: 4 };
  }

  function avaliarEixo(cfg) {
    var nome = cfg[0], fam = cfg[1], prof = cfg[2], src = cfg[3];
    var polos = nome.split("–"), poloA = polos[0], poloB = polos[1];
    var M = testemunhos(prof, src).filter(function (m) { return Math.abs(m.dir) > .03; });
    if (!M.length) return {
      nome: nome, fam: fam, poloA: poloA, poloB: poloB, raw: 0,
      inclinacao: { rot: "sem testemunhos", grau: 0 }, lado: null,
      testemunhos: [], convergencia: null,
      frase: "Não há testemunhos suficientes no mapa para inclinar este eixo.",
      certeza: "experimental"
    };
    var wsum = M.reduce(function (a, m) { return a + m.peso; }, 0);
    var raw = M.reduce(function (a, m) { return a + m.dir * m.peso; }, 0) / wsum;
    var sg = raw >= 0 ? 1 : -1;
    var acordo = M.filter(function (m) { return Math.sign(m.dir) === sg; })
      .reduce(function (a, m) { return a + m.peso; }, 0) / wsum;
    var inc = inclinacao(raw);
    var lado = inc.grau === 0 ? null : (raw >= 0 ? poloA : poloB);
    var top = M.slice().sort(function (a, b) {
      return Math.abs(b.dir * b.peso) - Math.abs(a.dir * a.peso);
    }).slice(0, 3);
    var conv = acordo >= .8 ? "os testemunhos concordam"
      : acordo >= .62 ? "a maioria dos testemunhos aponta para o mesmo lado"
      : "há testemunhos apreciáveis nos dois sentidos";
    return {
      nome: nome, fam: fam, poloA: poloA, poloB: poloB, raw: raw,
      inclinacao: inc, lado: lado, convergencia: conv, acordo: acordo,
      testemunhos: M, top: top,
      frase: lado
        ? "Inclinação " + inc.rot + " a " + lado.toLowerCase() + " — " +
          top.slice(0, 2).map(function (t) { return t.txt.replace(/\s*\(.*?\)\s*$/, ""); }).join(" e ") + "."
        : "Sem inclinação clara: os testemunhos se anulam.",
      certeza: "experimental"
    };
  }

  var _eixos = null;
  function eixos() {
    if (!_eixos) _eixos = K.AXES48.map(avaliarEixo);
    return _eixos;
  }

  /* ============================================================
     SAÚDE · correspondências, e nada além (item 13)
     ============================================================ */
  function saude() {
    var temp = temperamento();
    var regioes = [];
    /* signo → região do corpo, para cada planeta e para o Ascendente */
    var pts = { "Ascendente": MAPA.casas.asc };
    S.CLASSICOS.forEach(function (p) { pts[p] = MAPA.ceu[p].lon; });
    Object.keys(pts).forEach(function (nome) {
      var s = T.signoDe(pts[nome]);
      regioes.push({
        ponto: nome, signo: T.SIGNOS[s], regiao: K.SIGN_CORPO[s],
        funcao: nome === "Ascendente" ? "o corpo inteiro e a compleição" : K.PL_FUNCAO[nome],
        casa: C.casaDe(pts[nome]),
        certeza: "tradicional"
      });
    });
    /* a casa 6 e seu regente: onde a tradição lia a desregulação */
    var reg6 = T.REGENTE[T.SIGNOS[T.signoDe(MAPA.casas.cusps[5])]];
    var cond6 = MAPA.condicao[reg6];
    /* aflições: significadores de corpo e vitalidade em má condição */
    var afl = [];
    ["Sol", "Lua", MAPA.regenteASC, reg6].forEach(function (p) {
      if (!p || afl.some(function (x) { return x.planeta === p; })) return;
      var c = MAPA.condicao[p]; if (!c) return;
      var motivos = c.essencial.debilidades.map(function (d) { return d.tipo; })
        .concat(c.acidental.itens.filter(function (i) { return i.peso < 0; }).map(function (i) { return i.tipo; }));
      if (motivos.length) afl.push({
        planeta: p, motivos: motivos,
        papel: p === "Sol" ? "vitalidade" : p === "Lua" ? "fluxos e ritmo"
          : p === MAPA.regenteASC ? "regente do Ascendente — o corpo" : "regente da casa 6 — a desregulação",
        regiao: K.SIGN_CORPO[T.signoDe(MAPA.ceu[p].lon)],
        funcao: K.PL_FUNCAO[p]
      });
    });
    return {
      aviso: K.SAUDE_AVISO,
      temperamento: temp,
      excesso: K.HUMOR_EXCESSO[temp.principal],
      regime: K.HUMOR_REGIME[temp.principal],
      regioes: regioes,
      regente6: { planeta: reg6, casa: cond6.acidental.casa, signo: cond6.essencial.signo,
                  essencial: cond6.essencial.pontos },
      aflicoes: afl,
      certeza: "tradicional"
    };
  }

  root.Perfil = {
    temperamento: temperamento, eixos: eixos, avaliarEixo: avaliarEixo,
    saude: saude, senhorDaGenitura: senhorDaGenitura, contagens: contagens
  };
})(window);
