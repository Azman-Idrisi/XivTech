# Crypto Dashboard

A modern, responsive cryptocurrency dashboard that provides real-time market data and visualization for cryptocurrency assets.

![Crypto Dashboard Demo](https://raw.githubusercontent.com/username/crypto-dashboard/main/demo.gif)

## Features

- Real-time cryptocurrency price updates via WebSocket simulation
- Responsive design that works on desktop, tablet, and mobile devices
- Interactive data table with sorting functionality
- Dark/light mode toggle
- Detailed asset information and statistics
- WebSocket connection status indicator
- Crypto price update simulation

## Tech Stack

- **React** - Frontend library for building user interfaces
- **Redux Toolkit** - State management with simplified Redux logic
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Mock WebSocket** - Simulated WebSocket implementation for real-time data

## Setup Instructions

### Prerequisites

- Node.js (version 14.x or higher)
- npm (version 6.x or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/username/crypto-dashboard.git
   cd crypto-dashboard
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

## Project Structure

```
crypto-dashboard/
├── public/                # Static assets
├── src/                   # Source code
│   ├── app/               # Redux store configuration
│   ├── components/        # React components
│   │   ├── CryptoDetail.jsx        # Detailed view of a single crypto asset
│   │   ├── CryptoList.jsx          # Main cryptocurrency listing table
│   │   ├── CryptoTable.jsx         # Enhanced data table with sorting
│   │   ├── CryptoUpdater.jsx       # UI for manual price updates
│   │   ├── MarketStats.jsx         # Overall market statistics
│   │   ├── ThemeToggle.jsx         # Dark/light mode toggle
│   │   └── WebSocketDemo.jsx       # WebSocket connection controls
│   ├── features/          # Redux Toolkit slices and logic
│   │   ├── crypto/        # Cryptocurrency data management
│   │   └── theme/         # Theme state management
│   ├── services/          # Service layer
│   │   └── mockWebSocket.js  # WebSocket simulation for real-time updates
│   ├── App.jsx            # Main application component
│   ├── index.css          # Global styles
│   └── main.jsx           # Application entry point
└── package.json           # Project dependencies and scripts
```

## Component Architecture

- **App**: Main container component that manages overall layout and routing
- **CryptoList**: Displays a list of cryptocurrencies with key metrics
- **CryptoDetail**: Shows detailed information for a selected cryptocurrency
- **CryptoUpdater**: Allows manual simulation of price changes
- **MarketStats**: Displays overall market statistics and trends
- **WebSocketDemo**: Controls the WebSocket connection for real-time updates
- **ThemeToggle**: Toggles between dark and light mode

## State Management

The application uses Redux Toolkit for state management with the following slices:

- **cryptoSlice**: Manages cryptocurrency data, including prices, market caps, and percentage changes
- **themeSlice**: Manages application theme (dark/light mode)

## WebSocket Simulation

The application includes a simulated WebSocket service that mimics real-time cryptocurrency price updates. This allows for a realistic user experience without requiring an actual WebSocket connection to an external API.

## Styling

Styling is implemented with Tailwind CSS, providing a responsive and modern UI that adapts to different screen sizes. The application supports both dark and light modes for user preference.


## Acknowledgments

- Cryptocurrency icons from various sources
- Tailwind CSS for the styling framework
- React and Redux teams for their excellent libraries
