# Teleprompter App - Product Requirements Document (PRD)

## Product Overview
A mobile-first web-based teleprompter application that allows users to display scrolling text for video recording, presentations, and public speaking. Built with Next.js, Magic UI components, and deployed on Vercel.

## Target Users
- Content creators and YouTubers
- Public speakers and presenters
- Educators and trainers
- Business professionals
- Anyone needing to read scripts while looking at a camera

## Core Features (Based on Reference Screenshot)

### 1. Text Display & Scrolling
- **Large, readable text display** with customizable content
- **Auto-scrolling functionality** with smooth animation
- **Manual scroll control** for precise positioning
- **Pause/resume functionality** for breaks during recording

### 2. Control Panel (Top Bar)
- **Play/Pause button** - Start/stop text scrolling
- **Menu/Settings button** - Access configuration options
- **Flip/Mirror button** - Horizontal text flip for teleprompter mirror setups
- **Outline/Border toggle** - Text outline for better readability
- **Background color picker** - Customizable background (black, white, green screen, etc.)
- **Text color picker** - Adjustable text color for contrast
- **Text size slider** - Font size adjustment (66px default)
- **Margin slider** - Text margin/padding control (5% default)
- **Speed slider** - Scrolling speed control (10 default)

### 3. Mobile-First Design
- **Touch-friendly controls** with adequate button sizes (44px minimum)
- **Responsive layout** that works on phones, tablets, and desktops
- **Swipe gestures** for scroll control
- **Pinch-to-zoom** for text size adjustment
- **Portrait and landscape orientation** support

### 4. Text Management
- **Text input interface** for script entry
- **Rich text formatting** (bold, italic, paragraph breaks)
- **Save/load scripts** with local storage
- **Word count and estimated reading time**

### 5. Advanced Features
- **Countdown timer** - Preparation time before scrolling starts
- **Keyboard shortcuts** for quick control
- **Fullscreen mode** for distraction-free use
- **Multiple script management** - Save and organize multiple scripts

## Technical Stack
- **Next.js 15** with App Router and TypeScript
- **Magic UI Components** for enhanced UI elements
- **Tailwind CSS** for styling with custom animations
- **Lucide React** for icons
- **Local Storage** for data persistence
- **Vercel** for deployment

## Component Architecture

### Core Components
1. **TeleprompterDisplay** - Main scrolling text component
2. **ControlPanel** - Top toolbar with all controls
3. **SettingsPanel** - Configuration overlay
4. **ScriptEditor** - Text input and management
5. **LandingPage** - App introduction and navigation

### Magic UI Integration
- Sliders for speed, text size, and margin controls
- Buttons for play/pause and settings
- Color pickers for background and text colors
- Smooth animations and transitions

## User Experience Flow
1. **Landing Page** - Clean interface with "Start Teleprompter" CTA
2. **Script Input** - Text area for entering or loading script
3. **Teleprompter View** - Full-screen text display with controls
4. **Settings Panel** - Real-time customization options

## Performance Requirements
- **60fps scrolling** for smooth text movement
- **Sub-2 second load times** on mobile networks
- **Responsive touch controls** with <100ms latency
- **Minimal battery drain** during extended use

## Mobile Optimizations
- Touch targets minimum 44px for accessibility
- Gesture controls (swipe, pinch, tap)
- Viewport handling for notched devices
- Optimized animations and minimal re-renders

## Implementation Phases
1. ✅ Project setup with Next.js and Magic UI
2. 🔄 Core components and basic functionality
3. 📱 Mobile-first responsive design
4. ⚡ Performance optimizations
5. 🚀 Vercel deployment

**Status:** In development
**Target:** Production-ready teleprompter app with professional features