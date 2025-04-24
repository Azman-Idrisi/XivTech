import { useSelector, useDispatch, useStore } from 'react-redux';
import { useState, useEffect, useRef } from 'react';
import { 
  selectAllCryptoAssets,
  sortByPrice,
  sortByMarketCap
} from '../features/crypto/cryptoSlice';
import { 
  formatCurrency, 
  formatPercentage, 
  formatLargeNumber 
} from '../features/crypto/utils';
import { selectDarkMode } from '../features/theme/themeSlice';

function CryptoList({ onSelectCrypto, selectedCryptoId }) {
  const cryptoAssets = useSelector(selectAllCryptoAssets);
  const darkMode = useSelector(selectDarkMode);
  const dispatch = useDispatch();
  const store = useStore();
  
  const [sortField, setSortField] = useState('marketCap');
  const [sortDirection, setSortDirection] = useState('desc');
  
  // Track previous values to detect changes
  const prevValuesRef = useRef({});
  const [changedFields, setChangedFields] = useState({});
  
  // Store previous asset values for comparison
  useEffect(() => {
    const newPrevValues = {};
    cryptoAssets.forEach(asset => {
      newPrevValues[asset.id] = {
        price: asset.price,
        percentChange1h: asset.percentChange1h,
        percentChange24h: asset.percentChange24h,
        percentChange7d: asset.percentChange7d,
        volume24h: asset.volume24h
      };
    });
    
    // Compare with previous values to detect changes
    const newChangedFields = {};
    
    if (Object.keys(prevValuesRef.current).length > 0) {
      cryptoAssets.forEach(asset => {
        const prev = prevValuesRef.current[asset.id];
        if (prev) {
          newChangedFields[asset.id] = {
            price: prev.price !== asset.price,
            percentChange1h: prev.percentChange1h !== asset.percentChange1h,
            percentChange24h: prev.percentChange24h !== asset.percentChange24h,
            percentChange7d: prev.percentChange7d !== asset.percentChange7d,
            volume24h: prev.volume24h !== asset.volume24h
          };
        }
      });
      
      setChangedFields(newChangedFields);
      
      // Clear changed fields after animation time
      setTimeout(() => {
        setChangedFields({});
      }, 1000);
    }
    
    prevValuesRef.current = newPrevValues;
  }, [cryptoAssets]);

  const getPercentageClass = (value) => {
    return value >= 0 ? 'text-green-500' : 'text-red-500';
  };

  const handleSort = (field) => {
    // Toggle direction if clicking on same field
    const newDirection = field === sortField && sortDirection === 'desc' ? 'asc' : 'desc';
    setSortField(field);
    setSortDirection(newDirection);
    
    if (field === 'price') {
      dispatch(sortByPrice(newDirection));
    } else if (field === 'marketCap') {
      dispatch(sortByMarketCap(newDirection));
    }
  };

  const getSortIndicator = (field) => {
    if (field !== sortField) return null;
    return sortDirection === 'desc' ? '↓' : '↑';
  };
  
  // Helper to determine if a field has changed
  const hasChanged = (assetId, field) => {
    return changedFields[assetId]?.[field] || false;
  };
  
  // Helper for price change animation class
  const getPriceChangeClass = (assetId, currentPrice) => {
    if (!hasChanged(assetId, 'price')) return '';
    
    const prev = prevValuesRef.current[assetId]?.price;
    if (!prev) return '';
    
    return currentPrice > prev 
      ? 'bg-green-100 dark:bg-green-900/30 transition-colors duration-1000' 
      : 'bg-red-100 dark:bg-red-900/30 transition-colors duration-1000';
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-xl shadow-md overflow-hidden transition-colors duration-200`}>
      <div className={`${darkMode ? 'bg-gradient-to-r from-blue-900 to-indigo-900 border-gray-700' : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-gray-200'} p-4 border-b transition-colors duration-200`}>
        <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Cryptocurrency Market</h2>
        <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-gray-600'}`}>Click on any asset to view detailed information</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <tr>
              <th className={`px-4 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                Asset
              </th>
              <th 
                className={`px-4 py-3 text-right text-xs font-medium ${darkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-500 hover:bg-gray-100'} uppercase tracking-wider cursor-pointer`}
                onClick={() => handleSort('price')}
              >
                Price {getSortIndicator('price')}
              </th>
              <th className={`px-4 py-3 text-right text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                1h %
              </th>
              <th className={`px-4 py-3 text-right text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                24h %
              </th>
              <th className={`px-4 py-3 text-right text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                7d %
              </th>
              <th 
                className={`px-4 py-3 text-right text-xs font-medium ${darkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-500 hover:bg-gray-100'} uppercase tracking-wider cursor-pointer`}
                onClick={() => handleSort('marketCap')}
              >
                Market Cap {getSortIndicator('marketCap')}
              </th>
              <th className={`px-4 py-3 text-right text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider hidden md:table-cell`}>
                Volume (24h)
              </th>
              <th className={`px-4 py-3 text-right text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider hidden lg:table-cell`}>
                Supply
              </th>
            </tr>
          </thead>
          <tbody className={`${darkMode ? 'bg-gray-800 divide-y divide-gray-700' : 'bg-white divide-y divide-gray-200'}`}>
            {cryptoAssets.map((asset) => (
              <tr 
                key={asset.id} 
                className={`${
                  selectedCryptoId === asset.id 
                    ? (darkMode ? 'bg-blue-900/30' : 'bg-blue-50') 
                    : ''
                } hover:${darkMode ? 'bg-gray-700' : 'bg-blue-50'} cursor-pointer transition-colors`}
                onClick={() => onSelectCrypto(asset.id)}
              >
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 h-8 w-8 ${darkMode ? 'bg-gray-600' : 'bg-gray-200'} rounded-full flex items-center justify-center text-xs font-medium`}>
                      {asset.symbol.substring(0, 3)}
                    </div>
                    <div className="ml-4">
                      <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{asset.name}</div>
                      <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{asset.symbol}</div>
                    </div>
                  </div>
                </td>
                <td className={`px-4 py-4 whitespace-nowrap text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'} text-right ${getPriceChangeClass(asset.id, asset.price)}`}>
                  {formatCurrency(asset.price)}
                  {hasChanged(asset.id, 'price') && (
                    <span className="inline-block w-2 h-2 rounded-full bg-blue-500 ml-2 animate-pulse" />
                  )}
                </td>
                <td className={`px-4 py-4 whitespace-nowrap text-sm ${getPercentageClass(asset.percentChange1h)} text-right font-medium ${hasChanged(asset.id, 'percentChange1h') ? 'animate-pulse' : ''}`}>
                  {formatPercentage(asset.percentChange1h)}
                </td>
                <td className={`px-4 py-4 whitespace-nowrap text-sm ${getPercentageClass(asset.percentChange24h)} text-right font-medium ${hasChanged(asset.id, 'percentChange24h') ? 'animate-pulse' : ''}`}>
                  {formatPercentage(asset.percentChange24h)}
                </td>
                <td className={`px-4 py-4 whitespace-nowrap text-sm ${getPercentageClass(asset.percentChange7d)} text-right font-medium ${hasChanged(asset.id, 'percentChange7d') ? 'animate-pulse' : ''}`}>
                  {formatPercentage(asset.percentChange7d)}
                </td>
                <td className={`px-4 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-white' : 'text-gray-900'} text-right`}>
                  ${formatLargeNumber(asset.marketCap)}
                </td>
                <td className={`px-4 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-white' : 'text-gray-900'} text-right hidden md:table-cell ${hasChanged(asset.id, 'volume24h') ? 'animate-pulse' : ''}`}>
                  ${formatLargeNumber(asset.volume24h)}
                </td>
                <td className={`px-4 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-white' : 'text-gray-900'} text-right hidden lg:table-cell`}>
                  {formatLargeNumber(asset.circulatingSupply)}
                  <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} ml-1`}>{asset.symbol}</span>
                  {asset.maxSupply && (
                    <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} block`}>
                      Max: {formatLargeNumber(asset.maxSupply)}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CryptoList; 