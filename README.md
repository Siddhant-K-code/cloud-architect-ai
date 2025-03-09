# Cloud Architect AI 🚀

An intelligent cloud architecture design tool that helps you visualize, plan, and implement cloud infrastructure using AI.

**Video demo**

[![Product video demo - Cloud Architect AI](https://img.youtube.com/vi/PIFVbbO6O8M/0.jpg)](https://www.youtube.com/watch?v=PIFVbbO6O8M)

## ✨ Features

- **AI-Powered Architecture Design**: Generate cloud architecture diagrams based on your requirements
- **Multi-Cloud Support**: Design for Google Cloud Platform (GCP), Amazon Web Services (AWS), or Microsoft Azure
- **Interactive Diagrams**: View and edit your architecture diagrams in real-time
- **Terraform Integration**: Generate Terraform code for your architecture
- **Cost Estimation**: Get estimated running costs for your infrastructure
- **Customization**: Adjust your designs with budget constraints and specific requirements

## 🛠️ Tech Stack

- **Frontend**: React with TypeScript
- **UI Framework**: Mantine UI
- **Diagramming**: Mermaid.js and Excalidraw
- **AI Integration**: Google Vertex AI via Firebase Extensions
- **Hosting**: Firebase Hosting
- **Code Highlighting**: React Syntax Highlighter

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase account
- Google Cloud Platform account (for Vertex AI)

### Installation

1. Clone this repository
   ```bash
   git clone https://github.com/Siddhant-K-code/cloud-architect-ai.git
   cd cloud-architect-ai
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Run the setup script (recommended for first-time setup)
   ```bash
   ./setup.sh
   ```
   This script will guide you through the Firebase setup process.

4. Set up Firebase manually (alternative to step 3)
   - Create a new Firebase project at [firebase.google.com](https://firebase.google.com)
   - Enable Firebase Hosting
   - Set up Vertex AI extension in Firebase
   - Update the Firebase configuration in `src/lib/firebaseApp.ts`
   - For detailed instructions, see [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)

5. Start the development server
   ```bash
   npm run dev
   ```

6. Build for production
   ```bash
   npm run build
   ```

7. Deploy to Firebase
   ```bash
   firebase deploy
   ```

### Setup Resources

- [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md) - A comprehensive checklist to track your setup progress
- [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) - Detailed instructions for setting up Firebase and Vertex AI

## 🧠 How It Works

1. **Input Your Requirements**: Describe what you need in plain English
2. **Set Constraints**: Specify your budget and cloud provider preference
3. **Generate Designs**: AI creates multiple architecture proposals
4. **Review & Customize**: Explore different options and make adjustments
5. **Export**: Get Terraform code ready for deployment

## 📝 License

This project is licensed under the MIT License - see the [LICENSE file](./LICENSE) for details.

## 🙏 Acknowledgements

- [Mantine UI](https://mantine.dev/) for the beautiful UI components
- [Mermaid.js](https://mermaid-js.github.io/) for diagram rendering
- [Excalidraw](https://excalidraw.com/) for interactive diagrams
- [Firebase](https://firebase.google.com/) for hosting and backend services
- [Google Vertex AI](https://cloud.google.com/vertex-ai) for AI capabilities
