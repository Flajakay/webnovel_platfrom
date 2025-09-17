import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaShieldAlt } from 'react-icons/fa';
import Layout from '../components/layout/Layout';
import MobileNavigation from '../components/layout/MobileNavigation';

const PrivacyPage = () => {
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
            <FaShieldAlt className="text-indigo-500 mr-3" size={24} />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Polityka prywatności</h1>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="text-gray-700 dark:text-gray-300 space-y-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">Ostatnia aktualizacja: 19 maja 2025</p>
            
            <p className="leading-relaxed">
              W Opowiadamy poważnie traktujemy Twoją prywatność. Ta Polityka prywatności wyjaśnia, jak gromadzimy, używamy, ujawniamy i chronimy Twoje informacje podczas korzystania z naszej platformy. Prosimy o uważne przeczytanie tej polityki prywatności. Jeśli nie zgadzasz się z warunkami tej polityki prywatności, prosimy o nieporzystanie z platformy.
            </p>
            
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">1. Gromadzenie Twoich informacji</h2>
              <p className="mb-4 leading-relaxed">
                Możemy gromadzić informacje o Tobie na różne sposoby. Informacje, które możemy gromadzić za pośrednictwem Platformy, obejmują:
              </p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">1.1. Dane osobowe</h3>
                  <p className="leading-relaxed">
                    Informacje umożliwiające identyfikację osoby, takie jak imię i nazwisko, adres e-mail i nazwa użytkownika, które dobrowolnie przekazujesz nam podczas rejestracji na Platformie lub gdy decydujesz się uczestniczyć w różnych działaniach związanych z Platformą. Nie masz obowiązku przekazywania nam danych osobowych jakiegokolwiek rodzaju, jednak odmowa może uniemożliwić korzystanie z niektórych funkcji Platformy.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">1.2. Dane pochodne</h3>
                  <p className="leading-relaxed">
                    Informacje automatycznie gromadzone przez nasze serwery podczas dostępu do Platformy, takie jak adres IP, typ przeglądarki, system operacyjny, czasy dostępu oraz strony, które oglądałeś bezpośrednio przed i po uzyskaniu dostępu do Platformy.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">1.3. Treści użytkownika</h3>
                  <p className="leading-relaxed">
                    Treści takie jak opowiadania, komentarze i oceny, które publikujesz na Platformie.
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">2. Wykorzystanie Twoich informacji</h2>
              <p className="mb-4 leading-relaxed">
                Posiadanie dokładnych informacji o Tobie pozwala nam zapewnić Ci płynne, wydajne i spersonalizowane doświadczenie. W szczególności możemy wykorzystywać informacje zebrane o Tobie za pośrednictwem Platformy do:
              </p>
              
              <ul className="list-disc pl-6 space-y-2">
                <li>Tworzenia i zarządzania Twoim kontem.</li>
                <li>Kompilowania anonimowych danych statystycznych i analiz do użytku wewnętrznego lub z podmiotami trzecimi.</li>
                <li>Dostarczania ukierunkowanej reklamy, newsletterów i innych informacji dotyczących promocji i Platformy.</li>
                <li>Wysyłania e-maili dotyczących Twojego konta lub aktywności.</li>
                <li>Zwiększania wydajności i działania Platformy.</li>
                <li>Monitorowania i analizowania użytkowania oraz trendów w celu poprawy Twojego doświadczenia z Platformą.</li>
                <li>Powiadamiania o aktualizacjach Platformy.</li>
                <li>Rozwiązywania sporów i rozwiązywania problemów.</li>
              </ul>
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">3. Ujawnianie Twoich informacji</h2>
              <p className="mb-4 leading-relaxed">
                Możemy udostępniać informacje, które o Tobie zebraliśmy w określonych sytuacjach. Twoje informacje mogą być ujawnione w następujący sposób:
              </p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">3.1. Z mocy prawa lub w celu ochrony praw</h3>
                  <p className="leading-relaxed">
                    Jeśli uznamy, że ujawnienie informacji o Tobie jest konieczne do odpowiedzi na proces prawny, zbadania lub naprawienia potencjalnych naruszeń naszych zasad, lub ochrony praw, własności i bezpieczeństwa innych, możemy udostępnić Twoje informacje zgodnie z obowiązującym prawem, przepisami lub regulacjami.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">3.2. Zewnętrzni dostawcy usług</h3>
                  <p className="leading-relaxed">
                    Możemy udostępniać Twoje informacje stronom trzecim, które świadczą usługi dla nas lub w naszym imieniu, w tym przetwarzanie płatności, analiza danych, dostarczanie e-maili, usługi hostingowe, obsługa klienta i pomoc marketingowa.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">3.3. Komunikacja marketingowa</h3>
                  <p className="leading-relaxed">
                    Za Twoją zgodą lub z możliwością wycofania zgody możemy udostępniać Twoje informacje stronom trzecim w celach marketingowych.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">3.4. Publikacje online</h3>
                  <p className="leading-relaxed">
                    Gdy publikujesz komentarze, wkłady lub inne treści na Platformie, Twoje posty mogą być oglądane przez wszystkich użytkowników i mogą być publicznie dystrybuowane poza Platformą w nieskończoność.
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">4. Bezpieczeństwo Twoich informacji</h2>
              <p className="leading-relaxed">
                Stosujemy administracyjne, techniczne i fizyczne środki bezpieczeństwa, aby pomóc chronić Twoje dane osobowe. Chociaż podjęliśmy rozsądne kroki w celu zabezpieczenia przekazanych nam danych osobowych, należy pamiętać, że pomimo naszych wysiłków, żadne środki bezpieczeństwa nie są doskonałe ani nieprzenikalne, a żadna metoda transmisji danych nie może być gwarantowana przed jakimkolwiek przechwyceniem lub innym rodzajem nadużycia.
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">5. Polityka dotycząca dzieci</h2>
              <p className="leading-relaxed">
                Nie gromadzimy świadomie informacji od dzieci poniżej 13 roku życia ani nie kierujemy do nich reklam. Jeśli dowiesz się o jakichkolwiek danych, które zebraliśmy od dzieci poniżej 13 roku życia, skontaktuj się z nami natychmiast.
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">6. Twoje prawa dotyczące Twoich danych</h2>
              <p className="leading-relaxed">
                Masz prawo do dostępu, sprostowania, usunięcia lub ograniczenia przetwarzania swoich danych osobowych. Możesz skorzystać z tych praw, kontaktując się z nami bezpośrednio.
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">7. Zmiany w tej Polityce prywatności</h2>
              <p className="leading-relaxed">
                Możemy od czasu do czasu aktualizować tę politykę prywatności. Powiadomimy Cię o wszelkich zmianach, publikując nową politykę prywatności na tej stronie. Zalecamy okresowe przeglądanie tej polityki prywatności pod kątem wszelkich zmian.
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">8. Skontaktuj się z nami</h2>
              <p className="leading-relaxed">
                Jeśli masz pytania lub komentarze dotyczące tej Polityki prywatności, skontaktuj się z nami pod adresem: privacy@opowiadamy.pl
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <MobileNavigation />
    </Layout>
  );
};

export default PrivacyPage;