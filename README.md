# Mindly - AI-Powered Learning Platform 🚀

**Your personal AI companion for unlocking insights from your documents and challenging your knowledge.**

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com)
[![License](https://img.shields.io/badge/license-MIT-blue)](https://github.com/your-username/your-repo/blob/main/LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-orange)](https://github.com/your-username/your-repo)

## 🌟 Overview

Mindly is an innovative, AI-powered learning platform designed to help you learn faster and more effectively. Upload your documents, and Mindly's AI will help you understand complex topics, answer your questions, and even generate quizzes to test your knowledge. Whether you're a student, a researcher, or a lifelong learner, Mindly is your personal tutor.

## 🎬 Demo

*(Here you can add a GIF, screenshot, or a link to a live preview of your project.)*

**Example:**

![Mindly Demo](httpss://via.placeholder.com/800x400.png?text=Mindly+Demo+Screenshot)

## ✨ Features

- **📄 Document Upload:** Upload your PDF documents to create a personalized knowledge base.
- **🤖 AI-Powered Chat:** Ask questions and get answers from an AI that understands your documents.
- **🧠 Smart Quizzes:** Generate quizzes from your documents to test your knowledge and retention.
- **🏆 Leaderboard:** Compete with other users and climb the leaderboard by acing quizzes.
- **👤 User Profiles:** Track your progress and see your stats.

## 🛠️ Installation

Follow these steps to get Mindly up and running on your local machine.

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/your-repo.git
    cd your-repo
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up your environment variables:**
    Create a `.env` file in the root of the project and add the following environment variables. You can get these from your Supabase and Google Cloud dashboards.
    ```
    VITE_GOOGLE_API_KEY=your_google_api_key
    VITE_SUPABASE_URL=your_supabase_url
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Set up Supabase:**
    - Go to [Supabase](https://supabase.com/) and create a new project.
    - Run the SQL scripts in the `supabase/migrations` directory to set up your database schema.
    - Set up your Supabase functions by deploying the functions in the `supabase/functions` directory. Make sure to set the required environment variables in your Supabase project settings.

5.  **Run the development server:**
    ```bash
    npm run dev
    ```

## 🚀 Usage

Once the installation is complete, you can start the development server and open the app in your browser at `http://localhost:5173`.

- **Upload Documents:** Go to the dashboard and upload your PDF documents.
- **Chat with AI:** Open the chat interface to ask questions about your documents.
- **Take Quizzes:** Navigate to the arena to take quizzes and test your knowledge.

## ⚙️ Configuration

The following environment variables are required for the application to run correctly:

| Variable                 | Description                               |
| ------------------------ | ----------------------------------------- |
| `VITE_GOOGLE_API_KEY`    | Your Google API key for the AI services.  |
| `VITE_SUPABASE_URL`      | Your Supabase project URL.                |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key.              |

## 🤝 Contributing

Contributions are welcome! If you have any ideas, suggestions, or bug reports, please open an issue or submit a pull request.

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature`).
3.  Commit your changes (`git commit -m 'Add some feature'`).
4.  Push to the branch (`git push origin feature/your-feature`).
5.  Open a pull request.

## 📄 License

This project is licensed under the **[Your License Type]** - see the [LICENSE](LICENSE) file for details.
