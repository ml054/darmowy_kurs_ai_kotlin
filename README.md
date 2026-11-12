# AI na produkcji – kurs

Statyczny kurs (HTML/CSS/JS, bez builda). Przykłady: Spring Boot + Kotlin, frontend TypeScript/React.

## Publikacja na GitHub Pages
1. Utwórz repozytorium i wrzuć zawartość tego folderu do gałęzi `main`.
2. Settings → Pages → Source: *Deploy from a branch*, Branch: `main`, folder `/ (root)`.
3. Strona będzie pod `https://<login>.github.io/<repo>/`.

## Struktura
- `index.html` – lista modułów i postęp
- `assets/course.js` – manifest modułów i lekcji (`available` = gotowe moduły)
- `assets/app.js` – postęp (localStorage), quizy, nawigacja, eksport/import
- `mX/lY.html` – lekcje; `_template.html` – szablon nowej lekcji

Kod w lekcjach: `<script type="text/x-code" data-lang="kotlin">` (bez escapowania `<`).
Postęp: localStorage `aiprod-progress-v1`; eksport/import JSON na stronie głównej.
