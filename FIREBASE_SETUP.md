# Firebase and Vertex AI Setup Guide

This guide will walk you through setting up Firebase and Vertex AI for the Cloud Architect AI project.

> [!NOTE]
> For an automated setup experience, you can use the included setup script by running `./setup.sh` in the project root directory. The script will guide you through most of the steps below.

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter a project name (e.g., "cloud-architect-ai")
4. Choose whether to enable Google Analytics (recommended)
5. Accept the terms and click "Create project"
6. Wait for the project to be created and click "Continue"

## 2. Register Your Web App

1. In the Firebase console, click on the web icon (</>) to add a web app
2. Enter a nickname for your app (e.g., "Cloud Architect AI Web")
3. Check the box for "Also set up Firebase Hosting"
4. Click "Register app"
5. Copy the Firebase configuration object that appears
6. Replace the placeholder configuration in `src/lib/firebaseApp.ts` with your configuration
7. Click "Next" and then "Continue to console"

## 3. Set Up Firebase Hosting

1. Install the Firebase CLI if you haven't already:
   ```bash
   npm install -g firebase-tools
   ```

2. Log in to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project directory:
   ```bash
   firebase init
   ```

4. Select "Hosting" when prompted for features
5. Select your Firebase project
6. Specify "dist" as your public directory
7. Configure as a single-page app: Yes
8. Set up automatic builds and deploys with GitHub: No (unless you want to)

## 4. Set Up Vertex AI

### Enable Vertex AI API

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Make sure you're in the same project as your Firebase project
3. Navigate to "APIs & Services" > "Library"
4. Search for "Vertex AI API"
5. Click on it and then click "Enable"

### Set Up Firebase Extensions for Vertex AI

1. In the Firebase console, go to "Extensions"
2. Click "Browse Extensions"
3. Search for "Vertex AI"
4. Select "Use Vertex AI with Firebase"
5. Click "Install extension"
6. Follow the prompts to configure the extension
   - Choose the region closest to your users
   - Select the Gemini model (gemini-pro)
   - Configure authentication as needed

## 5. Update Project Configuration

1. Update `.firebaserc` with your Firebase project ID:
   ```json
   {
     "projects": {
       "default": "YOUR_FIREBASE_PROJECT_ID"
     }
   }
   ```

2. Make sure your `firebase.json` looks like this:
   ```json
   {
     "hosting": {
       "public": "dist",
       "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
       "rewrites": [
         {
           "source": "**",
           "destination": "/index.html"
         }
       ]
     }
   }
   ```

## 6. Build and Deploy

1. Build your project:
   ```bash
   npm run build
   ```

2. Deploy to Firebase:
   ```bash
   firebase deploy
   ```

3. Your app should now be live at `https://YOUR_PROJECT_ID.web.app`

## Troubleshooting

### Vertex AI Authentication Issues

If you encounter authentication issues with Vertex AI:

1. Make sure you've enabled billing for your Google Cloud project
2. Ensure the service account has the necessary permissions
3. Check that the Vertex AI API is enabled
4. Verify that the Firebase Extensions for Vertex AI is properly configured

### Deployment Issues

If you encounter issues during deployment:

1. Make sure you're logged in to the correct Firebase account
2. Verify that your `.firebaserc` file has the correct project ID
3. Ensure that your build process completed successfully
4. Check that the "dist" directory exists and contains your built application

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Vertex AI Documentation](https://cloud.google.com/vertex-ai/docs)
- [Firebase Extensions](https://firebase.google.com/docs/extensions)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)