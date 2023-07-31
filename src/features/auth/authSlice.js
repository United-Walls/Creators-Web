import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchToken, fetchUser, send2FA } from "./authAPI";
import { hideToast, showToast } from "../toast/toastSlice";

const initialState = {
    status: 'idle',
    isAuthenticated: false,
    is2FA: false,
    user: null
}

export const loginAsync = createAsyncThunk(
    'auth/login',
    async ({ username, password }, { dispatch, rejectWithValue }) => {
        const hasError = await fetchToken({ username, password });
        if (hasError && hasError.error) {
            dispatch(showToast({ status: "error", message: hasError.msg }));
            setTimeout(() => dispatch(hideToast()), 5000);
            return rejectWithValue("Invalid Credentials");
        }
    }
);

export const twoFAAsync = createAsyncThunk(
    'auth/2fa',
    async (twoFA, { dispatch }) => {
        const userData = await send2FA({twoFA});
        if (userData && userData.error) {
            dispatch(showToast({ status: "error", message: "Oops, something went wrong!"}));
            setTimeout(() => dispatch(hideToast()), 3000);
        }
        return { user: userData }
    }
);

export const loadUserAsync = createAsyncThunk(
    'auth/loadUser',
    async (params, { dispatch, rejectWithValue }) => {
        const userData = await fetchUser();
        if (userData && userData.error) {
            dispatch(showToast({ status: "error", message: userData.msg }));
            setTimeout(() => dispatch(hideToast()), 5000);
            return rejectWithValue("Invalid Token");
        }
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
            .addCase(loginAsync.rejected, (state) => {
                state.status = 'idle'
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
            .addCase(loadUserAsync.rejected, (state) => {
                state.status = 'idle'
                state.is2FA = false;
                state.isAuthenticated = false;
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