# Luna - Privacy-First Cycle Tracker

Luna is a privacy-focused menstrual cycle tracking application designed to run entirely offline on your device. It empowers users to track their cycles, symptoms, and moods without compromising their data privacy.

<div align="center">
<!-- Add a screenshot or banner here if available -->
</div>

## Features

*   **Privacy First**: All data is stored locally on your device. No data is sent to the cloud unless you explicitly choose to back it up (feature coming soon).
*   **Cycle Tracking**: Log your periods and predict future cycles.
*   **Symptom & Mood Logging**: Keep track of your daily symptoms and moods to understand your body better.
*   **Gemini AI Integration**: leveraging Google's Gemini AI (via a user-provided API key) for personalized insights and analysis, running locally or via API with strict privacy controls.
*   **Pet Companion**: A fun, interactive pet companion that evolves with your usage.

## Tech Stack

*   **Frontend**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Mobile Framework**: [Capacitor](https://capacitorjs.com/) (Android)
*   **AI**: [Google GenAI SDK](https://github.com/google/google-api-javascript-client)
*   **Storage**: LocalStorage / Capacitor Preferences
*   **Styling**: CSS / Tailwind (if applicable)

## Getting Started

### Prerequisites

*   Node.js (v18 or higher recommended)
*   npm or yarn
*   Android Studio (for building the Android app)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/rogerjs93/periodtracker.git
    cd periodtracker
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  **Environment Setup**:
    *   Create a `.env.local` file in the root directory.
    *   Add your Gemini API Key:
        ```
        GEMINI_API_KEY=your_api_key_here
        ```
    *   *Note: This key is used locally for AI features and is not shared.*

4.  Run the web app locally:
    ```bash
    npm run dev
    ```

5.  Build and sync for Android:
    ```bash
    npm run build
    npx cap sync android
    npx cap open android
    ```

## Privacy Policy

**Luna is designed with privacy as its core principle.**

*   **Local Storage**: All your personal data, including cycle logs, symptoms, and notes, are stored locally on your device using Android's secure storage mechanisms.
*   **No Tracking**: We do not track your usage, location, or any personal information.
*   **AI Processing**: AI features are implemented using your own API key, and data sent to the AI model is minimized and anonymized where possible. We are working towards fully on-device AI solutions.

## License

[MIT License](LICENSE)
