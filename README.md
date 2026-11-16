# AI na produkcji – kurs

Statyczny kurs (HTML/CSS/JS, bez builda), przygotowany do nauki na telefonie i tablecie. Przykłady: Spring Boot + Kotlin, Spring AI, frontend TypeScript/React. Język: polski.

6 modułów, 37 lekcji: aplikacja i środowisko AI, asystent informacyjny, asystent operacyjny, baza wiedzy (RAG), agent procesowy i wdrożenie, podsumowanie z checklistą przed wdrożeniem.

## Publikacja na GitLab Pages

GitLab Pages publikuje to, co job `pages` w CI zostawi w katalogu `public/`. Strona nie wymaga builda, więc job tylko kopiuje pliki.

1. Dodaj w katalogu głównym repozytorium plik `.gitlab-ci.yml`:

   ```yaml
   pages:
     stage: deploy
     image: alpine:latest
     script:
       - mkdir -p public
       - cp -r index.html slowniczek.html assets m[0-9] public/
     artifacts:
       paths:
         - public
     rules:
       - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
   ```

   Kopiowane są tylko pliki strony; pliki robocze (`_*.md`, `_check.js`, `CLAUDE.md`, `node_modules/`) nie trafiają do publikacji.

2. Wypchnij zmiany na gałąź domyślną (np. `main`). Pipeline uruchomi job `pages`; jego postęp widać w **Build → Pipelines**.
3. Adres strony znajdziesz w **Deploy → Pages**. Zwykle to `https://<namespace>.gitlab.io/<projekt>/`; przy włączonej opcji unikalnej domeny GitLab nadaje adres w postaci `https://<projekt>-<identyfikator>.gitlab.io/`.
4. Dla projektu prywatnego ustaw widoczność Pages w **Settings → General → Visibility, project features, permissions → Pages** (np. „Everyone”, jeśli kurs ma być publiczny).

Nazwy menu i opcji różnią się między wersjami GitLaba (gitlab.com i self-managed) – w razie wątpliwości sprawdź dokumentację GitLab Pages dla swojej wersji.

Wszystkie odnośniki w kursie są względne, więc strona działa zarówno pod ścieżką projektu, jak i pod własną domeną. Plik `.nojekyll` jest potrzebny tylko na GitHub Pages; GitLab go ignoruje.

## Podgląd lokalny

Wystarczy otworzyć `index.html` w przeglądarce. Do testów na telefonie w tej samej sieci możesz uruchomić dowolny serwer plików, np.:

```bash
npx serve .
```

## Struktura

- `index.html` – lista modułów, postęp, eksport/import postępu
- `slowniczek.html` – słowniczek pojęć z wyszukiwarką
- `assets/course.js` – manifest modułów i lekcji (`available` = moduły widoczne na stronie)
- `assets/app.js` – postęp (localStorage `aiprod-progress-v1`), quizy, checklisty, spis treści, dymki słowniczka, nawigacja
- `assets/glossary.js` – hasła słowniczka (`id: { term, short, long, see }`)
- `assets/style.css`, `assets/highlight.min.js` – wygląd (jasny/ciemny motyw) i podświetlanie składni offline
- `mX/lY.html` – lekcje (`m1`–`m6`)

Pliki zaczynające się od `_` oraz `CLAUDE.md` to materiały robocze autora (są w `.gitignore`) i nie są częścią strony.

## Format lekcji (skrót)

- Kod: `<script type="text/x-code" data-lang="kotlin" data-title="Plik.kt">` – bez escapowania `<` i `>`.
- Pojęcie ze słowniczka: `<dfn data-t="eval">evale</dfn>` → klikalny termin z dymkiem.
- Quiz: `<div class="quiz" data-id="q1" data-correct="N">` z przyciskami i `<p class="explain">`.
- Checklista: `<ul class="checklist" data-id="grupa"><li data-id="punkt" data-level="pilot|auto">…</li></ul>` oraz `<div class="checklist-panel"></div>` (podsumowanie, filtr, druk).

Postęp, odpowiedzi w quizach i zaznaczenia w checkliście są zapisywane tylko w przeglądarce; eksport/import JSON na stronie głównej przenosi je między urządzeniami.
