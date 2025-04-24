import CryptoList from './components/CryptoList'
import CryptoDetail from './components/CryptoDetail'
import CryptoUpdater from './components/CryptoUpdater'
import MarketStats from './components/MarketStats'
import WebSocketDemo from './components/WebSocketDemo'
import CryptoTable from './components/CryptoTable'
import ThemeToggle from './components/ThemeToggle'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectDarkMode } from './features/theme/themeSlice'
import { selectLastUpdated, fetchUpdatedPrices } from './features/crypto/cryptoSlice'
import mockWebSocket from './services/mockWebSocket'

export default function App() {
  const [selectedCryptoId, setSelectedCryptoId] = useState('bitcoin');
  const darkMode = useSelector(selectDarkMode);
  const lastUpdated = useSelector(selectLastUpdated);
  const dispatch = useDispatch();

  // Initial data load and connect WebSocket
  useEffect(() => {
    // Load initial data once
    dispatch(fetchUpdatedPrices());
    
    // Connect to WebSocket for real-time updates
    mockWebSocket.connect();
    
    // Clean up by disconnecting WebSocket when component unmounts
    return () => {
      mockWebSocket.disconnect();
    };
  }, [dispatch]);

  const handleSelectCrypto = (id) => {
    setSelectedCryptoId(id);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-100'} transition-colors duration-200`}>
      <header className={`${darkMode ? 'bg-gradient-to-r from-blue-900 to-purple-900' : 'bg-gradient-to-r from-blue-600 to-purple-600'} text-white shadow-lg`}>
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Crypto Dashboard</h1>
              <p className="text-blue-100">Track your favorite cryptocurrencies</p>
            </div>
            {lastUpdated && (
              <div className="text-right hidden sm:block">
                <div className="text-sm text-blue-100">Last updated:</div>
                <div className="text-white font-medium">
                  {new Date(lastUpdated).toLocaleString()}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-4">
          <WebSocketDemo />
        </div>
        <MarketStats />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CryptoList onSelectCrypto={handleSelectCrypto} selectedCryptoId={selectedCryptoId} />
            <div className="grid grid-cols-1 md:grid-cols-1 gap-8 mt-8">
              <CryptoUpdater />
            </div>
            <CryptoTable />
          </div>
          <div>
            <div className="sticky top-4">
              <CryptoDetail id={selectedCryptoId} />
            </div>
          </div>
        </div>
      </main>
      
      <footer className={`${darkMode ? 'bg-gray-900 text-gray-300 border-t border-gray-800' : 'bg-gray-800 text-white'} py-6 mt-12`}>
        <div className="container mx-auto px-4 text-center">
          <p>© 2023 Crypto Dashboard. All data is for demonstration purposes only.</p>
        </div>
      </footer>

      <ThemeToggle />
    </div>
  )
}