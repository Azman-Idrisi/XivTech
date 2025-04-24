import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  selectAllCryptoAssets, 
  selectCryptoStatus, 
  selectLastUpdated, 
  updateAssetPrice, 
  updateAssetPercentChanges, 
  updateAssetVolume,
  fetchUpdatedPrices
} from '../features/crypto/cryptoSlice';
import { formatCurrency } from '../features/crypto/utils';
import { selectDarkMode } from '../features/theme/themeSlice';

function CryptoUpdater() {
  const dispatch = useDispatch();
  const assets = useSelector(selectAllCryptoAssets);
  const status = useSelector(selectCryptoStatus);
  const lastUpdated = useSelector(selectLastUpdated);
  const darkMode = useSelector(selectDarkMode);
  const [selectedAsset, setSelectedAsset] = useState(assets[0]?.id || '');
  const [priceChange, setPriceChange] = useState(0);

  const selectedAssetData = assets.find(a => a.id === selectedAsset);

  const handleUpdatePrice = () => {
    if (!selectedAsset) return;
    
    const newPrice = selectedAssetData.price * (1 + priceChange / 100);
    dispatch(updateAssetPrice({
      id: selectedAsset,
      price: newPrice
    }));
  };

  const handleUpdatePercentChanges = () => {
    if (!selectedAsset) return;
    
    dispatch(updateAssetPercentChanges({
      id: selectedAsset,
      percentChange1h: Math.random() * 5 * (Math.random() > 0.5 ? 1 : -1),
      percentChange24h: Math.random() * 10 * (Math.random() > 0.5 ? 1 : -1),
      percentChange7d: Math.random() * 15 * (Math.random() > 0.5 ? 1 : -1)
    }));
  };

  const handleUpdateVolume = () => {
    if (!selectedAsset) return;
    
    const volumeChange = 0.8 + Math.random() * 0.4; 
    
    dispatch(updateAssetVolume({
      id: selectedAsset,
      volume24h: selectedAssetData.volume24h * volumeChange
    }));
  };

  const handleFetchAll = () => {
    dispatch(fetchUpdatedPrices());
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-xl shadow-md overflow-hidden transition-colors duration-200 mt-8`}>
      <div className={`${darkMode ? 'bg-gradient-to-r from-purple-900 to-blue-900' : 'bg-gradient-to-r from-purple-500 to-blue-500'} p-4 text-white`}>
        <h2 className="text-xl font-bold">Update Crypto Data</h2>
        <p className="text-sm text-blue-100">Simulate market changes</p>
      </div>

      <div className="p-6">
        <div className="mb-4">
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Last updated: {lastUpdated ? new Date(lastUpdated).toLocaleString() : 'Never'}
          </p>
        </div>

        <div className="mb-4">
          <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
            Select Asset
          </label>
          <select
            value={selectedAsset}
            onChange={(e) => setSelectedAsset(e.target.value)}
            className={`w-full px-3 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
          >
            <option value="">Select an asset</option>
            {assets.map(asset => (
              <option key={asset.id} value={asset.id}>
                {asset.name} ({asset.symbol}) - {formatCurrency(asset.price)}
              </option>
            ))}
          </select>
        </div>

        {selectedAssetData && (
          <div className="mb-6">
            <div className="mb-4">
              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                Price Change (%)
              </label>
              <div className="flex items-center">
                <input
                  type="range"
                  min="-20"
                  max="20"
                  value={priceChange}
                  onChange={(e) => setPriceChange(parseFloat(e.target.value))}
                  className="flex-1 mr-4"
                />
                <span className={`${priceChange > 0 ? 'text-green-500' : priceChange < 0 ? 'text-red-500' : ''} font-medium`}>
                  {priceChange > 0 ? '+' : ''}{priceChange.toFixed(1)}%
                </span>
              </div>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                New price: {formatCurrency(selectedAssetData.price * (1 + priceChange / 100))}
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <button
                onClick={handleUpdatePrice}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 text-sm font-medium"
              >
                Update Price
              </button>
              <button
                onClick={handleUpdatePercentChanges}
                className="bg-green-500 hover:bg-green-600 text-white rounded-lg px-4 py-2 text-sm font-medium"
              >
                Randomize %
              </button>
              <button
                onClick={handleUpdateVolume}
                className="bg-purple-500 hover:bg-purple-600 text-white rounded-lg px-4 py-2 text-sm font-medium"
              >
                Update Volume
              </button>
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleFetchAll}
            disabled={status === 'loading'}
            className={`w-full ${
              status === 'loading' 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700'
            } text-white rounded-lg px-4 py-3 text-sm font-medium transition-colors`}
          >
            {status === 'loading' ? 'Updating...' : 'Update All Market Data'}
          </button>
          {status === 'failed' && (
            <p className="mt-2 text-sm text-red-500">Failed to update prices</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default CryptoUpdater; 