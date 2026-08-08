/* ============================================================
   LIONS DAILY · preditivas — direções primárias e progressões

   Três camadas que não se contaminam:

   1. CÁLCULO       geometria esférica pura. Não conhece promessa,
                    relevância nem texto.
   2. CLASSIFICAÇÃO casa cada contato com uma promessa natal, mede as
                    confirmações das outras camadas de tempo e atribui
                    relevância por regra escrita.
   3. LEITURA       só lê o que 1 e 2 produziram. Nenhuma interpretação
                    altera um número.

   A regra que governa tudo: um contato só é apresentado como período
   quando cumpre uma promessa natal. Sem promessa, é registrado como
   contato — nunca como acontecimento.
   ============================================================ */
(function (root) {
  "use strict";
  var S = root.Astro, T = root.Trad, K = root.Corpus, C = root.Chrono;
  var MAPA = C.MAPA, norm = S.norm, delta = S.delta;
  var R = Math.PI / 180, D = 180 / Math.PI;
  var ANO = 365.2425 * S.MS_DIA;

  /* ============================================================
     CAMADA 1 — CÁLCULO
     ============================================================ */

  /* chaves de medida do arco: quanto de ascensão reta vale um ano */
  var CHAVES = {
    naibod: { rot: "Naibod", v: 0.9856473, nota: "0°59′08″ de ascensão reta por ano — o movimento médio diário do Sol" },
    ptolomeu: { rot: "Ptolomeu", v: 1, nota: "1° de ascensão reta por ano — a chave mais antiga, e a mais grosseira" }
  };
  var ASPECTOS_PV = [
    [0, "☌", "conjunção", "conj"], [60, "⚹", "sextil", "harm"], [90, "□", "quadratura", "tens"],
    [120, "△", "trígono", "harm"], [180, "☍", "oposição", "tens"]
  ];
  /* Asc e MC são os significadores angulares. Dsc e IC são as outras
     extremidades dos mesmos eixos: dirigir aos dois seria contar duas vezes. */
  var ANGULOS = {
    asc: { nome: "Ascendente", casa: 1, oposto: "Descendente", casaOposta: 7 },
    mc: { nome: "Meio-do-Céu", casa: 10, oposto: "Fundo-do-Céu", casaOposta: 4 }
  };

  /* quadro natal fixo: obliquidade, RAMC e latitude geográfica */
  var QUADRO = (function () {
    var d = C.NATIVO.nascimento, eps = S.obliquidade(d);
    return {
      data: d, eps: eps, phi: C.NATIVO.lat,
      ramc: S.ramcDeMC(MAPA.casas.mc, eps)
    };
  })();

  /* posição de um ponto no seu círculo diurno.
     μ ∈ (−2, 2]: 0 no MC, ±1 no horizonte (+ a leste), ±2 no IC. */
  function mu(ra, dec, ramc, phi) {
    var ad = S.difAscensional(dec, phi);
    if (ad === null) return null;                    /* circumpolar: sem semiarco */
    var dsa = 90 + ad, nsa = 90 - ad;
    var hd = delta(ra, ramc);
    if (Math.abs(hd) <= dsa) return { mu: hd / dsa, dsa: dsa, nsa: nsa, hd: hd, acima: true };
    var s = hd >= 0 ? 1 : -1, mdIC = 180 - Math.abs(hd);
    return { mu: s * (2 - mdIC / nsa), dsa: dsa, nsa: nsa, hd: hd, acima: false };
  }
  /* polo do significador: tan(polo) = tan(φ) · MD/SA.
     É o que faz de Placidus um método de mundo e não de zodíaco. */
  function poloDoSignificador(ra, dec, ramc, phi) {
    var M = mu(ra, dec, ramc, phi); if (!M) return null;
    var sa = M.acima ? M.dsa : M.nsa;
    var md = M.acima ? Math.abs(M.hd) : (180 - Math.abs(M.hd));
    if (!(sa > 0)) return null;
    var f = Math.max(0, Math.min(1, md / sa));
    return { polo: Math.atan(Math.tan(phi * R) * f) * D, md: md, sa: sa, f: f, leste: M.hd > 0, acima: M.acima };
  }
  function ascensaoObliqua(ra, dec, polo, leste) {
    var ad = S.difAscensional(dec, polo);
    if (ad === null) return null;
    return norm(leste ? ra - ad : ra + ad);
  }

  /* Arco de direção pelo polo do significador.
     Direta:   o promissor é levado pelo movimento primário ao significador.
     Conversa: o significador é levado, no sentido contrário, ao promissor.
     São duas séries independentes, não o mesmo arco com sinal trocado. */
  function arcos(sig, prom, F) {
    var polo, leste, oaS;
    if (sig.angulo) {
      polo = sig.angulo === "mc" ? 0 : F.phi;        /* o MC tem polo zero; o Asc, o polo do lugar */
      leste = true;
      oaS = sig.angulo === "mc" ? F.ramc : norm(F.ramc + 90);
    } else {
      var P = poloDoSignificador(sig.ra, sig.dec, F.ramc, F.phi);
      if (!P) return null;
      polo = P.polo; leste = P.leste;
      oaS = ascensaoObliqua(sig.ra, sig.dec, polo, leste);
    }
    var oaP = ascensaoObliqua(prom.ra, prom.dec, polo, leste);
    if (oaS === null || oaP === null) return null;
    return { direta: norm(oaP - oaS), conversa: norm(oaS - oaP), polo: polo, oaS: oaS, oaP: oaP };
  }

  function significadores(F) {
    var out = [];
    ["asc", "mc"].forEach(function (a) {
      var lon = a === "asc" ? MAPA.casas.asc : MAPA.casas.mc;
      var e = S.equatorial(lon, 0, F.eps);
      out.push({
        chave: a, angulo: a, nome: ANGULOS[a].nome, lon: lon, lat: 0,
        ra: e.ra, dec: e.dec, casa: ANGULOS[a].casa
      });
    });
    S.CLASSICOS.forEach(function (p) {
      var pos = MAPA.ceu[p];
      var e = S.equatorial(pos.lon, pos.lat, F.eps);
      out.push({
        chave: p, planeta: p, nome: p, lon: pos.lon, lat: pos.lat,
        ra: e.ra, dec: e.dec, casa: C.casaDe(pos.lon)
      });
    });
    return out;
  }
  /* Os pontos promissores cobrem os dois lados de cada aspecto. O conjunto é
     fechado sob +180°, de modo que dirigir só a Asc e MC já alcança Dsc e IC. */
  function promissores(F) {
    var out = [];
    S.CLASSICOS.forEach(function (p) {
      var pos = MAPA.ceu[p];
      ASPECTOS_PV.forEach(function (a) {
        var A = a[0];
        var alvos = A === 0 ? [[pos.lon, pos.lat, 0]]
          : A === 180 ? [[norm(pos.lon + 180), 0, 180]]
          : [[norm(pos.lon + A), 0, A], [norm(pos.lon - A), 0, -A]];
        alvos.forEach(function (t) {
          var e = S.equatorial(t[0], t[1], F.eps);
          out.push({
            planeta: p, A: A, sinal: t[2], glifo: a[1], aspecto: a[2], classe: a[3],
            lon: t[0], lat: t[1], ra: e.ra, dec: e.dec
          });
        });
      });
    });
    return out;
  }

  var _dirCache = {};
  function direcoesPrimarias(op) {
    op = op || {};
    var chave = op.chave || "naibod";
    var sentido = op.sentido || "ambas";
    var ck = chave + "|" + sentido;
    if (_dirCache[ck]) return _dirCache[ck];

    var F = QUADRO, k = CHAVES[chave];
    var sigs = significadores(F), proms = promissores(F), out = [];
    sigs.forEach(function (sig) {
      proms.forEach(function (prom) {
        if (sig.planeta && sig.planeta === prom.planeta) return;   /* um planeta não se dirige a si */
        var A = arcos(sig, prom, F); if (!A) return;
        [["direta", A.direta], ["conversa", A.conversa]].forEach(function (par) {
          var sent = par[0], arco = par[1];
          if (arco == null || !isFinite(arco)) return;
          if (sentido !== "ambas" && sentido !== sent) return;
          var anos = arco / k.v;
          if (anos < 0.15 || anos > 95) return;
          /* em que extremidade do eixo o contato realmente cai */
          var eixo = null;
          if (sig.angulo) {
            eixo = Math.abs(delta(prom.lon, sig.lon)) > 90 ? ANGULOS[sig.angulo].oposto : ANGULOS[sig.angulo].nome;
          }
          out.push({
            tipo: "direcao", sig: sig, prom: prom, arco: arco, sentido: sent,
            chaveArco: chave, polo: A.polo, oaS: A.oaS, oaP: A.oaP, eixo: eixo,
            anos: anos, data: new Date(C.NATIVO.nascimento.getTime() + anos * ANO)
          });
        });
      });
    });
    out.sort(function (a, b) { return a.anos - b.anos; });
    return (_dirCache[ck] = out);
  }

  /* ---------------- progressões secundárias ---------------- */
  /* um dia depois do nascimento vale um ano de vida */
  function dataProgredida(idade) {
    return new Date(C.NATIVO.nascimento.getTime() + idade * S.MS_DIA);
  }
  var MOVEIS = {
    "Lua": "Lua progredida", "Sol": "Sol progredido", "Mercúrio": "Mercúrio progredido",
    "Vênus": "Vênus progredida", "Marte": "Marte progredido",
    ascP: "Ascendente progredido", mcP: "Meio-do-Céu progredido"
  };
  var MOVEL_CASA = { ascP: 1, mcP: 10 };
  var PROG_PL = ["Lua", "Sol", "Mercúrio", "Vênus", "Marte"];

  var _amostras = {};
  function amostra(idade) {
    var ck = idade.toFixed(5);
    if (_amostras[ck]) return _amostras[ck];
    var d = dataProgredida(idade), o = { idade: idade, data: d, lon: {} };
    PROG_PL.forEach(function (p) { o.lon[p] = S.lon(p, d); });
    /* ângulos progredidos pelo arco solar em longitude aplicado ao MC natal */
    var arco = delta(o.lon["Sol"], MAPA.ceu["Sol"].lon);
    var mc = norm(MAPA.casas.mc + arco);
    o.lon.mcP = mc;
    o.lon.ascP = S.ascDeRAMC(S.ramcDeMC(mc, QUADRO.eps), QUADRO.eps, QUADRO.phi);
    o.arcoSolar = arco;
    return (_amostras[ck] = o);
  }
  function lonEm(movel, idade) { return amostra(idade).lon[movel]; }

  /* Raiz por interpolação linear e uma correção de Newton. A função é quase
     linear no passo de amostragem; duas avaliações bastam para chegar abaixo
     de um dia — bisseção completa aqui só gastaria efemérides. */
  function raiz(f, a0, a1, v0, v1) {
    if (v0 === v1) return a0;
    var r = a0 + (a1 - a0) * v0 / (v0 - v1);
    if (!(r >= a0 && r <= a1)) return (a0 + a1) / 2;
    var vr = f(r);
    if (vr === 0) return r;
    var der = (v1 - v0) / (a1 - a0);
    if (der !== 0) {
      var r2 = r - vr / der;
      if (r2 >= a0 && r2 <= a1) return r2;
    }
    return r;
  }

  function alvosNatais() {
    var t = {};
    S.CLASSICOS.forEach(function (p) {
      t[p] = { nome: p, lon: MAPA.ceu[p].lon, planeta: p, casa: C.casaDe(MAPA.ceu[p].lon) };
    });
    t.asc = { nome: "Ascendente", lon: MAPA.casas.asc, casa: 1 };
    t.mc = { nome: "Meio-do-Céu", lon: MAPA.casas.mc, casa: 10 };
    return t;
  }

  var _progCache = {};
  function progressoesSecundarias(a0, a1) {
    a0 = Math.max(0, Math.floor(a0 / 2) * 2);
    a1 = Math.min(100, Math.ceil(a1 / 2) * 2);
    var ck = a0 + "/" + a1;
    if (_progCache[ck]) return _progCache[ck];

    var passo = 0.08, amostras = [];
    for (var a = a0; a <= a1 + 1e-9; a += passo) amostras.push(amostra(+a.toFixed(5)));
    var alvos = alvosNatais(), out = [];
    function ev(o) {
      o.tipo = "progressao";
      o.data = new Date(C.NATIVO.nascimento.getTime() + o.anos * ANO);
      out.push(o);
    }

    Object.keys(MOVEIS).forEach(function (m) {
      for (var i = 0; i < amostras.length - 1; i++) {
        var A0 = amostras[i].idade, A1 = amostras[i + 1].idade;
        var L0 = amostras[i].lon[m], L1 = amostras[i + 1].lon[m];
        if (Math.abs(delta(L1, L0)) > 15) continue;         /* descontinuidade: pula */

        /* ingresso de signo */
        var s0 = Math.floor(norm(L0) / 30), s1 = Math.floor(norm(L1) / 30);
        if (s0 !== s1) {
          var fron = norm((delta(L1, L0) > 0 ? s1 : s0) * 30);
          var g = function (x) { return delta(lonEm(m, x), fron); };
          var r = raiz(g, A0, A1, g(A0), g(A1));
          ev({
            classe: "signo", movel: m, anos: r, casas: [], planetas: [m.replace("P", "")],
            titulo: MOVEIS[m] + " entra em " + T.SIGNOS[Math.floor(norm(lonEm(m, r + 0.02)) / 30)]
          });
        }
        /* ingresso de casa pela cúspide */
        var h0 = S.casaDe(L0, MAPA.casas.cusps), h1 = S.casaDe(L1, MAPA.casas.cusps);
        if (h0 !== h1) {
          var cusp = MAPA.casas.cusps[h1 - 1];
          var gc = function (x) { return delta(lonEm(m, x), cusp); };
          var rc = raiz(gc, A0, A1, gc(A0), gc(A1));
          ev({
            classe: "casa", movel: m, anos: rc, casaNova: h1, cusp: cusp,
            casas: [h1].concat(MOVEL_CASA[m] ? [MOVEL_CASA[m]] : []),
            planetas: [m.replace("P", "")],
            titulo: MOVEIS[m] + " cruza a cúspide da casa " + h1
          });
        }
        /* estação: raiz da velocidade */
        if (PROG_PL.indexOf(m) >= 0 && m !== "Sol" && m !== "Lua" && i > 0) {
          var vel = function (x) { return delta(lonEm(m, x + 0.02), lonEm(m, x - 0.02)); };
          var v0 = vel(A0), v1 = vel(A1);
          if (v0 !== 0 && v1 !== 0 && Math.sign(v0) !== Math.sign(v1)) {
            ev({
              classe: "estacao", movel: m, anos: raiz(vel, A0, A1, v0, v1), casas: [], planetas: [m],
              titulo: MOVEIS[m] + " estaciona " + (v1 < 0 ? "retrógrado" : "direto")
            });
          }
        }
        /* aspectos exatos a pontos natais */
        Object.keys(alvos).forEach(function (tk) {
          if (tk === m || (m === "ascP" && tk === "asc") || (m === "mcP" && tk === "mc")) return;
          ASPECTOS_PV.forEach(function (asp) {
            var A = asp[0];
            [A, -A].forEach(function (sinal, idx) {
              if (idx === 1 && (A === 0 || A === 180)) return;
              var ga = function (x) { return delta(lonEm(m, x) - alvos[tk].lon, sinal); };
              var w0 = ga(A0), w1 = ga(A1);
              if (w0 === 0 || Math.sign(w0) === Math.sign(w1)) return;
              if (Math.abs(w0) + Math.abs(w1) > 20) return;
              ev({
                classe: "aspecto", movel: m, alvo: tk, A: A, glifo: asp[1], cls: asp[3],
                anos: raiz(ga, A0, A1, w0, w1),
                titulo: MOVEIS[m] + " em " + asp[2] + " " +
                  (alvos[tk].planeta ? "a " : "ao ") + alvos[tk].nome + " natal",
                casas: (MOVEL_CASA[m] ? [MOVEL_CASA[m]] : []).concat(alvos[tk].casa ? [alvos[tk].casa] : []),
                planetas: [m.replace("P", ""), alvos[tk].planeta].filter(function (x) {
                  return S.CLASSICOS.indexOf(x) >= 0;
                })
              });
            });
          });
        });
      }
    });
    /* lunações progredidas: o ciclo de ~29,5 anos entre Lua nova e Lua nova */
    for (var j = 0; j < amostras.length - 1; j++) {
      var el = function (x) { var s = amostra(x); return delta(s.lon["Lua"], s.lon["Sol"]); };
      var e0 = el(amostras[j].idade), e1 = el(amostras[j + 1].idade);
      if (e0 < 0 && e1 >= 0 && Math.abs(e0) + Math.abs(e1) < 40) {
        var rn = raiz(el, amostras[j].idade, amostras[j + 1].idade, e0, e1);
        ev({
          classe: "lunacao", movel: "Lua", anos: rn, planetas: ["Sol", "Lua"],
          casas: [S.casaDe(amostra(rn).lon["Sol"], MAPA.casas.cusps)],
          titulo: "Lua Nova progredida"
        });
      }
      var fl = function (x) { var s = amostra(x); return delta(s.lon["Lua"] - s.lon["Sol"], 180); };
      var f0 = fl(amostras[j].idade), f1 = fl(amostras[j + 1].idade);
      if (f0 < 0 && f1 >= 0 && Math.abs(f0) + Math.abs(f1) < 40) {
        var rf = raiz(fl, amostras[j].idade, amostras[j + 1].idade, f0, f1);
        ev({
          classe: "lunacao", movel: "Lua", anos: rf, planetas: ["Sol", "Lua"],
          casas: [S.casaDe(amostra(rf).lon["Lua"], MAPA.casas.cusps)],
          titulo: "Lua Cheia progredida"
        });
      }
    }
    out.sort(function (a, b) { return a.anos - b.anos; });
    return (_progCache[ck] = out);
  }

  /* janela de permanência de um móvel numa casa — dá duração ao ingresso */
  function janelaNaCasa(movel, casa, anos) {
    var dentro = function (x) {
      return x >= 0 && x <= 100 && S.casaDe(lonEm(movel, +x.toFixed(5)), MAPA.casas.cusps) === casa;
    };
    function borda(dir) {
      var a = anos;
      for (var n = 0; n < 80; n++) { var b = +(a + dir * 0.5).toFixed(5); if (!dentro(b)) break; a = b; }
      for (var m = 0; m < 12; m++) { var c = +(a + dir * 0.05).toFixed(5); if (!dentro(c)) break; a = c; }
      return a;
    }
    var i = borda(-1), f = borda(1);
    return {
      ini: new Date(C.NATIVO.nascimento.getTime() + i * ANO),
      fim: new Date(C.NATIVO.nascimento.getTime() + f * ANO),
      anos: f - i
    };
  }

  /* ============================================================
     CAMADA 2 — CLASSIFICAÇÃO
     ============================================================ */

  /* papéis: o significador é o CAMPO atingido, o promissor é a NATUREZA
     da ativação. Trocar os dois é o erro mais comum na leitura. */
  function papeis(it) {
    if (it.tipo === "direcao") {
      var casaCampo = it.sig.angulo
        ? (it.eixo === ANGULOS[it.sig.angulo].oposto
            ? ANGULOS[it.sig.angulo].casaOposta : ANGULOS[it.sig.angulo].casa)
        : it.sig.casa;
      return {
        significador: {
          nome: it.eixo || it.sig.nome, planeta: it.sig.planeta || null, casa: casaCampo,
          rege: it.sig.planeta ? (MAPA.rege[it.sig.planeta] || []) : []
        },
        promissor: {
          nome: it.prom.planeta, planeta: it.prom.planeta,
          rege: MAPA.rege[it.prom.planeta] || [],
          ocupa: C.casaDe(MAPA.ceu[it.prom.planeta].lon)
        },
        aspecto: it.prom.aspecto, classe: it.prom.classe
      };
    }
    var mv = it.movel.replace("P", "");
    var alvo = it.alvo ? alvosNatais()[it.alvo] : null;
    return {
      significador: {
        nome: alvo ? alvo.nome : (it.casaNova ? "casa " + it.casaNova : MOVEIS[it.movel]),
        planeta: (alvo && alvo.planeta) || null,
        casa: (alvo && alvo.casa) || it.casaNova || MOVEL_CASA[it.movel] || null,
        rege: (alvo && alvo.planeta) ? (MAPA.rege[alvo.planeta] || []) : []
      },
      promissor: {
        nome: MOVEIS[it.movel], planeta: S.CLASSICOS.indexOf(mv) >= 0 ? mv : null,
        rege: MAPA.rege[mv] || [],
        ocupa: MAPA.ceu[mv] ? C.casaDe(MAPA.ceu[mv].lon) : null
      },
      aspecto: it.classe === "aspecto"
        ? (ASPECTOS_PV.filter(function (a) { return a[0] === it.A; })[0] || [])[2]
        : it.classe,
      classe: it.cls || "conj"
    };
  }

  function envolvidos(it) {
    var P = papeis(it), pls = {}, casasSig = {}, casasProm = {};
    if (P.significador.planeta) pls[P.significador.planeta] = 1;
    if (P.promissor.planeta) pls[P.promissor.planeta] = 1;
    if (P.significador.casa) casasSig[P.significador.casa] = 1;
    P.significador.rege.forEach(function (h) { casasSig[h] = 1; });
    P.promissor.rege.forEach(function (h) { casasProm[h] = 1; });
    if (P.promissor.ocupa) casasProm[P.promissor.ocupa] = 1;
    (it.casas || []).forEach(function (h) { if (h) casasSig[h] = 1; });
    var cs = Object.keys(casasSig).map(Number), cp = Object.keys(casasProm).map(Number);
    var todas = {}; cs.concat(cp).forEach(function (h) { todas[h] = 1; });
    return {
      planetas: Object.keys(pls), casasSig: cs, casasProm: cp,
      casas: Object.keys(todas).map(Number), papeis: P
    };
  }

  /* promessa natal: o vínculo forte é pelo PLANETA. A casa coincidente conta,
     mas nunca supera o planeta — senão qualquer contato acharia promessa. */
  function promessaDe(it) {
    var E = envolvidos(it), lista = C.promessasNatais(), melhor = null;
    lista.forEach(function (pr) {
      var porPlaneta = E.planetas.indexOf(pr.planeta) >= 0;
      var inter = pr.casas.filter(function (h) { return E.casas.indexOf(h) >= 0; });
      if (!porPlaneta && !inter.length) return;
      var sc = (porPlaneta ? 3 : 0) + Math.min(1, inter.length);
      if (!melhor || sc > melhor.pontos)
        melhor = { pr: pr, pontos: sc, casas: inter, porPlaneta: porPlaneta, forte: pr.estado === "forte" };
    });
    return melhor;
  }

  /* confirmações: as outras camadas de tempo apontam para o mesmo lugar
     na DATA DE PERFEIÇÃO do contato? Planeta vale mais que casa. */
  function confirmacoes(it, comTransito) {
    var E = envolvidos(it), out = [];
    var d = it.data;
    if (!(d instanceof Date) || isNaN(+d)) return out;
    var fd = C.firdariaEm(d), pr = C.profeccaoEm(d);

    if (E.planetas.indexOf(pr.senhorDoAno) >= 0)
      out.push({ camada: "profecção", via: "planeta", txt: "senhor do ano é " + pr.senhorDoAno });
    else if (E.casas.indexOf(pr.casa) >= 0)
      out.push({ camada: "profecção", via: "casa", txt: "profecção na casa " + pr.casa });

    if (fd) {
      var lm = fd.maior.lorde, ls = fd.sub ? fd.sub.lorde : null;
      if (E.planetas.indexOf(lm) >= 0 || (ls && E.planetas.indexOf(ls) >= 0))
        out.push({ camada: "firdaria", via: "planeta", txt: "firdaria de " + lm + (ls ? " / " + ls : "") });
      else {
        var casasFird = (MAPA.rege[lm] || []).concat(ls ? (MAPA.rege[ls] || []) : []);
        if (casasFird.some(function (h) { return E.casas.indexOf(h) >= 0; }))
          out.push({ camada: "firdaria", via: "casa", txt: "a firdaria administra a mesma casa" });
      }
    }
    /* revolução do ano em que o contato perfaz */
    var rs = null;
    try { rs = C.revolucaoVigente(d); } catch (e) { }
    if (rs) {
      if (E.planetas.indexOf(rs.regenteASC) >= 0)
        out.push({ camada: "revolução", via: "planeta", txt: "revolução regida por " + rs.regenteASC });
      else if (E.casas.indexOf(rs.ascSobreNatal) >= 0)
        out.push({ camada: "revolução", via: "casa", txt: "ascendente da revolução na casa " + rs.ascSobreNatal + " natal" });
    }
    if (comTransito) {
      try {
        var hits = C.transitosAoNatal(d, { fator: 0.4, comPerfeicao: false })
          .filter(function (x) {
            return x.orbe < 3 &&
              (E.planetas.indexOf(x.transitante) >= 0 || E.planetas.indexOf(x.natal) >= 0);
          }).sort(function (a, b) { return a.orbe - b.orbe; })[0];
        if (hits) out.push({
          camada: "trânsito", via: "planeta",
          txt: hits.transitante + " " + hits.glifo + " " + hits.natal + " natal (" + T.fmtGrau(hits.orbe) + ")"
        });
      } catch (e) { }
    }
    return out;
  }

  var VITAIS = ["asc", "mc", "Sol", "Lua"];
  function estrutural(it) {
    var P = papeis(it), motivos = [];
    var alvoVital = it.tipo === "direcao"
      ? !!(it.sig.angulo || it.sig.planeta === "Sol" || it.sig.planeta === "Lua")
      : ((it.alvo && VITAIS.indexOf(it.alvo) >= 0) || !!MOVEL_CASA[it.movel]);
    var duro = it.tipo === "direcao"
      ? (it.prom.A === 0 || it.prom.A === 180)
      : (it.classe === "aspecto" ? (it.A === 0 || it.A === 180) : it.classe !== "signo");
    if (alvoVital && duro) motivos.push("conjunção ou oposição a ponto vital");
    var regASC = MAPA.regenteASC;
    var regMC = T.REGENTE[T.SIGNOS[T.signoDe(MAPA.casas.mc)]];
    if (P.promissor.planeta === regASC) motivos.push("o promissor rege o Ascendente");
    if (P.promissor.planeta === regMC) motivos.push("o promissor rege o Meio-do-Céu");
    if (P.promissor.ocupa && [1, 4, 7, 10].indexOf(P.promissor.ocupa) >= 0)
      motivos.push("o promissor é angular no natal");
    return { alvoVital: alvoVital, duro: duro, motivos: motivos };
  }

  /* relevância por regra escrita — nada de nota agregada oculta */
  function relevancia(it, prom, conf) {
    var st = estrutural(it);
    var confPl = conf.filter(function (c) { return c.via === "planeta"; }).length;
    var promForte = prom && prom.porPlaneta && prom.forte;
    var promReal = prom && prom.porPlaneta;
    if ((st.alvoVital && st.duro && promReal) ||
        (promForte && confPl >= 1) ||
        (promReal && confPl >= 2) ||
        (st.motivos.length >= 2 && promReal && conf.length >= 1)) return "alta";
    if (promReal || (st.duro && conf.length >= 1) || (st.alvoVital && conf.length >= 1)) return "média";
    return "contextual";
  }

  /* períodos: contatos vizinhos que servem à mesma promessa deixam de ser
     eventos soltos e passam a ser um período com começo e fim */
  function periodos(itens, janelaAnos) {
    var usados = {}, out = [];
    var peso = { alta: 3, "média": 2, contextual: 1 };
    itens.forEach(function (a, i) {
      if (usados[i]) return;
      var grupo = [a]; usados[i] = 1;
      itens.forEach(function (b, j) {
        if (usados[j] || j === i) return;
        if (Math.abs(b.anos - a.anos) > janelaAnos) return;
        var mesmaProm = a.promessa && b.promessa && a.promessa.pr.id === b.promessa.pr.id;
        var mesmoPl = a.env.planetas.some(function (p) { return b.env.planetas.indexOf(p) >= 0; });
        if (mesmaProm || mesmoPl) { grupo.push(b); usados[j] = 1; }
      });
      grupo.sort(function (x, y) { return x.anos - y.anos; });
      var pls = {}, casas = {};
      grupo.forEach(function (g) {
        g.env.planetas.forEach(function (p) { pls[p] = (pls[p] || 0) + 1; });
        g.env.casas.forEach(function (h) { casas[h] = (casas[h] || 0) + 1; });
      });
      var dom = Object.keys(pls).sort(function (x, y) { return pls[y] - pls[x]; })[0];
      var casasTop = Object.keys(casas).map(Number)
        .sort(function (x, y) { return casas[y] - casas[x]; }).slice(0, 3);
      var forca = grupo.reduce(function (s, g) { return s + peso[g.nivel]; }, 0) +
        (grupo.length > 1 ? grupo.length : 0) +
        (Object.keys(pls).some(function (k2) { return pls[k2] > 1; }) ? 2 : 0);
      out.push({
        grupo: grupo, dominante: dom, casasTop: casasTop, forca: forca,
        nivel: grupo.map(function (g) { return g.nivel; })
          .sort(function (x, y) { return peso[y] - peso[x]; })[0],
        de: grupo[0].anos, ate: grupo[grupo.length - 1].anos,
        dataDe: grupo[0].data, dataAte: grupo[grupo.length - 1].data,
        principal: null, promessa: null
      });
      /* o principal é o contato de nível mais alto do grupo; a promessa do
         período é a dele, não a do primeiro em ordem de tempo */
      var P = out[out.length - 1];
      P.principal = grupo.slice().sort(function (x, y) {
        return peso[y.nivel] - peso[x.nivel] || x._dist - y._dist;
      })[0];
      P.promessa = P.principal.promessa ||
        (grupo.filter(function (g) { return g.promessa; })[0] || {}).promessa || null;
    });
    out.sort(function (a, b) { return b.forca - a.forca; });
    return out;
  }

  /* ============================================================
     CAMADA 3 — LEITURA
     ============================================================ */
  function tituloDe(it) {
    if (it.tipo !== "direcao") return it.titulo;
    var P = papeis(it);
    var alvo = it.eixo || P.significador.nome;
    var asp = it.prom.A === 0 ? "dirigido" : "dirigido em " + it.prom.aspecto;
    return it.prom.planeta + " " + asp + " a " + alvo +
      (it.sentido === "conversa" ? " (conversa)" : "");
  }
  function idadeTxt(anos) {
    var a = Math.floor(anos), m = Math.round((anos - a) * 12);
    if (m === 12) { a++; m = 0; }
    return a + " anos" + (m ? " e " + m + " meses" : "");
  }
  function leitura(it) {
    var P = it.env.papeis, prom = it.promessa, L = [];
    L.push(["Ativação", tituloDe(it)]);
    L.push(["Promessa natal", prom
      ? prom.pr.enunciado + " (" + prom.pr.estado + ")"
      : "nenhuma promessa natal suficientemente testemunhada corresponde a este contato — " +
        "registra-se o contato, não um acontecimento"]);
    L.push(["Campo atingido", P.significador.casa
      ? cap(K.CASA_ASSUNTO[P.significador.casa]) + " (casa " + P.significador.casa + ")"
      : cap(P.significador.nome)]);
    var origem = [];
    if (P.promissor.rege.length) origem.push(casasTxt(P.promissor.rege));
    if (P.promissor.ocupa) origem.push("a partir da casa " + P.promissor.ocupa);
    L.push(["Origem da manifestação", origem.length
      ? cap(origem.join(", ")) + "." : "o promissor não administra casa neste mapa."]);
    if (P.promissor.planeta) {
      var cd = MAPA.condicao[P.promissor.planeta];
      L.push(["Condição do promissor", P.promissor.planeta + " " +
        (cd.essencial.itens.length
          ? "com " + cd.essencial.itens.map(function (i) { return i.tipo; }).join(" e ")
          : cd.essencial.debilidades.map(function (i) { return i.tipo; }).join(" e ")) +
        ", na casa " + cd.acidental.casa + " — " +
        (cd.essencial.pontos >= 3 ? "entrega com apoio próprio"
          : cd.essencial.pontos >= 0 ? "entrega dependente dos apoios que receber"
          : "entrega que tende a exigir mais esforço, revisão e tempo") + "."]);
    }
    /* Síntese: o que administra o promissor encontra o campo do significador.
       Quando os dois coincidem, dizer "a casa 3 favorece a casa 3" seria
       literal e inútil — o caso pede outra frase. */
    var campoN = P.significador.casa;
    var regeP = P.promissor.rege.filter(function (h) { return h !== campoN; });
    var fecho = it.tipo === "direcao"
      ? "com possibilidade de definição ou reorganização nesse campo."
      : "com amadurecimento interno antes de qualquer forma exterior.";
    /* "se somar a" pede contração com o artigo; os outros verbos são
       transitivos diretos. Sem isto sai "tende a se somar a a casa 3". */
    var VERBOS = { conj: ["se somar", "à casa "], harm: ["favorecer", "a casa "],
                   tens: ["pressionar", "a casa "] };
    var vb = VERBOS[P.classe] || ["tocar", "a casa "];
    function verbo(plural) { return (plural ? "tendem a " : "tende a ") + vb[0]; }
    var sintese;
    if (!campoN)
      sintese = cap(P.promissor.nome) + " " + verbo(false) + " " + P.significador.nome + ", " + fecho;
    else if (!regeP.length && P.promissor.rege.indexOf(campoN) >= 0)
      sintese = "O promissor administra a própria casa atingida: a casa " + campoN +
        " é ao mesmo tempo a origem e o campo, e o contato tende a concentrar o assunto em si mesmo, " + fecho;
    else if (!regeP.length)
      sintese = "Os assuntos do promissor " + verbo(true) + " " + vb[1] + campoN + ", " + fecho;
    else
      sintese = cap(casasTxt(regeP)) + " " + verbo(regeP.length > 1) + " " + vb[1] + campoN +
        (P.promissor.rege.indexOf(campoN) >= 0 ? ", que o próprio promissor também administra" : "") + ", " + fecho;
    L.push(["Síntese", sintese]);
    return L;
  }
  function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }
  function casasTxt(hs) {
    if (!hs || !hs.length) return "";
    return hs.length === 1 ? "a casa " + hs[0] : "as casas " + hs.join(" e ");
  }

  /* ---------------- seleção ---------------- */
  /* margem de tolerância: um contato é "ativo" dentro de N meses da perfeição.
     Direções e progressões não são relógios; a tradição trabalha com o ano. */
  var MARGEM_MESES = 6;
  function estado(it, agora) {
    var meses = (it.data - agora) / S.MS_DIA / 365.2425 * 12;
    if (Math.abs(meses) <= MARGEM_MESES) return "ativo";
    return meses > 0 ? "proximo" : "passado";
  }

  function selecionar(op) {
    op = op || {};
    var agora = op.agora || new Date();
    var idade = C.idadeEm(agora);
    var tipo = op.tipo || "direcao";
    var base = tipo === "direcao"
      ? direcoesPrimarias({ chave: op.chave, sentido: op.sentido })
      : progressoesSecundarias(Math.max(0, idade - 8), idade + 12);
    var janela = op.janela || (tipo === "direcao" ? 10 : 8);
    var perto = base.filter(function (x) { return Math.abs(x.anos - idade) <= janela; });
    var bruta = perto.length ? perto : base.slice(0, 40);

    var pre = bruta.map(function (x) {
      var p = promessaDe(x), e = envolvidos(x), s = estrutural(x);
      var o = {};
      Object.keys(x).forEach(function (k2) { o[k2] = x[k2]; });
      o.promessa = p; o.env = e; o.estr = s;
      o._rank = (p ? p.pontos : 0) + s.motivos.length + (s.alvoVital ? 2 : 0) + (s.duro ? 1 : 0);
      o._dist = Math.abs(x.anos - idade);
      return o;
    });
    pre.sort(function (a, b) { return (b._rank - a._rank) || (a._dist - b._dist); });

    var limite = op.limite || 18;
    var iPerto = 0;
    for (var i = 1; i < pre.length; i++) if (pre[i]._dist < pre[iPerto]._dist) iPerto = i;
    var sel = pre.slice(0, limite);
    if (iPerto >= limite && pre[iPerto]) sel[limite - 1] = pre[iPerto];

    var curta = sel.map(function (x) {
      var conf = confirmacoes(x, !!op.comTransito);
      x.conf = conf;
      x.nivel = relevancia(x, x.promessa, conf);
      x.estado = estado(x, agora);
      return x;
    });
    var peso = { alta: 0, "média": 1, contextual: 2 };
    curta.sort(function (a, b) {
      return (peso[a.nivel] - peso[b.nivel]) || (a._dist - b._dist) || (b._rank - a._rank);
    });
    return {
      lista: curta,
      periodos: periodos(curta, tipo === "direcao" ? 2.5 : 1.5),
      idade: idade, agora: agora, total: base.length
    };
  }

  root.Preditivas = {
    CHAVES: CHAVES, ANGULOS: ANGULOS, MOVEIS: MOVEIS, QUADRO: QUADRO, MARGEM_MESES: MARGEM_MESES,
    direcoesPrimarias: direcoesPrimarias, progressoesSecundarias: progressoesSecundarias,
    janelaNaCasa: janelaNaCasa, amostra: amostra, dataProgredida: dataProgredida,
    papeis: papeis, envolvidos: envolvidos, promessaDe: promessaDe,
    confirmacoes: confirmacoes, estrutural: estrutural, relevancia: relevancia,
    periodos: periodos, leitura: leitura, tituloDe: tituloDe, idadeTxt: idadeTxt, casasTxt: casasTxt,
    estado: estado, selecionar: selecionar
  };
})(window);
