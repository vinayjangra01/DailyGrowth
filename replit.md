# OneUp - Daily Improvement Tracking App

## Overview

OneUp is a fully functional mobile-first progressive web application designed to help users track daily 1% improvements across different focus areas. The app encourages compound growth through consistent daily logging of small improvements, streak tracking, and AI-powered suggestions. Built with React, TypeScript, Express, and in-memory storage, it follows a monorepo structure with shared schemas between client and server.

**Current Status**: Complete MVP with all core features implemented and working.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript and Vite for fast development and building
- **UI Framework**: Shadcn/UI components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system supporting light/dark themes
- **State Management**: TanStack Query for server state, React hooks for local state
- **Routing**: Wouter for lightweight client-side routing
- **Mobile-First Design**: Progressive Web App (PWA) with service worker support

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Database**: In-memory storage with MemStorage class for rapid development
- **Data Layer**: Type-safe operations using shared TypeScript schemas
- **API Design**: RESTful endpoints with JSON responses
- **Validation**: Zod schemas for type validation and parsing

### Build System
- **Bundler**: Vite for frontend, esbuild for backend production builds
- **Development**: Hot module replacement and runtime error overlay
- **TypeScript**: Strict mode with path mapping for clean imports

## Key Components

### Database Schema
- **Users**: Basic user management with username/password
- **Improvements**: Daily improvement entries with categories and notes
- **Focus Areas**: Customizable improvement categories with icons and colors
- **User Stats**: Streak tracking and improvement counters

### Core Features
1. **Daily Improvement Logging**: Simple form to log daily 1% improvements
2. **Streak Tracking**: Current and best streak visualization
3. **Focus Areas**: Customizable categories for organizing improvements
4. **Progress Analytics**: Weekly summaries and growth charts
5. **AI Suggestions**: OpenAI-powered improvement recommendations
6. **History View**: Calendar-style browsing of past improvements

### UI Components
- **Mobile-Optimized Layout**: Bottom navigation with sticky header
- **Card-Based Design**: Clean, modern interface with shadow effects
- **Interactive Elements**: Floating action button, modals, and responsive forms
- **Theme Support**: Light/dark mode with CSS custom properties

## Data Flow

1. **User Input**: Improvements logged through modal forms
2. **Database Storage**: Drizzle ORM handles data persistence to PostgreSQL
3. **Real-time Updates**: TanStack Query manages cache invalidation and refetching
4. **Analytics Processing**: Server-side aggregation of improvement data
5. **AI Integration**: OpenAI API provides personalized improvement suggestions

## External Dependencies

### Core Libraries
- **@neondatabase/serverless**: Serverless PostgreSQL driver
- **drizzle-orm**: Type-safe ORM with PostgreSQL dialect
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI primitives
- **wouter**: Lightweight React router

### AI Integration
- **OpenAI API**: For generating personalized improvement suggestions based on user history and focus areas

### Development Tools
- **Vite**: Frontend build tool with React plugin
- **TypeScript**: Type safety across the entire stack
- **Tailwind CSS**: Utility-first styling framework

## Deployment Strategy

### Production Build
- Frontend: Vite builds optimized static assets to `dist/public`
- Backend: esbuild compiles TypeScript server code to `dist/index.js`
- Single deployment target serving both static files and API endpoints

### Environment Configuration
- Database connection via `DATABASE_URL` environment variable
- OpenAI API key for AI features
- Development mode includes Replit-specific plugins and error handling

### Database Migrations
- Drizzle Kit handles schema migrations with `db:push` command
- Schema definitions in `shared/schema.ts` ensure type consistency
- PostgreSQL dialect with full relationship support

The application is designed as a cohesive full-stack solution with a focus on developer experience, type safety, and user engagement through gamification elements like streaks and AI-powered recommendations.