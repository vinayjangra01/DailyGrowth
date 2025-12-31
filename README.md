# OneUp - Daily 1% Improvement Tracker

A minimalistic Progressive Web App that helps you become 1% better every day through consistent small improvements, streak tracking, and AI-powered suggestions.

## ✨ Features

### Core Functionality
- **Daily Improvement Logging**: Simple interface to log your daily 1% improvements with notes and categories
- **Streak Tracking**: Visual current and best streak counters to maintain momentum
- **Growth Visualization**: Beautiful compound growth charts using the 1.01^n formula
- **Focus Areas**: Customizable categories (fitness, learning, mindset, etc.) with progress tracking
- **AI Suggestions**: OpenAI-powered personalized improvement recommendations
- **Weekly Analytics**: Progress summaries showing consistency and top performing areas

### User Experience
- **Mobile-First Design**: Optimized for smartphones with intuitive touch interface
- **Dark/Light Mode**: Full theme support with smooth transitions
- **Progressive Web App**: Installable on devices with offline capabilities
- **Daily Reminders**: Local notification system asking "What's your 1% today?"
- **Clean Interface**: Calming soft colors and minimal design philosophy

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- OpenAI API key (optional, for AI suggestions)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd oneup
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Add to Replit Secrets or create .env file
OPENAI_API_KEY=your_openai_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser to `http://localhost:5000`

## 🏗️ Technology Stack

### Frontend
- **React 18** with TypeScript for type-safe UI development
- **Vite** for fast development and optimized builds
- **Tailwind CSS** with shadcn/ui components for modern styling
- **TanStack Query** for server state management and caching
- **Wouter** for lightweight client-side routing

### Backend
- **Express.js** with TypeScript for the API server
- **Drizzle ORM** with PostgreSQL for type-safe database operations
- **Neon Database** for serverless PostgreSQL hosting
- **OpenAI API** for AI-powered improvement suggestions

### PWA Features
- **Service Worker** for offline functionality and caching
- **Web App Manifest** for app-like installation experience
- **Push Notifications** for daily reminders (browser-based)

## 📱 Core Concepts

### The 1% Philosophy
Small daily improvements compound exponentially over time:
- After 30 days: 1.35x better
- After 90 days: 2.45x better  
- After 365 days: 37.78x better!

### Focus Areas
Organize improvements into customizable categories:
- 🏋️ Fitness - Physical health and exercise
- 📚 Learning - New skills and knowledge
- 🧠 Mindset - Mental health and personal growth
- ❤️ Health - General wellness and habits
- 💼 Skills - Professional development
- 👥 Relationships - Social connections

## 🎯 Usage Guide

### Logging Improvements
1. Tap the "+" floating action button or "Log Today's Improvement"
2. Enter a brief note about what you improved (e.g., "Read 5 extra pages")
3. Select the appropriate category
4. Submit to update your streak and statistics

### Setting Up Notifications
1. Go to the Profile tab
2. Toggle "Daily Reminders" on
3. Grant notification permission when prompted
4. Receive reminders at 8:00 PM daily

### Using AI Suggestions
1. Navigate to the AI Suggestions section on the home page
2. View personalized recommendations based on your focus areas
3. Tap "Use" on any suggestion to pre-fill the improvement form
4. Refresh to get new suggestions anytime

### Tracking Progress
- **Home Tab**: Current streak, today's improvements, growth chart
- **Progress Tab**: Detailed statistics, milestones, compound growth explanation
- **History Tab**: Calendar view of past improvements with filtering
- **Profile Tab**: Settings, data management, and app information

## 🔧 API Endpoints

### User Statistics
- `GET /api/user/stats` - Current user statistics (streak, total improvements)

### Improvements
- `GET /api/improvements` - All user improvements
- `GET /api/improvements/date/:date` - Improvements for specific date
- `GET /api/improvements/recent/:days` - Recent improvements
- `POST /api/improvements` - Create new improvement

### Focus Areas
- `GET /api/focus-areas` - User's active focus areas
- `POST /api/focus-areas` - Create new focus area
- `PATCH /api/focus-areas/:id` - Update focus area
- `DELETE /api/focus-areas/:id` - Delete focus area

### Analytics
- `GET /api/analytics/weekly` - Weekly progress summary
- `GET /api/analytics/growth/:days` - Growth data for charts

### AI Features
- `POST /api/ai/suggestions` - Generate improvement suggestions

## 🎨 Design Philosophy

OneUp follows a minimalistic design approach with:

### Color Palette
- **Primary**: Purple gradient (#6366F1) for actions and highlights
- **Success**: Green (#10B981) for growth and positive metrics
- **Warning**: Amber (#F59E0B) for attention areas
- **Neutral**: Soft grays for backgrounds and secondary content

### Layout Principles
- **Mobile-First**: Designed primarily for smartphone usage
- **Card-Based**: Clean sections with subtle shadows and rounded corners
- **Single-Column**: Vertical scrolling interface for easy thumb navigation
- **Bottom Navigation**: Accessible tab bar with clear iconography

### Interaction Design
- **Floating Action Button**: Primary action always accessible
- **Swipe-Friendly**: Large touch targets and gesture support
- **Instant Feedback**: Loading states and success animations
- **Progressive Disclosure**: Information revealed as needed

## 📊 Data Model

The app uses a simple yet effective data structure:

```typescript
// User basic info
User {
  id: number
  username: string
  password: string
  createdAt: timestamp
}

// Daily improvement entries
Improvement {
  id: number
  userId: number
  note: string
  category: string
  date: timestamp
}

// Customizable focus categories
FocusArea {
  id: number
  userId: number
  name: string
  icon: string
  color: string
  isActive: boolean
}

// Streak and progress tracking
UserStats {
  id: number
  userId: number
  currentStreak: number
  bestStreak: number
  totalImprovements: number
  lastLogDate: timestamp
}
```

## 🔮 Compound Growth Formula

OneUp visualizes progress using the mathematical principle of compound improvement:

**Growth = 1.01^n**

Where:
- `1.01` represents 1% daily improvement
- `n` is the number of days with improvements
- Result shows total multiplicative growth

This formula demonstrates how small, consistent efforts create exponential results over time.

## 🚧 Future Enhancements

### Planned Features
- **Data Export/Import**: Backup and restore functionality
- **Advanced Analytics**: Detailed progress charts and trends
- **Social Features**: Share achievements and connect with friends
- **Custom Categories**: User-defined focus areas with icons
- **Habit Streaks**: Track multiple improvement habits simultaneously
- **Milestone Rewards**: Achievement badges and celebration animations

### Technical Improvements
- **Firebase Integration**: Cloud sync and real-time updates
- **Push Notifications**: Server-sent daily reminders
- **Offline Mode**: Full functionality without internet connection
- **Advanced PWA**: Background sync and app shortcuts

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## 📞 Support

For questions or support, please open an issue in the GitHub repository.

---

**Remember**: Every 1% counts. Start small, stay consistent, and watch compound growth transform your life! 🚀