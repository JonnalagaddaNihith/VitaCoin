# VitaCoin - Comprehensive Learning & Rewards Platform

VitaCoin is a gamified learning platform that rewards users with coins for daily activities, quizzes, and maintaining streaks. Built with Next.js, Firebase, and modern UI components.

## 🚀 Features

### Core Features
- **Firebase Authentication** - Email/password and Google OAuth sign-in
- **Daily Login Bonus** - Progressive rewards (Day 1: 100 coins, Day 2: 105 coins, etc.)
- **Comprehensive Quiz System** - Separate daily quizzes for Math, Aptitude, Grammar, and Programming
- **Badge System** - Purchasable badges (1000, 2000, 5000, 10000+ coins) and achievement badges
- **Streak Tracking** - Login and quiz streaks with penalties for missed days
- **Leaderboard** - Real-time rankings with in-app notifications for changes
- **Analytics Dashboard** - Coin earnings graphs and daily statistics
- **Transaction History** - Detailed log of all coin earnings and deductions
- **Penalty System** - Motivational messages for missed activities
- **Email Notifications** - SendGrid integration for reminders and streak alerts

### Advanced Features
- **In-app Notifications** - Real-time updates for achievements and leaderboard changes
- **Perfect Day Tracking** - Bonus rewards for completing all quizzes with 100% scores
- **Comprehensive Badge Categories**:
  - Purchase badges (Bronze, Silver, Gold, Platinum, Diamond)
  - Streak badges (1 day, 7 days, 30 days, 100 days)
  - Performance badges (Perfect Day, Perfect Week, Perfect Month)
  - Category-specific badges (Math Enthusiast, Logic Master, etc.)

## 🛠 Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Firebase project with Firestore and Authentication enabled
- SendGrid account (optional, for email notifications)

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd VitaCoin
npm install
```

### 2. Firebase Setup

1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication with Email/Password and Google providers
3. Create a Firestore database in production mode
4. Get your Firebase configuration from Project Settings

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id

# SendGrid Configuration (Optional)
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Initialize Sample Data

Run the initialization script to populate your Firebase with sample quiz questions and badges:

```bash
npx tsx src/scripts/initializeData.ts
```

This will add:
- 20 quiz questions across 4 categories (Math, Aptitude, Grammar, Programming)
- 16 badges (5 purchasable + 11 achievement badges)

### 5. Firebase Security Rules

Update your Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Allow reading other users' public data for leaderboard
      allow read: if request.auth != null;
      
      // Subcollections
      match /{subcollection=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
    
    // Public collections
    match /badges/{document} {
      allow read: if request.auth != null;
    }
    
    match /quizQuestions/{document} {
      allow read: if request.auth != null;
    }
    
    match /system/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 6. Run the Application

```bash
npm run dev
```

Visit `http://localhost:3000` to see your VitaCoin app!

## 📱 Usage Guide

### For New Users
1. **Sign Up** - Create account with email/password or Google
2. **Welcome Bonus** - Receive 500 coins upon registration
3. **Daily Login** - Claim daily bonus to build login streak
4. **Take Quizzes** - Complete daily quizzes in all 4 categories
5. **Earn Badges** - Purchase badges or earn them through achievements
6. **Track Progress** - View analytics and transaction history

### Daily Activities
- **Login Bonus**: Claim once per day, increases by 5 coins per streak day
- **Quizzes**: Take one quiz per category per day (5 coins per correct answer)
- **Streaks**: Maintain consecutive days for bonus multipliers
- **Badges**: Purchase with coins or earn through achievements

## 🏗 Architecture

### Tech Stack
- **Frontend**: Next.js 15, React 18, TypeScript
- **Backend**: Firebase (Auth, Firestore)
- **UI**: Tailwind CSS, Radix UI components
- **Charts**: Recharts
- **Email**: SendGrid
- **Forms**: React Hook Form + Zod validation

### Project Structure
```
src/
├── app/                 # Next.js app router
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── Dashboard.tsx   # Main dashboard with tabs
│   ├── BadgeStore.tsx  # Badge management
│   ├── CoinAnalytics.tsx # Analytics charts
│   └── ...
├── lib/
│   ├── firebase.ts     # Firebase configuration & functions
│   ├── email.ts        # SendGrid email functions
│   └── types.ts        # TypeScript interfaces
└── scripts/
    └── initializeData.ts # Sample data initialization
```

### Database Schema
- **users/**: User profiles with coins, streaks, badges
- **users/{uid}/transactions/**: Transaction history
- **users/{uid}/notifications/**: In-app notifications
- **users/{uid}/quizResults/**: Quiz attempt records
- **badges/**: Available badges (purchasable & achievement)
- **quizQuestions/**: Quiz questions by category
- **system/**: System data (leaderboard cache, etc.)

## 🎯 Key Features Explained

### Streak System
- **Login Streaks**: Day 1: 100 coins, Day 2: 105 coins, Day 3: 110 coins...
- **Quiz Streaks**: Separate streaks for each category
- **Penalties**: Coins deducted for missed days with motivational messages

### Badge Categories
- **Purchasable**: Bronze (1000), Silver (2000), Gold (5000), Platinum (10000), Diamond (20000)
- **Login Streaks**: 1, 7, 30, 100 days
- **Quiz Streaks**: 7-day streaks per category
- **Perfect Scores**: Daily, weekly, monthly perfect completion

### Notification System
- **In-app**: Leaderboard changes, achievements, penalties
- **Email**: Daily reminders, streak alerts, badge notifications

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Firebase Hosting
```bash
npm run build
firebase deploy
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the GitHub Issues page
2. Review Firebase and SendGrid documentation
3. Ensure all environment variables are correctly set

---

**Happy Learning with VitaCoin! 🪙📚**
