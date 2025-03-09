import { initializeApp } from "firebase/app";

// TODO: Replace with your own Firebase configuration
// You can get this from your Firebase project settings
// 1. Go to https://console.firebase.google.com/
// 2. Select your project (or create a new one)
// 3. Click on the gear icon (⚙️) next to "Project Overview" and select "Project settings"
// 4. Scroll down to "Your apps" section and select your web app (or create one)
// 5. Copy the firebaseConfig object

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;
