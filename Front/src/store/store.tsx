import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slice/authslice';
import contractReducer from './slice/contractSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    contract: contractReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;