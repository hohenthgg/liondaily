/* ============================================================
   LIONS DAILY · telas técnicas, perfil, promessas, saúde e guia
   ============================================================ */
(function () {
  "use strict";
  var S = window.Astro, T = window.Trad, K = window.Corpus, C = window.Chrono, P = window.Perfil;
  var U = window.__ui, MAPA = C.MAPA;
  var bloco = U.bloco, camada = U.camada, dados = U.dados, rot = U.rot, esc = U.esc,
      escAttr = U.escAttr, gl = U.gl, cap = U.cap, texto = U.texto, VS = U.VS;

  /* ============================================================
     TÉCNICA · o aparato de tempo
     ============================================================ */
  var subTecnica = "cronocratores";
  function telaTecnica() {
    var abas = [["cronocratores", "Cronocratores"], ["revolucao", "Revolução"],
                ["cronologia", "Cronologia"], ["transitos", "Trânsitos"],
                ["semana", "Semana"], ["eletiva", "Eletiva"]];
    return '<h2>Técnica</h2><p class="sub">As camadas de tempo, cada uma no seu nível. ' +
      "Firdaria e profecção autorizam; a revolução dá o campo do ano; o trânsito dispara.</p>" +
      '<div class="chips" id="chips-tec">' + abas.map(function (a) {
        return '<button class="chip" data-sub="' + a[0] + '" aria-pressed="' +
          (a[0] === subTecnica) + '">' + a[1] + "</button>";
      }).join("") + '</div><div id="tec-corpo"></div>';
  }

  function tecCronocratores() {
    var agora = new Date();
    var fd = C.firdariaEm(agora), pr = C.profeccaoEm(agora);
    var h = [];

    h.push(rot("Firdaria — a era"));
    if (fd) {
      var lm = fd.maior.lorde, ls = fd.sub ? fd.sub.lorde : null;
      var cm = MAPA.condicao[lm];
      h.push(bloco({
        titulo: "Firdaria de " + lm + (ls ? " / " + ls : ""), glifo: T.GLIFO[lm],
        ativo: true, certeza: "tradicional",
        pos: U.fCurta(fd.inicioMaior) + " → " + U.fCurta(fd.fimMaior) +
          " · " + fd.maior.anos + " anos · " + U.daqui(fd.fimMaior) + " para acabar",
        conclusao: "<p>A era pertence a <b>" + lm + "</b>" +
          (MAPA.rege[lm] ? ", senhor das casas " + MAPA.rege[lm].join(" e ") : "") +
          ". No mapa está em " + T.fmtLonNome(MAPA.ceu[lm].lon) + ", casa " + cm.acidental.casa +
          " — e é nesse estado que ele governa o período.</p>" +
          (ls ? "<p>O capítulo em curso é de <b>" + ls + "</b>, até " + U.fCurta(fd.fimSub) +
            " (" + U.daqui(fd.fimSub) + ").</p>" : ""),
        tags: [["era de " + lm, "ativo"], ls ? ["capítulo de " + ls, "barro"] : null,
               ["essencial " + (cm.essencial.pontos > 0 ? "+" : "") + cm.essencial.pontos,
                cm.essencial.pontos >= 0 ? "bom" : "mau"]],
        porque: "<p>A firdaria persa divide a vida em períodos planetários fixos. Em mapa noturno a " +
          "sequência começa pela Lua: Lua 9, Saturno 11, Júpiter 12, Marte 7, Sol 10, Vênus 8, " +
          "Mercúrio 13, Nodo Norte 3, Nodo Sul 2 — 75 anos ao todo, e então recomeça.</p>" +
          "<p>Cada período maior divide-se em sete sub-períodos iguais, começando pelo próprio senhor " +
          "e seguindo a mesma ordem. O senhor maior dá o tom da era; o submenor, o do capítulo.</p>",
        calculo: dados([
          ["idade agora", C.idadeEm(agora).toFixed(3) + " anos"],
          ["período maior", lm + " · " + fd.maior.de + "–" + fd.maior.ate + " anos"],
          ["sub-período", ls ? ls + " · " + fd.sub.de.toFixed(3) + "–" + fd.sub.ate.toFixed(3) + " anos" : "—"],
          ["seita", MAPA.seita + " (define a sequência)"]
        ]),
        extra: camada("todos os sub-períodos desta era", '<div class="dados">' +
          fd.maior.subs.map(function (s) {
            var atual = C.idadeEm(agora) >= s.de && C.idadeEm(agora) < s.ate;
            return "<div><span class='k'>" + (atual ? "▸ " : "") + esc(s.lorde) + "</span><span class='v'>" +
              U.fCurta(C.dataDaIdade(s.de)) + " → " + U.fCurta(C.dataDaIdade(s.ate)) + "</span></div>";
          }).join("") + "</div>")
      }));
    }

    h.push(rot("Profecção — o ano"));
    var cs = MAPA.condicao[pr.senhorDoAno];
    h.push(bloco({
      titulo: "Ano " + pr.idade + " · casa " + pr.casa + " em " + pr.signo,
      glifo: T.GLIFO_SIGNO[pr.signoIdx], ativo: true, certeza: "tradicional",
      pos: U.fCurta(pr.inicio) + " → " + U.fCurta(pr.fim),
      conclusao: "<p>O Ascendente avançou até " + pr.signo + ". O ano é lido pelos assuntos da " +
        "<b>casa " + pr.casa + "</b> — " + esc(K.CASA_ASSUNTO[pr.casa]) + ".</p>" +
        "<p>Senhor do ano: <b>" + pr.senhorDoAno + "</b>, natal em " +
        T.fmtLonNome(MAPA.ceu[pr.senhorDoAno].lon) + ", casa " + pr.casaNatalDoSenhor + ", " +
        (cs.essencial.itens.length
          ? "com " + cs.essencial.itens.map(function (i) { return i.tipo; }).join(" e ")
          : cs.essencial.debilidades.map(function (i) { return i.tipo; }).join(" e ")) + ".</p>" +
        (pr.ocupantes.length ? "<p>Em " + pr.signo + " está " + pr.ocupantes.join(", ") +
          " — testemunha do ano.</p>" : ""),
      tags: [["senhor: " + pr.senhorDoAno, "ativo"],
             ["essencial " + (cs.essencial.pontos > 0 ? "+" : "") + cs.essencial.pontos,
              cs.essencial.pontos >= 0 ? "bom" : "mau"],
             ["natal na casa " + pr.casaNatalDoSenhor, "barro"]],
      porque: "<p>A profecção é de signo inteiro: a cada aniversário o Ascendente avança um signo. " +
        "A casa é a contagem a partir do signo ascendente, não a casa Placidus — as duas divergem, " +
        "e é a whole-sign que a técnica usa.</p>" +
        (cs.essencial.pontos < 0
          ? "<p><b>Senhor do ano debilitado.</b> " + pr.senhorDoAno + " está " +
            cs.essencial.debilidades.map(function (i) { return i.tipo; }).join(" e ") +
            ". A tradição não diz que o ano será ruim: diz que o significador chega sem apoio do lugar, " +
            "e portanto que os assuntos da casa " + pr.casa + " dependem mais de circunstância e de " +
            "recepção alheia do que de força própria. Vale olhar quem o recebe.</p>"
          : ""),
      calculo: dados([
        ["idade completa", pr.idade],
        ["signo ascendente natal", MAPA.signoASC],
        ["signo profectado", pr.signo + " (" + MAPA.signoASC + " + " + pr.idade + ")"],
        ["casa (whole-sign)", pr.casa],
        ["senhor", pr.senhorDoAno]
      ])
    }));

    /* coincidência de camadas — item 29 */
    var coin = C.coincidencias(new Date(agora.getTime() - 400 * 86400000),
      new Date(agora.getTime() + 800 * 86400000), 60);
    if (coin.length) {
      h.push(rot("Camadas mudando juntas"));
      coin.forEach(function (c) {
        h.push(bloco({
          titulo: c.dias === 0 ? "Duas camadas viram no mesmo dia" : "Duas camadas viram em " + c.dias + " dias",
          glifo: "⇄", certeza: "heuristico",
          pos: U.fCurta(c.de) + (c.dias ? " → " + U.fCurta(c.ate) : ""),
          conclusao: "<p>" + c.eventos.map(function (e) { return "<b>" + esc(e.titulo) + "</b>"; }).join(" e ") + ".</p>" +
            "<p>" + esc(c.nota) + "</p>"
        }));
      });
    }
    return h.join("");
  }

  function tecRevolucao() {
    var agora = new Date();
    var rs = C.revolucaoVigente(agora);
    var pr = C.profeccaoEm(agora);
    if (!rs) return '<p class="vazio">Não foi possível calcular a revolução.</p>';
    var passos = C.prioridadeRevolucao(rs, pr);
    var h = [];
    var loc = C.localAtual();

    h.push(bloco({
      titulo: "Revolução solar de " + rs.ano, glifo: "☉", ativo: true, certeza: "tradicional",
      pos: U.fDataHora(rs.utc) + " UTC · " + esc(loc.nome),
      conclusao: "<p>O Sol voltou ao grau natal (" + T.fmtLonNome(MAPA.ceu["Sol"].lon) + ") neste instante. " +
        "A carta levantada aqui tem <b>ascendente próprio</b> em " + T.fmtLonNome(rs.casas.asc) +
        " e casas próprias — não se leem os planetas da revolução nas casas natais.</p>",
      porque: '<p class="aviso" style="margin:0">Correção de auditoria: a versão anterior classificava os ' +
        "planetas da revolução usando as cúspides natais, o que é uma contradição — a revolução tem seu " +
        "próprio ascendente. Agora há duas leituras separadas, como manda a técnica: as casas da revolução " +
        "e a sobreposição sobre o natal.</p>" +
        "<p>O lugar importa: a revolução é levantada para onde o nativo está no momento do retorno. " +
        "O instante é o mesmo no mundo inteiro; as casas mudam com a longitude e a latitude.</p>",
      calculo: dados([
        ["instante do retorno", U.fDataHora(rs.utc) + " (UTC)"],
        ["Sol na revolução", '<span class="num">' + rs.planetas["Sol"].lon.toFixed(5) + "°</span>"],
        ["Sol natal", '<span class="num">' + MAPA.ceu["Sol"].lon.toFixed(5) + "°</span>"],
        ["diferença", '<span class="num">' + (Math.abs(S.delta(rs.planetas["Sol"].lon, MAPA.ceu["Sol"].lon)) * 3600).toFixed(1) + "″</span>"],
        ["lugar", esc(loc.nome) + " (" + loc.lat.toFixed(4) + ", " + loc.lon.toFixed(4) + ")"],
        ["seita da revolução", rs.seita]
      ])
    }));

    h.push(rot("Ordem de leitura"));
    passos.forEach(function (p) {
      h.push(bloco({
        titulo: p.ordem + ". " + p.rot, glifo: String(p.ordem), certeza: p.certeza,
        pos: p.valor, conclusao: "<p>" + esc(p.leitura) + "</p>"
      }));
    });

    h.push(rot("As duas leituras, lado a lado"));
    h.push('<div class="rolagem"><table class="grade"><tr><th>planeta</th><th>posição</th>' +
      "<th>casa da revolução</th><th>sobre a casa natal</th></tr>" +
      Object.keys(rs.proprias).map(function (p) {
        return "<tr><td class='rot'>" + gl(T.GLIFO[p]) + " " + esc(p) + "</td><td>" +
          T.fmtLonNome(rs.planetas[p].lon) + "</td><td>" + rs.proprias[p] + "</td><td>" +
          rs.sobreNatal[p] + "</td></tr>";
      }).join("") +
      "<tr><td class='rot'>Ascendente</td><td>" + T.fmtLonNome(rs.casas.asc) +
      "</td><td>1</td><td>" + rs.ascSobreNatal + "</td></tr>" +
      "<tr><td class='rot'>Meio-do-Céu</td><td>" + T.fmtLonNome(rs.casas.mc) +
      "</td><td>10</td><td>" + rs.mcSobreNatal + "</td></tr></table></div>");

    h.push(rot("Onde o ano toca a promessa natal"));
    var toca = rs.aoNatal.filter(function (a) { return a.orbe < 2; });
    if (!toca.length) h.push('<p class="vazio">Nenhum contato apertado entre a revolução e os pontos natais.</p>');
    toca.slice(0, 12).forEach(function (a) {
      h.push('<div class="gatilho' + (a.orbe < 1 ? " forte" : "") + '"><span class="asp">' + a.glifo + VS +
        '</span><div class="txt"><div class="t1">' + gl(T.GLIFO[a.a] || "") + " <b>" + esc(a.a) +
        "</b> da revolução " + esc(a.aspecto.toLowerCase()) + " " + esc(a.b) + " natal</div>" +
        '<div class="t2">' + T.fmtGrau(a.orbe) +
        ((MAPA.rege[a.b] || []).length ? " · toca as casas " + MAPA.rege[a.b].join(" e ") : "") +
        "</div></div></div>");
    });

    h.push(rot("Outras revoluções"));
    h.push('<div class="rolagem"><table class="grade"><tr><th>ano</th><th>idade</th><th>instante</th>' +
      "<th>ASC da revolução</th><th>sobre casa natal</th><th>senhor do ano</th></tr>" +
      (function () {
        var out = [], ano0 = agora.getUTCFullYear();
        for (var y = ano0 - 3; y <= ano0 + 3; y++) {
          var r = C.revolucaoDe(y); if (!r) continue;
          var idade = Math.round(C.idadeEm(r.utc));
          var pf = C.profeccaoEm(new Date(r.utc.getTime() + 86400000));
          out.push("<tr" + (y === rs.ano ? " style='background:rgba(217,106,43,.09)'" : "") +
            "><td>" + y + "</td><td>" + idade + "</td><td>" + U.fCurta(r.utc) + "</td><td>" +
            T.fmtLonNome(r.casas.asc) + "</td><td>" + r.ascSobreNatal + "</td><td>" +
            pf.senhorDoAno + "</td></tr>");
        }
        return out.join("");
      })() + "</table></div>");
    return h.join("");
  }

  function tecCronologia() {
    var agora = new Date();
    var de = new Date(agora.getTime() - 6 * 365.25 * 86400000);
    var ate = new Date(agora.getTime() + 14 * 365.25 * 86400000);
    var ev = C.linhaDoTempo(de, ate);
    var idx = 0;
    for (var i = 0; i < ev.length; i++) if (ev[i].quando <= agora) idx = i;
    var h = ['<p class="nota">Cronologia real: eventos com instante, não barras de intensidade. ' +
      "Cada faixa é uma categoria — <b>primário</b> (a camada vira por inteiro), <b>secundário</b> " +
      "(subdivisão dentro da camada), <b>contexto</b> (pano de fundo). Não há porcentagem porque não " +
      "há grandeza contínua a medir.</p>"];
    h.push('<div class="crono">' + ev.map(function (e, i) {
      var passado = e.quando <= agora;
      return '<div class="crono-ev' + (i === idx ? " agora" : "") + '" data-nivel="' + e.nivel + '"' +
        (passado ? ' style="opacity:.55"' : "") + ">" +
        '<div class="quando">' + U.fCurta(e.quando) + " · " + U.daqui(e.quando) + "</div>" +
        '<div class="tit">' + esc(e.titulo) + "</div>" +
        '<div class="det">' + esc(e.detalhe) + "</div></div>";
    }).join("") + "</div>");

    h.push(rot("A vida inteira, por firdaria"));
    h.push('<div class="rolagem"><table class="grade"><tr><th>senhor</th><th>idades</th><th>período</th>' +
      "<th>casas que rege</th><th>condição natal</th></tr>" +
      C.FIRDARIA.slice(0, 9).map(function (p) {
        var cd = MAPA.condicao[p.lorde];
        var atual = C.idadeEm(agora) >= p.de && C.idadeEm(agora) < p.ate;
        return "<tr" + (atual ? " style='background:rgba(217,106,43,.09)'" : "") + "><td class='rot'>" +
          gl(T.GLIFO[p.lorde] || "") + " " + esc(p.lorde) + "</td><td>" + p.de + "–" + p.ate + "</td><td>" +
          U.fCurta(C.dataDaIdade(p.de)) + " → " + U.fCurta(C.dataDaIdade(p.ate)) + "</td><td>" +
          ((MAPA.rege[p.lorde] || []).join(", ") || "—") + "</td><td>" +
          (cd ? (cd.essencial.pontos > 0 ? "+" : "") + cd.essencial.pontos : "—") + "</td></tr>";
      }).join("") + "</table></div>");
    return h.join("");
  }

  function tecTransitos() {
    var agora = new Date();
    var ceu = S.ceu(agora);
    var tr = C.transitosAoNatal(agora, { fator: 1 });
    var h = ['<p class="nota">Trânsitos aos pontos natais. Orbe cheio; o que importa é a coluna ' +
      "<b>estado</b>: aplicando é o que ainda vai perfazer.</p>"];

    h.push(rot("O céu agora"));
    h.push('<div class="rolagem"><table class="grade"><tr><th></th><th>posição</th><th>casa natal</th>' +
      "<th>termo</th><th>vel.</th><th>estação</th></tr>" +
      S.CLASSICOS.map(function (p) {
        var est = S.proximaEstacao(p, agora, 200);
        return "<tr><td class='rot'>" + gl(T.GLIFO[p]) + " " + esc(p) + "</td><td>" +
          T.fmtLonNome(ceu[p].lon) + "</td><td>" + C.casaDe(ceu[p].lon) + "</td><td>" +
          gl(T.GLIFO[T.termoDe(ceu[p].lon).senhor]) + "</td><td class='num'>" +
          ceu[p].speed.toFixed(3) + (ceu[p].speed < 0 ? " ℞" : "") + "</td><td>" +
          (est ? est.tipo + " " + U.fCurta(est.data) : "—") + "</td></tr>";
      }).join("") + "</table></div>");

    h.push(rot("Contatos"));
    var apl = tr.filter(function (a) { return a.aplicando; });
    var sep = tr.filter(function (a) { return a.separando; });
    h.push("<p style='font-size:.82rem;color:var(--creme-3);margin:.3rem 0 .5rem'>" +
      apl.length + " aplicando · " + sep.length + " separando</p>");
    apl.concat(sep).slice(0, 30).forEach(function (a) {
      h.push('<div class="gatilho' + (a.aplicando && a.orbe < 1 ? " forte" : "") + '"' +
        (a.separando ? ' style="opacity:.6"' : "") + '><span class="asp">' + a.glifo + VS + "</span>" +
        '<div class="txt"><div class="t1">' + gl(T.GLIFO[a.transitante]) + " <b>" + esc(a.transitante) +
        "</b>" + (a.retrogrado ? " ℞" : "") + " " + esc(a.aspecto.toLowerCase()) + " " + esc(a.natal) +
        ' natal</div><div class="t2">' + T.fmtGrau(a.orbe) + " · " +
        (a.aplicando ? "aplicando" : "separando") +
        ((MAPA.rege[a.natal] || []).length ? " · casas " + MAPA.rege[a.natal].join(" e ") : "") +
        "</div></div>" +
        (a.perfeicao ? '<span class="quando">' + U.fCurta(a.perfeicao) + "</span>" : "") + "</div>");
    });
    return h.join("");
  }

  /* ---- semana: grade signo · casa · termo ---- */
  var semanaIni = null;
  function inicioSemana(d) {
    var x = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
    x.setUTCDate(x.getUTCDate() - x.getUTCDay());
    return x;
  }
  function tecSemana() {
    if (!semanaIni) semanaIni = inicioSemana(new Date());
    var dias = [], linhas = {};
    for (var i = 0; i < 7; i++) {
      var d = new Date(semanaIni); d.setUTCDate(semanaIni.getUTCDate() + i);
      d.setUTCHours(12, 0, 0, 0); dias.push(d);
    }
    S.CLASSICOS.forEach(function (p) {
      linhas[p] = dias.map(function (d) {
        var l = S.lon(p, d);
        return { lon: l, sg: T.signoDe(l), casa: C.casaDe(l), tm: T.termoDe(l).senhor };
      });
    });
    function mudou(c, i, k) { return i > 0 && c[i - 1][k] !== c[i][k]; }
    var fim = dias[6];
    var h = ['<div style="display:flex;align-items:center;gap:.6rem;margin-bottom:.6rem">' +
      '<button class="bt" id="sem-ant">←</button>' +
      '<b style="flex:1;text-align:center;font-family:var(--serif)">' +
      dias[0].getUTCDate() + " " + U.MES3[dias[0].getUTCMonth()] + " – " +
      fim.getUTCDate() + " " + U.MES3[fim.getUTCMonth()] + " " + fim.getUTCFullYear() + "</b>" +
      '<button class="bt" id="sem-prox">→</button></div>'];
    h.push('<div class="rolagem"><table class="grade"><tr><th></th>' +
      dias.map(function (d) {
        return "<th><b>" + String(d.getUTCDate()).padStart(2, "0") + "</b><br>" +
          U.DIA3[d.getUTCDay()] + "</th>";
      }).join("") + "</tr>" +
      S.CLASSICOS.map(function (p) {
        return "<tr><td class='rot'>" + gl(T.GLIFO[p]) + "</td>" +
          linhas[p].map(function (c, i) {
            var v = mudou(linhas[p], i, "sg") || mudou(linhas[p], i, "tm") || mudou(linhas[p], i, "casa");
            return "<td class='" + (v ? "vira" : "") + "'>" + gl(T.GLIFO_SIGNO[c.sg]) +
              "<br><span style='color:var(--creme-3)'>c" + c.casa + "</span> " +
              gl(T.GLIFO[c.tm]) + "</td>";
          }).join("") + "</tr>";
      }).join("") + "</table></div>");
    h.push('<p class="nota">Célula destacada = o planeta mudou de signo, de casa natal ou de termo naquele dia. ' +
      "Cada célula traz o glifo do signo, a casa natal em trânsito e o glifo do senhor do termo.</p>");
    return h.join("");
  }

  /* ---- eletiva: busca de janela com testemunhos (item 10) ---- */
  var eletivaTema = "oficio";
  function tecEletiva() {
    return '<p class="nota">Não é um gráfico: é uma <b>busca de janela</b>. Escolha o assunto; ' +
      "o aplicativo varre as próximas 72 horas e mostra, hora a hora, quais testemunhos tradicionais " +
      "de eleição são satisfeitos — e quais não são. Nenhuma nota agregada esconde o critério.</p>" +
      '<div class="chips" id="chips-ele">' + K.TEMAS.map(function (t) {
        return '<button class="chip" data-tema="' + t.id + '" aria-pressed="' + (t.id === eletivaTema) +
          '">' + gl(t.glifo) + esc(t.nome) + "</button>";
      }).join("") + '</div><div id="ele-corpo"></div>';
  }

  function avaliarJanela(quando, tema) {
    var loc = C.localAtual();
    var ceu = S.ceu(quando);
    var casaAlvo = tema.casas[0];
    var senhor = T.REGENTE[T.SIGNOS[T.signoDe(MAPA.casas.cusps[casaAlvo - 1])]];
    var hp = S.horaPlanetaria(quando, loc.lat, loc.lon, loc.alt);
    var casasT = S.casas(quando, loc.lat, loc.lon);
    var seitaT = S.seita(ceu["Sol"].lon, casasT.cusps);
    var lua = T.agendaDaLua(quando, ceu, S.CLASSICOS);
    var condS = {
      essencial: T.dignidadeEssencial(senhor, ceu[senhor].lon, seitaT),
      acidental: T.condicaoAcidental(senhor, ceu[senhor], {
        cusps: casasT.cusps, solLon: ceu["Sol"].lon, seita: seitaT, todas: ceu
      })
    };
    var res = [];
    function reg(id, ok, detalhe) {
      var r = K.ELETIVA_REGRAS.filter(function (x) { return x.id === id; })[0];
      res.push({ regra: r, ok: ok, detalhe: detalhe });
    }
    reg("lua-vazia", !lua.vaziaDeCurso,
      lua.vaziaDeCurso ? "vazia de curso até sair de " + lua.signoAtual
        : lua.eventos.length + " aspecto(s) por perfazer antes de sair de " + lua.signoAtual);
    var prox = lua.eventos[0];
    reg("lua-benefico", !!(prox && ["Júpiter", "Vênus"].indexOf(prox.alvo) >= 0),
      prox ? "aplica-se a " + prox.alvo + " (" + prox.aspecto.toLowerCase() + ")" : "nada a aplicar");
    reg("lua-malefico", !(prox && ["Marte", "Saturno"].indexOf(prox.alvo) >= 0 &&
      prox.natureza !== "suave"),
      prox && ["Marte", "Saturno"].indexOf(prox.alvo) >= 0
        ? "aplica-se a " + prox.alvo + " por " + prox.aspecto.toLowerCase() : "livre dos maléficos");
    reg("senhor-forte", condS.essencial.pontos >= 0,
      senhor + " com dignidade " + (condS.essencial.pontos > 0 ? "+" : "") + condS.essencial.pontos);
    var elSol = Math.abs(S.delta(ceu[senhor].lon, ceu["Sol"].lon));
    reg("senhor-livre", senhor === "Sol" || elSol > 17,
      senhor === "Sol" ? "é o próprio Sol" : "a " + T.fmtGrau(elSol) + " do Sol");
    reg("senhor-direto", ceu[senhor].speed >= 0,
      ceu[senhor].speed >= 0 ? "direto" : "retrógrado");
    reg("hora-concorde", !!(hp && (hp.regente === senhor || ["Júpiter", "Vênus"].indexOf(hp.regente) >= 0)),
      hp ? "hora de " + hp.regente : "—");
    var casaSenhorT = S.casaDe(ceu[senhor].lon, casasT.cusps);
    reg("angular", [1, 4, 7, 10].indexOf(casaSenhorT) >= 0,
      senhor + " na casa " + casaSenhorT + " do momento");
    var ascT = casasT.asc;
    var malSobreAsc = ["Marte", "Saturno"].filter(function (m) {
      return Math.abs(S.delta(ceu[m].lon, ascT)) < 5;
    });
    reg("asc-limpo", !malSobreAsc.length,
      malSobreAsc.length ? malSobreAsc.join(" e ") + " sobre o ascendente" : "ascendente livre");
    var lLua = ceu["Lua"].lon;
    reg("via-combusta", !(lLua > 195 && lLua < 225),
      lLua > 195 && lLua < 225 ? "Lua na via combusta" : "fora da via combusta");

    var favor = res.filter(function (r) { return r.ok; }).reduce(function (a, r) { return a + r.regra.peso; }, 0);
    var contra = res.filter(function (r) { return !r.ok; }).reduce(function (a, r) { return a + r.regra.peso; }, 0);
    return { quando: quando, res: res, favor: favor, contra: contra, senhor: senhor, casa: casaAlvo, hora: hp };
  }

  function eletivaCorpo() {
    var tema = K.TEMAS.filter(function (t) { return t.id === eletivaTema; })[0];
    var agora = new Date();
    var janelas = [];
    for (var i = 0; i < 36; i++) {
      janelas.push(avaliarJanela(new Date(agora.getTime() + i * 2 * 3600000), tema));
    }
    var melhores = janelas.slice().sort(function (a, b) {
      return (b.favor - b.contra) - (a.favor - a.contra);
    }).slice(0, 3);
    var h = [];
    h.push(rot("Melhores janelas nas próximas 72 horas"));
    melhores.forEach(function (j) {
      h.push(bloco({
        titulo: U.fCurta(j.quando) + ", " + U.fHora(j.quando),
        glifo: j.hora ? T.GLIFO[j.hora.regente] : "◷", ativo: true, certeza: "tradicional",
        pos: "testemunhos a favor: " + j.favor + " · contra: " + j.contra +
          (j.hora ? " · hora de " + j.hora.regente : ""),
        conclusao: "<p>Assunto: <b>" + esc(tema.nome) + "</b>, casa " + j.casa +
          ", regida por <b>" + j.senhor + "</b>.</p>",
        porque: '<div class="dados">' + j.res.map(function (r) {
          return "<div><span class='k' style='color:" + (r.ok ? "var(--verde)" : "var(--vermelho)") + "'>" +
            (r.ok ? "✓" : "✕") + " " + esc(r.regra.rot) + "</span><span class='v'>" +
            esc(r.detalhe) + "</span></div>";
        }).join("") + "</div>",
        calculo: '<div class="dados">' + j.res.map(function (r) {
          return "<div><span class='k'>" + esc(r.regra.rot) + " (peso " + r.regra.peso + ")</span>" +
            "<span class='v'>" + esc(r.regra.fonte) + " — " + esc(r.regra.nota) + "</span></div>";
        }).join("") + "</div>"
      }));
    });
    h.push(rot("As 72 horas, hora a hora"));
    h.push('<div class="rolagem"><table class="grade"><tr><th>quando</th><th>hora de</th>' +
      K.ELETIVA_REGRAS.map(function (r) {
        return "<th title='" + escAttr(r.rot) + "'>" + esc(r.rot.split(" ")[0].slice(0, 6)) + "</th>";
      }).join("") + "<th>saldo</th></tr>" +
      janelas.map(function (j) {
        return "<tr><td class='rot'>" + U.DIA3[j.quando.getDay()] + " " + U.fHora(j.quando) + "</td><td>" +
          (j.hora ? gl(T.GLIFO[j.hora.regente]) : "—") + "</td>" +
          j.res.map(function (r) {
            return "<td style='color:" + (r.ok ? "var(--verde)" : "var(--vermelho)") + "'>" +
              (r.ok ? "✓" : "✕") + "</td>";
          }).join("") + "<td class='num'>" + (j.favor - j.contra) + "</td></tr>";
      }).join("") + "</table></div>");
    h.push('<p class="nota">O saldo é a soma dos pesos, mostrada só porque cada parcela está visível na ' +
      "mesma linha. Não é uma nota: é a conta aberta.</p>");
    return h.join("");
  }

  /* ============================================================
     PERFIL · temperamento e eixos
     ============================================================ */
  var famSel = null;
  function telaPerfil() {
    var t = P.temperamento();
    var h = ['<h2>Perfil</h2><p class="sub">Temperamento pela tradição médica; eixos como experimento declarado.</p>'];

    h.push(rot("Temperamento"));
    var info = K.TEMP_INFO[t.principal];
    h.push(bloco({
      titulo: cap(t.principal) + (t.colapso ? "" : " com " + t.secundario),
      glifo: K.TEMP_GLIFO[t.principal], ativo: true, certeza: "derivado",
      pos: t.nitidez + " · " + t.eixoCalor.rot + ", " + t.eixoUmidade.rot,
      conclusao: "<p>" + esc(info ? (info.desc || info[0] || "") : "") + "</p>" +
        (t.colapso ? '<p class="nota">A combinação ' + esc(t.principal) + "–" + esc(t.secundario) +
          " não é composto válido na doutrina dos humores: as duas qualidades se excluem. " +
          "Lê-se como " + esc(t.colapso) + " puro.</p>" : ""),
      corpo: U.escala("frio", "quente", t.eixoCalor.grau,
                      t.eixoCalor.lado === "quente" ? "dir" : t.eixoCalor.lado === "frio" ? "esq" : null,
                      t.eixoCalor.grau >= 3) +
             U.escala("úmido", "seco", t.eixoUmidade.grau,
                      t.eixoUmidade.lado === "seco" ? "dir" : t.eixoUmidade.lado === "úmido" ? "esq" : null,
                      t.eixoUmidade.grau >= 3),
      porque: "<p>Os testemunhos são os que a tradição manda pesar: o signo do Ascendente e o seu senhor, " +
        "a Lua e sua fase, a estação do ano e os planetas que tocam Ascendente e Lua. " +
        "<b>Os pesos entre eles são nossos</b> — por isso este bloco é derivado, e não tradicional.</p>" +
        '<p class="nota">' + esc(t.nota) + "</p>",
      calculo: '<div class="dados">' + t.fatores.map(function (f) {
        return "<div><span class='k'>peso " + f.peso + "</span><span class='v'>" + esc(f.rot) +
          " — " + esc(f.detalhe) + "</span></div>";
      }).join("") + "</div>" +
      dados([["ordem dos humores", t.vetor.map(function (v) { return v[0]; }).join(" › ")],
             ["margem entre 1º e 2º", t.margem > 0.15 ? "larga" : t.margem > 0.06 ? "média" : "estreita"]])
    }));

    h.push(rot("48 eixos"));
    h.push('<div class="aviso"><b>Experimental.</b> Os 48 eixos não vêm da tradição: são uma grade ' +
      "moderna que traduz testemunhos do mapa em polaridades de comportamento. Não é psicometria, " +
      "não foi validado contra nada e não mede ninguém. O que se mostra é a inclinação em cinco faixas " +
      "e a lista crua dos testemunhos — para poder ser conferida e descartada.</p></div>");
    var fams = Object.keys(K.AX_FAM);
    h.push('<div class="chips" id="chips-eixos">' +
      '<button class="chip" data-fam="" aria-pressed="' + (!famSel) + '">todos</button>' +
      fams.map(function (f) {
        return '<button class="chip" data-fam="' + f + '" aria-pressed="' + (famSel === f) + '">' +
          gl(K.AX_FAM[f][0]) + esc(f) + "</button>";
      }).join("") + '</div><div id="eixos-corpo"></div>');
    return h.join("");
  }
  function eixosCorpo() {
    var lista = P.eixos().filter(function (e) { return !famSel || e.fam === famSel; });
    return lista.map(function (e) {
      var ladoEsq = e.lado === e.poloA;
      return bloco({
        titulo: e.nome, glifo: "◑", certeza: "experimental",
        pos: e.lado ? e.inclinacao.rot + " a " + e.lado.toLowerCase() : "sem inclinação clara",
        conclusao: "<p>" + esc(e.frase) + "</p>" +
          (e.convergencia ? '<p class="nota">' + esc(e.convergencia) + ".</p>" : ""),
        corpo: U.escala(e.poloA, e.poloB, e.inclinacao.grau,
          e.lado ? (ladoEsq ? "esq" : "dir") : null, e.inclinacao.grau >= 3),
        calculo: e.testemunhos.length ? '<div class="dados">' + e.testemunhos.map(function (m) {
          return "<div><span class='k'>peso " + m.peso + " · " + (m.dir > 0 ? "→ " + e.poloA : "→ " + e.poloB) +
            "</span><span class='v'>" + esc(m.txt) + "</span></div>";
        }).join("") + "</div>" : ""
      });
    }).join("") || '<p class="vazio">Nenhum eixo nesta família.</p>';
  }

  /* ============================================================
     PROMESSAS NATAIS (item 3)
     ============================================================ */
  function telaPromessas() {
    var h = ['<h2>Promessas natais</h2><p class="sub">O que o mapa torna possível, tema por tema. ' +
      "A promessa é o primeiro degrau da hierarquia: sem ela, nenhum trânsito significa nada.</p>"];
    K.TEMAS.forEach(function (t) { h.push(cardTema(t)); });
    return h.join("");
  }
  function cardTema(t) {
    var casaP = t.casas[0];
    var senhor = T.REGENTE[T.SIGNOS[T.signoDe(MAPA.casas.cusps[casaP - 1])]];
    var cs = MAPA.condicao[senhor];
    var ocup = [];
    t.casas.concat(t.apoio || []).forEach(function (c) {
      S.CLASSICOS.forEach(function (p) {
        if (C.casaDe(MAPA.ceu[p].lon) === c && ocup.indexOf(p + "|" + c) < 0) ocup.push(p + "|" + c);
      });
    });
    var lote = t.lote ? MAPA.lotes[t.lote] : null;
    var sig = MAPA.condicao[t.significador];
    /* a promessa: condição do senhor + testemunhas */
    var forca = cs.essencial.pontos + cs.acidental.pontos;
    var veredito = forca >= 6 ? "bem sustentado" : forca >= 0 ? "sustentado com ressalvas"
      : forca >= -6 ? "sustentado com dificuldade" : "mal sustentado";
    return bloco({
      id: "tema-" + t.id,
      titulo: t.nome, glifo: t.glifo, certeza: "derivado",
      pos: "casa " + t.casas.join(" e ") + " · senhor " + senhor + " · " + veredito,
      conclusao: "<p>" + esc(t.pergunta) + "</p>" +
        "<p>A casa " + casaP + " começa em " + T.fmtLonNome(MAPA.casas.cusps[casaP - 1]) +
        ", logo o assunto pertence a <b>" + senhor + "</b>, que está em " +
        T.fmtLonNome(MAPA.ceu[senhor].lon) + ", casa " + cs.acidental.casa +
        (cs.essencial.itens.length ? ", com " + cs.essencial.itens.map(function (i) { return i.tipo; }).join(" e ")
          : cs.essencial.debilidades.length ? ", " + cs.essencial.debilidades.map(function (i) { return i.tipo; }).join(" e ")
          : "") + ".</p>" +
        (ocup.length ? "<p>Nas casas do tema: " + ocup.map(function (x) {
          var pp = x.split("|");
          return pp[0] + " (casa " + pp[1] + ")";
        }).join(", ") + ".</p>" : '<p class="nota">Nenhum planeta ocupa as casas do tema — lê-se pelo senhor.</p>'),
      tags: [["senhor: " + senhor, "barro"],
             ["significador natural: " + t.significador, ""],
             [veredito, forca >= 0 ? "bom" : "mau"],
             t.lote ? ["Lote de " + t.lote + " na casa " + C.casaDe(lote), "ativo"] : null],
      porque: "<p><b>Como se lê.</b> " + esc(t.comoLer) + "</p>" +
        "<p><b>Significador natural.</b> " + t.significador + ", que no mapa está em " +
        T.fmtLonNome(MAPA.ceu[t.significador].lon) + ", casa " + sig.acidental.casa +
        " (essencial " + (sig.essencial.pontos > 0 ? "+" : "") + sig.essencial.pontos + ").</p>" +
        (lote ? "<p><b>Lote de " + t.lote + ".</b> " + T.fmtLonNome(lote) + ", casa " + C.casaDe(lote) +
          ". " + esc(K.LOTE_INFO[t.lote].sig) + "</p>" : "") +
        "<p><b>Quando este tema é acionado.</b> A profecção cai na casa " + casaP + " nas idades " +
        idadesDaCasa(casaP).slice(0, 8).join(", ") + "…; e sempre que " + senhor +
        " for cronocrator por firdaria ou senhor do ano.</p>",
      calculo: dados([
        ["casas primárias", t.casas.join(", ")],
        ["casas de apoio", (t.apoio || []).join(", ") || "—"],
        ["cúspide da casa " + casaP, T.fmtLonNome(MAPA.casas.cusps[casaP - 1])],
        ["senhor", senhor + " · essencial " + (cs.essencial.pontos > 0 ? "+" : "") + cs.essencial.pontos +
          " · acidental " + (cs.acidental.pontos > 0 ? "+" : "") + cs.acidental.pontos],
        ["soma da condição", (forca > 0 ? "+" : "") + forca + " → " + veredito]
      ])
    });
  }
  function idadesDaCasa(casa) {
    var out = [];
    for (var a = 0; a < 96; a++) if ((a % 12) + 1 === casa) out.push(a);
    return out;
  }

  /* ============================================================
     SAÚDE · correspondências (item 13)
     ============================================================ */
  function telaSaude() {
    var s = P.saude();
    var h = ['<h2>Correspondências de saúde</h2><p class="sub">Vocabulário médico da tradição — ' +
      "signo por região, planeta por função, humor por regime.</p>"];
    h.push('<div class="aviso">' + esc(s.aviso) + "</div>");

    h.push(rot("Compleição"));
    h.push(bloco({
      titulo: "Temperamento " + s.temperamento.principal, glifo: K.TEMP_GLIFO[s.temperamento.principal],
      certeza: "derivado",
      pos: s.temperamento.eixoCalor.rot + ", " + s.temperamento.eixoUmidade.rot,
      conclusao: "<p><b>Excesso característico.</b> " + esc(s.excesso) + "</p>" +
        "<p><b>Regime que a tradição prescrevia.</b> " + esc(s.regime) + "</p>",
      porque: "<p>Na medicina galênica o corpo é uma mistura de quatro qualidades. O desequilíbrio " +
        "não é doença: é a inclinação que, sob pressão, se manifesta primeiro. O regime clássico " +
        "sempre opõe o contrário ao excesso.</p>"
    }));

    h.push(rot("Regente da casa 6"));
    h.push(bloco({
      titulo: s.regente6.planeta + " rege a casa da desregulação",
      glifo: T.GLIFO[s.regente6.planeta], certeza: "tradicional",
      pos: s.regente6.signo + " · casa " + s.regente6.casa + " · essencial " +
        (s.regente6.essencial > 0 ? "+" : "") + s.regente6.essencial,
      conclusao: "<p>A casa 6 era, para Lilly, a das doenças e suas causas. O seu regente diz por " +
        "que porta a desregulação entra, e a condição dele, com que facilidade.</p>"
    }));

    h.push(rot("Significadores em condição difícil"));
    if (!s.aflicoes.length) h.push('<p class="vazio">Nenhum significador de corpo ou vitalidade em condição adversa.</p>');
    s.aflicoes.forEach(function (a) {
      h.push(bloco({
        titulo: a.planeta + " — " + a.papel, glifo: T.GLIFO[a.planeta], certeza: "tradicional",
        pos: a.motivos.join(", "),
        conclusao: "<p>Função associada: " + esc(a.funcao) + ". Região do corpo pelo signo: " +
          esc(a.regiao) + ".</p>",
        porque: '<p class="nota">Condição adversa, na tradição, significa que o significador age sem ' +
          "apoio do lugar — não que exista doença. Registrar não é diagnosticar.</p>"
      }));
    });

    h.push(rot("Correspondências do mapa"));
    h.push('<div class="rolagem"><table class="grade"><tr><th>ponto</th><th>signo</th>' +
      "<th>região do corpo</th><th>função</th></tr>" +
      s.regioes.map(function (r) {
        return "<tr><td class='rot'>" + gl(T.GLIFO[r.ponto] || "") + " " + esc(r.ponto) + "</td><td>" +
          esc(r.signo) + "</td><td>" + esc(r.regiao) + "</td><td>" + esc(r.funcao || "—") + "</td></tr>";
      }).join("") + "</table></div>");
    h.push('<p class="nota">Fonte: melotesia clássica (signo → parte do corpo, da cabeça aos pés) ' +
      "e a atribuição planetária de funções em Culpeper. Correspondência simbólica, não fisiologia.</p>");
    return h.join("");
  }

  /* ============================================================
     GUIA · o didático
     ============================================================ */
  function telaGuia() {
    var ordem = [["planetas", "☉"], ["signos", "♈"], ["casas", "⌂"],
                 ["aspectos", "☌"], ["estrelas", "✧"], ["regencia", "♛"]];
    var h = ['<h2>Guia</h2><p class="sub">A peça e seus elementos. Cada planeta e cada casa em ' +
      "duas leituras: a objetiva, que a tradição endossa, e a subjetiva, moderna. Os signos, pela " +
      "narrativa solar das estações. Tudo editável, e imagens podem ser indexadas por URL.</p>"];
    h.push('<div class="grade2">' + ordem.map(function (o) {
      var c = K.GUIA[o[0]];
      return '<button class="bloco" style="text-align:left;width:100%" data-carta="' + o[0] + '">' +
        '<div class="bloco-h"><span class="gl">' + o[1] + VS + "</span><h3>" + esc(c.t) +
        '<span class="pos">' + esc(c.sub) + "</span></h3></div>" +
        '<div class="conclusao">' + esc(c.intro.split(". ")[0]) +
        '. <b style="color:var(--laranja)">abrir →</b></div></button>';
    }).join("") + "</div>");
    return h.join("");
  }
  function montarSignos() {
    K.GUIA.signos.itens = T.SIGNOS.map(function (nome, i) {
      var barb = K.SIGNO_CICLO[i] ? " No Manual Prático, Barbault: “" + K.SIGNO_CICLO[i] + "”" : "";
      var meta = cap(T.ELEMENTO[i % 4]) + " " + T.MODO[i % 3] + ", regido por " + T.REGENTE[nome] + ".";
      return [T.GLIFO_SIGNO[i], nome, cap(K.ESTACOES[i]) + ". " + meta + barb];
    });
  }
  function cartaGuia(k) {
    montarSignos();
    var c = K.GUIA[k]; if (!c) return "";
    var corpo = c.itens.map(function (it, i) {
      var chave = "guia-" + k + "-" + i;
      if (c.dupla) return bloco({
        titulo: it[1], glifo: it[0], plano: true,
        conclusao: camada("leitura objetiva · tradição", texto(chave + "-obj", it[2])) +
          camada("leitura subjetiva · moderna", texto(chave + "-sub", it[3]))
      });
      return bloco({ titulo: it[1], glifo: it[0], plano: true, conclusao: texto(chave, it[2]) });
    }).join("");
    return "<h3>" + esc(c.t) + '</h3><p class="sub" style="margin-bottom:.9rem">' + esc(c.intro) + "</p>" + corpo;
  }

  window.__telas = {
    telaTecnica: telaTecnica, telaPerfil: telaPerfil, telaPromessas: telaPromessas,
    telaSaude: telaSaude, telaGuia: telaGuia, cartaGuia: cartaGuia,
    eixosCorpo: eixosCorpo, eletivaCorpo: eletivaCorpo, cardTema: cardTema,
    tecnica: {
      cronocratores: tecCronocratores, revolucao: tecRevolucao, cronologia: tecCronologia,
      transitos: tecTransitos, semana: tecSemana, eletiva: tecEletiva
    },
    estado: {
      get subTecnica() { return subTecnica; }, set subTecnica(v) { subTecnica = v; },
      get famSel() { return famSel; }, set famSel(v) { famSel = v; },
      get eletivaTema() { return eletivaTema; }, set eletivaTema(v) { eletivaTema = v; },
      semanaMove: function (n) {
        if (!semanaIni) semanaIni = inicioSemana(new Date());
        var d = new Date(semanaIni); d.setUTCDate(d.getUTCDate() + n * 7); semanaIni = d;
      }
    }
  };
})();
