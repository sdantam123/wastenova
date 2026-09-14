import { combineReducers, configureStore } from '@reduxjs/toolkit';
import type { Middleware } from '@reduxjs/toolkit';
import type { TypedUseSelectorHook } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import authReducer from './authSlice';
import locationReducer from './locationSlice';
import { recycleApi } from '../api/recycleApi';
import { loadPersistedState, savePersistedState } from './persist';

const persisted = loadPersistedState();

const rootReducer = combineReducers({
  auth: authReducer,
  location: locationReducer,
  [recycleApi.reducerPath]: recycleApi.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  preloadedState: persisted as any,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(recycleApi.middleware as Middleware),
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
