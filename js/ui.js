/* ============================================================
   LIONS DAILY · interface
   Dois modos que não se misturam:
     HOJE — guia diário. Sintetiza. Responde "o que importa agora".
     MAPA — consulta natal. Aprofunda. Responde "por que isso está aí".
   Toda leitura tem três níveis: conclusão / por quê / cálculo.
   Toda afirmação carrega um selo de certeza.
   ============================================================ */
(function () {
  "use strict";
  var S = window.Astro, T = window.Trad, K = window.Corpus, C = window.Chrono, P = window.Perfil;
  var MAPA = C.MAPA;

  /* ---------------- utilidades ---------------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(t) { return String(t == null ? "" : t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function escAttr(t) { return esc(t).replace(/"/g, "&quot;").replace(/'/g, "&#39;"); }
  var VS = "︎";                                  /* força glifo de texto, nunca emoji */
  function gl(g) { return '<span class="gl">' + esc(g) + VS + "</span>"; }
  function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

  var MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho",
               "agosto", "setembro", "outubro", "novembro", "dezembro"];
  var MES3 = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  var DIAS = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];
  var DIA3 = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];

  function dt(d) { return d instanceof Date ? d : new Date(d); }
  function fData(d) { d = dt(d); return d.getDate() + " de " + MESES[d.getMonth()] + " de " + d.getFullYear(); }
  function fCurta(d) { d = dt(d); return d.getDate() + " " + MES3[d.getMonth()] + " " + d.getFullYear(); }
  function fHora(d) { d = dt(d); return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0"); }
  function fDataHora(d) { return fCurta(d) + ", " + fHora(d); }
  function daqui(d) {
    var ms = dt(d) - new Date(), s = ms < 0 ? "há " : "em ";
    var a = Math.abs(ms) / 86400000;
    if (a < 1 / 24) return s + Math.max(1, Math.round(Math.abs(ms) / 60000)) + " min";
    if (a < 1) return s + Math.round(Math.abs(ms) / 3600000) + " h";
    if (a < 45) return s + Math.round(a) + " dias";
    if (a < 365) return s + Math.round(a / 30.44) + " meses";
    return s + (a / 365.2425).toFixed(1).replace(".", ",") + " anos";
  }

  /* ---------------- notas editáveis + GitHub ---------------- */
  var GH_REPO = "hohenthgg/liondaily", TK = "lions-gh-token", LS = "lions-notas";
  var NOTAS = {}, salvarT = null, shaNotas = null;
  try { NOTAS = JSON.parse(localStorage.getItem(LS) || "{}"); } catch (e) { NOTAS = {}; }
  function token() { try { return localStorage.getItem(TK) || ""; } catch (e) { return ""; } }
  function sync(msg, cls) { var e = $("#sync"); if (e) { e.textContent = msg; e.className = cls || ""; } }

  function carregarNotas() {
    return fetch("notes.json?" + Date.now()).then(function (r) { return r.ok ? r.json() : {}; })
      .then(function (j) {
        if (j && typeof j === "object") {
          Object.keys(j).forEach(function (k) { NOTAS[k] = j[k]; });
          try { localStorage.setItem(LS, JSON.stringify(NOTAS)); } catch (e) { }
        }
      }).catch(function () { });
  }
  function guardarNotas() {
    try { localStorage.setItem(LS, JSON.stringify(NOTAS)); } catch (e) { }
    clearTimeout(salvarT);
    salvarT = setTimeout(enviarNotas, 1200);
  }
  function enviarNotas() {
    var tk = token();
    if (!tk) { sync("edições só neste aparelho", ""); return; }
    sync("gravando…", "indo");
    var url = "https://api.github.com/repos/" + GH_REPO + "/contents/notes.json";
    var h = { Authorization: "Bearer " + tk, Accept: "application/vnd.github+json" };
    fetch(url, { headers: h }).then(function (r) { return r.ok ? r.json() : null; })
      .then(function (meta) {
        var corpo = {
          message: "Atualiza notas do Lions Daily",
          content: btoa(unescape(encodeURIComponent(JSON.stringify(NOTAS, null, 1))))
        };
        if (meta && meta.sha) corpo.sha = meta.sha;
        return fetch(url, { method: "PUT", headers: h, body: JSON.stringify(corpo) });
      })
      .then(function (r) { sync(r && r.ok ? "gravado no GitHub" : "falha ao gravar", r && r.ok ? "ok" : "erro"); })
      .catch(function () { sync("sem rede", "erro"); });
  }
  /* URLs de imagem viram <img> — é assim que se indexa a simbólica */
  function rico(t) {
    return esc(t).split(/\n{2,}/).map(function (par) {
      var p = par.replace(/(https?:\/\/\S+\.(?:png|jpe?g|gif|webp|svg))(\S*)/gi,
        function (_, u) { return '<img src="' + escAttr(u) + '" alt="" loading="lazy">'; })
        .replace(/\n/g, "<br>");
      return "<p>" + p + "</p>";
    }).join("");
  }
  function texto(chave, padrao) {
    var v = NOTAS[chave] != null ? NOTAS[chave] : padrao;
    return '<div class="texto" data-nota="' + escAttr(chave) + '" data-raw="' + escAttr(v) + '">' + rico(v) + "</div>";
  }

  /* ---------------- componentes ---------------- */
  function selo(c) {
    var m = C.CERTEZA[c]; if (!m) return "";
    return '<span class="selo ' + c + '" title="' + escAttr(m.desc) + '">' + m.rot + "</span>";
  }
  /* nível 2 e 3 da divulgação progressiva */
  function camada(rot, html) {
    if (!html) return "";
    return '<details class="camada"><summary>' + esc(rot) + '</summary><div class="corpo">' + html + "</div></details>";
  }
  function tags(lista) {
    var t = (lista || []).filter(Boolean);
    if (!t.length) return "";
    return '<div class="tags">' + t.map(function (x) {
      var txt = Array.isArray(x) ? x[0] : x, cls = Array.isArray(x) ? (x[1] || "") : "";
      return '<span class="tag ' + cls + '">' + esc(txt) + "</span>";
    }).join("") + "</div>";
  }
  function dados(pares) {
    return '<div class="dados">' + pares.filter(Boolean).map(function (p) {
      return '<div><span class="k">' + esc(p[0]) + '</span><span class="v">' + p[1] + "</span></div>";
    }).join("") + "</div>";
  }
  /* o bloco padrão: conclusão + camadas + menu ••• */
  function bloco(o) {
    return '<article class="bloco' + (o.ativo ? " ativo" : "") + (o.plano ? " plano" : "") + '"' +
      (o.id ? ' id="' + escAttr(o.id) + '"' : "") + ' data-copia="1">' +
      '<button class="mais" aria-label="Mais">⋯</button>' +
      '<div class="bloco-h">' +
      (o.glifo ? '<span class="gl">' + esc(o.glifo) + VS + "</span>" : "") +
      "<h3>" + esc(o.titulo) + (o.pos ? '<span class="pos">' + esc(o.pos) + "</span>" : "") +
      (o.certeza ? " " + selo(o.certeza) : "") + "</h3></div>" +
      (o.conclusao ? '<div class="conclusao">' + o.conclusao + "</div>" : "") +
      (o.tags ? tags(o.tags) : "") +
      (o.corpo || "") +
      camada(o.rotPorque || "por quê", o.porque) +
      camada(o.rotCalculo || "cálculo", o.calculo) +
      (o.extra || "") + "</article>";
  }
  function rot(t) { return '<div class="rot-secao">' + esc(t) + "</div>"; }

  /* escala qualitativa de 5 casas — substitui as barras de porcentagem */
  function escala(esq, dir, grau, lado, forte) {
    var n = 5, meio = 2, cheias = [];
    for (var i = 0; i < n; i++) {
      var on = false;
      if (grau > 0 && lado) {
        if (lado === "esq") on = i < meio && (meio - i) <= grau;
        else on = i > meio && (i - meio) <= grau;
      }
      if (i === meio) on = true;
      cheias.push('<i class="' + (on ? "on" + (forte ? " forte" : "") : "") + '"></i>');
    }
    return '<div class="escala"><div class="escala-r"><span>' + esc(esq) + "</span><span>" +
      esc(dir) + '</span></div><div class="escala-t">' + cheias.join("") + "</div></div>";
  }

  /* ============================================================
     TELA HOJE · o guia diário (item 1)
     ============================================================ */
  function telaHoje() {
    var agora = new Date();
    var b = C.briefing(agora);
    var cam = b.camadas, h = [];
    var hp = cam.hoje.hora, fase = cam.hoje.fase, lua = cam.hoje.lua;

    /* --- faixa HOJE --- */
    var luaLon = S.lon("Lua", agora), solLon = S.lon("Sol", agora);
    var tz = (Intl.DateTimeFormat().resolvedOptions().timeZone || "hora local");
    h.push('<div class="brief-topo">' +
      '<div class="brief-data"><span class="dia">' + cap(DIAS[agora.getDay()]) + ", " + fData(agora) + "</span>" +
      '<span class="lugar">' + esc(C.localAtual().nome) +
      (C.localAtual().herdado ? " · local natal, ainda não definido" : "") +
      " · horas em " + esc(tz) + "</span></div>" +
      '<div class="brief-linha">' +
      cel("hora planetária", hp ? gl(T.GLIFO[hp.regente]) + " " + hp.regente : "—",
          hp ? "até " + fHora(hp.fim) : "") +
      cel("dia de", hp ? gl(T.GLIFO[hp.regenteDia]) + " " + hp.regenteDia : "—",
          hp ? (hp.diurno ? "desde o nascer do Sol" : "noite deste dia planetário") : "") +
      cel("Lua", gl(T.GLIFO_SIGNO[T.signoDe(luaLon)]) + " " + T.SIGNOS[T.signoDe(luaLon)],
          fase.ilum + "% iluminada") +
      cel("Sol", gl(T.GLIFO_SIGNO[T.signoDe(solLon)]) + " " + T.fmtGrau(S.norm(solLon) % 30),
          "casa natal " + C.casaDe(solLon) + " · termo de " + T.termoDe(solLon).senhor) +
      "</div></div>");

    /* --- TEMA DOMINANTE --- */
    h.push(rot("Tema dominante"));
    if (b.dominante) {
      var d = b.dominante, pl = d.planeta, cond = MAPA.condicao[pl];
      var casas = b.casasDominante;
      var origem = "No mapa natal, " + pl + " está em " + T.fmtLonNome(MAPA.ceu[pl].lon) +
        ", casa " + cond.acidental.casa + ", " +
        (cond.essencial.itens.length
          ? "com " + cond.essencial.itens.map(function (i) { return i.tipo; }).join(" e ")
          : cond.essencial.debilidades.map(function (i) { return i.tipo; }).join(" e ")) + ".";
      h.push(bloco({
        titulo: pl + " governa o período", glifo: T.GLIFO[pl], ativo: true, certeza: "derivado",
        pos: casas.length ? "senhor da casa " + casas.join(" e da casa ") : "sem casas regidas",
        conclusao: "<p>" + d.motivos.map(cap).join("; ") + ". " +
          (casas.length
            ? "Enquanto durar, os assuntos em jogo são os da <b>casa " + casas.join("</b> e da <b>casa ") +
              "</b> — " + casas.map(function (c) { return K.CASA_CURTO[c]; }).join(" e ") + "."
            : "Age por natureza própria, sem delegação de casa.") + "</p>",
        porque: '<p class="conclusao">' + origem + "</p>" +
          "<p>" + (K.NATUREZA[pl] ? K.NATUREZA[pl][1] || K.NATUREZA[pl] : "") + "</p>" +
          '<p class="nota">A hierarquia manda ler assim: o natal promete, o cronocrator autoriza, ' +
          "o trânsito dispara. Este planeta está na camada que autoriza.</p>",
        calculo: dados([
          ["camadas", d.motivos.join(" · ")],
          ["dignidade essencial", (cond.essencial.pontos > 0 ? "+" : "") + cond.essencial.pontos],
          ["condição acidental", (cond.acidental.pontos > 0 ? "+" : "") + cond.acidental.pontos],
          ["dispositor", cond.essencial.dispositor],
          ["longitude natal", T.fmtLonNome(MAPA.ceu[pl].lon)]
        ]),
        corpo: '<div class="escada">' + b.autorizados.map(function (a, i) {
          return '<div class="degrau' + (i === 0 ? " destaque" : "") + '">' +
            '<span class="r">' + esc(a.motivos[0]) + "</span>" +
            '<div class="v">' + gl(T.GLIFO[a.planeta]) + " " + esc(a.planeta) + "</div></div>";
        }).join("") + "</div>"
      }));
    }

    /* --- ARCO EM CURSO --- */
    /* Direções e progressões custam algumas centenas de milissegundos.
       Entram depois da primeira pintura, para não atrasar o briefing. */
    h.push(rot("Arco em curso"));
    h.push('<div id="brief-arco"><p class="carregando">medindo arcos…</p></div>');

    /* --- AGORA: os gatilhos --- */
    h.push(rot("Agora"));
    var gat = cam.gatilhos.slice(0, 7);
    if (!gat.length) h.push('<p class="vazio">Nenhum trânsito toca, dentro do orbe, um ponto que o mapa prometa e que o tempo autorize. Período de baixa ativação.</p>');
    gat.forEach(function (g) { h.push(gatilhoHTML(g)); });
    if (cam.ruido.length) h.push(camada("outros " + cam.ruido.length + " contatos, sem autorização de camada",
      cam.ruido.slice(0, 12).map(function (r) {
        return '<div class="dados"><div><span class="k">' + esc(r.t.transitante) + " " + r.t.glifo + " " +
          esc(r.t.natal) + '</span><span class="v">' + T.fmtGrau(r.t.orbe) + ", " +
          (r.t.aplicando ? "aplicando" : "separando") + "</span></div></div>";
      }).join("") +
      '<p class="nota">Estão no céu, mas nenhuma camada de tempo os autoriza e/ou o ponto tocado não carrega promessa. A tradição chamaria isto de testemunho sem significador.</p>'));

    /* --- A LUA COMO AGENDA --- */
    h.push(rot("A Lua até sair de " + lua.signoAtual));
    h.push(bloco({
      titulo: lua.vaziaDeCurso ? "Lua vazia de curso" : "Agenda da Lua",
      glifo: "☽", certeza: "tradicional",
      pos: "sai de " + lua.signoAtual + " para " + lua.proximoSigno + " " + daqui(lua.saiDoSigno),
      conclusao: lua.vaziaDeCurso
        ? "<p>A Lua não perfaz mais nenhum aspecto antes de mudar de signo. Lilly: <i>nada se conclui</i>. Período bom para esperar, ruim para inaugurar.</p>"
        : "<p>Antes de sair do signo, a Lua ainda perfaz " + lua.eventos.length +
          " aspecto" + (lua.eventos.length > 1 ? "s" : "") + ". A ordem é a agenda do dia: cada perfeição entrega o assunto ao planeta seguinte.</p>",
      calculo: lua.eventos.length ? '<div class="dados">' + lua.eventos.map(function (e) {
        return "<div><span class='k'>" + fHora(e.quando) + "</span><span class='v'>" +
          e.glifo + " " + esc(e.alvo) + " natal · " + esc(e.natureza) + "</span></div>";
      }).join("") + "</div>" : "",
      porque: "<p>A Lua é o significador universal do curso das coisas: mais rápida que todos, " +
        "ela leva a luz de um planeta a outro. O que ela toca hoje é o que se move hoje.</p>"
    }));

    /* --- PRÓXIMA VIRADA --- */
    h.push(rot("Próxima virada"));
    if (b.proximaVirada) {
      var v = b.proximaVirada;
      h.push(bloco({
        titulo: v.o_que, glifo: "→", ativo: true, certeza: "tradicional",
        pos: fDataHora(v.quando) + " · " + daqui(v.quando),
        conclusao: "<p>Camada <b>" + esc(v.camada) + "</b>. " + explicaCamada(v.camada) + "</p>"
      }));
    }

    /* --- PRÓXIMOS EVENTOS --- */
    h.push(rot("Próximos eventos"));
    h.push('<div class="crono">' + b.proximosEventos.map(function (e) {
      return '<div class="crono-ev" data-nivel="' +
        (e.peso >= 3 ? "primário" : e.peso >= 1 ? "secundário" : "contexto") + '">' +
        '<div class="quando">' + fDataHora(e.quando) + " · " + daqui(e.quando) + "</div>" +
        '<div class="tit">' + esc(e.o_que) + "</div>" +
        '<div class="det">' + esc(explicaCamada(e.camada)) + "</div></div>";
    }).join("") + "</div>");

    /* --- como isto foi decidido --- */
    h.push(bloco({
      titulo: "Como esta tela foi decidida", glifo: "⚙", plano: true, certeza: "heuristico",
      conclusao: "<p>A tradição fornece as camadas; a regra de prioridade entre elas é nossa. " +
        "Está escrita abaixo, por inteiro, para poder ser contestada.</p>",
      porque: "<p><b>1. Quem está autorizado.</b> Um planeta entra na conversa se governa alguma camada de tempo: " +
        "firdaria maior (peso 4), senhor do ano por profecção (4), sub-firdaria (3), regente do ascendente da " +
        "revolução (3), regente do ascendente natal (2), regente da hora planetária (1). Os pesos somam.</p>" +
        "<p><b>2. O que conta como promessa.</b> Um ponto natal só recebe trânsito relevante se for ângulo, " +
        "luminar, ou reger alguma cúspide. Sem isso não há assunto para ativar.</p>" +
        "<p><b>3. O que aparece em AGORA.</b> Trânsito com orbe abaixo de 3°, sobre ponto com promessa, " +
        "envolvendo pelo menos um planeta autorizado. Ordenado por autorização e depois por orbe.</p>" +
        "<p><b>4. Estado ou evento.</b> Duas coisas diferentes aparecem aqui e não se confundem. " +
        "<i>Estado</i> é uma configuração com duração — um planeta em tal signo, um aspecto dentro do orbe, " +
        "uma firdaria em curso: mostra-se com orbe ou com um intervalo de datas. <i>Evento</i> é um instante " +
        "— a perfeição de um aspecto, um ingresso, uma virada de camada: mostra-se com data e hora. " +
        "Um aspecto separando é o rastro de um evento que já passou; um aplicando é a véspera de um que " +
        "ainda vem, e por isso vem primeiro na lista.</p>" +
        "<p><b>O que ficou de fora de propósito:</b> qualquer nota agregada de 0 a 100, qualquer " +
        "\"clima do dia\" e qualquer previsão de acontecimento. O aplicativo diz o que está ativo e por quê; " +
        "não diz o que vai acontecer.</p>",
      calculo: dados([
        ["seita do mapa", MAPA.seita],
        ["firdaria", cam.cronocrator ? cam.cronocrator.maior.lorde + " / " + (cam.cronocrator.sub ? cam.cronocrator.sub.lorde : "—") : "—"],
        ["profecção", "casa " + cam.contexto.profeccao.casa + " (" + cam.contexto.profeccao.signo + "), senhor " + cam.contexto.profeccao.senhorDoAno],
        ["revolução vigente", cam.contexto.revolucao ? fDataHora(cam.contexto.revolucao.utc) + " · ASC " + T.fmtLonNome(cam.contexto.revolucao.casas.asc) : "—"],
        ["efemérides", "Astronomy Engine (VSOP87/ELP2000)"],
        ["casas", MAPA.casas.sistema],
        ["local dos cálculos horários", C.localAtual().nome]
      ])
    }));
    return h.join("");
  }
  /* O que direções e progressões dizem estar em curso agora.
     Fica entre o cronocrator e o gatilho na hierarquia: dura anos, não dias,
     e é a camada que responde "por que este assunto, e não outro". */
  function briefArco() {
    var V = window.Preditivas;
    if (!V) return '<p class="vazio">Camada preditiva indisponível.</p>';
    var agora = new Date();
    var itens = [];
    ["direcao", "progressao"].forEach(function (tp) {
      var sel = V.selecionar({ tipo: tp, agora: agora, comTransito: false, limite: 24 });
      sel.lista.forEach(function (it) {
        if (it.estado === "ativo" && it.nivel !== "contextual") itens.push(it);
      });
    });
    itens.sort(function (a, b) {
      var w = { alta: 0, "média": 1 };
      return (w[a.nivel] - w[b.nivel]) || (a._dist - b._dist);
    });
    if (!itens.length) return '<p class="vazio">Nenhuma direção ou progressão com promessa natal perfaz ' +
      'dentro da margem de ' + V.MARGEM_MESES + ' meses. Período sem arco definidor: o que se mover agora ' +
      'vem das camadas mais curtas.</p>';

    return itens.slice(0, 4).map(function (it) {
      var pr = it.promessa;
      var casa = it.env.papeis.significador.casa;
      return '<div class="gatilho forte">' +
        '<span class="asp">' + (it.tipo === "direcao" ? "∠" : "◑") + VS + "</span>" +
        '<div class="txt"><div class="t1"><b>' + esc(V.tituloDe(it)) + "</b></div>" +
        '<div class="t2">' +
        (it.tipo === "direcao" ? "direção primária" : "progressão secundária") + " · " +
        (pr ? "cumpre a promessa de " + pr.pr.planeta + " (" + pr.pr.estado + "), que rege " +
              window.Preditivas.casasTxt(pr.pr.rege) : "sem promessa ligada pelo planeta") +
        (casa ? " · campo: casa " + casa + ", " + esc(K.CASA_CURTO[casa]) : "") +
        (it.conf.length ? " · confirmado por " + it.conf.map(function (c) { return c.camada; }).join(" e ") : "") +
        "</div></div>" +
        '<span class="quando">perfaz<br>' + fCurta(it.data) + "</span></div>";
    }).join("") +
      camada("por que isto está aqui",
        "<p>Direções e progressões ocupam, na hierarquia, o degrau entre o cronocrator e o gatilho: " +
        "duram anos, não dias. A firdaria diz <i>quem</i> governa o período; o arco diz <i>qual promessa " +
        "natal encontra o seu momento de definição</i> dentro dele.</p>" +
        "<p>Só aparecem aqui os arcos que perfazem dentro de " + V.MARGEM_MESES + " meses da data de hoje " +
        "e que cumprem uma promessa natal. A lista completa, com o cálculo de cada arco, está em " +
        "<b>Mapa → Técnica → Preditivas</b>.</p>");
  }

  function cel(r, v, s) {
    return '<div class="brief-cel"><span class="r">' + esc(r) + '</span><span class="v">' + v + "</span>" +
      (s ? '<span class="r" style="margin:.15rem 0 0">' + esc(s) + "</span>" : "") + "</div>";
  }
  function explicaCamada(c) {
    return { natal: "a promessa — o que o mapa torna possível",
      cronocrator: "a autorização — quem governa o período",
      contexto: "o campo do ano — onde o período acontece",
      gatilho: "o disparo — o que ativa o que já estava prometido",
      hoje: "o recorte do dia — muda depressa e não decide nada sozinho" }[c] || c;
  }
  function gatilhoHTML(g) {
    var t = g.t;
    var casasNatal = MAPA.rege[t.natal] || [];
    var forte = g.nivel >= 5 || t.partil;
    return '<div class="gatilho' + (forte ? " forte" : "") + '">' +
      '<span class="asp">' + t.glifo + VS + "</span>" +
      '<div class="txt"><div class="t1">' +
      gl(T.GLIFO[t.transitante] || "") + " <b>" + esc(t.transitante) + "</b>" +
      (t.retrogrado ? ' <span class="tag mau">retrógrado</span>' : "") +
      " " + esc(t.aspecto.toLowerCase()) + " " + esc(t.natal) + " natal</div>" +
      '<div class="t2">' + T.fmtGrau(t.orbe) + ", " + (t.aplicando ? "aplicando" : "separando") +
      (casasNatal.length ? " · toca as casas " + casasNatal.join(" e ") : "") +
      (g.porQue.length ? " · " + esc(g.porQue.join("; ")) : "") + "</div></div>" +
      (t.perfeicao ? '<span class="quando">perfaz<br>' + fCurta(t.perfeicao) + "</span>"
        : '<span class="quando">' + (t.separando ? "passou" : "") + "</span>") + "</div>";
  }

  /* ============================================================
     TELA MAPA · a carta natal
     ============================================================ */
  function telaMapa() {
    var h = [];
    h.push('<h2>Mapa natal</h2><p class="sub">' + esc(C.NATIVO.dataLocal) + " · " +
      esc(C.NATIVO.lugar) + " · carta " + MAPA.seita + " · casas " + MAPA.casas.sistema + "</p>");

    h.push('<div class="chips" id="chips-mapa">' +
      [["planetas", "Planetas"], ["casas", "Casas"], ["aspectos", "Aspectos"],
       ["lotes", "Lotes"], ["estrelas", "Estrelas fixas"], ["antiscia", "Antiscia"]]
      .map(function (x, i) {
        return '<button class="chip" data-sec="' + x[0] + '" aria-pressed="' + (i === 0) + '">' + x[1] + "</button>";
      }).join("") + "</div><div id="+'"mapa-corpo"'+"></div>");
    return h.join("");
  }

  function secPlanetas() {
    var h = [];
    h.push('<p class="nota">Cada planeta abre a cadeia de significação inteira: o que é, de que é significador, ' +
      "onde está, com que força, de quem depende, com quem fala, quando manda e o que o toca agora.</p>");
    S.CLASSICOS.forEach(function (p) { h.push(cardPlaneta(p)); });
    ["Nodo Norte", "Nodo Sul"].forEach(function (p) {
      var l = MAPA.ceu[p].lon;
      h.push(bloco({
        titulo: p, glifo: T.GLIFO[p], certeza: "tradicional",
        pos: T.fmtLonNome(l) + " · casa " + C.casaDe(l),
        conclusao: "<p>Os nós não são corpos: são os pontos em que a órbita da Lua cruza a eclíptica. " +
          "Não regem casas nem recebem dignidade. O Norte amplia o que toca; o Sul dispersa.</p>"
      }));
    });
    return h.join("");
  }

  function cardPlaneta(p) {
    var pos = MAPA.ceu[p], cond = MAPA.condicao[p];
    var casa = cond.acidental.casa, sg = T.signoDe(pos.lon), signo = T.SIGNOS[sg];
    var cad = C.cadeiaDeSignificacao(p, new Date());
    var regidas = MAPA.rege[p] || [];
    var e = cad.elos;

    /* corpus interpretativo */
    var chaveOlavo = p + "-" + casa;
    var olavo = K.OLAVO[chaveOlavo];
    var bs = K.BARBAULT_SIGNO[p], bc = K.BARBAULT_CASA[p];

    var essenciais = cond.essencial.itens.concat(cond.essencial.debilidades);
    var etiquetas = essenciais.map(function (i) { return [i.tipo, i.peso > 0 ? "bom" : "mau"]; })
      .concat(cond.acidental.itens.filter(function (i) { return i.peso !== 0; })
        .map(function (i) { return [i.tipo, i.peso > 0 ? "bom" : "mau"]; }))
      .concat(regidas.map(function (c) { return ["rege a casa " + c, "barro"]; }));

    var interp = "";
    if (olavo) interp += camada("Olavo de Carvalho · " + p + " na casa " + casa,
      texto("olavo-" + chaveOlavo, olavo));
    if (bs) interp += camada("Barbault · " + p + " em " + bs[0], texto("barb-sig-" + p, bs[1]));
    if (bc) interp += camada("Barbault · " + p + " na casa " + bc[0], texto("barb-casa-" + p, bc[1]));

    return bloco({
      id: "pl-" + p,
      titulo: p + " em " + signo, glifo: T.GLIFO[p], certeza: "tradicional",
      pos: T.fmtLonNome(pos.lon) + " · casa " + casa + " · termo de " + T.termoDe(pos.lon).senhor +
        (pos.speed < 0 ? " · retrógrado" : ""),
      conclusao: "<p>" + e[1].resumo + "</p>" +
        "<p>" + (cond.essencial.itens.length
          ? "No lugar onde está tem " + cond.essencial.itens.map(function (i) { return i.tipo; }).join(" e ") +
            " — age com apoio próprio."
          : cond.essencial.debilidades.length
          ? "No lugar onde está está " + cond.essencial.debilidades.map(function (i) { return i.tipo; }).join(" e ") +
            " — depende de " + cond.essencial.dispositor + ", que o dispõe."
          : "") +
        (pn(cond).naCuspide ? " Está a " + T.fmtGrau(pn(cond).paraProxima) + " da cúspide da casa " +
          pn(cond).naCuspide + ": a tradição já lhe atribui parte desses assuntos." : "") + "</p>",
      tags: etiquetas,
      porque:
        "<p><b>Com que força.</b> " + e[3].resumo + "</p>" +
        "<p><b>De quem depende.</b> " + e[4].resumo + "</p>" +
        "<p><b>Com quem fala.</b> " + e[5].resumo + "</p>" +
        (e[5].recepcoes.length ? "<p><b>Recepções.</b> " +
          e[5].recepcoes.map(function (r) { return r.nota; }).join(" ") + "</p>" : "") +
        (e[5].estrelas.length ? "<p><b>Estrelas.</b> " + e[5].estrelas.map(function (s) {
          return s.estrela + " a " + T.fmtGrau(s.orbe) + " (" + s.natureza + "): " + s.simbolo;
        }).join(" ") + "</p>" : "") +
        (e[5].antiscia.length ? "<p><b>Antiscia.</b> " + e[5].antiscia.map(function (a) {
          return cap(a.nota) + " (" + T.fmtGrau(a.orbe) + ", " + a.camada + ").";
        }).join(" ") + "</p>" : "") +
        "<p><b>Quando manda.</b> " + mandatosHTML(e[6].mandatos) + "</p>" +
        "<p><b>O que o toca agora.</b> " + e[7].resumo + "</p>",
      calculo: dados([
        ["longitude", '<span class="num">' + S.norm(pos.lon).toFixed(4) + "°</span> · " + T.fmtLonNome(pos.lon)],
        ["velocidade", '<span class="num">' + pos.speed.toFixed(4) + "°/dia</span>" + (pos.speed < 0 ? " (retrógrado)" : "")],
        ["latitude eclíptica", '<span class="num">' + pos.lat.toFixed(3) + "°</span>"],
        ["casa (Placidus)", casa + " — de " + T.fmtLonNome(MAPA.casas.cusps[casa - 1]) +
          " a " + T.fmtLonNome(MAPA.casas.cusps[casa % 12])],
        ["termo egípcio", T.termoDe(pos.lon).senhor + " (" + T.termoDe(pos.lon).de + "°–" + T.termoDe(pos.lon).ate + "° de " + signo + ")"],
        ["face", T.faceDe(pos.lon).senhor],
        ["dignidade essencial", (cond.essencial.pontos > 0 ? "+" : "") + cond.essencial.pontos +
          " · " + (essenciais.map(function (i) { return i.tipo + " " + (i.peso > 0 ? "+" : "") + i.peso; }).join(", ") || "nenhuma")],
        ["condição acidental", (cond.acidental.pontos > 0 ? "+" : "") + cond.acidental.pontos +
          " · " + cond.acidental.itens.map(function (i) { return i.tipo + (i.peso ? " " + (i.peso > 0 ? "+" : "") + i.peso : ""); }).join(", ")],
        ["antiscion", T.fmtLonNome(T.antiscion(pos.lon))],
        ["contra-antiscion", T.fmtLonNome(T.contraAntiscion(pos.lon))]
      ]),
      extra: interp
    });
  }
  function pn(cond) { return cond.acidental.posicaoNaCasa; }
  function mandatosHTML(m) {
    if (!m.length) return "Nunca é cronocrator neste esquema.";
    var fird = m.filter(function (x) { return x.tipo === "firdaria maior"; });
    var anos = m.filter(function (x) { return x.tipo === "senhor do ano"; })
      .map(function (x) { return parseInt(x.idade, 10); }).filter(function (x) { return x < 90; });
    var out = [];
    if (fird.length) out.push("Firdaria maior aos " + fird.map(function (f) { return f.idade; }).join(" e aos ") + ".");
    if (anos.length) out.push("Senhor do ano nas idades " + anos.slice(0, 12).join(", ") +
      (anos.length > 12 ? "…" : "") + ".");
    return out.join(" ");
  }

  function secCasas() {
    var h = ['<p class="nota">Casas em Placidus. Cada casa traz a leitura objetiva da tradição e a subjetiva moderna, ' +
      "além do seu regente e da condição dele — porque é o regente que cumpre ou não a promessa da casa.</p>"];
    for (var i = 1; i <= 12; i++) {
      var ini = MAPA.casas.cusps[i - 1], fim = MAPA.casas.cusps[i % 12];
      var senhor = T.REGENTE[T.SIGNOS[T.signoDe(ini)]];
      var cs = MAPA.condicao[senhor];
      var ocup = S.CLASSICOS.filter(function (p) { return C.casaDe(MAPA.ceu[p].lon) === i; });
      var gc = K.GUIA.casas.itens[i - 1];
      h.push(bloco({
        titulo: "Casa " + i, glifo: String(i), certeza: "tradicional",
        pos: T.fmtLonNome(ini) + " → " + T.fmtLonNome(fim) + " · " + T.fmtGrau(S.norm(fim - ini)) + " de amplitude",
        conclusao: "<p><b>" + esc(K.CASA_ASSUNTO[i]) + ".</b> Signo na cúspide: " +
          T.SIGNOS[T.signoDe(ini)] + ", logo o senhor é <b>" + senhor + "</b>, que está em " +
          T.fmtLonNome(MAPA.ceu[senhor].lon) + ", casa " + cs.acidental.casa + ".</p>" +
          (ocup.length ? "<p>Ocupada por " + ocup.join(", ") + ".</p>"
            : '<p class="nota">Sem planetas. Lê-se inteiramente pelo senhor.</p>'),
        tags: [["senhor: " + senhor, "barro"],
               ["essencial " + (cs.essencial.pontos > 0 ? "+" : "") + cs.essencial.pontos, cs.essencial.pontos >= 0 ? "bom" : "mau"],
               ["acidental " + (cs.acidental.pontos > 0 ? "+" : "") + cs.acidental.pontos, cs.acidental.pontos >= 0 ? "bom" : "mau"]],
        porque: gc ? "<p><b>Objetivo (Lilly).</b> " + esc(gc[2]) + "</p>" +
          "<p><b>Subjetivo.</b> " + esc(gc[3]) + "</p>" : "",
        calculo: dados([
          ["cúspide", '<span class="num">' + S.norm(ini).toFixed(4) + "°</span>"],
          ["amplitude", '<span class="num">' + S.norm(fim - ini).toFixed(3) + "°</span>"],
          ["senhor", senhor + " — " + T.fmtLonNome(MAPA.ceu[senhor].lon)],
          ["dinâmica", [1, 4, 7, 10].indexOf(i) >= 0 ? "angular" : [2, 5, 8, 11].indexOf(i) >= 0 ? "sucedente" : "cadente"]
        ])
      }));
    }
    return h.join("");
  }

  function secAspectos() {
    var h = ['<p class="nota">Aspectos entre os sete clássicos. Orbe de 8° (6° para o sextil). ' +
      "Aplicando: o ângulo exato ainda vai se formar — é o que opera. Separando: já se formou.</p>"];
    h.push('<div class="rolagem"><table class="grade"><tr><th></th>' +
      S.CLASSICOS.map(function (p) { return "<th>" + gl(T.GLIFO[p]) + "</th>"; }).join("") + "</tr>" +
      S.CLASSICOS.map(function (a, i) {
        return "<tr><td class='rot'>" + gl(T.GLIFO[a]) + " " + esc(a) + "</td>" +
          S.CLASSICOS.map(function (b, j) {
            if (i === j) return "<td style='background:var(--tinta-2)'>·</td>";
            var x = MAPA.aspectos.filter(function (r) {
              return (r.a === a && r.b === b) || (r.a === b && r.b === a);
            })[0];
            if (!x) return "<td></td>";
            return "<td title='" + escAttr(x.aspecto + " " + T.fmtGrau(x.orbe)) + "'>" +
              x.glifo + VS + "<br><span style='font-size:.85em;color:var(--creme-3)'>" +
              T.fmtGrau(x.orbe) + "</span></td>";
          }).join("") + "</tr>";
      }).join("") + "</table></div>");
    MAPA.aspectos.forEach(function (x) {
      h.push(bloco({
        titulo: x.a + " " + x.aspecto.toLowerCase() + " " + x.b, glifo: x.glifo,
        certeza: "tradicional",
        pos: T.fmtGrau(x.orbe) + " · " + (x.aplicando ? "aplicando" : "separando") + (x.partil ? " · partil" : ""),
        conclusao: "<p>" + (x.natureza === "tenso"
          ? "Aspecto tenso: os dois significadores se estorvam, e é dessa fricção que sai movimento."
          : x.natureza === "fusão"
          ? "Conjunção: os significados se fundem — a natureza do mais forte prevalece."
          : "Aspecto suave: os significadores colaboram sem esforço, o que também significa sem urgência.") +
          " Liga as casas " + ((MAPA.rege[x.a] || []).join(" e ") || "—") + " às casas " +
          ((MAPA.rege[x.b] || []).join(" e ") || "—") + ".</p>",
        calculo: dados([
          ["ângulo exato", x.angulo + "°"],
          ["orbe", T.fmtGrau(x.orbe)],
          ["estado", x.aplicando ? "aplicando (ainda vai perfazer)" : "separando (já perfez)"],
          [x.a, T.fmtLonNome(MAPA.ceu[x.a].lon)],
          [x.b, T.fmtLonNome(MAPA.ceu[x.b].lon)]
        ])
      }));
    });
    return h.join("");
  }

  function secLotes() {
    var L = MAPA.lotes;
    var h = ['<p class="nota">Os sete lotes de Paulus Alexandrinus. Carta noturna: cada fórmula diurna se inverte. ' +
      "O lote lê-se pela casa, pelo signo e pelo senhor do signo em que cai.</p>"];
    Object.keys(L).forEach(function (nome) {
      var lon = L[nome], info = K.LOTE_INFO[nome], casa = C.casaDe(lon);
      var senhor = T.REGENTE[T.SIGNOS[T.signoDe(lon)]];
      var est = MAPA.estrelas.filter(function (e) { return e.ponto === "Lote de " + nome; });
      h.push(bloco({
        titulo: "Lote de " + nome, glifo: info.g, certeza: "tradicional",
        pos: T.fmtLonNome(lon) + " · casa " + casa + " · fórmula noturna: " + info.form,
        conclusao: "<p>" + esc(info.sig) + " Aqui cai na casa " + casa + " — " + esc(K.CASA_ASSUNTO[casa]) + ".</p>",
        tags: [["senhor: " + senhor, "barro"], ["casa " + casa, ""]],
        porque: camada("Abu Ma'shar · Grande Introdução", texto("abu-lote-" + nome, K.ABU_LOTES[nome] || "")) +
          "<p><b>Senhor do lote.</b> O lote em " + T.SIGNOS[T.signoDe(lon)] + " entrega-se a " + senhor +
          ", que está em " + T.fmtLonNome(MAPA.ceu[senhor].lon) + " (casa " + C.casaDe(MAPA.ceu[senhor].lon) +
          "). A condição do senhor diz se o lote cumpre o que promete.</p>" +
          (est.length ? "<p><b>Estrela em contato.</b> " + est.map(function (s) {
            return s.estrela + " a " + T.fmtGrau(s.orbe) + " — " + s.simbolo;
          }).join(" ") + "</p>" : ""),
        calculo: dados([["fórmula", info.form], ["longitude", '<span class="num">' + S.norm(lon).toFixed(4) + "°</span>"],
          ["senhor do lote", senhor]])
      }));
    });
    return h.join("");
  }

  function secEstrelas() {
    var todas = MAPA.estrelas;
    var nucleo = todas.filter(function (e) { return e.nucleo; });
    var sec = todas.filter(function (e) { return !e.nucleo; });
    var h = ['<p class="nota">Detector dinâmico: todos os pontos do mapa varridos contra um catálogo de ' +
      T.CATALOGO.length + " estrelas, com precessão aplicada à época do nascimento. " +
      "Orbe: núcleo até 1°00′, secundário de 1°00′ a 1°30′. Nada além disso conta.</p>"];
    function card(e) {
      return bloco({
        titulo: e.estrela + " × " + e.ponto, glifo: "✧", certeza: "tradicional",
        ativo: e.nucleo,
        pos: T.fmtGrau(e.orbe) + " · " + (e.nucleo ? "núcleo" : "secundário") + " · " + e.designacao +
          " · magnitude " + e.mag,
        conclusao: "<p>" + esc(e.simbolo) + "</p>",
        tags: [["natureza " + e.natureza, "barro"], [e.nucleo ? "núcleo ≤1°" : "secundário 1°–1°30′", e.nucleo ? "ativo" : ""],
               e.foraDaEcliptica ? ["latitude " + e.latEcl.toFixed(0) + "° — só em longitude", "mau"] : null],
        porque: e.foraDaEcliptica
          ? "<p>Esta estrela está a " + e.latEcl.toFixed(0) + "° da eclíptica. A conjunção é apenas em longitude: " +
            "no céu, estrela e planeta não se encontram. A tradição paranatelôntica exigiria conta por ascensão " +
            "reta ou por paran, não por longitude. Registramos assim para que o dado não passe por mais do que é.</p>"
          : "<p>Estrela próxima da eclíptica: a conjunção em longitude corresponde a uma proximidade real no céu.</p>",
        calculo: dados([
          ["longitude da estrela (na época)", '<span class="num">' + e.lonEstrela.toFixed(4) + "°</span>"],
          ["longitude do ponto", '<span class="num">' + e.lonPonto.toFixed(4) + "°</span>"],
          ["orbe", '<span class="num">' + e.orbe.toFixed(4) + "°</span> = " + T.fmtGrau(e.orbe)],
          ["latitude eclíptica", '<span class="num">' + e.latEcl.toFixed(2) + "°</span>"],
          ["precessão aplicada", "50,29″/ano a partir de J2000"]
        ])
      });
    }
    h.push(rot("Núcleo — até 1°00′"));
    h.push(nucleo.length ? nucleo.map(card).join("") : '<p class="vazio">Nenhum contato dentro de 1°.</p>');
    h.push(rot("Secundário — 1°00′ a 1°30′"));
    h.push(sec.length ? sec.map(card).join("") : '<p class="vazio">Nenhum contato nesta faixa.</p>');
    return h.join("");
  }

  function secAntiscia() {
    var val = MAPA.antiscia.filter(function (a) { return a.vale; });
    var fora = MAPA.antiscia.filter(function (a) { return !a.vale; });
    var h = ['<p class="nota">Antiscion: grau simétrico no eixo dos solstícios (180° − λ) — mesma declinação, ' +
      "mesmo comprimento de dia. Contra-antiscion: simétrico no eixo dos equinócios (360° − λ) — declinações opostas. " +
      "Orbe adotado: núcleo até 1°00′, secundário até 1°30′.</p>"];
    h.push('<div class="rolagem"><table class="grade"><tr><th>ponto</th><th>longitude</th><th>antiscion</th><th>contra-antiscion</th></tr>' +
      S.CLASSICOS.concat(["Ascendente", "Meio-do-Céu"]).map(function (p) {
        var l = MAPA.pontos[p];
        return "<tr><td class='rot'>" + gl(T.GLIFO[p] || p) + " " + esc(p) + "</td><td>" +
          T.fmtLonNome(l) + "</td><td>" + T.fmtLonNome(T.antiscion(l)) + "</td><td>" +
          T.fmtLonNome(T.contraAntiscion(l)) + "</td></tr>";
      }).join("") + "</table></div>");
    h.push(rot("Contatos dentro do orbe"));
    if (!val.length) h.push('<p class="vazio">Nenhum contato de antiscia dentro de 1°30′ neste mapa.</p>');
    val.forEach(function (a) {
      h.push(bloco({
        titulo: cap(a.tipo) + ": " + a.a + " → " + a.b, glifo: a.tipo === "antiscion" ? "⌖" : "⌗",
        certeza: "tradicional", ativo: a.camada === "núcleo",
        pos: T.fmtGrau(a.orbe) + " · " + a.camada,
        conclusao: "<p>" + cap(esc(a.nota)) + ".</p>"
      }));
    });
    if (fora.length) h.push(camada("fora do orbe adotado (" + fora.length + " quase-contatos, entre 1°30′ e 3°)",
      '<div class="dados">' + fora.map(function (a) {
        return "<div><span class='k'>" + esc(a.tipo) + "</span><span class='v'>" + esc(a.a) + " → " + esc(a.b) +
          " · " + T.fmtGrau(a.orbe) + "</span></div>";
      }).join("") + "</div>" +
      '<p class="nota">Listados só para conferência. A auditoria encontrou aqui o erro do aplicativo antigo: ' +
      "o texto prometia orbe de 1° e o código filtrava por 1,5 — e o contato de contra-antiscion entre Sol e " +
      "Júpiter, a 2°01′, era apresentado como válido. A 2°01′ não é contato: é vizinhança.</p>"));
    return h.join("");
  }

  window.__secoesMapa = {
    planetas: secPlanetas, casas: secCasas, aspectos: secAspectos,
    lotes: secLotes, estrelas: secEstrelas, antiscia: secAntiscia
  };

  /* exportado para o restante da interface */
  window.__ui = {
    $: $, $$: $$, esc: esc, escAttr: escAttr, gl: gl, VS: VS, cap: cap,
    bloco: bloco, camada: camada, tags: tags, dados: dados, rot: rot, selo: selo, escala: escala,
    texto: texto, rico: rico, NOTAS: NOTAS, guardarNotas: guardarNotas, carregarNotas: carregarNotas,
    fData: fData, fCurta: fCurta, fHora: fHora, fDataHora: fDataHora, daqui: daqui,
    MESES: MESES, MES3: MES3, DIAS: DIAS, DIA3: DIA3,
    telaHoje: telaHoje, telaMapa: telaMapa, briefArco: briefArco, sync: sync, token: token, TK: TK,
    explicaCamada: explicaCamada
  };
})();
