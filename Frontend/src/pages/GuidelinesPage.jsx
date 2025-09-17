import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaBook } from 'react-icons/fa';
import Layout from '../components/layout/Layout';
import MobileNavigation from '../components/layout/MobileNavigation';

const GuidelinesPage = () => {
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
          <div className="flex items-center">
            <FaBook className="text-indigo-500 mr-3" size={24} />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Wytyczne dla autorów</h1>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="text-gray-700 dark:text-gray-300 space-y-6">
            <p className="text-base leading-relaxed">
              Zachęcamy do pisania wysokiej jakości tekstów, które angażują czytelników. Chociaż nie oczekujemy perfekcji, szczególnie od nowych autorów, mamy pewne podstawowe standardy jakości:
            </p>

            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Standardy jakości</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-gray-900 dark:text-white">Poprawne formatowanie:</strong> Używaj akapitów, rozdziałów i odpowiednich odstępów, aby Twoje treści były czytelne.</li>
                <li><strong className="text-gray-900 dark:text-white">Podstawowa gramatyka i ortografia:</strong> Chociaż sporadyczne błędy są zrozumiałe, treść powinna być w miarę wolna od błędów ortograficznych i gramatycznych.</li>
                <li><strong className="text-gray-900 dark:text-white">Spójna narracja:</strong> Twoja historia powinna mieć klarowną fabułę i rozwój postaci, nawet jeśli jest eksperymentalna w stylu.</li>
                <li><strong className="text-gray-900 dark:text-white">Oryginalna treść:</strong> Wszystkie treści muszą być Twoim oryginalnym dziełem lub odpowiednio oznaczone, jeśli korzystasz z treści na licencjach otwartych.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Zabronione treści</h2>
              <p className="mb-4">Następujące rodzaje treści są zabronione w Opowiadamy:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-gray-900 dark:text-white">Treści splagiatowane:</strong> Kopiowanie cudzej pracy bez pozwolenia jest surowo zabronione.</li>
                <li><strong className="text-gray-900 dark:text-white">Treści nieodpowiednie z udziałem nieletnich:</strong> Wszelkie treści przedstawiające nieletnich w sytuacjach nieodpowiednich są kategorycznie zabronione.</li>
                <li><strong className="text-gray-900 dark:text-white">Mowa nienawiści:</strong> Treści promujące dyskryminację lub przemoc wobec osób lub grup ze względu na takie cechy jak rasa, religia, niepełnosprawność, płeć, orientacja seksualna itp.</li>
                <li><strong className="text-gray-900 dark:text-white">Nadmierna przemoc:</strong> Chociaż niektóre gatunki, takie jak horror, mogą zawierać elementy przemocy, nieuzasadniona przemoc bez celu narracyjnego jest odradzana.</li>
                <li><strong className="text-gray-900 dark:text-white">Spam i reklama:</strong> Treści stworzone głównie w celu promowania produktów lub usług, a nie opowiadania historii.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Najlepsze praktyki publikowania</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Informacje o powieści</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong className="text-gray-900 dark:text-white">Tytuł:</strong> Wybierz tytuł, który odzwierciedla Twoją historię i jest wystarczająco unikalny, aby się wyróżniać.</li>
                    <li><strong className="text-gray-900 dark:text-white">Opis:</strong> Napisz przekonujący opis, który da czytelnikom przedsmak tego, czego mogą się spodziewać, nie zdradzając głównych punktów fabuły.</li>
                    <li><strong className="text-gray-900 dark:text-white">Obraz okładki:</strong> Chociaż opcjonalny, obraz okładki może pomóc Twojej powieści przyciągnąć więcej czytelników. Upewnij się, że masz prawa do używania każdego obrazu.</li>
                    <li><strong className="text-gray-900 dark:text-white">Gatunki i tagi:</strong> Wybierz odpowiednie gatunki i tagi, aby pomóc czytelnikom znaleźć Twoją pracę.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Struktura rozdziału</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong className="text-gray-900 dark:text-white">Długość:</strong> Chociaż nie ma ścisłych wymagań, rozdziały o długości 2000-5000 słów zwykle dobrze sprawdzają się przy czytaniu online.</li>
                    <li><strong className="text-gray-900 dark:text-white">Konsekwencja:</strong> Staraj się utrzymywać spójny harmonogram publikacji, aby budować i utrzymywać grono odbiorców.</li>
                    <li><strong className="text-gray-900 dark:text-white">Formatowanie:</strong> Używaj edytora tekstu sformatowanego, aby poprawić czytelność dzięki odpowiednim akapitom, wyróżnieniom i innym narzędziom formatującym.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Zaangażowanie czytelników</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong className="text-gray-900 dark:text-white">Odpowiadaj na komentarze:</strong> Interakcja z komentarzami czytelników może pomóc w budowaniu lojalnej publiczności.</li>
                    <li><strong className="text-gray-900 dark:text-white">Notatki od autora:</strong> Rozważ dodawanie krótkich notatek przed lub po rozdziałach, aby zapewnić kontekst lub nawiązać kontakt z czytelnikami.</li>
                    <li><strong className="text-gray-900 dark:text-white">Aktualizacje:</strong> Jeśli potrzebujesz przerwy lub zmiany harmonogramu publikacji, poinformuj o tym swoich czytelników.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Klasyfikacja wiekowa treści</h2>
              <p className="mb-4">Aby pomóc czytelnikom znaleźć odpowiednie treści, prosimy o odpowiednie oznaczenie Twojej powieści:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong className="text-gray-900 dark:text-white">Dla wszystkich grup wiekowych:</strong> Treści odpowiednie dla czytelników w każdym wieku.</li>
                <li><strong className="text-gray-900 dark:text-white">Dla nastolatków (13+):</strong> Może zawierać łagodny język, przemoc lub sugestywne tematy.</li>
                <li><strong className="text-gray-900 dark:text-white">Dla dorosłych (18+):</strong> Zawiera tematy dla dorosłych, wulgaryzmy, przemoc lub treści seksualne.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Prawa autorskie i własność intelektualna</h2>
              <p className="mb-4">Jako autor w Opowiadamy:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Zachowujesz prawa autorskie do swoich oryginalnych treści.</li>
                <li>Publikując w Opowiadamy, udzielasz nam niewyłącznej licencji na wyświetlanie i promowanie Twojej pracy na naszej platformie.</li>
                <li>Możesz usunąć swoje treści w dowolnym momencie, chociaż nie możemy zagwarantować, że wszystkie zapisane w pamięci podręcznej lub udostępnione wersje zostaną usunięte z internetu.</li>
                <li>Jeśli uważasz, że ktoś splagiatował Twoją pracę, skontaktuj się z naszym zespołem wsparcia, przedstawiając dowody.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Wsparcie i opinie</h2>
              <p className="mb-4">Jeśli masz pytania dotyczące tych wytycznych lub potrzebujesz pomocy w pisaniu, skontaktuj się z naszym zespołem wsparcia. Zależy nam na tym, aby pomóc autorom odnieść sukces na naszej platformie.</p>
              <p>Dziękujemy za bycie częścią społeczności Opowiadamy i za dzielenie się swoimi historiami z naszymi czytelnikami!</p>
            </div>
          </div>
        </div>
      </div>
      
      <MobileNavigation />
    </Layout>
  );
};

export default GuidelinesPage;