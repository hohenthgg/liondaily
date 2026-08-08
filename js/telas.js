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
                ["preditivas", "Preditivas"], ["cronologia", "Cronologia"],
                ["transitos", "Trânsitos"], ["semana", "Semana"], ["eletiva", "Eletiva"]];
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

  /* ============================================================
     PREDITIVAS · direções primárias e progressões secundárias

     A camada que faltava: firdaria e profecção dizem QUEM governa o
     período; direções e progressões dizem QUANDO uma promessa natal
     encontra o seu momento de definição. Nada aqui é acontecimento —
     é o encontro datado entre uma promessa e um arco.
     ============================================================ */
  var pvVista = "periodos", pvChave = "naibod", pvSentido = "ambas", pvCache = {};

  function pvSel(tipo) {
    var V = window.Preditivas;
    var ck = tipo + "|" + pvChave + "|" + pvSentido;
    if (pvCache[ck]) return pvCache[ck];
    return (pvCache[ck] = V.selecionar({
      tipo: tipo, chave: pvChave, sentido: pvSentido, comTransito: false
    }));
  }
  function tecPreditivas() {
    var vistas = [["periodos", "Períodos"], ["direcoes", "Direções primárias"],
                  ["progressoes", "Progressões secundárias"]];
    return '<p class="nota">Duas técnicas de movimento: a <b>direção primária</b> leva o céu natal ' +
      "pelo movimento diurno, um grau de ascensão reta por ano de vida; a <b>progressão secundária</b> " +
      "avança o céu um dia por ano. Nenhuma das duas prevê acontecimento. Ambas datam o encontro entre " +
      "uma promessa do mapa e um arco de tempo — e um contato que não cumpre promessa fica registrado " +
      "como contato, não como período.</p>" +
      '<div class="chips" id="chips-pv">' + vistas.map(function (v) {
        return '<button class="chip" data-pv="' + v[0] + '" aria-pressed="' + (v[0] === pvVista) + '">' +
          v[1] + "</button>";
      }).join("") + "</div>" +
      (pvVista === "direcoes"
        ? '<div class="chips" id="chips-pvopt">' +
          [["chave", "naibod", "Naibod"], ["chave", "ptolomeu", "Ptolomeu"]].map(function (o) {
            return '<button class="chip" data-opt="chave" data-val="' + o[1] + '" aria-pressed="' +
              (pvChave === o[1]) + '">' + o[2] + "</button>";
          }).join("") +
          [["ambas", "direta e conversa"], ["direta", "só direta"], ["conversa", "só conversa"]].map(function (o) {
            return '<button class="chip" data-opt="sentido" data-val="' + o[0] + '" aria-pressed="' +
              (pvSentido === o[0]) + '">' + o[1] + "</button>";
          }).join("") + "</div>"
        : "") +
      '<div id="pv-corpo"><p class="carregando">calculando arcos…</p></div>';
  }

  var PV_NIVEL = { alta: ["ativo", "alta"], "média": ["barro", "média"], contextual: ["", "contextual"] };
  function pvEstadoTag(e) {
    return e === "ativo" ? ["em curso · margem ±6 meses", "ativo"]
      : e === "proximo" ? ["à frente", "barro"] : ["passado", ""];
  }

  function pvCorpo() {
    var V = window.Preditivas;
    if (pvVista === "periodos") return pvPeriodos();
    var tipo = pvVista === "direcoes" ? "direcao" : "progressao";
    var sel = pvSel(tipo);
    var h = [];
    h.push(pvMetodoBloco(tipo, sel));
    h.push(rot(pvVista === "direcoes"
      ? "Arcos em torno da idade atual" : "Progressões em torno da idade atual"));
    if (!sel.lista.length) h.push('<p class="vazio">Nenhum contato na janela.</p>');
    sel.lista.forEach(function (it) { h.push(pvItemBloco(it)); });
    return h.join("");
  }

  function pvMetodoBloco(tipo, sel) {
    var V = window.Preditivas;
    if (tipo === "direcao") {
      var k = V.CHAVES[pvChave];
      return bloco({
        titulo: "Método: Placidus sob o polo do significador", glifo: "∠", certeza: "tradicional",
        pos: "chave de " + k.rot + " · " + (pvSentido === "ambas" ? "direta e conversa" : "só " + pvSentido) +
          " · " + sel.total + " arcos calculados",
        conclusao: "<p>O significador recebe um polo próprio — <span class='mono'>tan(polo) = tan(φ) · MD/SA</span> — " +
          "e os dois pontos são reduzidos à ascensão oblíqua sob esse polo. O arco é a diferença entre elas.</p>",
        porque: "<p><b>Direta e conversa são séries independentes</b>, não o mesmo arco com o sinal trocado. " +
          "Na direta, o promissor é levado pelo movimento primário até o lugar do significador. Na conversa, " +
          "o significador recua contra o movimento primário até o lugar do promissor.</p>" +
          "<p><b>Papéis.</b> O significador é o <i>campo atingido</i>; o promissor é a <i>natureza da ativação</i>. " +
          "Trocar os dois é o erro mais comum na leitura.</p>" +
          "<p><b>Chave.</b> " + esc(k.nota) + ". A escolha da chave muda a data, nunca a geometria: " +
          "o mesmo arco vale " + (1 / V.CHAVES.naibod.v).toFixed(4) + " anos por Naibod e 1 por Ptolomeu.</p>" +
          '<div class="aviso" style="margin-top:.6rem">Direções a Ascendente e Meio-do-Céu dependem do ' +
          "horário exato do nascimento: quatro minutos de erro deslocam o ângulo cerca de 1°, ou seja, " +
          "cerca de um ano de vida. Os contatos a planetas são muito menos sensíveis.</div>",
        calculo: dados([
          ["obliquidade natal", '<span class="num">' + V.QUADRO.eps.toFixed(5) + "°</span>"],
          ["RAMC natal", '<span class="num">' + V.QUADRO.ramc.toFixed(4) + "°</span>"],
          ["latitude geográfica", '<span class="num">' + V.QUADRO.phi.toFixed(4) + "°</span>"],
          ["chave", k.rot + " — " + k.v + "° de ascensão reta por ano"],
          ["significadores", "Ascendente, Meio-do-Céu e os sete clássicos"],
          ["promissores", "os sete clássicos e os seus pontos de ☌ ⚹ □ △ ☍, dos dois lados"],
          ["janela apresentada", "10 anos em torno da idade atual"]
        ])
      });
    }
    return bloco({
      titulo: "Método: progressão secundária, um dia por ano", glifo: "◑", certeza: "tradicional",
      pos: sel.total + " eventos na janela calculada",
      conclusao: "<p>O céu de um dia depois do nascimento vale um ano de vida. Movem-se a Lua, o Sol, " +
        "Mercúrio, Vênus e Marte; os ângulos avançam pelo arco solar em longitude aplicado ao Meio-do-Céu natal.</p>",
      porque: "<p>São registrados quatro tipos de evento, cada um resolvido pela raiz real da função, " +
        "não por aproximação de tabela: <b>ingresso de signo</b>, <b>ingresso de casa</b> pela cúspide, " +
        "<b>estação</b> (raiz da velocidade) e <b>aspecto exato</b> a ponto natal. " +
        "Somam-se as <b>lunações progredidas</b> — a Lua Nova e a Lua Cheia do ciclo de cerca de 29 anos e meio.</p>" +
        "<p>A Lua progredida anda cerca de 13° por ano de vida e é o móvel rápido; o Sol e os ângulos " +
        "andam cerca de 1° por ano e marcam as viradas longas.</p>",
      calculo: dados([
        ["chave", "1 dia após o nascimento = 1 ano de vida"],
        ["móveis", "Lua, Sol, Mercúrio, Vênus, Marte, Ascendente e MC progredidos"],
        ["ângulos", "arco solar em longitude somado ao MC natal; o Ascendente vem do novo RAMC"],
        ["passo de amostragem", "0,08 ano (≈ 29 dias); raiz por interpolação e correção de Newton"],
        ["janela apresentada", "de 8 anos atrás a 12 anos à frente"]
      ])
    });
  }

  function pvItemBloco(it) {
    var V = window.Preditivas;
    var L = V.leitura(it);
    var niv = PV_NIVEL[it.nivel] || ["", it.nivel];
    var est = pvEstadoTag(it.estado);
    var P = it.env.papeis;
    var prom = it.promessa;
    var etiquetas = [[niv[1], niv[0]], est,
      prom ? ["promessa: " + prom.pr.planeta + " " + prom.pr.estado, prom.forte ? "bom" : "barro"]
           : ["sem promessa correspondente", "mau"]];
    it.conf.forEach(function (c) { etiquetas.push([c.camada + " · " + c.via, c.via === "planeta" ? "ativo" : ""]); });

    var janela = "";
    if (it.tipo === "progressao" && it.classe === "casa") {
      var j = V.janelaNaCasa(it.movel, it.casaNova, it.anos);
      janela = "<p><b>Permanência.</b> " + esc(MOVEIS_TXT(it.movel)) + " fica na casa " + it.casaNova +
        " de " + U.fCurta(j.ini) + " a " + U.fCurta(j.fim) + " — " + j.anos.toFixed(1) + " anos.</p>";
    }

    return bloco({
      titulo: V.tituloDe(it),
      glifo: it.tipo === "direcao" ? (T.GLIFO[it.prom.planeta] || "∠")
        : (T.GLIFO[it.movel.replace("P", "")] || "◑"),
      ativo: it.estado === "ativo",
      certeza: prom ? "derivado" : "tradicional",
      pos: U.fCurta(it.data) + " · " + V.idadeTxt(it.anos) + " · " + U.daqui(it.data),
      conclusao: "<p>" + esc(L[1][1]) + "</p>" +
        "<p><b>Campo atingido:</b> " + esc(L[2][1]) + ".</p>" + janela,
      tags: etiquetas,
      porque: L.slice(3).map(function (par) {
        return "<p><b>" + esc(par[0]) + ".</b> " + esc(par[1]) + "</p>";
      }).join("") +
        (it.conf.length
          ? "<p><b>Confirmações na data de perfeição.</b> " +
            it.conf.map(function (c) { return c.camada + " (" + c.via + "): " + c.txt; }).join("; ") + ".</p>"
          : '<p class="nota">Nenhuma outra camada de tempo aponta para os mesmos planetas ou casas nesta data. ' +
            "Contato isolado pesa menos.</p>") +
        (it.estr.motivos.length
          ? "<p><b>Razões estruturais.</b> " + cap(it.estr.motivos.join("; ")) + ".</p>" : "") +
        "<p><b>Por que este nível.</b> " + pvPorqueNivel(it) + "</p>",
      calculo: pvCalculo(it)
    });
  }
  function MOVEIS_TXT(m) { return window.Preditivas.MOVEIS[m] || m; }

  function pvPorqueNivel(it) {
    var prom = it.promessa, conf = it.conf;
    var confPl = conf.filter(function (c) { return c.via === "planeta"; }).length;
    if (it.nivel === "alta")
      return "alta porque há promessa natal ligada pelo planeta" +
        (prom && prom.forte ? " em condição forte" : "") +
        (confPl ? " e " + (confPl === 1 ? "uma confirmação" : confPl + " confirmações") +
          " por planeta em outra camada" : "") +
        (it.estr.alvoVital && it.estr.duro ? ", com conjunção ou oposição a ponto vital" : "") + ".";
    if (it.nivel === "média")
      return "média porque " + (prom && prom.porPlaneta
        ? "há promessa ligada pelo planeta, mas as confirmações não bastam para o nível alto"
        : "o contato é estrutural (aspecto duro ou ponto vital) com ao menos uma confirmação, sem promessa por planeta") + ".";
    return "contextual porque não há promessa natal ligada pelo planeta nem confirmação suficiente. " +
      "Fica registrado como pano de fundo, não como período.";
  }

  function pvCalculo(it) {
    var V = window.Preditivas;
    if (it.tipo === "direcao") {
      var k = V.CHAVES[it.chaveArco];
      return dados([
        ["arco de direção", '<span class="num">' + it.arco.toFixed(4) + "°</span>"],
        ["chave", k.rot + " (" + k.v + "°/ano)"],
        ["tempo", '<span class="num">' + it.anos.toFixed(4) + "</span> anos → " + U.fCurta(it.data)],
        ["sentido", it.sentido],
        ["significador", it.sig.nome + " · " + T.fmtLonNome(it.sig.lon) +
          " · AR " + it.sig.ra.toFixed(3) + "° · dec " + it.sig.dec.toFixed(3) + "°"],
        ["promissor", it.prom.planeta + (it.prom.A ? " · ponto de " + it.prom.aspecto : " · corpo") +
          " · " + T.fmtLonNome(it.prom.lon) + " · AR " + it.prom.ra.toFixed(3) + "° · dec " + it.prom.dec.toFixed(3) + "°"],
        ["polo do significador", it.polo == null ? "—" : '<span class="num">' + it.polo.toFixed(4) + "°</span>"],
        ["ascensão oblíqua do significador", it.oaS == null ? "—" : '<span class="num">' + it.oaS.toFixed(4) + "°</span>"],
        ["ascensão oblíqua do promissor", it.oaP == null ? "—" : '<span class="num">' + it.oaP.toFixed(4) + "°</span>"],
        ["distância zodiacal", '<span class="num">' + Math.abs(S.delta(it.sig.lon, it.prom.lon)).toFixed(3) +
          "°</span> <span class=\"nota\">(não é o arco: a direção é em mundo, não em zodíaco)</span>"]
      ]);
    }
    var am = V.amostra(it.anos);
    return dados([
      ["idade da perfeição", '<span class="num">' + it.anos.toFixed(4) + "</span> anos"],
      ["data equivalente no céu", U.fCurta(V.dataProgredida(it.anos)) +
        " <span class=\"nota\">(o dia real cujo céu vale este ano)</span>"],
      ["data na vida", U.fCurta(it.data)],
      ["móvel", V.MOVEIS[it.movel]],
      ["longitude do móvel", T.fmtLonNome(am.lon[it.movel])],
      ["arco solar acumulado", '<span class="num">' + am.arcoSolar.toFixed(4) + "°</span>"],
      it.cusp != null ? ["cúspide cruzada", T.fmtLonNome(it.cusp)] : null,
      ["classe", it.classe]
    ].filter(Boolean));
  }

  function pvPeriodos() {
    var V = window.Preditivas;
    var dir = pvSel("direcao"), prog = pvSel("progressao");
    var todos = dir.periodos.concat(prog.periodos)
      .filter(function (P) { return P.nivel !== "contextual"; })
      .sort(function (a, b) { return a.de - b.de; });
    var idade = dir.idade;
    var h = [];

    h.push(bloco({
      titulo: "Como os períodos são formados", glifo: "⚙", plano: true, certeza: "heuristico",
      conclusao: "<p>Um contato isolado não é um período. Quando dois ou mais contatos vizinhos no tempo " +
        "servem à <b>mesma promessa natal</b> ou envolvem o <b>mesmo planeta</b>, deixam de ser eventos " +
        "soltos e passam a ter começo e fim.</p>",
      porque: "<p><b>A regra de agrupamento.</b> Janela de 2,5 anos para direções e 1,5 para progressões; " +
        "os contatos entram no mesmo grupo se compartilham a promessa ou um planeta.</p>" +
        "<p><b>A força</b> soma o nível de cada contato (alta 3, média 2, contextual 1), mais o número " +
        "de contatos e mais dois pontos quando um planeta se repete. É contagem, não medida — está aberta " +
        "aqui para poder ser refeita.</p>" +
        "<p><b>O que fica de fora.</b> Períodos cujos contatos são todos contextuais: sem promessa e sem " +
        "confirmação de outra camada, não há o que datar.</p>"
    }));

    h.push(rot("Promessas natais em jogo"));
    C.promessasNatais().forEach(function (pr) {
      var ativos = todos.filter(function (P) {
        return P.promessa && P.promessa.pr.id === pr.id;
      }).length;
      h.push(bloco({
        titulo: pr.titulo, glifo: T.GLIFO[pr.planeta], certeza: "derivado",
        pos: pr.planeta + " rege a casa " + pr.rege.join(" e a casa ") + " · ocupa a casa " + pr.ocupa +
          " · " + pr.estado,
        conclusao: "<p>" + esc(pr.enunciado) + "</p><p>" + esc(pr.entrega) + "</p>",
        tags: [[pr.estado, pr.estado === "forte" ? "bom" : pr.estado === "condicional" ? "mau" : "barro"],
               pr.tema ? ["tema: " + pr.tema.nome, "barro"] : null,
               ativos ? [ativos + " período(s) na janela", "ativo"] : null],
        porque: "<p><b>Testemunhos convergentes.</b></p><div class='dados'>" +
          pr.testemunhos.map(function (t) {
            return "<div><span class='k'>" + esc(t.tipo) + "</span><span class='v'>" + esc(t.txt) + "</span></div>";
          }).join("") + "</div>" +
          "<p class='nota'>Uma promessa só é registrada com dois ou mais testemunhos. Um planeta que " +
          "apenas rege uma casa e ocupa outra, sem mais nada, é coincidência de tabela — não promessa.</p>"
      }));
    });

    h.push(rot("Períodos datados"));
    if (!todos.length) h.push('<p class="vazio">Nenhum período com promessa e confirmação na janela.</p>');
    h.push('<div class="crono">' + todos.map(function (P) {
      var atual = idade >= P.de - 0.5 && idade <= P.ate + 0.5;
      var passado = P.ate < idade;
      var tipo = P.grupo[0].tipo === "direcao" ? "direções" : "progressões";
      return '<div class="crono-ev' + (atual ? " agora" : "") + '" data-nivel="' +
        (P.nivel === "alta" ? "primário" : "secundário") + '"' +
        (passado ? ' style="opacity:.5"' : "") + ">" +
        '<div class="quando">' + U.fCurta(P.dataDe) +
        (P.de !== P.ate ? " → " + U.fCurta(P.dataAte) : "") +
        " · " + V.idadeTxt(P.de) + (P.de !== P.ate ? " a " + V.idadeTxt(P.ate) : "") + "</div>" +
        '<div class="tit">' + gl(T.GLIFO[P.dominante] || "") + " " +
        esc(pvNomePeriodo(P)) + "</div>" +
        '<div class="det">' + (P.grupo.length === 1 ? "um contato" : P.grupo.length + " contatos") +
        " por " + tipo +
        (P.promessa ? " · promessa de " + P.promessa.pr.planeta + " (" + P.promessa.pr.estado + ")"
                    : " · sem promessa ligada pelo planeta") +
        " · nível " + P.nivel + "</div>" +
        (P.grupo.length > 1
          ? '<div class="det" style="color:var(--creme-3);font-size:.78rem">' +
            P.grupo.map(function (g) { return esc(V.tituloDe(g)); }).join(" · ") + "</div>"
          : "") +
        "</div>";
    }).join("") + "</div>");
    return h.join("");
  }
  /* Um contato sozinho não é convergência — chamá-lo assim inflaria o dado.
     Só há período quando dois ou mais contatos se encontram. */
  function pvNomePeriodo(P) {
    if (P.grupo.length < 2) return window.Preditivas.tituloDe(P.grupo[0]);
    var casas = P.casasTop.length
      ? P.casasTop.map(function (h) { return K.CASA_CURTO[h]; }).join(", ")
      : "assuntos gerais";
    return "Convergência de " + P.dominante + " — " + casas;
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
      transitos: tecTransitos, semana: tecSemana, eletiva: tecEletiva,
      preditivas: tecPreditivas
    },
    pvCorpo: pvCorpo,
    estado: {
      get subTecnica() { return subTecnica; }, set subTecnica(v) { subTecnica = v; },
      get famSel() { return famSel; }, set famSel(v) { famSel = v; },
      get eletivaTema() { return eletivaTema; }, set eletivaTema(v) { eletivaTema = v; },
      get pvVista() { return pvVista; }, set pvVista(v) { pvVista = v; },
      get pvChave() { return pvChave; }, set pvChave(v) { pvChave = v; },
      get pvSentido() { return pvSentido; }, set pvSentido(v) { pvSentido = v; },
      semanaMove: function (n) {
        if (!semanaIni) semanaIni = inicioSemana(new Date());
        var d = new Date(semanaIni); d.setUTCDate(d.getUTCDate() + n * 7); semanaIni = d;
      }
    }
  };
})();
