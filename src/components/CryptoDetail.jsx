import { useSelector } from 'react-redux';
import { selectCryptoAssetById } from '../features/crypto/cryptoSlice';
import { formatCurrency, formatPercentage, formatLargeNumber } from '../features/crypto/utils';
import { selectDarkMode } from '../features/theme/themeSlice';


function CryptoDetail({ id }) {
  const asset = useSelector((state) => selectCryptoAssetById(state, id));
  const darkMode = useSelector(selectDarkMode);

  if (!asset) {
    return <div className={`p-6 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-xl shadow-md transition-colors duration-200`}>Asset not found</div>;
  }

  const getPercentageClass = (value) => {
    return value >= 0 ? 'text-green-500' : 'text-red-500';
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-xl shadow-md overflow-hidden transition-colors duration-200`}>
      <div className={`${darkMode ? 'bg-gradient-to-r from-indigo-900 to-purple-900' : 'bg-gradient-to-r from-indigo-500 to-purple-600'} p-6 text-white`}>
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center space-x-3">
              <div className={`h-10 w-10 ${darkMode ? 'bg-white/10' : 'bg-white/20'} rounded-full flex items-center justify-center text-sm font-bold backdrop-blur-sm`}>
                {asset.symbol.substring(0, 3)}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{asset.name}</h2>
                <p className={darkMode ? 'text-indigo-200' : 'text-indigo-100'}>{asset.symbol}</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{formatCurrency(asset.price)}</div>
            <div className={`text-sm ${asset.percentChange24h >= 0 ? 'text-green-300' : 'text-red-300'}`}>
              {formatPercentage(asset.percentChange24h)} (24h)
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <h3 className={`text-lg font-medium ${darkMode ? 'text-white border-gray-700' : 'text-gray-800 border-gray-200'} mb-3 border-b pb-2`}>Price Changes</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-3 rounded-lg shadow-sm`}>
              <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'} mb-1`}>1h Change</div>
              <div className={`text-lg font-medium ${getPercentageClass(asset.percentChange1h)}`}>
                {formatPercentage(asset.percentChange1h)}
              </div>
            </div>
            <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-3 rounded-lg shadow-sm`}>
              <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'} mb-1`}>24h Change</div>
              <div className={`text-lg font-medium ${getPercentageClass(asset.percentChange24h)}`}>
                {formatPercentage(asset.percentChange24h)}
              </div>
            </div>
            <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-3 rounded-lg shadow-sm`}>
              <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'} mb-1`}>7d Change</div>
              <div className={`text-lg font-medium ${getPercentageClass(asset.percentChange7d)}`}>
                {formatPercentage(asset.percentChange7d)}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className={`text-lg font-medium ${darkMode ? 'text-white border-gray-700' : 'text-gray-800 border-gray-200'} mb-3 border-b pb-2`}>Market Data</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Market Cap</span>
              <span className={darkMode ? 'font-medium text-white' : 'font-medium text-gray-800'}>${formatLargeNumber(asset.marketCap)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>24h Volume</span>
              <span className={darkMode ? 'font-medium text-white' : 'font-medium text-gray-800'}>${formatLargeNumber(asset.volume24h)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Circulating Supply</span>
              <span className={darkMode ? 'font-medium text-white' : 'font-medium text-gray-800'}>
                {formatLargeNumber(asset.circulatingSupply)} <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>{asset.symbol}</span>
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>Max Supply</span>
              <span className={darkMode ? 'font-medium text-white' : 'font-medium text-gray-800'}>
                {asset.maxSupply ? formatLargeNumber(asset.maxSupply) + ' ' + asset.symbol : 'Unlimited'}
              </span>
            </div>
          </div>
        </div>

        <div>
          <h3 className={`text-lg font-medium ${darkMode ? 'text-white border-gray-700' : 'text-gray-800 border-gray-200'} mb-3 border-b pb-2`}>Price Chart (7d)</h3>
          <div className={`${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} p-4 rounded-lg flex items-center justify-center h-64 border`}>
            <div className="text-center">
              <svg className={`w-10 h-10 ${darkMode ? 'text-gray-500' : 'text-gray-400'} mx-auto mb-2`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
              <p className={darkMode ? 'text-gray-300 text-sm' : 'text-gray-500 text-sm'}>Chart would display here</p>
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} mt-1`}>{asset.chartUrl}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className={`text-lg font-medium ${darkMode ? 'text-white border-gray-700' : 'text-gray-800 border-gray-200'} mb-3 border-b pb-2`}>About {asset.name}</h3>
          <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
            {asset.name} ({asset.symbol}) is one of the major cryptocurrencies traded globally. View detailed market data and price trends above. The market capitalization is calculated by multiplying the current price by the circulating supply.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <a 
              href={`https://coinmarketcap.com/currencies/${asset.id}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} p-3 rounded-lg text-center transition-colors`}
            >
              <span className={darkMode ? 'text-blue-400' : 'text-blue-600'}>View on CoinMarketCap</span>
            </a>
            <a 
              href={`https://www.coingecko.com/en/coins/${asset.id}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} p-3 rounded-lg text-center transition-colors`}
            >
              <span className={darkMode ? 'text-blue-400' : 'text-blue-600'}>View on CoinGecko</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CryptoDetail; 