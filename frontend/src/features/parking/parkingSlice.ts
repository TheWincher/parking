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
        console.log('id', id);
        while (id === '' || (id !== null && Number.isNaN(+id))) {
            id = prompt('Veuillez entrer un numéro de place valide');
        }

        if (id === '' || (id !== null && Number.isNaN(+id))) {
            alert('Veuillez entrer un numéro de place valide')
        } else if (id) {
            return await leave(+id);
        }
    }
);

export const parkingSlice = createSlice({
    name: 'parking',
    initialState,
    reducers: {
    },
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