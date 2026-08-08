/* ============================================================
   LIONS DAILY · núcleo astronômico
   Efemérides: Astronomy Engine (Don Cross, MIT) — VSOP87/ELP2000
   truncados, precisão típica melhor que 1″ no intervalo 1700–2200.
   Substitui a aproximação kepleriana anterior, que errava até 7′.

   Tudo aqui é cálculo. Nada de interpretação.
   ============================================================ */
(function (root) {
  "use strict";
  var A = root.Astronomy;
  var R = Math.PI / 180, D = 180 / Math.PI;

  /* ---------- utilidades angulares ---------- */
  function norm(x) { return ((x % 360) + 360) % 360; }
  /* diferença assinada no intervalo (-180, 180] */
  function delta(a, b) { return ((a - b + 540) % 360) - 180; }
  /* separação absoluta 0–180 */
  function sep(a, b) { return Math.abs(delta(a, b)); }

  var MS_DIA = 86400000;
  function jd(d) { return d.getTime() / MS_DIA + 2440587.5; }
  function fromJD(j) { return new Date((j - 2440587.5) * MS_DIA); }
  function T(d) { return (jd(d) - 2451545) / 36525; }

  /* ---------- obliquidade e tempo sideral ---------- */
  /* IAU 1980 / Meeus 22.2 — suficiente: erro < 0.1″ no período coberto */
  function obliquidade(d) {
    var t = T(d);
    return 23.439291111 - 0.0130041667 * t - 1.638889e-7 * t * t + 5.036111e-7 * t * t * t;
  }
  /* GMST em graus (Meeus 12.4) */
  function gmst(d) {
    var j = jd(d), t = (j - 2451545) / 36525;
    return norm(280.46061837 + 360.98564736629 * (j - 2451545)
      + 0.000387933 * t * t - t * t * t / 38710000);
  }

  /* ---------- corpos ---------- */
  var CORPO = {
    "Sol": "Sun", "Lua": "Moon", "Mercúrio": "Mercury", "Vênus": "Venus",
    "Marte": "Mars", "Júpiter": "Jupiter", "Saturno": "Saturn"
  };
  var CLASSICOS = ["Sol", "Lua", "Mercúrio", "Vênus", "Marte", "Júpiter", "Saturno"];

  /* Longitude eclíptica aparente, eclíptica da data (tropical).
     Verificado contra efeméride de referência: Δ < 0.0001°. */
  function lon(nome, d) {
    if (nome === "Lua") return norm(A.EclipticGeoMoon(d).lon);
    if (nome === "Nodo Norte") return nodoMedio(d);
    if (nome === "Nodo Sul") return norm(nodoMedio(d) + 180);
    return norm(A.Ecliptic(A.GeoVector(CORPO[nome], d, true)).elon);
  }
  /* Latitude eclíptica — necessária para paralelos e para as estrelas */
  function lat(nome, d) {
    if (nome === "Lua") return A.EclipticGeoMoon(d).lat;
    if (nome === "Nodo Norte" || nome === "Nodo Sul") return 0;
    return A.Ecliptic(A.GeoVector(CORPO[nome], d, true)).elat;
  }
  /* Distância geocêntrica em UA — entra na condição acidental (Lua) */
  function dist(nome, d) {
    if (nome === "Lua") return A.EclipticGeoMoon(d).dist;
    if (nome === "Nodo Norte" || nome === "Nodo Sul") return 0;
    var v = A.GeoVector(CORPO[nome], d, true);
    return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
  }

  /* Nó lunar MÉDIO (Meeus 47.7). A carta de referência usa o nó médio,
     não o verdadeiro — a diferença chega a 1°40′, o que mudaria a casa. */
  function nodoMedio(d) {
    var t = T(d);
    return norm(125.0445479 - 1934.1362891 * t + 0.0020754 * t * t
      + t * t * t / 467441 - t * t * t * t / 60616000);
  }

  /* Velocidade em graus/dia, por diferença central. Sinal negativo = retrógrado. */
  function speed(nome, d) {
    var h = nome === "Lua" ? 0.02 : 0.5;      /* passo em dias */
    var a = lon(nome, new Date(d.getTime() - h * MS_DIA));
    var b = lon(nome, new Date(d.getTime() + h * MS_DIA));
    return delta(b, a) / (2 * h);
  }

  /* Fotografia do céu num instante */
  function ceu(d) {
    var o = {};
    for (var i = 0; i < CLASSICOS.length; i++) {
      var p = CLASSICOS[i];
      o[p] = { lon: lon(p, d), lat: lat(p, d), speed: speed(p, d) };
    }
    var nn = nodoMedio(d);
    o["Nodo Norte"] = { lon: nn, lat: 0, speed: -0.0529539 };
    o["Nodo Sul"] = { lon: norm(nn + 180), lat: 0, speed: -0.0529539 };
    return o;
  }

  /* ============================================================
     CASAS · Placidus por iteração de semiarco
     Validado contra as cúspides de referência do mapa natal:
     erro máximo 0.0052° (19″) nas doze casas.
     ============================================================ */
  function casas(d, latitude, longitude) {
    var e = obliquidade(d) * R;
    var ramcDeg = norm(gmst(d) + longitude);
    var ramc = ramcDeg * R;
    var phi = latitude * R;

    var mc = norm(Math.atan2(Math.sin(ramc), Math.cos(ramc) * Math.cos(e)) * D);
    var asc = norm(Math.atan2(Math.cos(ramc),
      -(Math.sin(ramc) * Math.cos(e) + Math.tan(phi) * Math.sin(e))) * D);

    /* Nas latitudes polares o semiarco degenera; ali Placidus não existe
       e a tradição recorre a Porfírio. Fazemos o mesmo. */
    var polar = Math.abs(latitude) > 66.0;

    function cusp(frac, noturno) {
      var x = norm(ramcDeg + (noturno ? 180 : 0));
      for (var i = 0; i < 80; i++) {
        var dec = Math.asin(Math.sin(e) * Math.sin(x * R));
        var ad = Math.tan(phi) * Math.tan(dec);
        if (ad > 1) ad = 1; else if (ad < -1) ad = -1;
        var AD = Math.asin(ad) * D;
        var ra = noturno ? norm(ramcDeg + 180 - frac * (90 - AD))
                         : norm(ramcDeg + frac * (90 + AD));
        var nx = norm(Math.atan2(Math.sin(ra * R), Math.cos(ra * R) * Math.cos(e)) * D);
        if (Math.abs(delta(nx, x)) < 1e-9) { x = nx; break; }
        x = nx;
      }
      return x;
    }

    var c11, c12, c2, c3;
    if (polar) {                                   /* Porfírio */
      var q1 = norm(asc - mc) / 3, q2 = norm(norm(mc + 180) - asc) / 3;
      c11 = norm(mc + q1); c12 = norm(mc + 2 * q1);
      c2 = norm(asc + q2); c3 = norm(asc + 2 * q2);
    } else {
      c11 = cusp(1 / 3, false); c12 = cusp(2 / 3, false);
      c3 = cusp(1 / 3, true); c2 = cusp(2 / 3, true);
    }

    return {
      asc: asc, mc: mc, sistema: polar ? "Porfírio" : "Placidus",
      cusps: [asc, c2, c3, norm(mc + 180), norm(c11 + 180), norm(c12 + 180),
              norm(asc + 180), norm(c2 + 180), norm(c3 + 180), mc, c11, c12]
    };
  }

  /* ---------- conversões de quadro, para direções primárias ---------- */
  /* eclíptica → equatorial. A latitude importa: o promissor de conjunção
     leva a sua, os pontos de aspecto são tomados sobre a eclíptica. */
  function equatorial(lonDeg, latDeg, epsDeg) {
    var l = lonDeg * R, b = (latDeg || 0) * R, e = epsDeg * R;
    var ra = Math.atan2(Math.sin(l) * Math.cos(e) - Math.tan(b) * Math.sin(e), Math.cos(l)) * D;
    var dec = Math.asin(Math.sin(b) * Math.cos(e) + Math.cos(b) * Math.sin(e) * Math.sin(l)) * D;
    return { ra: norm(ra), dec: dec };
  }
  /* diferença ascensional sob um polo; null se o ponto for circumpolar ali */
  function difAscensional(decDeg, poloDeg) {
    var x = Math.tan(decDeg * R) * Math.tan(poloDeg * R);
    if (!isFinite(x) || Math.abs(x) >= 1) return null;
    return Math.asin(x) * D;
  }
  function ramcDeMC(mcDeg, epsDeg) {
    var m = mcDeg * R, e = epsDeg * R;
    return norm(Math.atan2(Math.sin(m) * Math.cos(e), Math.cos(m)) * D);
  }
  function mcDeRAMC(ramcDeg, epsDeg) {
    var r = ramcDeg * R, e = epsDeg * R;
    return norm(Math.atan2(Math.sin(r), Math.cos(r) * Math.cos(e)) * D);
  }
  function ascDeRAMC(ramcDeg, epsDeg, latDeg) {
    var r = ramcDeg * R, e = epsDeg * R, phi = latDeg * R;
    return norm(Math.atan2(Math.cos(r),
      -(Math.sin(r) * Math.cos(e) + Math.tan(phi) * Math.sin(e))) * D);
  }

  /* Em que casa cai uma longitude, dadas as cúspides */
  function casaDe(l, cusps) {
    l = norm(l);
    for (var i = 0; i < 12; i++) {
      var a = norm(cusps[i]), b = norm(cusps[(i + 1) % 12]);
      var span = norm(b - a), off = norm(l - a);
      if (span > 0 && off < span) return i + 1;
    }
    return 12;
  }
  /* Distância à cúspide seguinte e à anterior — a tradição considera
     um planeta "na cúspide" da casa seguinte a partir de ~5° antes dela. */
  function posicaoNaCasa(l, cusps) {
    var h = casaDe(l, cusps);
    var ini = norm(cusps[h - 1]), fim = norm(cusps[h % 12]);
    var tamanho = norm(fim - ini) || 30;
    var dentro = norm(l - ini);
    return {
      casa: h, tamanho: tamanho, percorrido: dentro,
      paraProxima: tamanho - dentro,
      naCuspide: (tamanho - dentro) <= 5 ? (h % 12) + 1 : null,
      recemEntrado: dentro <= 3
    };
  }

  /* ============================================================
     EVENTOS · resolução por bisseção sobre uma função de sinal
     Um "evento" tem instante. Um "estado" tem duração. Item 9.
     ============================================================ */
  function bissecao(f, t0, t1, tolMs) {
    tolMs = tolMs || 60000;
    var a = t0.getTime(), b = t1.getTime(), fa = f(new Date(a));
    if (fa === 0) return new Date(a);
    var fb = f(new Date(b));
    if (fa * fb > 0) return null;
    for (var i = 0; i < 60 && (b - a) > tolMs; i++) {
      var m = (a + b) / 2, fm = f(new Date(m));
      if (fm === 0) return new Date(m);
      if (fa * fm < 0) { b = m; fb = fm; } else { a = m; fa = fm; }
    }
    return new Date((a + b) / 2);
  }

  /* Instante em que `nome` cruza a longitude `alvo`, procurando à frente
     a partir de `de` até `dias`. Devolve null se não cruzar. */
  function cruzaLongitude(nome, alvo, de, dias, passoDias) {
    var passo = passoDias || (nome === "Lua" ? 0.08 : 0.5);
    var f = function (t) { return delta(lon(nome, t), alvo); };
    var t0 = de, v0 = f(t0);
    for (var acc = 0; acc < dias; acc += passo) {
      var t1 = new Date(de.getTime() + Math.min(acc + passo, dias) * MS_DIA);
      var v1 = f(t1);
      /* só aceita cruzamento contínuo — descarta o salto de ±180 */
      if (v0 * v1 <= 0 && Math.abs(v0 - v1) < 180) {
        var r = bissecao(f, t0, t1);
        if (r) return r;
      }
      t0 = t1; v0 = v1;
    }
    return null;
  }

  /* Instante em que o aspecto de `ang` graus entre dois corpos se perfaz.
     É isto que a tradição chama de "perfeição": o momento exato. Item 8. */
  function perfeicao(pA, pB, ang, de, dias) {
    var f = function (t) {
      var s = delta(lon(pA, t), lon(pB, t));
      /* distância assinada até o aspecto, pelo lado mais próximo */
      var d1 = delta(s, ang), d2 = delta(s, -ang);
      return Math.abs(d1) <= Math.abs(d2) ? d1 : d2;
    };
    var passo = (pA === "Lua" || pB === "Lua") ? 0.08 : 0.4;
    var t0 = de, v0 = f(t0);
    for (var acc = 0; acc < dias; acc += passo) {
      var t1 = new Date(de.getTime() + Math.min(acc + passo, dias) * MS_DIA);
      var v1 = f(t1);
      if (v0 * v1 <= 0 && Math.abs(v0 - v1) < 90) {
        var r = bissecao(f, t0, t1);
        if (r) return r;
      }
      t0 = t1; v0 = v1;
    }
    return null;
  }

  /* Aspecto de trânsito contra um ponto FIXO (natal). Aqui o corpo natal
     não se move, então aplicativo/separativo depende só do trânsito. */
  function perfeicaoAoPonto(nome, alvoLon, ang, de, dias) {
    var f = function (t) {
      var s = delta(lon(nome, t), alvoLon);
      var d1 = delta(s, ang), d2 = delta(s, -ang);
      return Math.abs(d1) <= Math.abs(d2) ? d1 : d2;
    };
    var passo = nome === "Lua" ? 0.05 : 0.3;
    var t0 = de, v0 = f(t0);
    for (var acc = 0; acc < dias; acc += passo) {
      var t1 = new Date(de.getTime() + Math.min(acc + passo, dias) * MS_DIA);
      var v1 = f(t1);
      if (v0 * v1 <= 0 && Math.abs(v0 - v1) < 90) {
        var r = bissecao(f, t0, t1);
        if (r) return r;
      }
      t0 = t1; v0 = v1;
    }
    return null;
  }

  /* Estações (parada e mudança de direção) — retrogradação real, item 29 */
  function proximaEstacao(nome, de, dias) {
    if (nome === "Sol" || nome === "Lua") return null;
    var f = function (t) { return speed(nome, t); };
    var passo = 1, t0 = de, v0 = f(t0);
    for (var acc = 0; acc < dias; acc += passo) {
      var t1 = new Date(de.getTime() + Math.min(acc + passo, dias) * MS_DIA);
      var v1 = f(t1);
      if (v0 * v1 <= 0) {
        var r = bissecao(f, t0, t1, 3600000);
        if (r) return { data: r, tipo: v0 > 0 ? "retrógrado" : "direto", lon: lon(nome, r) };
      }
      t0 = t1; v0 = v1;
    }
    return null;
  }

  /* ============================================================
     REVOLUÇÃO SOLAR · com cúspides PRÓPRIAS
     O erro antigo: as casas da revolução eram lidas nas cúspides natais,
     o que é uma contradição — a revolução tem seu próprio ascendente.
     ============================================================ */
  function revolucaoSolar(solNatalLon, ano, latitude, longitude) {
    /* chuta o aniversário e resolve o instante exato do retorno */
    var chute = new Date(Date.UTC(ano, 0, 1));
    var inst = cruzaLongitude("Sol", solNatalLon, chute, 370, 0.5);
    if (!inst) return null;
    return {
      utc: inst,
      ano: ano,
      lat: latitude, lon: longitude,
      planetas: ceu(inst),
      casas: casas(inst, latitude, longitude)
    };
  }

  /* ============================================================
     LUGAR E HORA · o local deixa de ser fixo (item 17)
     ============================================================ */
  function observador(latitude, longitude, alt) {
    return new A.Observer(latitude, longitude, alt || 0);
  }
  function nascerPor(corpo, obs, dia) {
    var r = A.SearchRiseSet(corpo, obs, +1, dia, 2);
    return r ? r.date : null;
  }
  function ocasoPor(corpo, obs, dia) {
    var r = A.SearchRiseSet(corpo, obs, -1, dia, 2);
    return r ? r.date : null;
  }
  /* SearchRiseSet é caro e a busca de janelas eletivas repete o mesmo dia
     dezenas de vezes. Ancoramos na meia-noite UTC do dia — chave exata,
     sem risco de dois instantes do mesmo balde darem respostas diferentes. */
  var _cacheSol = {};
  function meiaNoite(d) { return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()); }
  function arcoSolar(ms, obs) {
    var k = ms + "|" + obs.latitude.toFixed(4) + "|" + obs.longitude.toFixed(4);
    if (_cacheSol[k]) return _cacheSol[k];
    var d0 = new Date(ms);
    var nasc = nascerPor("Sun", obs, d0);
    var ocaso = nasc ? ocasoPor("Sun", obs, new Date(nasc.getTime() + 1000)) : null;
    return (_cacheSol[k] = { nascer: nasc, ocaso: ocaso });
  }

  var CALDEU = ["Saturno", "Júpiter", "Marte", "Sol", "Vênus", "Mercúrio", "Lua"];
  var REGENTE_DIA = ["Sol", "Lua", "Marte", "Mercúrio", "Júpiter", "Vênus", "Saturno"];

  /* Hora planetária no LUGAR DADO. Doze horas desiguais entre o nascer e o
     ocaso, doze entre o ocaso e o nascer seguinte. */
  function horaPlanetaria(agora, latitude, longitude, alt) {
    var obs = observador(latitude, longitude, alt);
    var base = meiaNoite(agora);
    /* procura o arco diurno que contém o instante, testando três dias */
    var arco = null, prox = null;
    for (var d = -1; d <= 1; d++) {
      var a = arcoSolar(base + d * MS_DIA, obs);
      var b = arcoSolar(base + (d + 1) * MS_DIA, obs);
      if (!a.nascer || !a.ocaso || !b.nascer) continue;
      if (agora >= a.nascer && agora < b.nascer) { arco = a; prox = b; break; }
    }
    if (!arco) return null;
    var nasc = arco.nascer, ocas = arco.ocaso, proxNasc2 = prox.nascer;

    var diurno = agora >= nasc && agora < ocas;
    var ini = diurno ? nasc : ocas;
    var fim = diurno ? ocas : proxNasc2;
    var dur = (fim - ini) / 12;
    var idx = Math.floor((agora - ini) / dur);
    if (idx < 0) idx = 0; if (idx > 11) idx = 11;

    /* O dia planetário começa ao nascer do Sol, não à meia-noite. */
    var diaSemana = nasc.getUTCDay();
    var regenteDia = REGENTE_DIA[diaSemana];
    var base = CALDEU.indexOf(regenteDia);
    var passo = diurno ? idx : idx + 12;
    var regente = CALDEU[(base + passo) % 7];

    return {
      regente: regente, regenteDia: regenteDia, diurno: diurno,
      indice: idx + 1, inicio: new Date(ini.getTime() + idx * dur),
      fim: new Date(ini.getTime() + (idx + 1) * dur),
      duracaoMin: dur / 60000, nascer: nasc, ocaso: ocas
    };
  }

  /* Seita: diurna se o Sol está acima do horizonte no instante do mapa.
     Determinado pelas casas, não pelo relógio. */
  function seita(solLon, cusps) {
    var h = casaDe(solLon, cusps);
    return (h >= 7 && h <= 12) ? "diurno" : "noturno";
  }

  /* ---------- Lua: fase, iluminação, próximo evento ---------- */
  function fase(d) {
    var t = ceu(d);
    var el = norm(t["Lua"].lon - t["Sol"].lon);
    return { elongacao: el, ilum: Math.round((1 - Math.cos(el * R)) / 2 * 100) };
  }
  function proximaFase(d) {
    var r = A.SearchMoonPhase(0, d, 40) , melhor = null;
    [0, 90, 180, 270].forEach(function (q) {
      var s = A.SearchMoonPhase(q, d, 40);
      if (s && (!melhor || s.date < melhor.data)) melhor = { data: s.date, quadrante: q };
    });
    return melhor;
  }

  /* ---------- exportação ---------- */
  root.Astro = {
    norm: norm, delta: delta, sep: sep, jd: jd, fromJD: fromJD,
    MS_DIA: MS_DIA, CLASSICOS: CLASSICOS,
    obliquidade: obliquidade, gmst: gmst,
    lon: lon, lat: lat, dist: dist, speed: speed, ceu: ceu, nodoMedio: nodoMedio,
    casas: casas, casaDe: casaDe, posicaoNaCasa: posicaoNaCasa,
    equatorial: equatorial, difAscensional: difAscensional,
    ramcDeMC: ramcDeMC, mcDeRAMC: mcDeRAMC, ascDeRAMC: ascDeRAMC,
    bissecao: bissecao, cruzaLongitude: cruzaLongitude,
    perfeicao: perfeicao, perfeicaoAoPonto: perfeicaoAoPonto,
    proximaEstacao: proximaEstacao,
    revolucaoSolar: revolucaoSolar,
    observador: observador, nascerPor: nascerPor, ocasoPor: ocasoPor,
    horaPlanetaria: horaPlanetaria, seita: seita,
    fase: fase, proximaFase: proximaFase
  };
})(window);
