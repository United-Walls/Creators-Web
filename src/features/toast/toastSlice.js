import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    status: 'idle',
    message: ''
}

const toastSlice = createSlice({
    name: 'toast',
    initialState,
    reducers: {
        showToast: (state, action) => {
            state.status = action.payload.status;
            state.message = action.payload.message;
        },
        hideToast: (state) => {
            state.status = 'idle';
            state.message = '';
        }
    }
});

export const { showToast, hideToast } = toastSlice.actions;

export default toastSlice.reducer;