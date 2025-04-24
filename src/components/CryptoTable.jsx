import { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectDarkMode } from '../features/theme/themeSlice';
import { 
  selectAllCryptoAssets,
  selectCryptoStatus, 
  selectLastUpdated
} from '../features/crypto/cryptoSlice';

// Cryptocurrency logo components
const BitcoinLogo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
    <g fill="none" fillRule="evenodd">
      <circle cx="16" cy="16" r="16" fill="#F7931A"/>
      <path fill="#FFF" fillRule="nonzero" d="M23.189 14.02c.314-2.096-1.283-3.223-3.465-3.975l.708-2.84-1.728-.43-.69 2.765c-.454-.114-.92-.22-1.385-.326l.695-2.783L15.596 6l-.708 2.839c-.376-.086-.746-.17-1.104-.26l.002-.009-2.384-.595-.46 1.846s1.283.294 1.256.312c.7.175.826.638.805 1.006l-.806 3.235c.048.012.11.03.18.057l-.183-.045-1.13 4.532c-.086.212-.303.53-.793.41.018.025-1.256-.313-1.256-.313l-.858 1.978 2.25.561c.418.105.828.215 1.231.318l-.715 2.872 1.727.43.708-2.84c.472.127.93.245 1.378.357l-.706 2.828 1.728.43.715-2.866c2.948.558 5.164.333 6.097-2.333.752-2.146-.037-3.385-1.588-4.192 1.13-.26 1.98-1.003 2.207-2.538zm-3.95 5.538c-.533 2.147-4.148.986-5.32.695l.95-3.805c1.172.293 4.929.872 4.37 3.11zm.535-5.569c-.487 1.953-3.495.96-4.47.717l.86-3.45c.975.243 4.118.696 3.61 2.733z"/>
    </g>
  </svg>
);

const EthereumLogo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
    <g fill="none" fillRule="evenodd">
      <circle cx="16" cy="16" r="16" fill="#627EEA"/>
      <g fill="#FFF" fillRule="nonzero">
        <path fillOpacity=".602" d="M16.498 4v8.87l7.497 3.35z"/>
        <path d="M16.498 4L9 16.22l7.498-3.35z"/>
        <path fillOpacity=".602" d="M16.498 21.968v6.027L24 17.616z"/>
        <path d="M16.498 27.995v-6.028L9 17.616z"/>
        <path fillOpacity=".2" d="M16.498 20.573l7.497-4.353-7.497-3.348z"/>
        <path fillOpacity=".602" d="M9 16.22l7.498 4.353v-7.701z"/>
      </g>
    </g>
  </svg>
);

const BinanceLogo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
    <g fill="none">
      <circle cx="16" cy="16" r="16" fill="#F3BA2F"/>
      <path fill="#FFF" d="M12.116 14.404L16 10.52l3.886 3.886 2.26-2.26L16 6l-6.144 6.144 2.26 2.26zM6 16l2.26-2.26L10.52 16l-2.26 2.26L6 16zm6.116 1.596L16 21.48l3.886-3.886 2.26 2.259L16 26l-6.144-6.144-.003-.003 2.263-2.257zM21.48 16l2.26-2.26L26 16l-2.26 2.26L21.48 16zm-3.188-.002h.002V16L16 18.294l-2.291-2.29-.004-.004.004-.003.401-.402.195-.195L16 13.706l2.293 2.293z"/>
    </g>
  </svg>
);

const SolanaLogo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
    <defs>
      <linearGradient id="solana_gradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#9945FF" />
        <stop offset="100%" stopColor="#14F195" />
      </linearGradient>
    </defs>
    <circle cx="16" cy="16" r="16" fill="#000000" />
    <path d="M22.71 12.49L19.33 16l3.38 3.51H9.31a.7.7 0 01-.5-.2.69.69 0 010-1l6.8-7.05h7.1a.7.7 0 01.5.19.7.7 0 010 1.01l-.5.03zm0 10.17a.7.7 0 01-.5-.2l-6.8-7.05h-7.1a.7.7 0 01-.5-.2.69.69 0 010-1L11.19 10h13.52a.7.7 0 01.5.2.7.7 0 010 1.01l-3.38 3.5 3.38 3.51a.7.7 0 010 1.01l-2 2.08.1.54a.7.7 0 01-.5.8z" fill="url(#solana_gradient)" />
  </svg>
);

