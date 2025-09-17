import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaFileContract } from 'react-icons/fa';
import Layout from '../components/layout/Layout';
import MobileNavigation from '../components/layout/MobileNavigation';

const TermsPage = () => {
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
            <FaFileContract className="text-indigo-500 mr-3" size={24} />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Warunki korzystania</h1>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="text-gray-700 dark:text-gray-300 space-y-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">Ostatnia aktualizacja: 19 maja 2025</p>
            
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">1. Akceptacja warunków</h2>
              <p className="leading-relaxed">
                Uzyskując dostęp lub korzystając z platformy Opowiadamy („Platforma"), zgadzasz się przestrzegać niniejszych Warunków korzystania („Warunki") oraz naszej Polityki prywatności. Jeśli nie zgadzasz się z tymi Warunkami, prosimy o nieporzystanie z Platformy.
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">2. Opis usługi</h2>
              <p className="leading-relaxed">
                Opowiadamy to platforma umożliwiająca użytkownikom tworzenie, publikowanie, czytanie i interakcję z powieściami internetowymi oraz innymi treściami pisanymi. Platforma zapewnia narzędzia do pisania, odkrywania i angażowania się w historie różnych gatunków.
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">3. Konta użytkowników</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>3.1. Musisz utworzyć konto, aby uzyskać dostęp do określonych funkcji Platformy.</li>
                <li>3.2. Jesteś odpowiedzialny za zachowanie poufności danych logowania do swojego konta.</li>
                <li>3.3. Jesteś odpowiedzialny za wszystkie działania podejmowane na Twoim koncie.</li>
                <li>3.4. Musisz podać dokładne i kompletne informacje podczas tworzenia konta.</li>
                <li>3.5. Zastrzegamy sobie prawo do zawieszenia lub usunięcia kont naruszających te Warunki.</li>
              </ul>
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">4. Treści użytkowników</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>4.1. Zachowujesz własność treści, które tworzysz i publikujesz na Platformie.</li>
                <li>4.2. Publikując treści na Platformie, udzielasz Opowiadamy niewyłącznej, światowej, bezpłatnej licencji na użytkowanie, reprodukowanie, modyfikowanie, adaptowanie, publikowanie, tłumaczenie i dystrybucję Twoich treści w związku z działaniem Platformy.</li>
                <li>4.3. Jesteś wyłącznie odpowiedzialny za treści, które publikujesz oraz konsekwencje ich udostępniania.</li>
                <li>4.4. Zastrzegamy sobie prawo do usuwania treści naruszających te Warunki lub uznanych przez nas za nieodpowiednie.</li>
              </ul>
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">5. Zabronione treści</h2>
              <p className="mb-4">Zabronione są następujące rodzaje treści:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>5.1. Treści nielegalne, szkodliwe, groźne, obraźliwe, nękające, zniesławiające, wulgarne, nieprzyzwoite lub w inny sposób nieodpowiednie.</li>
                <li>5.2. Treści naruszające prawa własności intelektualnej innych osób.</li>
                <li>5.3. Treści promujące działania nielegalne lub szkodzące osobom lub grupom.</li>
                <li>5.4. Spam, phishing lub inne oszukańcze praktyki.</li>
                <li>5.5. Treści zawierające malware, wirusy lub inny szkodliwy kod.</li>
              </ul>
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">6. Własność intelektualna</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>6.1. Opowiadamy oraz jego treści, funkcje i funkcjonalność są własnością Opowiadamy i są chronione prawami autorskimi, znakami towarowymi oraz innymi prawami własności intelektualnej.</li>
                <li>6.2. Nie możesz kopiować, modyfikować, dystrybuować, sprzedawać ani dzierżawić żadnej części Platformy bez naszej wyraźnej zgody.</li>
              </ul>
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">7. Zachowanie użytkowników</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>7.1. Zgadzasz się korzystać z Platformy zgodnie ze wszystkimi obowiązującymi prawami i przepisami.</li>
                <li>7.2. Nie będziesz angażować się w działania, które zakłócają lub interferują z funkcjonalnością Platformy.</li>
                <li>7.3. Nie będziesz próbować uzyskać dostępu do kont lub danych, do których nie masz autoryzacji.</li>
                <li>7.4. Nie będziesz używać automatycznych systemów lub oprogramowania do wydobywania danych z Platformy (scraping).</li>
              </ul>
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">8. Rozwiązanie umowy</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>8.1. Zastrzegamy sobie prawo do zawieszenia lub zakończenia Twojego dostępu do Platformy w przypadku naruszenia tych Warunków.</li>
                <li>8.2. Możesz zakończyć korzystanie z konta w dowolnym momencie, postępując zgodnie z instrukcjami na Platformie.</li>
              </ul>
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">9. Wyłączenie gwarancji</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>9.1. Platforma jest dostarczana „tak jak jest" i „według dostępności" bez gwarancji jakiegokolwiek rodzaju.</li>
                <li>9.2. Nie gwarantujemy, że Platforma będzie działać nieprzerwanie, bezpiecznie lub bez błędów.</li>
              </ul>
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">10. Ograniczenie odpowiedzialności</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>10.1. Nie ponosimy odpowiedzialności za jakiekolwiek pośrednie, przypadkowe, specjalne, następcze lub karne szkody wynikające z korzystania przez Ciebie z Platformy.</li>
                <li>10.2. Nasza odpowiedzialność wobec Ciebie z jakiejkolwiek przyczyny jest ograniczona do kwoty, którą nam zapłaciłeś za korzystanie z Platformy (jeśli w ogóle).</li>
              </ul>
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">11. Zmiany w Warunkach</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>11.1. Możemy modyfikować te Warunki w dowolnym momencie, publikując zmienione Warunki na Platformie.</li>
                <li>11.2. Twoje dalsze korzystanie z Platformy po opublikowaniu zmienionych Warunków stanowi akceptację takich zmian.</li>
              </ul>
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">12. Prawo właściwe</h2>
              <p className="leading-relaxed">
                Te Warunki podlegają prawu polskiemu i będą interpretowane zgodnie z nim, bez uwzględnienia jego zasad kolizyjnych.
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">13. Informacje kontaktowe</h2>
              <p className="leading-relaxed">
                Jeśli masz pytania dotyczące tych Warunków, skontaktuj się z nami pod adresem: support@opowiadamy.pl
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <MobileNavigation />
    </Layout>
  );
};

export default TermsPage;