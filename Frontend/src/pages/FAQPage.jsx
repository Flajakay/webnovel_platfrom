import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaQuestionCircle, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import Layout from '../components/layout/Layout'; // Assuming these components exist
import MobileNavigation from '../components/layout/MobileNavigation'; // Assuming these components exist

const FAQPage = () => {
  // State to track which categories are expanded
  const [expandedCategories, setExpandedCategories] = useState({
    'Ogólne': true, // Open the first category by default
    'Czytanie': false,
    'Pisanie': false,
    'Konto i Wsparcie': false
  });

  // State to track which accordion items are expanded
  const [expandedItems, setExpandedItems] = useState({});

  // Toggle function for accordion items
  const toggleAccordion = (itemKey) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemKey]: !prev[itemKey]
    }));
  };

  // Toggle function for category expansion
  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Group FAQ items by category with Polish translations
  const faqCategories = {
    'Ogólne': [
      {
        question: "Czym jest Opowiadamy?",
        answer: "Opowiadamy to platforma do dzielenia się, odkrywania i czytania powieści internetowych. Zapewnia przestrzeń dla autorów do publikowania swoich historii oraz dla czytelników do znajdowania nowych i ekscytujących treści. Nazwa 'Opowiadamy' pochodzi z języka polskiego."
      },
      {
        question: "Jak mogę założyć konto?",
        answer: "Aby założyć konto, kliknij przycisk 'Zarejestruj się' w prawym górnym rogu strony. Wypełnij wymagane informacje, w tym unikalną nazwę użytkownika, adres e-mail i bezpieczne hasło. Po wypełnieniu formularza kliknij 'Zarejestruj się', aby utworzyć konto."
      },
      {
        question: "Czy korzystanie z Opowiadamy jest darmowe?",
        answer: "Tak, korzystanie z Opowiadamy jest całkowicie darmowe. Możesz czytać opowiadania, zakładać konto i publikować własne prace bez żadnych kosztów."
      }
    ],
    'Czytanie': [
      {
        question: "Jak mogę znaleźć nowe powieści do czytania?",
        answer: "Możesz przeglądać powieści, przechodząc na stronę 'Przeglądaj' z głównego menu. Tam możesz filtrować powieści według gatunku, statusu i popularności. Możesz również użyć funkcji wyszukiwania, aby znaleźć konkretne tytuły lub autorów."
      },
      {
        question: "Jak dodać powieść do mojej biblioteki?",
        answer: "Podczas czytania powieści kliknij przycisk 'Dodaj do biblioteki' na stronie powieści. Następnie możesz uzyskać dostęp do swojej biblioteki z profilu lub poprzez opcję 'Biblioteka' w menu nawigacyjnym."
      },
      {
        question: "Jak działają oceny?",
        answer: "Użytkownicy mogą oceniać powieści w skali od 1 do 5 gwiazdek. Średnia ocena powieści jest wyświetlana na jej stronie. Możesz ocenić powieść, klikając sekcję ocen gwiazdkowych na stronie powieści."
      },
      {
        question: "Czy mogę komentować powieści?",
        answer: "Tak, zalogowani użytkownicy mogą zostawiać komentarze pod powieściami. Sekcję komentarzy znajdziesz na dole strony powieści. Możesz również odpowiadać na komentarze innych użytkowników, edytować własne komentarze lub je usuwać."
      }
    ],
    'Pisanie': [
      {
        question: "Jak zacząć pisać własną powieść?",
        answer: "Po utworzeniu konta i zalogowaniu się przejdź do Panelu Autora, klikając swoje zdjęcie profilowe i wybierając 'Panel'. Następnie kliknij 'Utwórz nową powieść', wypełnij szczegóły dotyczące powieści i zacznij dodawać rozdziały."
      },
      {
        question: "Czy mogę edytować opublikowane prace?",
        answer: "Tak, możesz edytować swoje powieści i rozdziały w dowolnym momencie. Po prostu przejdź do Panelu Autora, znajdź powieść, którą chcesz edytować, i kliknij przycisk 'Edytuj'. W przypadku rozdziałów możesz albo kliknąć przycisk 'Edytuj' obok rozdziału na stronie szczegółów powieści, albo przejść do sekcji 'Zarządzaj rozdziałami' swojej powieści."
      },
      {
        question: "Jak dodać rozdziały do mojej powieści?",
        answer: "Z Panelu Autora kliknij swoją powieść, a następnie 'Dodaj rozdział'. Możesz również uzyskać dostęp do tej funkcji poprzez sekcję 'Zarządzaj rozdziałami' swojej powieści. Wypełnij tytuł rozdziału, treść i wybierz, czy opublikować go natychmiast, czy zapisać jako wersję roboczą."
      },
      {
        question: "Jakie gatunki są dostępne na Opowiadamy?",
        answer: "Opowiadamy wspiera szeroką gamę gatunków, w tym Fantasy, Science Fiction, Kryminał, Thriller, Romans, Horror, Przygodowe, Historyczne, Dramat, Komedia, Akcja, Obyczajowe (Slice of Life), Nadprzyrodzone, Sportowe i Psychologiczne."
      },
      {
        question: "Czy istnieje limit słów dla rozdziałów?",
        answer: "Chociaż nie ma ścisłego limitu słów, zalecamy utrzymywanie rozdziałów w granicach 2000-5000 słów dla optymalnego doświadczenia czytelniczego. Każdy rozdział ma techniczny limit 50 000 znaków."
      },
      {
        question: "Czy mogę dodawać obrazy do moich rozdziałów?",
        answer: "Obecnie Opowiadamy obsługuje tylko treść tekstową w rozdziałach. Możesz przesłać obraz okładki dla swojej powieści, ale poszczególne rozdziały są wyłącznie tekstowe."
      }
    ],
    'Konto i Wsparcie': [
      {
        question: "Jak mogę zmienić ustawienia konta?",
        answer: "Aby zmienić ustawienia konta, kliknij swoje zdjęcie profilowe w prawym górnym rogu i wybierz 'Profil'. Stamtąd możesz edytować informacje profilowe, zmienić hasło i zaktualizować inne ustawienia."
      },
      {
        question: "Jak mogę zgłosić nieodpowiednie treści?",
        answer: "Jeśli znajdziesz treści naruszające nasze warunki korzystania z usługi, użyj opcji 'Zgłoś' znajdującej się przy danej powieści lub komentarzu. Nasi moderatorzy przejrzą zgłoszenie i podejmą odpowiednie działania."
      }
    ]
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8 pb-24 md:pb-8">
        <div className="flex items-center mb-6">
          <Link
            to="/"
            className="mr-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <FaArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Najczęściej Zadawane Pytania</h1>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          {/* Navigation tabs for FAQ categories */}
          <div className="flex flex-wrap mb-6 border-b border-gray-200 dark:border-gray-700">
            {Object.keys(faqCategories).map((category) => (
              <button
                key={category}
                className={`px-4 py-2 font-medium text-sm mr-2 ${expandedCategories[category]
                    ? 'text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500'
                    : 'text-gray-600 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-300'}`}
                onClick={() => {
                  // Reset all categories to false, then set the clicked one to true
                  const resetCategories = Object.keys(faqCategories).reduce((acc, cat) => {
                    acc[cat] = cat === category;
                    return acc;
                  }, {});
                  setExpandedCategories(resetCategories);
                }}
              >
                {category}
              </button>
            ))}
          </div>

          {/* FAQ accordions by category */}
          <div className="space-y-6">
            {Object.keys(faqCategories).map((category) => (
              <div key={category} className={expandedCategories[category] ? 'block' : 'hidden'}>
                {faqCategories[category].map((item, index) => {
                  const itemKey = `${category}-${index}`; // Keep itemKey in English for consistency if it's not user-facing
                  return (
                    <div key={itemKey} className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4 last:border-b-0 last:mb-0 last:pb-0">
                      <button
                        className="flex items-start justify-between w-full text-left focus:outline-none group hover:text-indigo-600 dark:hover:text-indigo-400"
                        onClick={() => toggleAccordion(itemKey)}
                        aria-expanded={expandedItems[itemKey]}
                        aria-controls={`faq-answer-${itemKey}`}
                      >
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                          <FaQuestionCircle className="text-indigo-500 mr-2 flex-shrink-0" />
                          <span>{item.question}</span>
                        </h3>
                        <span className="ml-2 text-indigo-500 flex-shrink-0 transition-transform duration-200">
                          {expandedItems[itemKey] ? <FaChevronUp /> : <FaChevronDown />}
                        </span>
                      </button>
                      <div
                        id={`faq-answer-${itemKey}`}
                        className={`mt-2 pl-8 overflow-hidden transition-all duration-300 ${expandedItems[itemKey] ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`} // Increased max-h for potentially longer answers
                      >
                        <p className="text-gray-700 dark:text-gray-300 py-2">{item.answer}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
            <h3 className="text-lg font-medium text-indigo-700 dark:text-indigo-300 mb-2">Nadal masz pytania?</h3>
            <p className="text-indigo-600 dark:text-indigo-400 mb-4">Jeśli nie znalazłeś(-aś) odpowiedzi na swoje pytanie, skontaktuj się z nami.</p>
            <Link
              to="/contact" // Assuming this route exists
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Skontaktuj się z pomocą
            </Link>
          </div>
        </div>
      </div>

      <MobileNavigation />
    </Layout>
  );
};

export default FAQPage;