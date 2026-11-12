(function () {
  "use strict";
  const KEY = "aiprod-progress-v1";
  const C = window.COURSE;
  const root = document.body.dataset.root || "";

  // ---------- storage ----------
  function load() {
    try { return Object.assign({ done: {}, quiz: {}, last: null }, JSON.parse(localStorage.getItem(KEY) || "{}")); }
    catch (e) { return { done: {}, quiz: {}, last: null }; }
  }
  function save(p) { try { localStorage.setItem(KEY, JSON.stringify(p)); } catch (e) {} }
  let P = load();

  const allLessons = C.modules.flatMap(m => m.lessons.map(l => Object.assign({ module: m }, l)));
  const isAvailable = l => C.available.includes(l.module.id);
  const pct = (a, b) => b ? Math.round(a * 100 / b) : 0;

  // ---------- theme ----------
  const THEME_KEY = "aiprod-theme";
  function applyTheme(t) {
    if (t) document.documentElement.dataset.theme = t; else delete document.documentElement.dataset.theme;
  }
  try { applyTheme(localStorage.getItem(THEME_KEY)); } catch (e) {}
  function toggleTheme() {
    const dark = document.documentElement.dataset.theme
      ? document.documentElement.dataset.theme === "dark"
      : matchMedia("(prefers-color-scheme: dark)").matches;
    const t = dark ? "light" : "dark";
    applyTheme(t);
    try { localStorage.setItem(THEME_KEY, t); } catch (e) {}
  }

  function el(tag, attrs, html) {
    const e = document.createElement(tag);
    if (attrs) for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (html != null) e.innerHTML = html;
    return e;
  }

  function topbar(crumb) {
    const doneCount = Object.keys(P.done).length;
    const bar = el("header", { class: "topbar" },
      `<a class="home" href="${root}index.html">☰ ${C.title}</a>
       <span class="crumb">${crumb || ""}</span>
       <a class="btn icon" href="${root}slowniczek.html" aria-label="Słowniczek">Aa</a>
       <button class="icon" id="themeBtn" aria-label="Zmień motyw">◐</button>`);
    const line = el("div", { class: "progressline" }, `<i style="width:${pct(doneCount, allLessons.length)}%"></i>`);
    document.body.prepend(line);
    document.body.prepend(bar);
    bar.querySelector("#themeBtn").onclick = toggleTheme;
  }

  // ---------- code blocks: <script type="text/x-code" data-lang="kotlin"> ----------
  function dedent(s) {
    s = s.replace(/^\s*\n/, "").replace(/\s+$/, "");
    const lines = s.split("\n");
    const ind = Math.min(...lines.filter(l => l.trim()).map(l => l.match(/^ */)[0].length));
    return lines.map(l => l.slice(ind)).join("\n");
  }
  function renderCode() {
    document.querySelectorAll('script[type="text/x-code"]').forEach(s => {
      const lang = s.dataset.lang || "plaintext";
      const pre = el("pre");
      const code = el("code", { class: "language-" + lang });
      code.textContent = dedent(s.textContent);
      pre.appendChild(el("span", { class: "lang" }, s.dataset.title || lang));
      pre.appendChild(code);
      s.replaceWith(pre);
      if (window.hljs) { try { hljs.highlightElement(code); } catch (e) {} }
    });
  }

  // ---------- quizzes ----------
  function renderQuizzes(lessonId) {
    document.querySelectorAll(".quiz").forEach((q, idx) => {
      const qid = lessonId + "-" + (q.dataset.id || idx);
      const correct = parseInt(q.dataset.correct, 10);
      const buttons = [...q.querySelectorAll("button")];
      function mark(chosen) {
        q.classList.add("answered");
        buttons.forEach((b, i) => {
          b.classList.toggle("correct", i === correct);
          b.classList.toggle("wrong", i === chosen && i !== correct);
        });
      }
      if (P.quiz[qid] != null) mark(P.quiz[qid]);
      buttons.forEach((b, i) => b.addEventListener("click", () => {
        P.quiz[qid] = i; save(P); mark(i);
      }));
    });
  }

  // ---------- słowniczek: <dfn data-t="eval">evale</dfn> ----------
  function withGlossary(cb) {
    if (window.GLOSSARY) return cb(window.GLOSSARY);
    const s = el("script", { src: root + "assets/glossary.js" });
    s.onload = () => cb(window.GLOSSARY || {});
    document.head.appendChild(s);
  }
  function renderTerms() {
    const terms = document.querySelectorAll("dfn[data-t]");
    if (!terms.length) return;
    withGlossary(G => {
      let pop = null;
      const close = () => { if (pop) { pop.remove(); pop = null; } };
      terms.forEach(d => {
        const g = G[d.dataset.t];
        if (!g) { console.warn("Brak terminu w słowniczku:", d.dataset.t); return; }
        d.classList.add("term"); d.tabIndex = 0; d.title = g.short;
        const open = e => {
          e.preventDefault(); e.stopPropagation();
          const wasThis = pop && pop.dataset.for === d.dataset.t; close();
          if (wasThis) return;
          pop = el("span", { class: "term-pop", "data-for": d.dataset.t },
            `<strong>${g.term}</strong><br>${g.short}<br><a href="${root}slowniczek.html#${d.dataset.t}">Więcej w słowniczku →</a>`);
          document.body.appendChild(pop);
        };
        d.addEventListener("click", open);
        d.addEventListener("keydown", e => { if (e.key === "Enter") open(e); });
      });
      document.addEventListener("click", e => { if (pop && !pop.contains(e.target)) close(); });
    });
  }
  function glossaryPage() {
    topbar("Słowniczek");
    withGlossary(G => {
      const items = Object.entries(G).sort((a, b) => a[1].term.localeCompare(b[1].term, "pl"));
      const byId = Object.fromEntries(allLessons.map(l => [l.id, l]));
      document.querySelector("main").innerHTML =
        `<h1>Słowniczek</h1><input id="gq" type="search" placeholder="Szukaj pojęcia…" class="search">` +
        items.map(([id, g]) => `<section class="gl" id="${id}"><h3>${g.term}</h3><p><strong>${g.short}</strong></p><p>${g.long}</p>` +
          (g.see && g.see.length ? `<p class="small">Lekcje: ${g.see.map(s => byId[s] && isAvailable(byId[s])
            ? `<a href="${byId[s].file}">${s}</a>` : s).join(", ")}</p>` : "") + `</section>`).join("");
      const q = document.getElementById("gq");
      q.oninput = () => document.querySelectorAll(".gl").forEach(s =>
        s.hidden = !s.textContent.toLowerCase().includes(q.value.toLowerCase()));
      if (location.hash) { const t = document.querySelector(location.hash); if (t) { t.classList.add("hl"); t.scrollIntoView(); } }
    });
  }

  // ---------- spis treści z <h2> ----------
  function renderToc() {
    const hs = [...document.querySelectorAll("main h2")];
    if (hs.length < 4) return;
    const slug = s => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/ł/g, "l").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    hs.forEach((h, i) => { if (!h.id) h.id = (i + 1) + "-" + slug(h.textContent); });
    const toc = el("details", { class: "toc" },
      `<summary>Spis treści (${hs.length})</summary><ol>` +
      hs.map(h => `<li><a href="#${h.id}">${h.textContent}</a></li>`).join("") + `</ol>`);
    const anchor = document.querySelector("main .box.goals") || document.querySelector("main h1");
    anchor.after(toc);
    toc.addEventListener("click", e => { if (e.target.tagName === "A") toc.open = false; });
  }

  // ---------- lesson page ----------
  function lessonPage(id) {
    const i = allLessons.findIndex(l => l.id === id);
    const l = allLessons[i];
    if (!l) return;
    topbar(`M${l.module.id} · ${l.module.title}`);
    P.last = id; save(P);
    renderCode(); renderQuizzes(id); renderToc(); renderTerms();

    const prev = allLessons[i - 1], next = allLessons[i + 1];
    const link = (x, cls, label) => x && isAvailable(x)
      ? `<a class="${cls}" href="${root}${x.file}"><small>${label}</small>${x.id} ${x.title}</a>` : `<span style="flex:1"></span>`;
    const footer = el("div", { class: "lesson-footer" },
      `<button class="done-btn" id="doneBtn"></button>
       <div class="pager">${link(prev, "prev", "← Poprzednia")}${link(next, "next", "Następna →")}</div>`);
    document.querySelector("main").appendChild(footer);
    const btn = footer.querySelector("#doneBtn");
    function upd() {
      const d = !!P.done[id];
      btn.textContent = d ? "✓ Lekcja ukończona (kliknij, aby cofnąć)" : "Oznacz lekcję jako ukończoną";
      btn.classList.toggle("is-done", d);
      btn.classList.toggle("primary", !d);
    }
    btn.onclick = () => {
      if (P.done[id]) delete P.done[id]; else P.done[id] = Date.now();
      save(P); upd();
      document.querySelector(".progressline > i").style.width = pct(Object.keys(P.done).length, allLessons.length) + "%";
    };
    upd();
  }

  // ---------- index page ----------
  function indexPage() {
    topbar("");
    const main = document.querySelector("main");
    const doneAll = allLessons.filter(l => P.done[l.id]).length;
    const nextL = allLessons.find(l => isAvailable(l) && !P.done[l.id]);
    const lastL = allLessons.find(l => l.id === P.last);
    const cont = (lastL && !P.done[lastL.id]) ? lastL : nextL;

    let html = `<section class="hero">
      <h1>${C.title}</h1><p class="meta">${C.subtitle}</p>
      <div class="overall"><div class="bar"><i style="width:${pct(doneAll, allLessons.length)}%"></i></div>
      <span class="small">${doneAll}/${allLessons.length}</span></div>
      ${cont ? `<a class="btn primary" href="${cont.file}">${doneAll ? "Kontynuuj" : "Zacznij"}: ${cont.id} ${cont.title}</a>` : ""}
    </section>`;

    C.modules.forEach(m => {
      const avail = C.available.includes(m.id);
      const d = m.lessons.filter(l => P.done[l.id]).length;
      const open = avail && d < m.lessons.length ? "open" : "";
      html += `<details class="module" ${open}><summary>
        <span class="t">Moduł ${m.id}. ${m.title}</span>
        <span class="small">${avail ? `${d}/${m.lessons.length} lekcji` : "wkrótce"}</span>
        <div class="bar"><i style="width:${pct(d, m.lessons.length)}%"></i></div>
      </summary><ol>` +
        m.lessons.map(l => {
          const done = P.done[l.id];
          const inner = `<span class="mark">${done ? "✓" : "○"}</span><span>${l.id} ${l.title}</span>`;
          return `<li class="${done ? "done" : ""}">${avail ? `<a href="${l.file}">${inner}</a>` : `<span class="soon">${inner}</span>`}</li>`;
        }).join("") + `</ol></details>`;
    });

    html += `<div class="tools">
      <a class="btn" href="slowniczek.html">Słowniczek pojęć</a>
      <button id="exp">Eksportuj postęp</button>
      <button id="imp">Importuj postęp</button>
      <button id="rst">Wyczyść postęp</button>
      <input type="file" id="impFile" accept="application/json" hidden>
    </div>
    <p class="small">Postęp jest zapisany tylko w tej przeglądarce. Eksport/import przenosi go między urządzeniami.</p>`;
    main.innerHTML = html;

    document.getElementById("exp").onclick = () => {
      const blob = new Blob([JSON.stringify(P, null, 2)], { type: "application/json" });
      const a = el("a", { href: URL.createObjectURL(blob), download: "postep-kursu-ai.json" });
      document.body.appendChild(a); a.click(); a.remove();
    };
    const f = document.getElementById("impFile");
    document.getElementById("imp").onclick = () => f.click();
    f.onchange = async () => {
      try {
        const data = JSON.parse(await f.files[0].text());
        if (!data.done) throw new Error();
        P = Object.assign({ done: {}, quiz: {}, last: null }, data); save(P); location.reload();
      } catch (e) { alert("Nieprawidłowy plik postępu."); }
    };
    document.getElementById("rst").onclick = () => {
      if (confirm("Usunąć cały zapisany postęp?")) { P = { done: {}, quiz: {}, last: null }; save(P); location.reload(); }
    };
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (document.body.dataset.lesson) lessonPage(document.body.dataset.lesson);
    else if (document.body.dataset.page === "glossary") glossaryPage();
    else indexPage();
  });
})();
