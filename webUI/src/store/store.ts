import { configureStore } from '@reduxjs/toolkit';
import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import authReducer from './authSlice';
import locationReducer from './locationSlice';
import { recycleApi } from '../api/recycleApi';
import { loadPersistedState, savePersistedState } from './persist';

const persisted = loadPersistedState();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    location: locationReducer,
    [recycleApi.reducerPath]: recycleApi.reducer,
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  preloadedState: persisted as any,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(recycleApi.middleware),
});

store.subscribe(() => {
  const state = store.getState();
  savePersistedState({ auth: state.auth, location: state.location });
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
