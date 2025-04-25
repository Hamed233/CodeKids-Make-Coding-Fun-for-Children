# CodeKids: Make Coding Fun for Children

<div align="center">
  <img src="generated-icon.png" alt="CodeKids Logo" width="120" height="120" />
  <h3>A Visual Programming Platform for Young Learners</h3>
</div>

CodeKids is an interactive web-based educational platform designed to make coding accessible and enjoyable for children. Using a visual, block-based programming approach, CodeKids allows young learners to understand programming concepts without the barriers of syntax and typing.

## 📸 Screenshots

<div align="center">
  <img src="/client/public/images/screenshots/home-page.png" alt="Home Page" width="80%" />
  <p><em>Home Page with challenges and achievements</em></p>
  
  <img src="/client/public/images/screenshots/challenge-page.png" alt="Challenge Page" width="80%" />
  <p><em>Challenge page with visual code blocks</em></p>
  
  <img src="/client/public/images/screenshots/auth-page.png" alt="Login Page" width="80%" />
  <p><em>Authentication page for user login and registration</em></p>
</div>

## 🌟 Features

- **Visual Block-Based Coding**: Drag and drop programming blocks to create code without typing
- **Progressive Learning Path**: Structured lessons that gradually introduce programming concepts
- **Fun Challenges**: Interactive puzzles and games that test and reinforce learning
- **Achievement System**: Badges and rewards to track progress and motivate continued learning
- **Kid-Friendly Interface**: Bright colors, intuitive design, and clear instructions
- **User Accounts**: Persistent progress tracking across sessions
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- PostgreSQL database

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/codekids.git
   cd codekids
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL=postgres://username:password@localhost:5432/codekids
   SESSION_SECRET=your_session_secret
   ```

4. Push the database schema:
   ```bash
   npm run db:push
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open your browser and navigate to `http://localhost:5000`

## 💻 Technology Stack

- **Frontend**:
  - React with TypeScript
  - TailwindCSS for styling
  - Blockly for visual programming interface
  - Shadcn UI components
  - React Query for data fetching
  - Wouter for routing

- **Backend**:
  - Node.js with Express
  - PostgreSQL database with Drizzle ORM
  - Passport.js for authentication
  - Zod for validation

## 🏗️ Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions and configuration
│   │   ├── pages/          # Page components
│   │   ├── App.tsx         # Main application component
│   │   └── main.tsx        # Entry point
│   └── index.html          # HTML template
├── server/                 # Backend Express server
│   ├── auth.ts             # Authentication logic
│   ├── db.ts               # Database connection
│   ├── index.ts            # Server entry point
│   ├── routes.ts           # API routes
│   ├── storage.ts          # Data access layer
│   └── vite.ts             # Vite server integration
├── shared/                 # Shared code between client and server
│   └── schema.ts           # Database schema and types
└── package.json            # Project dependencies and scripts
```

## 📝 Core Components

### 1. BlocksPanel 
Provides a palette of programming blocks that can be dragged into the workspace.

### 2. CodeWorkspace
The main programming area where blocks are arranged to create code.

### 3. PreviewPanel
Shows the output of the code execution, such as animations or game elements.

### 4. ChallengeCard
Displays challenges with difficulty level, progress, and description.

### 5. LessonPage
Interactive step-by-step instructions for learning programming concepts.

## 🧩 Database Schema

The application uses a relational database with the following main tables:

- **users**: User accounts and authentication
- **lessons**: Educational content broken into steps
- **lesson_progress**: Tracks user progress through lessons
- **challenges**: Interactive programming puzzles
- **user_challenge_progress**: Tracks user progress on challenges
- **achievements**: Unlockable badges and rewards
- **user_achievements**: Records which achievements each user has earned

## 🛣️ Roadmap

- **Code Export**: Allow users to export their block creations as text-based code
- **Project Sharing**: Enable users to share their creations with friends
- **Expanded Curriculum**: Add more advanced programming concepts
- **Multiplayer Challenges**: Collaborative coding exercises
- **Parent Dashboard**: Monitoring tools for parents to track child's progress
- **Offline Mode**: Support for using the platform without an internet connection

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [Blockly](https://developers.google.com/blockly) for the visual programming library
- [React](https://reactjs.org/) for the frontend framework
- [Express](https://expressjs.com/) for the backend server
- [TailwindCSS](https://tailwindcss.com/) for styling
- [Drizzle ORM](https://github.com/drizzle-team/drizzle-orm) for database interactions

---

<div align="center">
  <p>Made with ❤️ for the coders of tomorrow</p>
</div>