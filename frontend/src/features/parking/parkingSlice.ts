import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAll, leave, take } from './parkingAPI';
import { RootState } from '../../app/store';

export interface ParkingSpace {
    id: number;
    free: boolean;
  }

export interface ParkingState {
    parkingSpaces: ParkingSpace[];
    initialized: boolean;
}

const initialState: ParkingState = {
    parkingSpaces: [],
    initialized: false
};

export const getAllAsync = createAsyncThunk(
    'parking/all',
    async () => {
      return await getAll();
    }
);

export const takeAsync = createAsyncThunk(
    'parking/take',
    async () => {
      return await take();
    }
);

export const leaveAsync = createAsyncThunk(
    'parking/take',
    async () => {
        let id = prompt('Numéro de la place');
        if(id) {
            return await leave(+id);
        }
      
    }
);

export const parkingSlice = createSlice({
    name: 'parking',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
    },
    // The `extraReducers` field lets the slice handle actions defined elsewhere,
    // including actions generated by createAsyncThunk or in other slices.
    extraReducers: (builder) => {
        builder.addCase(getAllAsync.fulfilled, (state, action) => {
            state.parkingSpaces = action.payload;
            state.initialized = true;
        })
    },
});
  
//export const { } = parkingSlice.actions;

export const selectParkingSpaces = (state: RootState) => state.parking.parkingSpaces;
export const selectInitialized = (state: RootState) => state.parking.initialized;

export default parkingSlice.reducer;