const CardanoLogo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
    <g fill="none">
      <circle cx="16" cy="16" r="16" fill="#0033AD"/>
      <path d="M15.725 5.06c.479-.247 1.064.324.84.83-.165.535-.873.573-1.124.137-.194-.297-.087-.733.284-.968zm3.142.513c.7-.11.96.903.34 1.194-.487.367-1.17-.178-1.011-.75.071-.238.406-.524.671-.444zm-6.96.669c.686-.32 1.493.418 1.14 1.14-.278.674-1.28.757-1.661.136-.358-.495-.091-1.136.52-1.276zm10.783.527c.716-.28 1.522.386 1.206 1.136-.232.65-1.218.834-1.623.226-.418-.514-.15-1.253.417-1.362zm-13.584 1.5c.761-.473 1.823.345 1.533 1.19-.234.886-1.562.94-1.892.068-.208-.458-.087-1.082.36-1.258zm16.024.5c.785-.426 1.746.515 1.324 1.293-.354.813-1.646.731-1.873-.126-.168-.511.032-1.05.55-1.166zm-18.54 1.489c.873-.538 2.036.466 1.722 1.406-.284.995-1.793 1.004-2.033-.108-.142-.523.024-1.13.311-1.298zm20.877.564c.49-.096.982.287 1.007.792.102.674-.736 1.147-1.337.734-.508-.283-.371-1.27.33-1.526zm-22.47 1.723c.876-.562 1.99.311 1.865 1.177-.125.917-1.13 1.253-1.904.759-.678-.375-.717-1.506.038-1.936zm24.079.567c.778-.473 1.78.314 1.68 1.076-.065.83-1.158 1.222-1.79.64-.596-.465-.511-1.475.11-1.716zm-25.583 1.606c.763-.48 1.731.053 1.865.907.12.864-.705 1.536-1.541 1.247-.934-.248-1.065-1.649-.324-2.154zm27.04.499c.693-.388 1.548.184 1.614.915.128.915-.915 1.432-1.618.883-.702-.428-.722-1.583.005-1.798zm-28.259 1.963c.731-.569 1.79.082 1.843.917.099.859-.798 1.562-1.615 1.211-.781-.284-.978-1.532-.228-2.128zm29.54.39c.558-.227 1.236.145 1.35.727.213.794-.704 1.497-1.434 1.089-.776-.324-.708-1.6.085-1.815zm-30.221 2.09c.716-.581 1.821.1 1.862.974.081.943-.982 1.498-1.72 1.024-.543-.305-.73-1.365-.142-1.997zm30.811.283c.57-.328 1.304.07 1.447.665.24.753-.532 1.472-1.337 1.137-.745-.246-.865-1.468-.11-1.802zm-30.877 2.188c.653-.429 1.516.12 1.589.797.169.834-.776 1.494-1.524 1.054-.665-.338-.767-1.552-.065-1.851zm30.81.33c.508-.3 1.18.082 1.287.64.208.718-.511 1.387-1.25 1.077-.701-.214-.773-1.366-.037-1.718zm-30.28 2.127c.621-.392 1.464.117 1.532.812.153.86-.85 1.443-1.554.964-.529-.318-.589-1.395.022-1.776zm29.699.458c.515-.403 1.31.02 1.367.62.142.706-.657 1.31-1.27.948-.652-.299-.645-1.356-.097-1.568zm-28.587 1.95c.521-.3 1.19.135 1.226.703.097.702-.73 1.203-1.284.791-.523-.32-.5-1.296.058-1.494zm27.42.384c.404-.227.94.071.999.519.146.587-.513 1.092-1.044.782-.513-.254-.486-1.156.045-1.301zm-26.116 1.79c.442-.335 1.084.044 1.165.57.132.53-.39.994-.894.855-.543-.096-.726-.979-.271-1.426zm24.671.507c.366-.25.866.097.93.499.126.528-.487.934-.957.645-.424-.212-.431-.964.027-1.144zm-22.765 1.426c.337-.231.811.032.9.414.13.422-.262.82-.702.752-.462-.038-.64-.753-.198-1.166zm20.833.572c.305-.159.698.059.759.386.133.435-.337.822-.762.672-.454-.117-.464-.87.003-1.058zm-18.59 1.225c.246-.136.584.024.635.298.104.308-.148.61-.482.629-.4.005-.509-.557-.153-.927zm16.146.437c.226-.111.51.057.538.301.053.257-.181.48-.44.463-.328-.005-.425-.531-.098-.764zm-13.6.86c.152-.9.373-.008.413.165.068.172-.06.38-.25.407-.224.022-.33-.326-.164-.571zm11.064.312c.152-.063.342.054.37.219.037.205-.143.362-.342.329-.233-.02-.271-.346-.028-.548z" fill="#fff"/>
    </g>
  </svg>
);

// Get logo component based on coin ID
const getCryptoLogo = (id) => {
  switch (id) {
    case 'bitcoin':
      return <BitcoinLogo />;
    case 'ethereum':
      return <EthereumLogo />;
    case 'binancecoin':
      return <BinanceLogo />;
    case 'solana':
      return <SolanaLogo />;
    case 'cardano':
      return <CardanoLogo />;
    default:
      return <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs">?</div>;
  }
};

