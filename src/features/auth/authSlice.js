import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchToken, fetchUser, send2FA } from "./authAPI";

const initialState = {
    status: 'idle',
    isAuthenticated: false,
    is2FA: false,
    user: null
}

export const loginAsync = createAsyncThunk(
    'auth/login',
    async ({ username, password }) => {
        await fetchToken({ username, password });
    }
);

export const twoFAAsync = createAsyncThunk(
    'auth/2fa',
    async (twoFA) => {
        const userData = await send2FA({twoFA});
        return { user: userData }
    }
);

export const loadUserAsync = createAsyncThunk(
    'auth/loadUser',
    async () => {
        const userData = await fetchUser();
        return {user: userData};
    }
)

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            localStorage.removeItem('token');
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginAsync.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(loginAsync.fulfilled, (state, action) => {
                state.status = 'idle'
                state.is2FA = true;
            })
            .addCase(twoFAAsync.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(twoFAAsync.fulfilled, (state, action) => {
                state.status = 'idle'
                state.is2FA = false;
                state.isAuthenticated = true;
                state.user = action.payload.user
            })
            .addCase(loadUserAsync.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(loadUserAsync.fulfilled, (state, action) => {
                state.status = 'idle'
                state.is2FA = false;
                state.isAuthenticated = true;
                state.user = action.payload.user
            })
    }
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;