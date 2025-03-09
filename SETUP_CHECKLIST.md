# Cloud Architect AI Setup Checklist

Use this checklist to track your progress in setting up the Cloud Architect AI project from scratch.

> [!TIP]
> You can automate many of these steps by running the included setup script: `./setup.sh`

## Prerequisites

- [ ] Node.js installed (v18 or higher)
- [ ] npm or yarn installed
- [ ] Firebase CLI installed (`npm install -g firebase-tools`)
- [ ] Google Cloud account created
- [ ] Firebase account created (linked to Google Cloud)
- [ ] Billing enabled on Google Cloud account

## Firebase Setup

- [ ] Create a new Firebase project
- [ ] Register a web app in the Firebase project
- [ ] Enable Firebase Hosting
- [ ] Copy Firebase configuration to `src/lib/firebaseApp.ts`
- [ ] Update `.firebaserc` with your project ID

## Google Cloud / Vertex AI Setup

- [ ] Enable Vertex AI API in Google Cloud Console
- [ ] Install Firebase Extensions for Vertex AI
- [ ] Configure Vertex AI extension with appropriate settings
- [ ] Verify Vertex AI authentication is working

## Local Development Setup

- [ ] Clone the repository
- [ ] Install dependencies (`npm install`)
- [ ] Start development server (`npm run dev`)
- [ ] Verify the application runs locally
- [ ] Test the Vertex AI integration

## Deployment

- [ ] Build the application (`npm run build`)
- [ ] Deploy to Firebase (`firebase deploy`)
- [ ] Verify the deployed application works
- [ ] Test the Vertex AI integration in production

## Additional Configuration

- [ ] Customize the application name/branding if desired
- [ ] Update the README.md with your project information
- [ ] Set up custom domain (optional)
- [ ] Configure Firebase Authentication (optional)
- [ ] Set up Firebase Analytics (optional)

## Troubleshooting Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Vertex AI Documentation](https://cloud.google.com/vertex-ai/docs)
- [Firebase Extensions](https://firebase.google.com/docs/extensions)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)
- [Vite Documentation](https://vitejs.dev/guide/)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Mantine UI Documentation](https://mantine.dev/)
