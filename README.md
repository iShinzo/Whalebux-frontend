# WhaleBux Frontend

Frontend for the WhaleBux Telegram Mini App.

## Overview
This is the frontend application for WhaleBux, a Telegram Mini App that provides users with a gamified experience including mining, tasks, NFTs, token swaps, daily streaks, and more. The frontend is built with Next.js and React, and communicates with the WhaleBux backend API.

## Features
- User dashboard and wallet
- Mining and token economy interface
- Task and rewards system
- NFT display and management
- Token swap functionality
- Daily streak tracking
- Friends and referral system
- Admin panel
- Responsive design for mobile and desktop
- Integration with Telegram Web Apps API

## Tech Stack
- Next.js 15
- React 18
- Tailwind CSS
- TypeScript
- Radix UI
- Axios

## Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm (comes with Node.js)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/iShinzo/Whalebux-frontend.git
   cd Whalebux-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Development Server
```bash
npm run dev
```
The app will be available at http://localhost:3000

### Building for Production
```bash
npm run build
npm start
```

## Project Structure
- `app/` - Next.js app directory (pages, layouts, routes)
- `components/` - Reusable UI components
- `lib/` - API services and utility functions
- `config/` - App configuration files
- `public/` - Static assets and icons
- `styles/` - Global styles

## Environment Variables
Create a `.env.local` file for any required environment variables (API endpoints, keys, etc.).

## License
MIT
