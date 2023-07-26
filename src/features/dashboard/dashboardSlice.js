import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchUserData, fetchUserWallCount } from "../user/userApi";

const initialState = {
    status: 'idle',
    username: null,
    avatar_file_url: null,
    walls: [],
    page: 0,
    totalNumberOfWalls: 0
};

export const loadWallsAndUserAsync = createAsyncThunk(
    'dashboard/loadWallsAndUser',
    async ({userId, page}) => {
        const userData = await fetchUserData({ userId, page });
        return { userData };
    }
);

export const loadWallCount = createAsyncThunk(
    'dashboard/wallcount',
    async ({ userId }) => {
        const count = await fetchUserWallCount({ userId });
        return { count }
    }
)

export const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadWallsAndUserAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loadWallsAndUserAsync.fulfilled, (state, action) => {
                const { userData } = action.payload;
                state.status = 'idle';
                state.username = userData.username;
                state.page = state.page + 1;
                state.walls = [state.walls, userData.walls];
                state.avatar_file_url = userData.avatar_file_url;
            })
            .addCase(loadWallCount.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loadWallCount.fulfilled, (state, action) => {
                const { count } = action.payload;
                state.status = 'idle';
                state.totalNumberOfWalls = count;
            })
    }
});

export default dashboardSlice.reducer; 

