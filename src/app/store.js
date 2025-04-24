import { configureStore } from '@reduxjs/toolkit';
// Import reducers
import cryptoReducer from '../features/crypto/cryptoSlice';
import themeReducer from '../features/theme/themeSlice';

export const store = configureStore({
  reducer: {
    crypto: cryptoReducer,
    theme: themeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        
        ignoredActions: ['crypto/fetchUpdatedPrices/fulfilled'],
      },
    }),
});
