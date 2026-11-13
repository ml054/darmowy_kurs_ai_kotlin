// Manifest kursu. Dodając lekcję: dopisz ją tutaj i utwórz plik mX/lY.html.
window.COURSE = {
  title: "AI na produkcji",
  subtitle: "Spring Boot + Kotlin, TypeScript/React",
  modules: [
    { id: 1, title: "Aplikacja i środowisko pracy z AI", lessons: [
      { id: "1.1", file: "m1/l1.html", title: "System HelpDesk: architektura, API, uprawnienia" },
      { id: "1.2", file: "m1/l2.html", title: "Pierwsze wywołanie modelu z Kotlina" },
      { id: "1.3", file: "m1/l3.html", title: "LiteLLM jako proxy: klucze, dostawcy, aliasy" },
      { id: "1.4", file: "m1/l4.html", title: "Tracing i obserwowalność" },
      { id: "1.5", file: "m1/l5.html", title: "Timeouty, retry, limity, fallback" },
      { id: "1.6", file: "m1/l6.html", title: "Wybór modelu: jakość, koszt, szybkość" }
    ]},
    { id: 2, title: "Asystent informacyjny", lessons: [
      { id: "2.1", file: "m2/l1.html", title: "Tool calling: narzędzia tylko do odczytu" },
      { id: "2.2", file: "m2/l2.html", title: "Kontekst użytkownika i izolacja klientów" },
      { id: "2.3", file: "m2/l3.html", title: "Streaming SSE i UI w React/TS" },
      { id: "2.4", file: "m2/l4.html", title: "Prompty pod caching i wersjonowanie" },
      { id: "2.5", file: "m2/l5.html", title: "Pamięć rozmowy" },
      { id: "2.6", file: "m2/l6.html", title: "Pomiar kosztu i opóźnień" },
      { id: "2.7", file: "m2/l7.html", title: "Dane osobowe: Presidio" },
      { id: "2.8", file: "m2/l8.html", title: "Pierwsze evale" }
    ]},
    { id: 3, title: "Asystent operacyjny", lessons: [
      { id: "3.1", file: "m3/l1.html", title: "Narzędzia zapisu" },
      { id: "3.2", file: "m3/l2.html", title: "Pętla agenta, limity, kill switch" },
      { id: "3.3", file: "m3/l3.html", title: "Uprawnienia i walidacja w backendzie" },
      { id: "3.4", file: "m3/l4.html", title: "Prompt injection" },
      { id: "3.5", file: "m3/l5.html", title: "Idempotencja i potwierdzenia" },
      { id: "3.6", file: "m3/l6.html", title: "Audyt działań agenta" },
      { id: "3.7", file: "m3/l7.html", title: "Evale jako bramka CI" }
    ]},
    { id: 4, title: "Baza wiedzy (RAG)", lessons: [
      { id: "4.1", file: "m4/l1.html", title: "Architektura RAG, embeddingi, pgvector" },
      { id: "4.2", file: "m4/l2.html", title: "Import wiedzy: chunking, metadane" },
      { id: "4.3", file: "m4/l3.html", title: "Aktualizacja i usuwanie dokumentów" },
      { id: "4.4", file: "m4/l4.html", title: "Wyszukiwanie z uprawnieniami" },
      { id: "4.5", file: "m4/l5.html", title: "Źródła brakujące, sprzeczne, nieaktualne" },
      { id: "4.6", file: "m4/l6.html", title: "Model dobrany do zadania, koszty" },
      { id: "4.7", file: "m4/l7.html", title: "Evale wyszukiwania i odpowiedzi" }
    ]},
    { id: 5, title: "Agent procesowy i wdrożenie", lessons: [
      { id: "5.1", file: "m5/l1.html", title: "Workflow czy agent" },
      { id: "5.2", file: "m5/l2.html", title: "Triage: structured outputs i walidacja" },
      { id: "5.3", file: "m5/l3.html", title: "Human-in-the-loop" },
      { id: "5.4", file: "m5/l4.html", title: "Shadow mode, rollout, rollback" },
      { id: "5.5", file: "m5/l5.html", title: "Wznawianie po restarcie" },
      { id: "5.6", file: "m5/l6.html", title: "LLM-as-a-judge i kalibracja" },
      { id: "5.7", file: "m5/l7.html", title: "Monitoring i koszt na zadanie" }
    ]},
    { id: 6, title: "Podsumowanie", lessons: [
      { id: "6.1", file: "m6/l1.html", title: "Sześć błędów produkcyjnych" },
      { id: "6.2", file: "m6/l2.html", title: "Checklista przed wdrożeniem AI" }
    ]}
  ],
  // Moduły już wygenerowane (pozostałe pokazywane jako "wkrótce").
  available: [1, 2]
};
