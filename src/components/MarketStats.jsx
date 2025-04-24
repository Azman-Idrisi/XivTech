import { useSelector } from 'react-redux';
import { 
  selectAllCryptoAssets, 
  selectGainingAssets, 
  selectLosingAssets, 
  selectTopAssetsByMarketCap
} from '../features/crypto/cryptoSlice';
import { formatCurrency, formatLargeNumber } from '../features/crypto/utils';
import { selectDarkMode } from '../features/theme/themeSlice';

function MarketStats() {
  const darkMode = useSelector(selectDarkMode);
  const assets = useSelector(selectAllCryptoAssets);
  const gainers = useSelector(selectGainingAssets);
  const losers = useSelector(selectLosingAssets);
  const topAssets = useSelector(state => selectTopAssetsByMarketCap(state, 3));

  // Calculate total market cap
  const totalMarketCap = assets.reduce((sum, asset) => sum + asset.marketCap, 0);
  
  // Calculate 24h volume
  const total24hVolume = assets.reduce((sum, asset) => sum + asset.volume24h, 0);
  
  // Calculate market average change
  const avgChange24h = assets.length > 0 
    ? assets.reduce((sum, asset) => sum + asset.percentChange24h, 0) / assets.length 
    : 0;

  return (
    <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-xl shadow-md overflow-hidden transition-colors duration-200 mb-8`}>
      <div className={`${darkMode ? 'bg-gradient-to-r from-green-900 to-blue-900' : 'bg-gradient-to-r from-green-500 to-blue-500'} p-4 text-white`}>
        <h2 className="text-xl font-bold">Market Statistics</h2>
        <p className="text-sm text-blue-100">Overview of the crypto market</p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-lg`}>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Market Cap</div>
            <div className="text-xl font-bold mt-1">${formatLargeNumber(totalMarketCap)}</div>
          </div>
          
          <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-lg`}>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>24h Trading Volume</div>
            <div className="text-xl font-bold mt-1">${formatLargeNumber(total24hVolume)}</div>
          </div>
          
          <div className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-4 rounded-lg`}>
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Avg. 24h Change</div>
            <div className={`text-xl font-bold mt-1 ${avgChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {avgChange24h >= 0 ? '+' : ''}{avgChange24h.toFixed(2)}%
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className={`text-lg font-medium ${darkMode ? 'text-white border-gray-700' : 'text-gray-800 border-gray-200'} mb-3 border-b pb-2`}>
              Top Assets by Market Cap
            </h3>
            <ul className="space-y-2">
              {topAssets.map(asset => (
                <li key={asset.id} className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-3 rounded-lg flex justify-between items-center`}>
                  <div className="flex items-center">
                    <div className={`w-8 h-8 ${darkMode ? 'bg-gray-600' : 'bg-gray-200'} rounded-full flex items-center justify-center mr-3`}>
                      <span className="text-xs font-medium">{asset.symbol.substring(0, 3)}</span>
                    </div>
                    <span>{asset.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(asset.price)}</div>
                    <div className={`text-xs ${asset.percentChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {asset.percentChange24h >= 0 ? '+' : ''}{asset.percentChange24h.toFixed(2)}%
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={`text-lg font-medium ${darkMode ? 'text-white border-gray-700' : 'text-gray-800 border-gray-200'} mb-3 border-b pb-2`}>
              Market Sentiment
            </h3>
            <div className="flex justify-between mb-3">
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Gainers</div>
              <div className="text-sm font-medium text-green-500">{gainers.length} assets</div>
            </div>
            <div className="w-full bg-gray-300 dark:bg-gray-600 h-4 rounded-full mb-4">
              <div
                className="bg-green-500 h-4 rounded-full"
                style={{ width: `${(gainers.length / assets.length) * 100}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between mb-3">
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Losers</div>
              <div className="text-sm font-medium text-red-500">{losers.length} assets</div>
            </div>
            <div className="w-full bg-gray-300 dark:bg-gray-600 h-4 rounded-full">
              <div
                className="bg-red-500 h-4 rounded-full"
                style={{ width: `${(losers.length / assets.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MarketStats; 