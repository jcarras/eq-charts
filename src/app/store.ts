import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import filtersReducer from '../comps/filters/filtersSlice';

export const store = configureStore({
  reducer: {
    filters: filtersReducer
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
