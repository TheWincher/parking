import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import parkingSlice from '../features/parking/parkingSlice';

export const store = configureStore({
  reducer: {
    parking: parkingSlice
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
