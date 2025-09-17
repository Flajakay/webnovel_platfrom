// Plik zawierający tłumaczenia na różne języki
const translations = {
  // Język polski
  pl: {
// Zarządzanie rozdziałami (ManageChaptersPage.jsx)
	manageChapters: {
	  title: "Zarządzaj rozdziałami",
	  novel: "Powieść",
	  addChapter: "Dodaj rozdział",
	  importFromEpub: "Importuj z EPUB",
	  chapter: "Rozdział",
	  chapterTitle: "Tytuł",
	  status: "Status",
	  reads: "Odczyty",
	  words: "Słowa",
	  updated: "Zaktualizowane",
	  actions: "Akcje",
	  noChapters: "Brak dostępnych rozdziałów.",
	  createFirstChapter: "Utwórz swój pierwszy rozdział",
	  importEpub: "Importuj EPUB",
	  importDialogTitle: "Importuj rozdziały z EPUB",
	  selectEpubFile: "Wybierz plik EPUB",
	  dragAndDrop: "Przeciągnij i upuść plik tutaj lub kliknij, aby wybrać",
	  selectFile: "Wybierz plik",
	  importOptions: "Opcje importu",
	  overwriteExisting: "Nadpisz istniejące rozdziały",
	  importAsDrafts: "Importuj jako szkice",
	  cancel: "Anuluj",
	  importing: "Importowanie...",
	  import: "Importuj",
	  importSuccess: "Import zakończony pomyślnie!",
	  importStats: "Zaimportowano {imported} z {total} rozdziałów",
	  importFailed: "Import nie powiódł się. Spróbuj ponownie.",
	  invalidFile: "Nieprawidłowy plik. Proszę wybrać prawidłowy plik EPUB.",
	  close: "Zamknij",
	  viewDetailsAndErrors: "Zobacz szczegóły i błędy",
	  errorsList: "Lista błędów",
	  errorInChapter: "Błąd w rozdziale {chapter}: {error}"
	},
    // Strona tworzenia powieści (CreateNovelPage.jsx)
    createNovelPage: {
      title: "Stwórz nową powieść",
      titleLabel: "Tytuł",
      captivatingTitle: "Wprowadź intrygujący tytuł",
      maxChars: "Maksymalnie {max} znaków",
      description: "Opis",
      writeDescription: "Napisz wciągający opis Twojej powieści",
      charsCount: "{current}/{max} znaków",
      genres: "Gatunki",
      selectUpTo: "(Wybierz do 5)",
      selectAtLeastOne: "Wybierz co najmniej jeden gatunek",
      tags: "Tagi",
      optional: "(Opcjonalne, do 10)",
      addTag: "Dodaj tag",
      tagsHelp: "Tagi pomagają czytelnikom znaleźć Twoją powieść (maks. {max} znaków na tag)",
      status: "Status",
      ongoing: "W toku",
      completed: "Zakończona",
      coverImage: "Okładka (Opcjonalna)",
      coverHelp: "Dobra okładka może przyciągnąć więcej czytelników. Zalecany rozmiar: 600x900 pikseli.",
      cancel: "Anuluj",
      creating: "Tworzenie...",
      create: "Stwórz powieść",
      selectGenreError: "Wybierz co najmniej jeden gatunek",
      maxGenresError: "Możesz wybrać maksymalnie {max} gatunków",
      tagExists: "Ten tag już istnieje",
      maxTagsError: "Możesz dodać maksymalnie {max} tagów",
      createFailed: "Nie udało się utworzyć powieści. Spróbuj ponownie."
    },
    // Nagłówek (Header.jsx)
    header: {
      home: "Strona główna",
      browse: "Przeglądaj",
      library: "Biblioteka",
      dashboard: "Panel autora",
      searchPlaceholder: "Szukaj powieści...",
      profile: "Profil",
      myNovels: "Moje powieści",
      logout: "Wyloguj się",
      login: "Zaloguj się",
      register: "Zarejestruj się"
    },

    // Stopka (Footer.jsx)
    footer: {
      description: "Platforma do udostępniania, odkrywania i czytania powieści internetowych. Dołącz do naszej społeczności autorów i czytelników.",
      resources: "Zasoby",
      genres: "Gatunki",
      trending: "Popularne",
      authors: "Autorzy",
      startWriting: "Zacznij pisać",
      guidelines: "Wytyczne",
      faq: "FAQ",
      legal: "Informacje prawne",
      privacyPolicy: "Polityka prywatności",
      termsConditions: "Warunki korzystania",
      allRightsReserved: "Wszelkie prawa zastrzeżone. Wykonane z",
      by: "przez studentów UMK."
    },

    // Strona główna (HomePage.jsx)
    homePage: {
      heroTitle: "Odkryj Niekończące się Historie",
      heroDescription: "Czytaj, pisz i udostępniaj oryginalne historie na Opowiadamy. Znajdź swoją następną ulubioną lekturę lub podziel się własną twórczością.",
      exploreStories: "Przeglądaj historie",
      startWriting: "Zacznij pisać",
      popularStories: "Popularne teraz",
      recentUpdates: "Ostatnio dodane",
      viewAll: "Zobacz wszystkie",
      loadingStories: "Ładowanie historii...",
	  "featured": "Wyróżnione",
      "readNow": "Czytaj teraz",
      "read": "Czytaj",
      "stories": "historie",
      "explore": "Przeglądaj",
      "defaultWriterBio": "Utalentowany gawędziarz tworzący wciągające narracje.",
      "novels": "powieści",
      "viewProfile": "Zobacz profil",
      "featuredStory": "Wyróżniona historia",
      "exploreGenres": "Przeglądaj gatunki",
      "viewAllGenres": "Zobacz wszystkie gatunki",
      "siteStats": "Statystyki strony",
      "totalReads": "Wszystkie odczyty",
      "totalStories": "Wszystkie historie",
      "activeAuthors": "Aktywni autorzy",
      "communityMembers": "Członkowie społeczności",
      "topWriters": "Najlepsi autorzy",
      "readerTestimonials": "Opinie czytelników",
      "testimonial1": {
          "quote": "Opowiadamy całkowicie zmieniło moje doświadczenie czytelnicze. Różnorodność historii jest niesamowita i odkryłem tak wielu utalentowanych autorów, których nie znalazłbym nigdzie indziej.",
          "author": "Marta C.",
          "role": "Zapamiętały czytelnik"
      },
      "testimonial2": {
          "quote": "Jako pisarz znalazłem tu niesamowitą społeczność. System informacji zwrotnej pomógł mi się rozwinąć, a obserwowanie, jak codziennie rośnie liczba moich czytelników, jest niezwykle motywujące..",
          "author": "Adam P.",
          "role": "Autor fantasy"
      },
      "testimonial3": {
          "quote": "Kosmiczny wygląd tej platformy sprawia, że czytanie przypomina podróż przez gwiazdy. Szczególnie podoba mi się kolekcja science fiction – nie ma sobie równych nigdzie indziej w Internecie..",
          "author": "Karolina W.",
          "role": "Entuzjastka science fiction"
      },
      "startWritingJourneyTitle": "Rozpocznij swoją przygodę z pisaniem już dziś",
      "startWritingJourneyDescription": "Dołącz do naszej społeczności pisarzy i dziel się swoimi historiami z czytelnikami na całym świecie. Uwolnij swoją kreatywność i zbuduj własne uniwersum literackie.",
      "goToDashboard": "Przejdź do panelu",
      "startWritingCta": "Zacznij pisać"
    },
// Szczegóły powieści (NovelDetailsPage.jsx)
    novelDetails: {
      loadError: "Nie udało się załadować powieści. Spróbuj ponownie później.",
      loadingDetails: "Ładowanie szczegółów powieści...",
      by: "autor",
      chapters: "rozdziałów",
      views: "wyświetleń",
      updated: "Zaktualizowano",
      startReading: "Rozpocznij czytanie",
      inLibrary: "W bibliotece",
      addToLibrary: "Dodaj do biblioteki",
      rate: "Oceń",
      editNovel: "Edytuj powieść",
      yourRating: "Twoja ocena",
      synopsis: "Streszczenie",
      manageChapters: "Zarządzaj rozdziałami",
      addChapter: "Dodaj rozdział",
      aboutAuthor: "O autorze",
      anonymous: "Anonimowy",
      noBioAvailable: "Brak dostępnego bio",
      novel: "Powieść",
      novels: "Powieści",
      rating: "Ocena",
      visitAuthorProfile: "Odwiedź profil autora",
      novelStatus: "Status powieści",
      status: "Status",
      ongoing: "W toku",
      completed: "Zakończona",
      unknown: "Nieznany",
      totalChapters: "Wszystkie rozdziały",
      published: "Opublikowano",
      tags: "Tagi"
    },
    // Strona logowania (LoginPage.jsx)
    loginPage: {
      title: "Zaloguj się do Opowiadamy",
      email: "Email",
      password: "Hasło",
      signIn: "Zaloguj się",
      signingIn: "Logowanie...",
      forgotPassword: "Zapomniałeś hasła?",
      noAccount: "Nie masz konta?",
      signUp: "Zarejestruj się",
      fillAllFields: "Wypełnij wszystkie pola",
      loginFailed: "Logowanie nie powiodło się. Sprawdź swoje dane."
    },

    // Strona rejestracji (RegisterPage.jsx)
    registerPage: {
      title: "Utwórz konto",
      username: "Nazwa użytkownika",
      email: "Email",
      password: "Hasło",
      confirmPassword: "Potwierdź hasło",
      dateOfBirth: "Data urodzenia",
      required: "*",
      createAccount: "Utwórz konto",
      creatingAccount: "Tworzenie konta...",
      haveAccount: "Masz już konto?",
      signIn: "Zaloguj się",
      publicDisplayName: "To będzie Twoja publiczna nazwa wyświetlana",
      atLeast8Chars: "Musi zawierać co najmniej 8 znaków",
      atLeast13Years: "Musisz mieć co najmniej 13 lat, aby się zarejestrować",
      registerSuccess: "Rejestracja zakończona pomyślnie! Zaloguj się na swoje nowe konto.",
      registerFailed: "Rejestracja nie powiodła się. Spróbuj ponownie.",
      validation: {
        usernameRequired: "Nazwa użytkownika jest wymagana",
        usernameLength: "Nazwa użytkownika musi mieć co najmniej 3 znaki",
        usernameMaxLength: "Nazwa użytkownika nie może przekraczać 20 znaków",
        emailRequired: "Email jest wymagany",
        emailInvalid: "Nieprawidłowy adres email",
        passwordRequired: "Hasło jest wymagane",
        passwordLength: "Hasło musi mieć co najmniej 8 znaków",
        passwordsDoNotMatch: "Hasła nie pasują do siebie",
        dobRequired: "Data urodzenia jest wymagana",
        dobAge: "Musisz mieć co najmniej 13 lat, aby się zarejestrować"
      }
    },

    // Strona resetowania hasła (ForgotPasswordPage.jsx)
    forgotPasswordPage: {
      title: "Zresetuj hasło",
      description: "Wprowadź swój adres email, a wyślemy Ci link do zresetowania hasła.",
      email: "Adres email",
      sendResetLink: "Wyślij link resetujący",
      sending: "Wysyłanie...",
      backToLogin: "Powrót do logowania",
      emailSent: "Email wysłany!",
      checkEmailTitle: "Sprawdź swoją skrzynkę pocztową",
      checkEmailDescription: "Jeśli konto z tym adresem email istnieje, wysłaliśmy link do zresetowania hasła.",
      didntReceive: "Nie otrzymałeś emaila?",
      resendLink: "Wyślij ponownie",
      emailRequired: "Adres email jest wymagany",
      emailInvalid: "Nieprawidłowy adres email",
      requestFailed: "Nie udało się wysłać linku resetującego. Spróbuj ponownie."
    },

    // Strona resetowania hasła (ResetPasswordPage.jsx)
    resetPasswordPage: {
      title: "Ustaw nowe hasło",
      description: "Wprowadź nowe hasło dla swojego konta.",
      newPassword: "Nowe hasło",
      confirmPassword: "Potwierdź nowe hasło",
      resetPassword: "Zresetuj hasło",
      resetting: "Resetowanie...",
      backToLogin: "Powrót do logowania",
      passwordResetSuccess: "Hasło zostało pomyślnie zresetowane!",
      successDescription: "Możesz się teraz zalogować używając nowego hasła.",
      goToLogin: "Przejdź do logowania",
      passwordRequired: "Hasło jest wymagane",
      passwordLength: "Hasło musi mieć co najmniej 8 znaków",
      passwordPattern: "Hasło musi zawierać co najmniej jedną wielką literę, jedną małą literę i jedną cyfrę",
      passwordsDoNotMatch: "Hasła nie pasują do siebie",
      invalidToken: "Nieprawidłowy lub wygasły token resetujący",
      resetFailed: "Nie udało się zresetować hasła. Spróbuj ponownie.",
      tokenExpired: "Link resetujący wygasł. Poproś o nowy link."
    },

    // Wspólne komunikaty
    common: {
      loading: "Ładowanie...",
      tryAgain: "Spróbuj ponownie",
      error: "Wystąpił błąd. Spróbuj ponownie później.",
      emailPlaceholder: "ty@przyklad.com",
      passwordPlaceholder: "••••••••",
      show: "Pokaż",
      hide: "Ukryj",
      add: "Dodaj"
    },

    // Komponenty powieści (NovelCard.jsx)
    novel: {
      by: "autor",
      unknown: "Nieznany",
      noDescription: "Brak opisu",
      chapters: "rozdziały",
      chapter: "rozdział",
      views: "wyświetlenia"
    },

    // Panel autora (AuthorDashboardPage.jsx)
    authorDashboard: {
      title: "Panel autora",
      createNewNovel: "Stwórz nową powieść",
      authorStats: "Twoje statystyki autora",
      totalNovels: "Wszystkie powieści",
      totalViews: "Wszystkie wyświetlenia",
      avgRating: "Średnia ocena",
      ratings: "ocen",
      totalChapters: "Wszystkie rozdziały",
      totalWords: "Wszystkie słowa",
      chapterReads: "Przeczytane rozdziały",
      yourNovels: "Twoje powieści",
      loadingNovels: "Ładowanie twoich powieści...",
      noNovels: "Nie stworzyłeś jeszcze żadnych powieści.",
      createFirstNovel: "Stwórz swoją pierwszą powieść",
      novel: "Powieść",
      stats: "Statystyki",
      status: "Status",
      lastUpdated: "Ostatnia aktualizacja",
      actions: "Akcje",
      editNovel: "Edytuj powieść",
      manageChapters: "Zarządzaj rozdziałami",
      addChapter: "Dodaj rozdział",
      deleteNovel: "Usuń powieść",
      confirmDelete: "Czy na pewno chcesz usunąć tę powieść? Tej operacji nie można cofnąć.",
      deleteFailed: "Nie udało się usunąć powieści. Spróbuj ponownie.",
      ongoing: "W toku",
      completed: "Zakończona",
      hiatus: "Wstrzymana"
    },

    // Biblioteka (LibraryPage.jsx)
    library: {
      title: "Moja biblioteka",
      loadingLibrary: "Ładowanie biblioteki...",
      emptyLibrary: "Twoja biblioteka jest pusta. Zacznij dodawać powieści, aby śledzić swoje czytanie!",
      emptyCategory: "Nie masz żadnych powieści w liście \"{category}\".",
      browseNovels: "Przeglądaj powieści",
      all: "Wszystkie",
      willRead: "Chcę przeczytać",
      reading: "Czytam",
      completed: "Zakończone",
      onHold: "Wstrzymane",
      dropped: "Porzucone",
      lastRead: "Ostatnio przeczytane: Rozdz.",
      changeStatus: "Zmień status",
      removeFromLibrary: "Usuń z biblioteki",
      continueReading: "Kontynuuj czytanie",
      startReading: "Zacznij czytanie",
      viewNovel: "Zobacz powieść"
    },

    // Strona przeglądania (BrowsePage.jsx)
    browsePage: {
      title: "Przeglądaj powieści",
      filters: "Filtry",
      reset: "Resetuj",
      searchPlaceholder: "Szukaj powieści...",
      genre: "Gatunek",
      allGenres: "Wszystkie gatunki",
      status: "Status",
      allStatuses: "Wszystkie statusy",
      sortBy: "Sortuj według",
      order: "Kolejność",
      descending: "Malejąco",
      ascending: "Rosnąco",
      resetFilters: "Resetuj filtry",
      applyFilters: "Zastosuj filtry",
      activeFilters: "Aktywne filtry:",
      search: "Wyszukiwanie",
      sort: "Sortowanie",
      loadingNovels: "Ładowanie powieści...",
      noNovelsFound: "Nie znaleziono powieści spełniających kryteria wyszukiwania.",
      previous: "Poprzednia",
      next: "Następna",
      genres: {
        fantasy: "Fantasy",
        scienceFiction: "Science Fiction",
        mystery: "Kryminał",
        thriller: "Thriller",
        romance: "Romans",
        horror: "Horror",
        adventure: "Przygodowa",
        historical: "Historyczna",
        drama: "Dramat",
        comedy: "Komedia"
      },
      statuses: {
        ongoing: "W toku",
        completed: "Zakończona",
        hiatus: "Wstrzymana"
      },
      sortOptions: {
        recentlyAdded: "Ostatnio dodane",
        recentlyUpdated: "Ostatnio zaktualizowane",
        mostViewed: "Najczęściej oglądane",
        highestRated: "Najwyżej oceniane",
        chapterCount: "Liczba rozdziałów"
      }
    },

    // Strona rozdziału (ChapterPage.jsx)
    chapterPage: {
      loadingChapter: "Ładowanie rozdziału...",
      chapterDataNotAvailable: "Dane rozdziału nie są dostępne",
      backToNovel: "Powrót do powieści",
      readingSettings: "Ustawienia czytania",
      fontSize: "Rozmiar czcionki",
      lineHeight: "Odstępy między wierszami",
      fontFamily: "Rodzaj czcionki",
      sansSerif: "Bezszeryfowa",
      serif: "Szeryfowa",
      monospace: "Monospace",
      theme: "Motyw",
      light: "Jasny",
      dark: "Ciemny",
      close: "Zamknij",
      previous: "Poprzedni",
      next: "Następny",
      chapters: "Rozdziały",
      chapter: "Rozdział"
    },

    // Strona kontaktowa (ContactPage.jsx)
    contactPage: {
      title: "Kontakt",
      contactInfo: "Informacje kontaktowe",
      email: "Email",
      phone: "Telefon",
      address: "Adres",
      followUs: "Obserwuj nas",
      sendMessage: "Wyślij nam wiadomość",
      messageSent: "Wiadomość wysłana!",
      thankYou: "Dziękujemy za kontakt. Odezwiemy się najszybciej jak to możliwe.",
      sendAnother: "Wyślij kolejną wiadomość",
      yourName: "Twoje imię",
      emailAddress: "Adres email",
      subject: "Temat",
      message: "Wiadomość",
      requiredFields: "Wymagane pola",
      sending: "Wysyłanie...",
      send: "Wyślij wiadomość",
      placeholders: {
        name: "Jan Kowalski",
        email: "jankowalski@przyklad.pl",
        subject: "W czym możemy pomóc?",
        message: "Twoja wiadomość tutaj..."
      }
    },

    // Strona tworzenia rozdziału (CreateChapterPage.jsx)
    createChapterPage: {
      title: "Dodaj nowy rozdział",
      novel: "Powieść",
      chapterNumber: "Numer rozdziału",
      chapterTitle: "Tytuł rozdziału",
      chapterContent: "Treść rozdziału",
      status: "Status",
      draft: "Szkic",
      published: "Opublikowany",
      draftInfo: "Rozdziały w formie szków są widoczne tylko dla Ciebie do momentu opublikowania",
      minimumChars: "Wymagane minimum 100 znaków",
      titlePlaceholder: "Wprowadź tytuł rozdziału",
      contentPlaceholder: "Napisz treść swojego rozdziału tutaj...",
      cancel: "Anuluj",
      saving: "Zapisywanie...",
      saveChapter: "Zapisz rozdział",
      contentLengthError: "Treść rozdziału musi mieć co najmniej 100 znaków.",
      saveFailed: "Nie udało się utworzyć rozdziału. Spróbuj ponownie.",
      loadingNovel: "Ładowanie danych powieści..."
    }
  },

  // Język angielski
  en: {
	// Chapter Management (ManageChaptersPage.jsx)
	manageChapters: {
	  title: "Manage Chapters",
	  novel: "Novel",
	  addChapter: "Add Chapter",
	  importFromEpub: "Import from EPUB",
	  chapter: "Chapter",
	  chapterTitle: "Title",
	  status: "Status",
	  reads: "Reads",
	  words: "Words",
	  updated: "Updated",
	  actions: "Actions",
	  noChapters: "No chapters available yet.",
	  createFirstChapter: "Create Your First Chapter",
	  importEpub: "Import EPUB",
	  importDialogTitle: "Import Chapters from EPUB",
	  selectEpubFile: "Select EPUB File",
	  dragAndDrop: "Drag and drop your file here or click to browse",
	  selectFile: "Select File",
	  importOptions: "Import Options",
	  overwriteExisting: "Overwrite existing chapters",
	  importAsDrafts: "Import as drafts",
	  cancel: "Cancel",
	  importing: "Importing...",
	  import: "Import",
	  importSuccess: "Import successful!",
	  importStats: "Imported {imported} out of {total} chapters",
	  importFailed: "Import failed. Please try again.",
	  invalidFile: "Invalid file. Please select a valid EPUB file.",
	  close: "Close",
	  viewDetailsAndErrors: "View details and errors",
	  errorsList: "Error list",
	  errorInChapter: "Error in chapter {chapter}: {error}"
	},
    // Strona tworzenia powieści (CreateNovelPage.jsx)
    createNovelPage: {
      title: "Create New Novel",
      titleLabel: "Title",
      captivatingTitle: "Enter a captivating title",
      maxChars: "Maximum {max} characters",
      description: "Description",
      writeDescription: "Write a compelling description of your novel",
      charsCount: "{current}/{max} characters",
      genres: "Genres",
      selectUpTo: "(Select up to {max})",
      selectAtLeastOne: "Please select at least one genre",
      tags: "Tags",
      optional: "(Optional, up to {max})",
      addTag: "Add a tag",
      tagsHelp: "Tags help readers find your novel (max {max} characters per tag)",
      status: "Status",
      ongoing: "Ongoing",
      completed: "Completed",
      coverImage: "Cover Image (Optional)",
      coverHelp: "A good cover image can attract more readers. Recommended size: 600x900 pixels.",
      cancel: "Cancel",
      creating: "Creating...",
      create: "Create Novel",
      selectGenreError: "Please select at least one genre",
      maxGenresError: "You can select up to {max} genres",
      tagExists: "This tag already exists",
      maxTagsError: "You can add up to {max} tags",
      createFailed: "Failed to create novel. Please try again."
    },
    // Nagłówek (Header.jsx)
    header: {
      home: "Home",
      browse: "Browse",
      library: "Library",
      dashboard: "Dashboard",
      searchPlaceholder: "Search novels...",
      profile: "Profile",
      myNovels: "My Novels",
      logout: "Logout",
      login: "Login",
      register: "Register"
    },

    // Stopka (Footer.jsx)
    footer: {
      description: "A platform for sharing, discovering, and reading web novels. Join our community of authors and readers.",
      resources: "Resources",
      genres: "Genres",
      trending: "Trending",
      authors: "Authors",
      startWriting: "Start Writing",
      guidelines: "Guidelines",
      faq: "FAQ",
      legal: "Legal",
      privacyPolicy: "Privacy Policy",
      termsConditions: "Terms & Conditions",
      allRightsReserved: "All Rights Reserved. Made with",
      by: "by UMK Students."
    },

    // Strona główna (HomePage.jsx)
    homePage: {
      heroTitle: "Discover Endless Stories",
      heroDescription: "Read, write, and share original stories on Opowiadamy. Find your next favorite read or share your own creative work.",
      exploreStories: "Explore Stories",
      startWriting: "Start Writing",
      popularNow: "Popular Now",
      recentlyAdded: "Recently Added",
      viewAll: "View All",
      loadingStories: "Loading stories..."
    },

    // Strona logowania (LoginPage.jsx)
    loginPage: {
      title: "Login to Opowiadamy",
      email: "Email",
      password: "Password",
      signIn: "Sign In",
      signingIn: "Signing in...",
      forgotPassword: "Forgot your password?",
      noAccount: "Don't have an account?",
      signUp: "Sign up",
      fillAllFields: "Please fill in all fields",
      loginFailed: "Failed to login. Please check your credentials."
    },

    // Strona rejestracji (RegisterPage.jsx)
    registerPage: {
      title: "Create an Account",
      username: "Username",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
      dateOfBirth: "Date of Birth",
      required: "*",
      createAccount: "Create Account",
      creatingAccount: "Creating Account...",
      haveAccount: "Already have an account?",
      signIn: "Sign in",
      publicDisplayName: "This will be your public display name",
      atLeast8Chars: "Must be at least 8 characters",
      atLeast13Years: "You must be at least 13 years old to register",
      registerSuccess: "Registration successful! Please log in with your new account.",
      registerFailed: "Registration failed. Please try again.",
      validation: {
        usernameRequired: "Username is required",
        usernameLength: "Username must be at least 3 characters",
        usernameMaxLength: "Username cannot exceed 20 characters",
        emailRequired: "Email is required",
        emailInvalid: "Invalid email address",
        passwordRequired: "Password is required",
        passwordLength: "Password must be at least 8 characters",
        passwordsDoNotMatch: "Passwords do not match",
        dobRequired: "Date of birth is required",
        dobAge: "You must be at least 13 years old to register"
      }
    },

    // Forgot Password Page (ForgotPasswordPage.jsx)
    forgotPasswordPage: {
      title: "Reset Password",
      description: "Enter your email address and we'll send you a link to reset your password.",
      email: "Email Address",
      sendResetLink: "Send Reset Link",
      sending: "Sending...",
      backToLogin: "Back to Login",
      emailSent: "Email Sent!",
      checkEmailTitle: "Check your email",
      checkEmailDescription: "If an account with that email exists, we've sent a password reset link.",
      didntReceive: "Didn't receive the email?",
      resendLink: "Resend Link",
      emailRequired: "Email address is required",
      emailInvalid: "Invalid email address",
      requestFailed: "Failed to send reset link. Please try again."
    },

    // Reset Password Page (ResetPasswordPage.jsx)
    resetPasswordPage: {
      title: "Set New Password",
      description: "Enter a new password for your account.",
      newPassword: "New Password",
      confirmPassword: "Confirm New Password",
      resetPassword: "Reset Password",
      resetting: "Resetting...",
      backToLogin: "Back to Login",
      passwordResetSuccess: "Password Reset Successfully!",
      successDescription: "You can now log in with your new password.",
      goToLogin: "Go to Login",
      passwordRequired: "Password is required",
      passwordLength: "Password must be at least 8 characters",
      passwordPattern: "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      passwordsDoNotMatch: "Passwords do not match",
      invalidToken: "Invalid or expired reset token",
      resetFailed: "Failed to reset password. Please try again.",
      tokenExpired: "Reset link has expired. Please request a new one."
    },

    // Wspólne komunikaty
    common: {
      loading: "Loading...",
      tryAgain: "Try Again",
      error: "Failed to load novels. Please try again later.",
      emailPlaceholder: "you@example.com",
      passwordPlaceholder: "••••••••",
      show: "Show",
      hide: "Hide",
      add: "Add"
    },

    // Komponenty powieści (NovelCard.jsx)
    novel: {
      by: "by",
      unknown: "Unknown",
      noDescription: "No description available",
      chapters: "chapters",
      chapter: "chapter",
      views: "views"
    },

    // Panel autora (AuthorDashboardPage.jsx)
    authorDashboard: {
      title: "Author Dashboard",
      createNewNovel: "Create New Novel",
      authorStats: "Your Author Stats",
      totalNovels: "Total Novels",
      totalViews: "Total Views",
      avgRating: "Avg. Rating",
      ratings: "ratings",
      totalChapters: "Total Chapters",
      totalWords: "Total Words",
      chapterReads: "Chapter Reads",
      yourNovels: "Your Novels",
      loadingNovels: "Loading your novels...",
      noNovels: "You haven't created any novels yet.",
      createFirstNovel: "Create Your First Novel",
      novel: "Novel",
      stats: "Stats",
      status: "Status",
      lastUpdated: "Last Updated",
      actions: "Actions",
      editNovel: "Edit Novel",
      manageChapters: "Manage Chapters",
      addChapter: "Add Chapter",
      deleteNovel: "Delete Novel",
      confirmDelete: "Are you sure you want to delete this novel? This action cannot be undone.",
      deleteFailed: "Failed to delete novel. Please try again.",
      ongoing: "Ongoing",
      completed: "Completed",
      hiatus: "Hiatus"
    },

    // Biblioteka (LibraryPage.jsx)
    library: {
      title: "My Library",
      loadingLibrary: "Loading your library...",
      emptyLibrary: "Your library is empty. Start adding novels to keep track of your reading!",
      emptyCategory: "You don't have any novels in your \"{category}\" list.",
      browseNovels: "Browse Novels",
      all: "All",
      willRead: "Plan to Read",
      reading: "Reading",
      completed: "Completed",
      onHold: "On Hold",
      dropped: "Dropped",
      lastRead: "Last read: Ch.",
      changeStatus: "Change Status",
      removeFromLibrary: "Remove from Library",
      continueReading: "Continue Reading",
      startReading: "Start Reading",
      viewNovel: "View Novel"
    },

    // Strona przeglądania (BrowsePage.jsx)
    browsePage: {
      title: "Browse Novels",
      filters: "Filters",
      reset: "Reset",
      searchPlaceholder: "Search novels...",
      genre: "Genre",
      allGenres: "All Genres",
      status: "Status",
      allStatuses: "All Statuses",
      sortBy: "Sort By",
      order: "Order",
      descending: "Descending",
      ascending: "Ascending",
      resetFilters: "Reset Filters",
      applyFilters: "Apply Filters",
      activeFilters: "Active filters:",
      search: "Search",
      sort: "Sort",
      loadingNovels: "Loading novels...",
      noNovelsFound: "No novels found matching your filters.",
      previous: "Previous",
      next: "Next",
      genres: {
        fantasy: "Fantasy",
        scienceFiction: "Science Fiction",
        mystery: "Mystery",
        thriller: "Thriller",
        romance: "Romance",
        horror: "Horror",
        adventure: "Adventure",
        historical: "Historical",
        drama: "Drama",
        comedy: "Comedy"
      },
      statuses: {
        ongoing: "Ongoing",
        completed: "Completed",
        hiatus: "On Hiatus"
      },
      sortOptions: {
        recentlyAdded: "Recently Added",
        recentlyUpdated: "Recently Updated",
        mostViewed: "Most Viewed",
        highestRated: "Highest Rated",
        chapterCount: "Chapter Count"
      }
    },

    // Strona rozdziału (ChapterPage.jsx)
    chapterPage: {
      loadingChapter: "Loading chapter...",
      chapterDataNotAvailable: "Chapter data is not available",
      backToNovel: "Back to Novel",
      readingSettings: "Reading Settings",
      fontSize: "Font Size",
      lineHeight: "Line Height",
      fontFamily: "Font Family",
      sansSerif: "Sans-serif",
      serif: "Serif",
      monospace: "Monospace",
      theme: "Theme",
      light: "Light",
      dark: "Dark",
      close: "Close",
      previous: "Previous",
      next: "Next",
      chapters: "Chapters",
      chapter: "Chapter"
    },

    // Strona kontaktowa (ContactPage.jsx)
    contactPage: {
      title: "Contact Us",
      contactInfo: "Contact Information",
      email: "Email",
      phone: "Phone",
      address: "Address",
      followUs: "Follow Us",
      sendMessage: "Send Us a Message",
      messageSent: "Message Sent!",
      thankYou: "Thank you for contacting us. We'll get back to you as soon as possible.",
      sendAnother: "Send Another Message",
      yourName: "Your Name",
      emailAddress: "Email Address",
      subject: "Subject",
      message: "Message",
      requiredFields: "Required fields",
      sending: "Sending...",
      send: "Send Message",
      placeholders: {
        name: "John Doe",
        email: "johndoe@example.com",
        subject: "How can we help you?",
        message: "Your message here..."
      }
    },

    // Strona tworzenia rozdziału (CreateChapterPage.jsx)
    createChapterPage: {
      title: "Add New Chapter",
      novel: "Novel",
      chapterNumber: "Chapter #",
      chapterTitle: "Chapter Title",
      chapterContent: "Chapter Content",
      status: "Status",
      draft: "Draft",
      published: "Published",
      draftInfo: "Draft chapters are only visible to you until published",
      minimumChars: "Minimum 100 characters required",
      titlePlaceholder: "Enter chapter title",
      contentPlaceholder: "Write your chapter content here...",
      cancel: "Cancel",
      saving: "Saving...",
      saveChapter: "Save Chapter",
      contentLengthError: "Chapter content must be at least 100 characters long.",
      saveFailed: "Failed to create chapter. Please try again.",
      loadingNovel: "Loading novel data..."
    }
  }
};

export default translations;