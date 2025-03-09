#!/bin/bash

# Cloud Architect AI Setup Script
# This script helps with the initial setup of the Cloud Architect AI project

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Cloud Architect AI Setup ===${NC}"
echo "This script will help you set up the Cloud Architect AI project."
echo ""

# Check if Node.js is installed
echo -e "${YELLOW}Checking prerequisites...${NC}"
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed. Please install Node.js v18 or higher.${NC}"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}Node.js version is less than 18. Please upgrade to Node.js v18 or higher.${NC}"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}npm is not installed. Please install npm.${NC}"
    exit 1
fi

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo -e "${YELLOW}Firebase CLI is not installed. Installing...${NC}"
    npm install -g firebase-tools
    if [ $? -ne 0 ]; then
        echo -e "${RED}Failed to install Firebase CLI. Please install it manually: npm install -g firebase-tools${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}Prerequisites check passed!${NC}"
echo ""

# Install dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
npm install
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to install dependencies. Please check the error message above.${NC}"
    exit 1
fi
echo -e "${GREEN}Dependencies installed successfully!${NC}"
echo ""

# Firebase login
echo -e "${YELLOW}Logging in to Firebase...${NC}"
echo "You'll need to log in to your Firebase account. A browser window will open."
firebase login
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to log in to Firebase. Please try again.${NC}"
    exit 1
fi
echo -e "${GREEN}Logged in to Firebase successfully!${NC}"
echo ""

# Firebase project setup
echo -e "${YELLOW}Setting up Firebase project...${NC}"
echo "Do you want to create a new Firebase project or use an existing one?"
echo "1. Create a new project"
echo "2. Use an existing project"
read -p "Enter your choice (1/2): " firebase_choice

if [ "$firebase_choice" = "1" ]; then
    echo "Creating a new Firebase project..."
    firebase projects:create
    if [ $? -ne 0 ]; then
        echo -e "${RED}Failed to create a new Firebase project. Please try again or create one manually.${NC}"
        exit 1
    fi
elif [ "$firebase_choice" = "2" ]; then
    echo "Listing your Firebase projects..."
    firebase projects:list
    read -p "Enter the project ID you want to use: " project_id
    firebase use "$project_id"
    if [ $? -ne 0 ]; then
        echo -e "${RED}Failed to set the Firebase project. Please check the project ID and try again.${NC}"
        exit 1
    fi
else
    echo -e "${RED}Invalid choice. Exiting.${NC}"
    exit 1
fi

# Get the current Firebase project ID
PROJECT_ID=$(firebase projects:list --json | grep -o '"projectId": "[^"]*' | head -1 | cut -d '"' -f 4)
echo -e "${GREEN}Using Firebase project: $PROJECT_ID${NC}"
echo ""

# Update .firebaserc
echo -e "${YELLOW}Updating .firebaserc...${NC}"
cat > .firebaserc << EOF
{
  "projects": {
    "default": "$PROJECT_ID"
  }
}
EOF
echo -e "${GREEN}.firebaserc updated successfully!${NC}"
echo ""

# Firebase init
echo -e "${YELLOW}Initializing Firebase...${NC}"
firebase init hosting
if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to initialize Firebase. Please try again.${NC}"
    exit 1
fi
echo -e "${GREEN}Firebase initialized successfully!${NC}"
echo ""

# Prompt for Firebase config
echo -e "${YELLOW}Setting up Firebase configuration...${NC}"
echo "Please go to the Firebase console, register a web app, and copy the Firebase configuration."
echo "1. Go to https://console.firebase.google.com/project/$PROJECT_ID/settings/general"
echo "2. Scroll down to 'Your apps' and click the web app icon (</>) to add a web app"
echo "3. Register the app and copy the firebaseConfig object"
echo ""
read -p "Press Enter when you're ready to enter the Firebase configuration..."

read -p "Enter your apiKey: " api_key
read -p "Enter your authDomain: " auth_domain
read -p "Enter your projectId: " project_id
read -p "Enter your storageBucket: " storage_bucket
read -p "Enter your messagingSenderId: " messaging_sender_id
read -p "Enter your appId: " app_id

# Update firebaseApp.ts
echo -e "${YELLOW}Updating Firebase configuration...${NC}"
mkdir -p src/lib
cat > src/lib/firebaseApp.ts << EOF
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "$api_key",
  authDomain: "$auth_domain",
  projectId: "$project_id",
  storageBucket: "$storage_bucket",
  messagingSenderId: "$messaging_sender_id",
  appId: "$app_id",
};

const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;
EOF
echo -e "${GREEN}Firebase configuration updated successfully!${NC}"
echo ""

# Remind about Vertex AI setup
echo -e "${YELLOW}Important: Vertex AI Setup${NC}"
echo "You need to set up Vertex AI in the Google Cloud Console and Firebase Extensions."
echo "Please follow the instructions in FIREBASE_SETUP.md for detailed steps."
echo ""

# Final instructions
echo -e "${GREEN}Setup completed!${NC}"
echo ""
echo "Next steps:"
echo "1. Set up Vertex AI as described in FIREBASE_SETUP.md"
echo "2. Start the development server: npm run dev"
echo "3. Build and deploy: npm run build && firebase deploy"
echo ""
echo "Thank you for using Cloud Architect AI!"
