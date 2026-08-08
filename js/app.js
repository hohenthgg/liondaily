/* ============================================================
   LIONS DAILY · navegação, busca, edição e boot
   ============================================================ */
(function () {
  "use strict";
  var S = window.Astro, T = window.Trad, K = window.Corpus, C = window.Chrono, P = window.Perfil;
  var U = window.__ui, W = window.__telas, SEC = window.__secoesMapa;
  var MAPA = C.MAPA;
  var $ = U.$, $$ = U.$$, esc = U.esc, escAttr = U.escAttr;

  var app = $("#app"), subnav = $("#subnav"), subin = $("#subnav-in");
  var modo = "hoje", aba = "mapa", secMapa = "planetas";

  var ABAS = [["mapa", "Mapa"], ["tecnica", "Técnica"], ["perfil", "Perfil"],
              ["promessas", "Promessas"], ["saude", "Saúde"], ["guia", "Guia"]];

  /* ---------------- render ---------------- */
  function render() {
    app.scrollTop = 0;
    if (modo === "hoje") {
      subnav.hidden = true;
      app.innerHTML = '<section class="tela">' + U.telaHoje() + "</section>";
      /* a camada preditiva entra depois da primeira pintura */
      setTimeout(function () {
        var alvo = $("#brief-arco");
        if (!alvo) return;
        try { alvo.innerHTML = U.briefArco(); } catch (e) {
          alvo.innerHTML = '<p class="vazio">Não foi possível medir os arcos.</p>';
        }
        ligarBlocos();
      }, 24);
    } else {
      subnav.hidden = false;
      subin.innerHTML = ABAS.map(function (a) {
        return '<button data-aba="' + a[0] + '" aria-selected="' + (a[0] === aba) + '">' + a[1] + "</button>";
      }).join("");
      app.innerHTML = '<section class="tela">' + telaDaAba() + "</section>";
      pos();
    }
    window.scrollTo(0, 0);
    ligar();
  }
  function telaDaAba() {
    switch (aba) {
      case "mapa": return U.telaMapa();
      case "tecnica": return W.telaTecnica();
      case "perfil": return W.telaPerfil();
      case "promessas": return W.telaPromessas();
      case "saude": return W.telaSaude();
      case "guia": return W.telaGuia();
    }
    return "";
  }
  /* preenche o corpo dependente de sub-seleção, depois do HTML base */
  function pos() {
    if (aba === "mapa") {
      var alvo = $("#mapa-corpo");
      if (alvo) alvo.innerHTML = SEC[secMapa] ? SEC[secMapa]() : "";
    } else if (aba === "tecnica") {
      var a2 = $("#tec-corpo");
      if (a2) {
        a2.innerHTML = W.tecnica[W.estado.subTecnica] ? W.tecnica[W.estado.subTecnica]() : "";
        if (W.estado.subTecnica === "eletiva") {
          var e = $("#ele-corpo"); if (e) e.innerHTML = W.eletivaCorpo();
        }
        if (W.estado.subTecnica === "preditivas") {
          /* os arcos levam algumas centenas de ms: deixa o "calculando" aparecer */
          var pv = $("#pv-corpo");
          if (pv) setTimeout(function () { pv.innerHTML = W.pvCorpo(); ligarBlocos(); }, 16);
        }
      }
    } else if (aba === "perfil") {
      var a3 = $("#eixos-corpo");
      if (a3) a3.innerHTML = W.eixosCorpo();
    }
  }

  /* ---------------- eventos delegados ---------------- */
  function ligar() {
    /* sub-abas */
    $$("#subnav-in button").forEach(function (b) {
      b.onclick = function () { aba = b.dataset.aba; render(); };
    });
    /* chips do mapa */
    $$("#chips-mapa .chip").forEach(function (b) {
      b.onclick = function () {
        secMapa = b.dataset.sec;
        $$("#chips-mapa .chip").forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
        $("#mapa-corpo").innerHTML = SEC[secMapa]();
        ligarBlocos();
      };
    });
    /* chips da técnica */
    $$("#chips-tec .chip").forEach(function (b) {
      b.onclick = function () {
        W.estado.subTecnica = b.dataset.sub;
        $$("#chips-tec .chip").forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
        pos(); ligar();
      };
    });
    /* chips dos eixos */
    $$("#chips-eixos .chip").forEach(function (b) {
      b.onclick = function () {
        W.estado.famSel = b.dataset.fam || null;
        $$("#chips-eixos .chip").forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
        $("#eixos-corpo").innerHTML = W.eixosCorpo();
        ligarBlocos();
      };
    });
    /* chips das preditivas */
    $$("#chips-pv .chip").forEach(function (b) {
      b.onclick = function () {
        W.estado.pvVista = b.dataset.pv;
        pos(); ligar();
      };
    });
    $$("#chips-pvopt .chip").forEach(function (b) {
      b.onclick = function () {
        if (b.dataset.opt === "chave") W.estado.pvChave = b.dataset.val;
        else W.estado.pvSentido = b.dataset.val;
        pos(); ligar();
      };
    });
    /* chips da eletiva */
    $$("#chips-ele .chip").forEach(function (b) {
      b.onclick = function () {
        W.estado.eletivaTema = b.dataset.tema;
        $$("#chips-ele .chip").forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
        $("#ele-corpo").innerHTML = W.eletivaCorpo();
        ligarBlocos();
      };
    });
    /* semana */
    if ($("#sem-ant")) $("#sem-ant").onclick = function () { W.estado.semanaMove(-1); pos(); ligar(); };
    if ($("#sem-prox")) $("#sem-prox").onclick = function () { W.estado.semanaMove(1); pos(); ligar(); };
    /* cartas do guia */
    $$("[data-carta]").forEach(function (b) {
      b.onclick = function () { abrirVeu(W.cartaGuia(b.dataset.carta)); };
    });
    ligarBlocos();
  }

  /* menu ••• de cada bloco (item 21) */
  function ligarBlocos() {
    $$(".bloco .mais").forEach(function (b) {
      b.onclick = function (ev) {
        ev.stopPropagation();
        abrirMenuBloco(b.closest(".bloco"), b);
      };
    });
  }
  function fecharMenus() { $$(".menu-pop.on").forEach(function (m) { if (m.id !== "menu-geral") m.remove(); else m.classList.remove("on"); }); }

  function abrirMenuBloco(bloco, botao) {
    fecharMenus();
    var editaveis = $$(".texto[data-nota]", bloco);
    var m = document.createElement("div");
    m.className = "menu-pop on";
    m.innerHTML =
      '<button data-a="copiar">Copiar este bloco</button>' +
      (editaveis.length ? '<button data-a="editar">Editar texto' +
        (editaveis.length > 1 ? " (" + editaveis.length + ")" : "") + "</button>" : "") +
      (editaveis.some(function (e) { return U.NOTAS[e.dataset.nota] != null; })
        ? '<button data-a="restaurar">Restaurar original</button>' : "") +
      "<hr><button data-a=\"abrir\">Abrir isolado</button>";
    botao.parentNode.style.position = "relative";
    botao.parentNode.appendChild(m);
    m.onclick = function (ev) {
      var a = ev.target.dataset && ev.target.dataset.a; if (!a) return;
      ev.stopPropagation();
      if (a === "copiar") copiar(textoDoBloco(bloco), ev.target);
      if (a === "editar") editar(editaveis[0], bloco);
      if (a === "restaurar") { editaveis.forEach(function (e) { delete U.NOTAS[e.dataset.nota]; });
        U.guardarNotas(); pos(); ligar(); }
      if (a === "abrir") abrirVeu(bloco.outerHTML.replace(/<button class="mais"[^<]*<\/button>/, ""));
      if (a !== "editar") m.remove();
    };
  }

  function textoDoBloco(b) {
    var out = [];
    var h = $(".bloco-h h3", b);
    if (h) out.push(h.innerText.trim());
    var c = $(".conclusao", b);
    if (c) out.push(c.innerText.trim());
    $$(".texto[data-nota]", b).forEach(function (t) { out.push(t.dataset.raw); });
    $$("details.camada", b).forEach(function (d) {
      var s = $("summary", d), co = $(".corpo", d);
      if (s && co) out.push("— " + s.innerText.trim().toUpperCase() + " —\n" + co.innerText.trim());
    });
    return out.filter(Boolean).join("\n\n");
  }
  function copiar(txt, btn) {
    var ok = function () { if (btn) { var o = btn.textContent; btn.textContent = "copiado"; setTimeout(function () { btn.textContent = o; }, 1200); } };
    if (navigator.clipboard && navigator.clipboard.writeText)
      navigator.clipboard.writeText(txt).then(ok, function () { fallback(txt, ok); });
    else fallback(txt, ok);
  }
  function fallback(txt, ok) {
    var ta = document.createElement("textarea");
    ta.value = txt; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); ok(); } catch (e) { }
    document.body.removeChild(ta);
  }

  function editar(alvo, bloco) {
    if (!alvo) return;
    fecharMenus();
    var chave = alvo.dataset.nota, atual = alvo.dataset.raw;
    var cx = document.createElement("div");
    cx.innerHTML = '<textarea class="edit-area"></textarea>' +
      '<div class="edit-bar"><button class="bt primario" data-e="salvar">Salvar</button>' +
      '<button class="bt" data-e="cancelar">Cancelar</button>' +
      '<span class="nota" style="align-self:center">cole URLs de imagem (.png .jpg .svg) para ilustrar</span></div>';
    var ta = $("textarea", cx); ta.value = atual;
    alvo.replaceWith(cx); ta.focus();
    cx.onclick = function (ev) {
      var e = ev.target.dataset && ev.target.dataset.e; if (!e) return;
      if (e === "salvar") { U.NOTAS[chave] = ta.value; U.guardarNotas(); }
      pos(); ligar();
      if (!$("#" + (bloco && bloco.id))) render();
    };
  }

  /* ---------------- véu de leitura ---------------- */
  function abrirVeu(html) {
    $("#veu-corpo").innerHTML = html;
    $("#veu").classList.add("on");
    document.body.style.overflow = "hidden";
    ligarBlocos();
  }
  function fecharVeu() {
    $("#veu").classList.remove("on");
    document.body.style.overflow = "";
  }
  $("#veu-fechar").onclick = fecharVeu;
  $("#veu").onclick = function (e) { if (e.target.id === "veu") fecharVeu(); };

  /* ---------------- busca por tópico (item 4) ---------------- */
  function buscar(q) {
    q = (q || "").trim().toLowerCase();
    if (!q) return [];
    function norm(s) { return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }
    var nq = norm(q), res = [], vistos = {};
    /* temas por palavra-chave */
    K.BUSCA.forEach(function (b) {
      if (norm(b[0]).indexOf(nq) < 0 && nq.indexOf(norm(b[0])) < 0) return;
      if (vistos["t" + b[1]]) return; vistos["t" + b[1]] = 1;
      var t = K.TEMAS.filter(function (x) { return x.id === b[1]; })[0];
      if (!t) return;
      var senhor = T.REGENTE[T.SIGNOS[T.signoDe(MAPA.casas.cusps[t.casas[0] - 1])]];
      res.push({ t: t.nome, s: "casa " + t.casas.join(" e ") + " · senhor " + senhor,
                 ir: function () { modo = "mapa"; aba = "promessas"; render(); irPara("tema-" + t.id); } });
    });
    /* temas por nome */
    K.TEMAS.forEach(function (t) {
      if (vistos["t" + t.id]) return;
      if (norm(t.nome).indexOf(nq) < 0) return;
      vistos["t" + t.id] = 1;
      res.push({ t: t.nome, s: "promessa natal", ir: function () { modo = "mapa"; aba = "promessas"; render(); irPara("tema-" + t.id); } });
    });
    /* planetas */
    S.CLASSICOS.forEach(function (p) {
      if (norm(p).indexOf(nq) < 0) return;
      var c = MAPA.condicao[p];
      res.push({ t: p, s: T.fmtLonNome(MAPA.ceu[p].lon) + " · casa " + c.acidental.casa +
        ((MAPA.rege[p] || []).length ? " · rege " + MAPA.rege[p].join(" e ") : ""),
        ir: function () { modo = "mapa"; aba = "mapa"; secMapa = "planetas"; render(); irPara("pl-" + p); } });
    });
    /* casas */
    var mc = q.match(/casa\s*(\d{1,2})/);
    if (mc) {
      var n = +mc[1];
      if (n >= 1 && n <= 12) res.push({ t: "Casa " + n, s: K.CASA_ASSUNTO[n],
        ir: function () { modo = "mapa"; aba = "mapa"; secMapa = "casas"; render(); } });
    }
    /* glossário */
    Object.keys(K.GLOSSARIO).forEach(function (g) {
      if (norm(g).indexOf(nq) < 0) return;
      res.push({ t: g, s: "glossário", ir: function () {
        abrirVeu("<h3>" + esc(g) + "</h3><p>" + esc(K.GLOSSARIO[g]) + "</p>"); } });
    });
    return res.slice(0, 14);
  }
  function irPara(id) {
    setTimeout(function () {
      var e = document.getElementById(id);
      if (e) { e.scrollIntoView({ block: "start", behavior: "smooth" }); e.classList.add("ativo"); }
    }, 60);
  }
  var bIn = $("#busca-in"), bRes = $("#busca-res"), bVeu = $("#busca-veu");
  function abrirBusca() { bVeu.classList.add("on"); bIn.value = ""; bRes.innerHTML = ""; bIn.focus(); }
  function fecharBusca() { bVeu.classList.remove("on"); }
  $("#bt-busca").onclick = abrirBusca;
  bVeu.onclick = function (e) { if (e.target === bVeu) fecharBusca(); };
  bIn.oninput = function () {
    var r = buscar(bIn.value);
    bRes.innerHTML = r.length
      ? r.map(function (x, i) {
          return '<button data-i="' + i + '"><span class="t">' + esc(x.t) + '</span><br><span class="s">' +
            esc(x.s) + "</span></button>";
        }).join("")
      : '<div style="padding:.9rem 1rem;color:var(--creme-3);font-size:.85rem">nada encontrado — tente ' +
        '"dinheiro", "casamento", "carreira", "saúde", "casa 7"</div>';
    $$("#busca-res button").forEach(function (b) {
      b.onclick = function () { fecharBusca(); r[+b.dataset.i].ir(); };
    });
  };
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { fecharBusca(); fecharVeu(); fecharMenus(); }
    if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) { e.preventDefault(); abrirBusca(); }
  });

  /* ---------------- menu geral ---------------- */
  var mg = $("#menu-geral");
  $("#bt-menu").onclick = function (e) {
    e.stopPropagation();
    if (mg.classList.contains("on")) { mg.classList.remove("on"); return; }
    fecharMenus();
    var loc = C.localAtual();
    mg.innerHTML =
      '<button data-a="local">Local atual: ' + esc(loc.nome.split(",")[0]) + "</button>" +
      '<button data-a="gps">Usar minha localização</button>' +
      '<button data-a="token">Token do GitHub' + (U.token() ? " ✓" : "") + "</button>" +
      '<button data-a="sincronizar">Recarregar notas</button>' +
      "<hr>" +
      '<button data-a="sobre">Sobre os cálculos</button>' +
      '<span id="sync">' + (U.token() ? "sincronizado com o GitHub" : "edições só neste aparelho") + "</span>";
    mg.classList.add("on");
    mg.onclick = function (ev) {
      var a = ev.target.dataset && ev.target.dataset.a; if (!a) return;
      ev.stopPropagation();
      if (a === "local") {
        var v = prompt("Local atual — nome, latitude, longitude\n(ex.: Lisboa, 38.72, -9.14)",
          loc.nome + ", " + loc.lat + ", " + loc.lon);
        if (v) {
          var p = v.split(",");
          var la = parseFloat(p[p.length - 2]), lo = parseFloat(p[p.length - 1]);
          if (isFinite(la) && isFinite(lo)) {
            C.definirLocalAtual(p.slice(0, -2).join(",").trim() || "local definido", la, lo, 0);
            mg.classList.remove("on"); render();
          } else alert("Não entendi as coordenadas.");
        }
      }
      if (a === "gps" && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (p) {
          C.definirLocalAtual("minha localização", p.coords.latitude, p.coords.longitude,
            p.coords.altitude || 0);
          mg.classList.remove("on"); render();
        }, function () { alert("Não consegui obter a localização."); });
      }
      if (a === "token") {
        var t = prompt("Token fino do GitHub com permissão de escrita em contents deste repositório.\n" +
          "Fica só neste aparelho.", U.token());
        if (t !== null) { try { localStorage.setItem(U.TK, t.trim()); } catch (e) { } mg.classList.remove("on"); }
      }
      if (a === "sincronizar") { U.carregarNotas().then(function () { mg.classList.remove("on"); render(); }); }
      if (a === "sobre") { mg.classList.remove("on"); abrirVeu(sobre()); }
    };
  };
  document.addEventListener("click", function () { fecharMenus(); });

  function sobre() {
    var loc = C.localAtual();
    return "<h3>Sobre os cálculos</h3>" +
      U.dados([
        ["efemérides", "Astronomy Engine (Don Cross, MIT) — VSOP87/ELP2000 truncados"],
        ["precisão típica", "melhor que 1″ para os sete clássicos entre 1700 e 2200"],
        ["conferência", "as sete longitudes natais batem com a efeméride de referência dentro de 0,07′"],
        ["nó lunar", "médio (Meeus 47.7) — a carta de referência usa o médio, não o verdadeiro"],
        ["casas", MAPA.casas.sistema + " por iteração de semiarco; erro máximo de 19″ nas doze cúspides"],
        ["seita", MAPA.seita + " — Sol na casa " + C.casaDe(MAPA.ceu["Sol"].lon)],
        ["dignidades", "tabela de Lilly; triplicidades de Dorotheus; termos egípcios; faces caldaicas"],
        ["estrelas fixas", T.CATALOGO.length + " estrelas, J2000 + precessão de 50,29″/ano"],
        ["orbe das estrelas", "núcleo ≤ 1°00′ · secundário 1°00′–1°30′"],
        ["orbe dos aspectos", "8° (6° no sextil); 75% disso para trânsitos"],
        ["antiscia", "núcleo ≤ 1°00′ · secundário ≤ 1°30′; acima disso não é contato"],
        ["nascimento", U.esc(C.NATIVO.dataLocal) + " · " + U.esc(C.NATIVO.lugar)],
        ["local dos cálculos horários", U.esc(loc.nome) + (loc.herdado ? " (herdado do natal)" : "")]
      ]) +
      '<p class="nota" style="margin-top:.8rem">Quatro selos aparecem ao lado de cada afirmação. ' +
      Object.keys(C.CERTEZA).map(function (c) {
        return U.selo(c) + " " + esc(C.CERTEZA[c].desc);
      }).join(" · ") + "</p>" +
      '<p class="nota">O que o aplicativo não faz: não prevê acontecimentos, não atribui nota a dias, ' +
      "não mede personalidade e não diagnostica. Diz o que está ativo, por qual regra, e de onde no mapa vem.</p>";
  }

  /* ---------------- modos ---------------- */
  $$("#modos button").forEach(function (b) {
    b.onclick = function () {
      modo = b.dataset.modo;
      $$("#modos button").forEach(function (x) { x.setAttribute("aria-selected", x === b); });
      render();
    };
  });

  /* ---------------- boot ---------------- */
  U.carregarNotas().then(function () {
    try { render(); }
    catch (e) {
      app.innerHTML = '<div class="aviso">Falha ao montar a tela: ' + esc(e.message) + "</div>";
      throw e;
    }
  });
})();
