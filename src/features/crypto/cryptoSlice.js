import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cryptoData } from './sampleData';

// Mock API function for simulating data updates
const mockUpdatePrices = async () => {
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: cryptoData.map(asset => ({
          id: asset.id,
          price: asset.price * (0.95 + Math.random() * 0.1), 
          percentChange1h: (Math.random() * 2 - 1) * 2, 
          percentChange24h: (Math.random() * 2 - 1) * 5, 
          percentChange7d: (Math.random() * 2 - 1) * 10,
          volume24h: asset.volume24h * (0.9 + Math.random() * 0.2), 
        }))
      });
    }, 1000);
  });
};


export const fetchUpdatedPrices = createAsyncThunk(
  'crypto/fetchUpdatedPrices',
  async (_, { rejectWithValue }) => {
    try {
      const response = await mockUpdatePrices();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update prices');
    }
  }
);

const initialState = {
  assets: cryptoData,
  status: 'idle',
  error: null,
  lastUpdated: null
};

export const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {
    // Sorting reducers
    sortByPrice: (state, action) => {
      const direction = action.payload;
      state.assets.sort((a, b) => {
        return direction === 'asc' ? a.price - b.price : b.price - a.price;
      });
    },
    sortByMarketCap: (state, action) => {
      const direction = action.payload;
      state.assets.sort((a, b) => {
        return direction === 'asc' ? a.marketCap - b.marketCap : b.marketCap - a.marketCap;
      });
    },
    
    // Update a specific asset's price
    updateAssetPrice: (state, action) => {
      const { id, price } = action.payload;
      const asset = state.assets.find(a => a.id === id);
      if (asset) {
        asset.price = price;
        // Recalculate market cap based on new price
        asset.marketCap = asset.circulatingSupply * price;
        state.lastUpdated = new Date().toISOString();
      }
    },
    
    
    updateAssetPercentChanges: (state, action) => {
      const { id, percentChange1h, percentChange24h, percentChange7d } = action.payload;
      const asset = state.assets.find(a => a.id === id);
      if (asset) {
        if (percentChange1h !== undefined) asset.percentChange1h = percentChange1h;
        if (percentChange24h !== undefined) asset.percentChange24h = percentChange24h;
        if (percentChange7d !== undefined) asset.percentChange7d = percentChange7d;
        state.lastUpdated = new Date().toISOString();
      }
    },
    
  
    updateAssetVolume: (state, action) => {
      const { id, volume24h } = action.payload;
      const asset = state.assets.find(a => a.id === id);
      if (asset) {
        asset.volume24h = volume24h;
        state.lastUpdated = new Date().toISOString();
      }
    },
    
   
    bulkUpdateAssets: (state, action) => {
      const updates = action.payload;
      updates.forEach(update => {
        const asset = state.assets.find(a => a.id === update.id);
        if (asset) {
          
          if (update.price !== undefined) {
            asset.price = update.price;
            
            asset.marketCap = asset.circulatingSupply * update.price;
          }
          if (update.percentChange1h !== undefined) asset.percentChange1h = update.percentChange1h;
          if (update.percentChange24h !== undefined) asset.percentChange24h = update.percentChange24h;
          if (update.percentChange7d !== undefined) asset.percentChange7d = update.percentChange7d;
          if (update.volume24h !== undefined) asset.volume24h = update.volume24h;
        }
      });
      state.lastUpdated = new Date().toISOString();
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUpdatedPrices.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUpdatedPrices.fulfilled, (state, action) => {
        state.status = 'succeeded';
      
        action.payload.forEach(update => {
          const asset = state.assets.find(a => a.id === update.id);
          if (asset) {
            if (update.price !== undefined) {
              asset.price = update.price;
             
              asset.marketCap = asset.circulatingSupply * update.price;
            }
            if (update.percentChange1h !== undefined) asset.percentChange1h = update.percentChange1h;
            if (update.percentChange24h !== undefined) asset.percentChange24h = update.percentChange24h;
            if (update.percentChange7d !== undefined) asset.percentChange7d = update.percentChange7d;
            if (update.volume24h !== undefined) asset.volume24h = update.volume24h;
          }
        });
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchUpdatedPrices.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to update prices';
      });
  }
});


export const { 
  sortByPrice, 
  sortByMarketCap, 
  updateAssetPrice, 
  updateAssetPercentChanges, 
  updateAssetVolume,
  bulkUpdateAssets
} = cryptoSlice.actions;

// Selectors
export const selectAllCryptoAssets = (state) => state.crypto.assets;
export const selectCryptoStatus = (state) => state.crypto.status;
export const selectCryptoError = (state) => state.crypto.error;
export const selectLastUpdated = (state) => state.crypto.lastUpdated;

// Get a specific asset by ID
export const selectCryptoAssetById = (state, id) => 
  state.crypto.assets.find(asset => asset.id === id);

// Get top assets by market cap (limit is optional)
export const selectTopAssetsByMarketCap = (state, limit) => {
  const sorted = [...state.crypto.assets].sort((a, b) => b.marketCap - a.marketCap);
  return limit ? sorted.slice(0, limit) : sorted;
};

// Get assets with positive 24h change
export const selectGainingAssets = (state) => 
  state.crypto.assets.filter(asset => asset.percentChange24h > 0);

// Get assets with negative 24h change
export const selectLosingAssets = (state) => 
  state.crypto.assets.filter(asset => asset.percentChange24h < 0);

export default cryptoSlice.reducer; 