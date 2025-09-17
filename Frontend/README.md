# Opowiadamy - Frontend

Aplikacja frontendowa do platformy opowiadań zbudowana w React z Vite.

## Wymagania

- Node.js (preferowana wersja: 22)
- npm lub yarn

## Szybka instalacja

1. **Sklonuj repozytorium i przejdź do folderu projektu:**
   ```bash
   cd "D:\UMK\Pracownia programowania zespolowego\Project\newFrontend\opowiadamy"
   ```

2. **Zainstaluj zależności:**
   ```bash
   npm install
   ```

3. **Uruchom aplikację w trybie rozwoju:**
   ```bash
   npm run dev
   ```

   Aplikacja będzie dostępna pod adresem: `http://localhost:5000`

## Konfiguracja API

W pliku `.env` znajduje się już skonfigurowane publiczne API dla potrzeb testowania:

```
VITE_API_URL=https://api.opowiadamy.online/api/
```

**Publiczne API** jest gotowe do użycia i zawiera już skonfigurowane:
- MongoDB
- Elasticsearch  
- Wszystkie niezbędne endpointy

**Dla środowiska lokalnego:** Jeśli chcesz uruchomić backend lokalnie, zmień wartość w pliku `.env` na:
```
VITE_API_URL=http://localhost:3000/api/
```

## Konfiguracja portu

Możesz zmienić port aplikacji, dodając zmienną środowiskową `PORT` do pliku `.env`:

```
PORT=3001
VITE_API_URL=https://api.opowiadamy.online/api/
```

