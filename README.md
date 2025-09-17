A full-stack web platform for creating, reading, and managing novels. 

**⚠️ Development Status**

This project is currently in active development and is **not production ready**. Use at your own risk. Features may change, APIs may be updated, and security improvements are ongoing.

**🚀 Features**

* **Novel Management**: Create, read, update, and delete novels with metadata such as title, description, genres, tags, and cover images
* **Chapter Management**: Organize novels into chapters with read tracking and analytics
* **User Authentication**: Secure JWT-based authentication system
* **Reader Library**: Allows users to save novels to their personal library and track reading progress
* **Search and Filtering**: Advanced search functionality powered by Elasticsearch
* **Analytics**: Reading statistics and insights for authors
* **RESTful API**: Well-documented API for easy frontend integration
* **Swagger Documentation**: Interactive API documentation

## Tech Stack

- **Frontend**: TailwindCSS
- **Backend**: Express.js
- **Database**: MongoDB
- **Search**: Elasticsearch

## Prerequisites

Before starting, make sure you have installed:
* Node.js (version 22 is preferred)
* MongoDB
* Elasticsearch

## MongoDB Installation

### Windows:
1. Download MongoDB Community Server from the official website: https://www.mongodb.com/try/download/community
2. Run the downloaded `.msi` file and follow the installation wizard instructions
3. Select "Complete" installation
4. Check the option "Install MongoDB as a Service"

### macOS (using Homebrew):
```bash
# Install Homebrew if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Add MongoDB tap
brew tap mongodb/brew

# Install MongoDB Community Edition
brew install mongodb-community

# Start MongoDB as a service
brew services start mongodb/brew/mongodb-community
```

### Ubuntu/Debian:
```bash
# Import the public key
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Create a list file for MongoDB
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update the package database
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

## Elasticsearch Installation

### Windows:
1. Download Elasticsearch from the official website: https://www.elastic.co/downloads/elasticsearch
2. Extract the ZIP archive to a chosen directory (e.g., `C:\elasticsearch`)
3. Navigate to the `bin` directory:
```cmd
cd C:\elasticsearch\bin
```
4. Start Elasticsearch:
```cmd
elasticsearch.bat
```

### macOS (using Homebrew):
```bash
# Install Elasticsearch
brew install elasticsearch

# Start Elasticsearch as a service
brew services start elasticsearch
```

### Ubuntu/Debian:
```bash
# Install Java (required for Elasticsearch)
sudo apt update
sudo apt install openjdk-11-jdk

# Add Elasticsearch key
wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add -

# Add Elasticsearch repository
echo "deb https://artifacts.elastic.co/packages/8.x/apt stable main" | sudo tee /etc/apt/sources.list.d/elastic-8.x.list

# Update and install
sudo apt update
sudo apt install elasticsearch

# Start and enable Elasticsearch
sudo systemctl start elasticsearch
sudo systemctl enable elasticsearch
```

## Elasticsearch Configuration

Create or modify the Elasticsearch configuration file (`config/elasticsearch.yml`):
```yaml
# Configuration for development only - DO NOT use in production!
# Basic settings
node.name: "my-node"
cluster.name: "novel-search-cluster"

# Network settings
network.host: 0.0.0.0
http.port: 9200

# Discovery settings
discovery.type: single-node

# CORS settings for development
http.cors.enabled: true
http.cors.allow-origin: "*"

# Security settings
xpack.security.enabled: false
xpack.security.enrollment.enabled: true
xpack.security.http.ssl.enabled: false
xpack.security.transport.ssl.enabled: false
```

## Installation Verification

### Check MongoDB:
```bash
# Check if MongoDB is running
mongo --eval "db.adminCommand('ismaster')"
# or for newer versions:
mongosh --eval "db.adminCommand('ismaster')"
```

### Check Elasticsearch:
```bash
# Check Elasticsearch status
curl -X GET "localhost:9200/_cluster/health?pretty"
```

## Backend Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd novel-platform
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in the `.env` file (standard file uses default configurations)

4. Start the server:
```bash
npm start
```

The API server will be available at `http://localhost:5000`.

## Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the application in development mode:**
   ```bash
   npm run dev
   ```

   The application will be available at: `http://localhost:5000`

## API Documentation

### Using Swagger UI
1. Go to `http://localhost:5000/api/docs`
2. Select an endpoint to test
3. Click "Try it out"
4. Enter the required parameters
5. Click "Execute"

## Development Roadmap

- [ ] Notification system
- [ ] User profile customization
- [ ] Improved analytics
- [ ] Admin panel
- [ ] Proper multilanguage system and English support (currently the whole platform mostly in Polish)
