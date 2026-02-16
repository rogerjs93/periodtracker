# Luna - Privacy-First Cycle Tracker

Luna is a privacy-focused menstrual cycle tracking application designed to run entirely offline on your device. It empowers users to track their cycles, symptoms, and moods without compromising their data privacy.

<div align="center">
<!-- Add a screenshot or banner here if available -->
</div>

## Features

*   **Privacy First**: All data is stored locally on your device. No data is sent to the cloud.
*   **Cycle Tracking**: Log your periods and predict future cycles.
*   **Symptom & Mood Logging**: Keep track of your daily symptoms and moods to understand your body better.
*   **Smart Cycle Predictions**: Local algorithms (TensorFlow.js) analyze your history to predict your next cycle and provide personalized health insights. No internet connection required.
*   **Pet Companion**: A fun, interactive pet companion that evolves with your usage.

## Tech Stack

*   **Frontend**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Mobile Framework**: [Capacitor](https://capacitorjs.com/) (Android)
*   **Local Intelligence**: Custom algorithms + [TensorFlow.js](https://www.tensorflow.org/js)
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

3.  Run the web app locally:
    ```bash
    npm run dev
    ```

4.  Build and sync for Android:
    ```bash
    npm run build
    npx cap sync android
    npx cap open android
    ```

## Download

You can download the latest APK from the [releases directory](releases/Luna-Cycle-Tracker.apk) in this repository.

## Privacy Policy

**Luna is designed with privacy as its core principle.**

*   **Local Storage**: All your personal data, including cycle logs, symptoms, and notes, are stored locally on your device using Android's secure storage mechanisms.
*   **No Tracking**: We do not track your usage, location, or any personal information.
*   **Offline Intelligence**: All predictions and insights are generated directly on your device using local algorithms. No data is ever sent to external servers for processing.

## License

[MIT License](LICENSE)
