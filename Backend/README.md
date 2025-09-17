# Opowiadamy API

### Wymagania wstępne
Przed rozpoczęciem upewnij się, że masz zainstalowane:
* Node.js (wersja 22 jest preferowana)
* MongoDB
* Elasticsearch
  
### instalacja MongoDB

#### Windows:
1. Pobierz MongoDB Community Server z oficjalnej strony: https://www.mongodb.com/try/download/community
2. Uruchom pobrany plik `.msi` i postępuj zgodnie z instrukcjami kreatora instalacji
3. Wybierz "Complete" installation
4. Zaznacz opcję "Install MongoDB as a Service"

#### macOS (używając Homebrew):
```bash
# Zainstaluj Homebrew jeśli nie masz
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Dodaj tap MongoDB
brew tap mongodb/brew

# Zainstaluj MongoDB Community Edition
brew install mongodb-community

# Uruchom MongoDB jako serwis
brew services start mongodb/brew/mongodb-community
```

#### Ubuntu/Debian:
```bash
# Importuj klucz publiczny
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Utwórz plik listy dla MongoDB
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Zaktualizuj bazę pakietów
sudo apt-get update

# Zainstaluj MongoDB
sudo apt-get install -y mongodb-org

# Uruchom MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

### instalacja Elasticsearch

#### Windows:
1. Pobierz Elasticsearch z oficjalnej strony: https://www.elastic.co/downloads/elasticsearch
2. Rozpakuj archiwum ZIP do wybranego katalogu (np. `C:\elasticsearch`)
3. Przejdź do katalogu `bin`:
```cmd
cd C:\elasticsearch\bin
```
4. Uruchom Elasticsearch:
```cmd
elasticsearch.bat
```

#### macOS (używając Homebrew):
```bash
# Zainstaluj Elasticsearch
brew install elasticsearch

# Uruchom Elasticsearch jako serwis
brew services start elasticsearch
```

#### Ubuntu/Debian:
```bash
# Zainstaluj Java (wymagane dla Elasticsearch)
sudo apt update
sudo apt install openjdk-11-jdk

# Dodaj klucz Elasticsearch
wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -

# Dodaj repozytorium Elasticsearch
echo "deb https://artifacts.elastic.co/packages/8.x/apt stable main" | sudo tee /etc/apt/sources.list.d/elastic-8.x.list

# Zaktualizuj i zainstaluj
sudo apt update
sudo apt install elasticsearch

# Uruchom i włącz Elasticsearch
sudo systemctl start elasticsearch
sudo systemctl enable elasticsearch
```

### Konfiguracja Elasticsearch
Utwórz lub zmodyfikuj plik konfiguracyjny Elasticsearch (`config/elasticsearch.yml`):
```yaml
# Konfiguracja tylko dla rozwoju - NIE używaj w produkcji!
# Podstawowe ustawienia
node.name: "my-node"
cluster.name: "novel-search-cluster"

# Ustawienia sieciowe
network.host: 0.0.0.0
http.port: 9200

# Ustawienia discovery
discovery.type: single-node

# Ustawienia CORS dla rozwoju
http.cors.enabled: true
http.cors.allow-origin: "*"

# Ustawienia bezpieczeństwa
xpack.security.enabled: false
xpack.security.enrollment.enabled: true
xpack.security.http.ssl.enabled: false
xpack.security.transport.ssl.enabled: false
```

### Weryfikacja instalacji

#### Sprawdzenie MongoDB:
```bash
# Sprawdź czy MongoDB działa
mongo --eval "db.adminCommand('ismaster')"
# lub dla nowszych wersji:
mongosh --eval "db.adminCommand('ismaster')"
```

#### Sprawdzenie Elasticsearch:
```bash
# Sprawdź status Elasticsearch
curl -X GET "localhost:9200/_cluster/health?pretty"
```

### Kroki instalacji projektu

1. Sklonuj repozytorium:
```bash
git clone <repository-url>
cd novel-platform
```

2. Zainstaluj zależności:
```bash
npm install
```

3. Skonfiguruj zmienne środowiskowe w pliku .env (standardowy plik uzywa standardowych konfiguracji) 

4. Uruchom serwer:
```bash
npm start
```

Serwer API będzie dostępny pod adresem `http://localhost:5000`.

## Dokumentacja API

## Testowanie API

### Używanie Swagger UI
1. Przejdź do `http://localhost:5000/api/docs`
2. Wybierz endpoint do testowania
3. Kliknij "Try it out"
4. Wprowadź wymagane parametry
5. Kliknij "Execute"

### Testowanie uwierzytelniania
Dla endpointów wymagających uwierzytelniania:

1. Użyj `/api/auth/login` aby uzyskać token JWT
2. Kliknij przycisk "Authorize" w Swagger UI
3. Wprowadź swój token używając formatu: `Bearer your_token_here`
4. Chronione endpointy będą teraz dostępne

