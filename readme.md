# 🧩 Infinite Sudoku

[![Formatted with Biome](https://img.shields.io/badge/Formatted_with-Biome-60a5fa?style=flat&logo=biome)](https://biomejs.dev/)
[![Linted with Biome](https://img.shields.io/badge/Linted_with-Biome-60a5fa?style=flat&logo=biome)](https://biomejs.dev)
[![Checked with Biome](https://img.shields.io/badge/Checked_with-Biome-60a5fa?style=flat&logo=biome)](https://biomejs.dev)
[![Built with Vue](https://img.shields.io/badge/Built_with-Vue_3-4FC08D?style=flat&logo=vue.js)](https://vuejs.org)
[![Powered by Fastify](https://img.shields.io/badge/Powered_by-Fastify-000000?style=flat&logo=fastify)](https://fastify.dev)
[![Database PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)](https://postgresql.org)
[![Styled with UnoCSS](https://img.shields.io/badge/Styled_with-UnoCSS-1c1c1c?style=flat&logo=unocss)](https://unocss.dev)
[![Turborepo](https://img.shields.io/badge/Monorepo-Turborepo-EF4444?style=flat&logo=turborepo)](https://turbo.build)

> *Where numbers meet strategy, and your brain gets a workout!* 🧠

Welcome to **Infinite Sudoku** – not just another sudoku game, but your personal puzzle playground where logic reigns supreme! Whether you're a sudoku newbie or a seasoned number-cruncher, we've got the perfect puzzle waiting for you.

## ✨ What Makes It Special?

### 🎮 Core Features

**🎯 Multiple Difficulty Levels**  
From "I'm just learning" to "I eat sudoku for breakfast" – pick your challenge and prove your worth!

**⏱️ Smart Timer**  
Track your solving speed with our intelligent timer that pauses when you switch tabs (because we know life happens). Beat your personal best and climb the ranks!

**🎨 Beautiful & Responsive Design**  
Solve puzzles on your phone during your commute, or on your desktop while pretending to work. We won't judge! 😉

**🔄 Undo/Redo Magic**  
Made a mistake? No worries! Our move history has your back. Go back, go forward, experiment freely!

**🎊 Victory Celebrations**  
Complete a puzzle and enjoy a satisfying victory animation. You've earned it, champ! 🏆

### 🔐 Premium Features (Registered Users)

**`💾 Cloud Save System`**  
Start a puzzle on your phone, finish it on your laptop. Your progress follows you everywhere!

**`📊 Global Leaderboards`**  
See how you stack up against other sudoku enthusiasts. Can you claim the crown? 👑

**`📈 Personal Statistics`**  
Track your progress, monitor your improvement, and watch yourself become a sudoku master!

**`⚡ Auto-Save`**  
Never lose your progress again. Every move is saved automatically when you're logged in.

**`🔄 Multi-Difficulty Progress`**  
Switch between difficulty levels without losing your progress. Work on multiple puzzles at your own pace!

### 🎯 Smart Features

**✏️ Intelligent Error Detection**  
Get feedback when something doesn't add up. Learn as you play!

**🎨 Visual Cell Highlighting (soon)**  
Smart highlighting helps you focus on rows, columns, and boxes. No more squinting!

**🪄 Hints (soon)**  
Stuck? Don't be anymore with some hints along the way!

## 🚀 Getting Started

Ready to flex those brain muscles? Here's how to jump in:

1. **[Visit the game](https://infinite-sudoku.vercel.app/)**
2. **Pick your difficulty** – Easy, Medium, Hard, even Hardcore 😱
3. **Start solving** – Click a cell, pick a number, repeat!
4. **Beat the clock** – Your timer starts with your first move
5. **Celebrate** – Complete the puzzle and bask in glory! 🎉

### 🔑 Want the Full Experience?

**Register for free** to unlock:

- Cloud saves across all devices
- Multi-player leaderboards with **`daily`**, **`weekly`** and **`monthly rankings`**!
- Multi-puzzle management
- **`Daily Challenge`** for the brainiest of them all (soon)

## 🎲 How It Works

Our custom sudoku generator creates **unique, solvable puzzles** with multiple difficulty levels. Each puzzle is:

- ✅ Guaranteed to have a single solution
- ✅ Validated for quality and difficulty
- ✅ Stored for optimal performance

The difficulty isn't just about the number of empty cells – it's about the **solving techniques required**. Hard puzzles will make you think! 🤯

## 🎨 The Experience

- **Smooth animations** that don't get in your way
- **Toast notifications** that keep you informed (and entertained)
- **Modal dialogs** for important decisions
- **Confetti** when you win (because why not?)
- **Dark mode ready** design that's easy on the eyes

## 🛠️ For the Tech-Savvy

<details>
<summary><strong>🏗️ Tech Stack & Architecture</strong></summary>

### Frontend
- **Vue 3** with Composition API & TypeScript
- **UnoCSS** for utility-first styling
- **Vite** for lightning-fast development
- **Vue Router** with file-based routing
- **VueUse** for composable utilities
- **Headless UI** and **Nuxt UI** for accessible components

### Backend
- **Fastify** for blazing-fast API
- **Prisma** ORM with PostgreSQL
- **JWT** authentication
- **Argon2** password hashing
- **Zod** for runtime validation
- **Mailtrap** for email notifications

### DevOps & Tools
- **Turborepo** monorepo management
- **Biome** for linting & formatting
- **Trigger.dev** for background jobs
- **Docker** for containerization
- **Playwright** for E2E testing
- **Vitest** for unit testing

### Project Structure
```
rncp-sudoku/
├── apps/
│   ├── web/          # Vue 3 frontend
│   └── api/          # Fastify backend
├── packages/
│   ├── database/     # Prisma schema & migrations
│   ├── shared/       # Shared utilities & types
│   └── trigger/      # Background job tasks
```

### Development Commands

```bash
# Install dependencies
npm install

# Start development (web + api)
npm run dev

# Start only web
npm run dev:web

# Start only api
npm run dev:api

# Start database
npm run db:start

# Lint & format
npm run check:fix
```

### Key Features Implementation

**🔐 Authentication Flow**
- JWT-based authentication with HTTP-only cookies
- Email verification system
- Password reset functionality
- Secure session management

**💾 Save System**
- Local storage for guest users
- Cloud saves for authenticated users (PostgreSQL)
- Automatic conflict resolution
- Real-time save synchronization

**🎮 Sudoku Engine**
- Custom generator with backtracking algorithm
- Priority-based cell removal for difficulty tuning
- Solution uniqueness validation
- Performance-optimized solving

**⏱️ Timer System**
- Visibility API integration
- Pause/resume on tab changes
- Accurate millisecond tracking
- Save time with progress

**🏆 Leaderboard System**
- Per-difficulty rankings
- Time-based scoring
- Real-time updates
- Personal best tracking

</details>

---

<div align="center">

**Built with ❤️ and ☕ by passionate developer**

*May your cells be filled and your logic be sound!* 🧩

[Report Bug](https://github.com/EliDevToBe/infinite-sudoku/issues) • [Request Feature](https://github.com/EliDevToBe/infinite-sudoku/issues)

</div>