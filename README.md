# 🔥 HabitFlow - Daily Challenge & Habit Tracking System

A beautiful, gamified habit tracking application inspired by LeetCode Daily. Build consistent habits through streaks, XP points, badges, and insightful analytics.

![Tech Stack](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)

## ✨ Features

### 🎯 Core Features
- **User Authentication** - Secure JWT-based signup/login system
- **Habit Management** - Create, track, and manage multiple habits
- **Streak Tracking** - Visual streak counter with flame icons
- **Gamification** - XP points, levels, and achievement badges
- **Interactive Calendar** - Click to mark days as completed/missed
- **Progress Analytics** - 30-day charts and completion statistics
- **Beautiful UI** - Glassmorphism design with smooth animations

### 🎨 Design Highlights
- Premium glassmorphism effects
- Gradient backgrounds and smooth animations
- Responsive design (mobile, tablet, desktop)
- Custom color palettes for each habit
- Interactive hover effects and micro-animations

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (free tier works great!)
- npm or yarn

### 1️⃣ MongoDB Atlas Setup

**IMPORTANT: You need to set up MongoDB Atlas before running the app!**

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account or sign in
3. Create a new cluster (free M0 tier is perfect)
4. Click "Connect" → "Connect your application"
5. Copy your connection string (it looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/`)

### 2️⃣ Installation

```bash
# Install all dependencies (frontend + backend)
npm run install:all
```

### 3️⃣ Environment Configuration

Create a `.env` file in the `server` folder:

```bash
cd server
cp .env.example .env
```

Edit `server/.env` and add your MongoDB connection string:

```env
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/habittracker?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this
PORT=5000
NODE_ENV=development
```

**Replace:**
- `YOUR_USERNAME` with your MongoDB username
- `YOUR_PASSWORD` with your MongoDB password
- `cluster0.xxxxx` with your actual cluster URL
- `your_super_secret_jwt_key_change_this` with a random secret string

### 4️⃣ Run the Application

**Terminal 1 - Backend:**
```bash
npm run server
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

The app will open at `http://localhost:3000`

## 📁 Project Structure

```
TaskManager/
├── src/                      # Frontend React app
│   ├── components/           # Reusable components
│   │   └── CreateHabitModal.tsx
│   ├── contexts/             # React contexts
│   │   └── AuthContext.tsx
│   ├── pages/                # Page components
│   │   ├── Login.tsx
│   │   ├── Signup.tsx
│   │   ├── Dashboard.tsx
│   │   └── HabitDetail.tsx
│   ├── types/                # TypeScript types
│   │   └── index.ts
│   ├── utils/                # Utilities
│   │   └── api.ts
│   ├── App.tsx               # Main app component
│   ├── main.tsx              # Entry point
│   └── index.css             # Global styles
├── server/                   # Backend Express app
│   ├── models/               # MongoDB models
│   │   ├── User.js
│   │   ├── Habit.js
│   │   └── DailyLog.js
│   ├── routes/               # API routes
│   │   ├── auth.js
│   │   └── habits.js
│   ├── middleware/           # Custom middleware
│   │   └── auth.js
│   ├── server.js             # Server entry point
│   └── .env                  # Environment variables
└── package.json              # Root package.json
```

## 🎮 How to Use

### Creating Your First Habit

1. **Sign up** for a new account
2. Click **"New Habit"** on the dashboard
3. Choose an icon and enter habit details
4. Click **"Create Habit"**

### Tracking Daily Progress

1. Click on any habit card
2. Click on calendar days to mark them as completed
3. Watch your streak grow! 🔥
4. Earn XP and level up

### Understanding the Stats

- **🔥 Streak** - Consecutive days completed
- **🏆 Level** - Based on total XP earned
- **🎯 Completion Rate** - Percentage of days completed
- **📊 30-Day Chart** - Visual progress over time

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Recharts** for analytics
- **Axios** for API calls
- **date-fns** for date manipulation
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing
- **node-cron** for scheduled tasks
- **express-validator** for input validation

## 📊 Database Schema

### User
```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  totalXP: Number,
  level: Number,
  badges: [Badge]
}
```

### Habit
```javascript
{
  userId: ObjectId,
  name: String,
  description: String,
  category: String,
  icon: String,
  color: String,
  currentStreak: Number,
  longestStreak: Number,
  totalCompletions: Number,
  xpPerCompletion: Number
}
```

### DailyLog
```javascript
{
  habitId: ObjectId,
  userId: ObjectId,
  date: Date,
  completed: Boolean,
  note: String,
  xpEarned: Number
}
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Habits
- `GET /api/habits` - Get all user habits
- `POST /api/habits` - Create new habit
- `GET /api/habits/:id` - Get single habit
- `DELETE /api/habits/:id` - Delete habit
- `GET /api/habits/:id/logs` - Get habit logs
- `POST /api/habits/:id/logs` - Create daily log
- `PUT /api/habits/:id/logs/:logId` - Update daily log

## 🎨 Customization

### Adding New Habit Icons

Edit `src/components/CreateHabitModal.tsx`:

```typescript
const habitTemplates = [
  { 
    icon: 'your-icon-name', 
    name: 'Your Habit', 
    color: 'linear-gradient(135deg, #color1 0%, #color2 100%)',
    IconComponent: YourIcon 
  },
  // ... more templates
];
```

### Changing XP Rewards

Edit habit creation in `server/routes/habits.js`:

```javascript
xpPerCompletion: 20 // Change from default 10
```

## 🚀 Future Enhancements

- [ ] Social features & leaderboards
- [ ] Push notifications & reminders
- [ ] Mobile app (React Native)
- [ ] Habit templates & recommendations
- [ ] Export data to CSV
- [ ] Dark/Light theme toggle
- [ ] Habit categories & filters
- [ ] Weekly/Monthly reports
- [ ] Achievement badges system
- [ ] Habit sharing with friends

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure your IP is whitelisted in MongoDB Atlas
- Check your connection string is correct
- Verify username/password are correct

### Port Already in Use
```bash
# Change port in server/.env
PORT=5001
```

### Frontend Not Connecting to Backend
- Ensure backend is running on port 5000
- Check proxy settings in `vite.config.ts`

## 📝 License

MIT License - feel free to use this project for learning or personal use!

## 🙏 Acknowledgments

- Inspired by LeetCode Daily Challenge
- Icons by [Lucide](https://lucide.dev/)
- Fonts by [Google Fonts](https://fonts.google.com/)

---

**Built with ❤️ for productivity enthusiasts**

Happy habit building! 🎯🔥