// SVG mini chart components
const UpTrendChart = () => (
  <svg width="80" height="30" viewBox="0 0 80 30" className="text-green-500">
    <polyline
      points="0,25 10,20 20,22 30,15 40,18 50,10 60,5 70,8 80,2"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
);

const DownTrendChart = () => (
  <svg width="80" height="30" viewBox="0 0 80 30" className="text-red-500">
    <polyline
      points="0,5 10,10 20,8 30,15 40,12 50,20 60,25 70,22 80,28"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
);

function CryptoTable() {
  const darkMode = useSelector(selectDarkMode);
  const cryptoAssets = useSelector(selectAllCryptoAssets);
  const status = useSelector(selectCryptoStatus);
  const lastUpdated = useSelector(selectLastUpdated);
  const [sortField, setSortField] = useState('rank');
  const [sortDirection, setSortDirection] = useState('asc');

  // Memoized sorted data to prevent unnecessary re-renders
  const sortedData = useMemo(() => {
    return [...cryptoAssets].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      // Handle special case for id vs rank
      if (sortField === 'rank' && !a.rank) {
        // For data that might not have rank field, use array index
        const aIndex = cryptoAssets.findIndex(asset => asset.id === a.id);
        const bIndex = cryptoAssets.findIndex(asset => asset.id === b.id);
        aValue = aIndex + 1;
        bValue = bIndex + 1;
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [cryptoAssets, sortField, sortDirection]);

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: value < 1 ? 4 : 2,
      maximumFractionDigits: value < 1 ? 6 : 2,
    }).format(value);
  };

  const formatPercentage = (value) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const formatLargeNumber = (value) => {
    if (value === null || value === undefined) return '∞';
    
    if (value >= 1e12) {
      return `${(value / 1e12).toFixed(2)}T`;
    } else if (value >= 1e9) {
      return `${(value / 1e9).toFixed(2)}B`;
    } else if (value >= 1e6) {
      return `${(value / 1e6).toFixed(2)}M`;
    } else if (value >= 1e3) {
      return `${(value / 1e3).toFixed(2)}K`;
    }
    return value.toString();
  };

  const getPercentageClass = (value) => {
    return value >= 0 ? 'text-green-500' : 'text-red-500';
  };

  // Determine chart trend based on 7d percentage
  const getChartTrend = (asset) => {
    return asset.percentChange7d >= 0 ? 'up' : 'down';
  };

  return (
    <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white'} rounded-xl shadow-md overflow-hidden transition-colors duration-200`}>
      <div className={`${darkMode ? 'bg-gradient-to-r from-blue-900 to-indigo-900 border-gray-700' : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-gray-200'} p-4 border-b transition-colors duration-200`}>
        <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Cryptocurrency Assets</h2>
        <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-gray-600'}`}>
          {lastUpdated 
            ? `Last updated: ${new Date(lastUpdated).toLocaleString()}`
            : 'Real-time market data'}
        </p>
      </div>
      
      <div className="overflow-x-auto">
        {status === 'loading' ? (
          <div className={`p-4 text-center ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Loading crypto data...
          </div>
        ) : status === 'failed' ? (
          <div className="p-4 text-center text-red-500">
            Failed to load crypto data. Please try again later.
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <tr>
                <th 
                  className={`px-3 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-500 hover:bg-gray-100'} uppercase tracking-wider cursor-pointer`}
                  onClick={() => handleSort('rank')}
                >
                  # {getSortIcon('rank')}
                </th>
                <th className={`px-3 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                  Logo
                </th>
                <th 
                  className={`px-3 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-500 hover:bg-gray-100'} uppercase tracking-wider cursor-pointer`}
                  onClick={() => handleSort('name')}
                >
                  Name {getSortIcon('name')}
                </th>
                <th className={`px-3 py-3 text-left text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider`}>
                  Symbol
                </th>
                <th 
                  className={`px-3 py-3 text-right text-xs font-medium ${darkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-500 hover:bg-gray-100'} uppercase tracking-wider cursor-pointer`}
                  onClick={() => handleSort('price')}
                >
                  Price {getSortIcon('price')}
                </th>
                <th 
                  className={`px-3 py-3 text-right text-xs font-medium ${darkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-500 hover:bg-gray-100'} uppercase tracking-wider cursor-pointer`}
                  onClick={() => handleSort('percentChange1h')}
                >
                  1h % {getSortIcon('percentChange1h')}
                </th>
                <th 
                  className={`px-3 py-3 text-right text-xs font-medium ${darkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-500 hover:bg-gray-100'} uppercase tracking-wider cursor-pointer hidden sm:table-cell`}
                  onClick={() => handleSort('percentChange24h')}
                >
                  24h % {getSortIcon('percentChange24h')}
                </th>
                <th 
                  className={`px-3 py-3 text-right text-xs font-medium ${darkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-500 hover:bg-gray-100'} uppercase tracking-wider cursor-pointer hidden sm:table-cell`}
                  onClick={() => handleSort('percentChange7d')}
                >
                  7d % {getSortIcon('percentChange7d')}
                </th>
                <th 
                  className={`px-3 py-3 text-right text-xs font-medium ${darkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-500 hover:bg-gray-100'} uppercase tracking-wider cursor-pointer hidden md:table-cell`}
                  onClick={() => handleSort('marketCap')}
                >
                  Market Cap {getSortIcon('marketCap')}
                </th>
                <th 
                  className={`px-3 py-3 text-right text-xs font-medium ${darkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-500 hover:bg-gray-100'} uppercase tracking-wider cursor-pointer hidden md:table-cell`}
                  onClick={() => handleSort('volume24h')}
                >
                  Volume (24h) {getSortIcon('volume24h')}
                </th>
                <th 
                  className={`px-3 py-3 text-right text-xs font-medium ${darkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-500 hover:bg-gray-100'} uppercase tracking-wider cursor-pointer hidden lg:table-cell`}
                  onClick={() => handleSort('circulatingSupply')}
                >
                  Circulating Supply {getSortIcon('circulatingSupply')}
                </th>
                <th 
                  className={`px-3 py-3 text-right text-xs font-medium ${darkMode ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-500 hover:bg-gray-100'} uppercase tracking-wider cursor-pointer hidden lg:table-cell`}
                  onClick={() => handleSort('maxSupply')}
                >
                  Max Supply {getSortIcon('maxSupply')}
                </th>
                <th className={`px-3 py-3 text-center text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-500'} uppercase tracking-wider hidden xl:table-cell`}>
                  7D Chart
                </th>
              </tr>
            </thead>
            <tbody className={`${darkMode ? 'bg-gray-800 divide-y divide-gray-700' : 'bg-white divide-y divide-gray-200'}`}>
              {sortedData.map((asset, index) => (
                <tr 
                  key={asset.id}
                  className={`hover:${darkMode ? 'bg-gray-700' : 'bg-blue-50'} cursor-pointer transition-colors`}
                >
                  <td className={`px-3 py-4 whitespace-nowrap text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {asset.rank || index + 1}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap">
                    {getCryptoLogo(asset.id)}
                  </td>
                  <td className={`px-3 py-4 whitespace-nowrap text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {asset.name}
                  </td>
                  <td className={`px-3 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {asset.symbol}
                  </td>
                  <td className={`px-3 py-4 whitespace-nowrap text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'} text-right`}>
                    {formatCurrency(asset.price)}
                  </td>
                  <td className={`px-3 py-4 whitespace-nowrap text-sm font-medium text-right ${getPercentageClass(asset.percentChange1h)}`}>
                    {formatPercentage(asset.percentChange1h)}
                  </td>
                  <td className={`px-3 py-4 whitespace-nowrap text-sm font-medium text-right ${getPercentageClass(asset.percentChange24h)} hidden sm:table-cell`}>
                    {formatPercentage(asset.percentChange24h)}
                  </td>
                  <td className={`px-3 py-4 whitespace-nowrap text-sm font-medium text-right ${getPercentageClass(asset.percentChange7d)} hidden sm:table-cell`}>
                    {formatPercentage(asset.percentChange7d)}
                  </td>
                  <td className={`px-3 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-white' : 'text-gray-900'} text-right hidden md:table-cell`}>
                    ${formatLargeNumber(asset.marketCap)}
                  </td>
                  <td className={`px-3 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-white' : 'text-gray-900'} text-right hidden md:table-cell`}>
                    ${formatLargeNumber(asset.volume24h)}
                  </td>
                  <td className={`px-3 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-white' : 'text-gray-900'} text-right hidden lg:table-cell`}>
                    {formatLargeNumber(asset.circulatingSupply)}
                    <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} ml-1`}>{asset.symbol}</span>
                  </td>
                  <td className={`px-3 py-4 whitespace-nowrap text-sm ${darkMode ? 'text-white' : 'text-gray-900'} text-right hidden lg:table-cell`}>
                    {asset.maxSupply ? formatLargeNumber(asset.maxSupply) : '∞'}
                    {asset.maxSupply && (
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} ml-1`}>{asset.symbol}</span>
                    )}
                  </td>
                  <td className="px-3 py-4 whitespace-nowrap hidden xl:table-cell text-center">
                    {getChartTrend(asset) === 'up' ? <UpTrendChart /> : <DownTrendChart />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default CryptoTable; 