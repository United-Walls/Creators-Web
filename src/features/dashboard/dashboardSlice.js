import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchUserData, fetchUserDownloadedWallsCount, fetchUserDownloadedWallsData, fetchUserLikedWallsCount, fetchUserLikedWallsData, fetchUserWallCount } from "../user/userApi";
import { updateProfile, updateProfilePic } from "../profile/profileAPI";
import { hideToast, showToast } from "../toast/toastSlice";

const initialState = {
    status: 'idle',
    username: "",
    description: "",
    avatar_file_url: "",
    walls: [],
    likedWalls: [],
    downloadedWalls: [],
    page: 0,
    likedPage: 0,
    downloadedPage: 0,
    totalNumberOfWalls: 0,
    totalNumberOfLikedWalls: 0,
    totalNumberOfDownloadedWalls: 0,
    sidebarOpened: false,
    userId: "",
    socialMediaLinks: {
        twitter: "", 
        instagram: "", 
        facebook: "", 
        mastodon: "", 
        threads: "", 
        steam: "", 
        linkedIn: "",
        link: "",
        other: [],
    },
    donationLinks: {
        paypal: "",
        patreon: "" ,
        otherdonations: []
    }
};

export const loadWallsAndUserAsync = createAsyncThunk(
    'dashboard/loadWallsAndUser',
    async ({userId, page}, { dispatch }) => {
        const userData = await fetchUserData({ userId, page });
        const count = await fetchUserWallCount({ userId });
        if (userData && userData.error) {
            dispatch(showToast({ status: "error", message: "Oops, something went wrong!"}));
            setTimeout(() => dispatch(hideToast()), 3000);
        }
        return { userData, count };
    }
);

export const loadLikedWallsAsync = createAsyncThunk(
    'dashboard/loadLikedWalls',
    async ({userId, page}, { dispatch }) => {
        const likedWalls = await fetchUserLikedWallsData({ userId, page });
        const likedWallsCount = await fetchUserLikedWallsCount({ userId });
        if (likedWalls && likedWalls.error) {
            dispatch(showToast({ status: "error", message: "Oops, something went wrong!"}));
            setTimeout(() => dispatch(hideToast()), 3000);
        }
        return { likedWalls, likedWallsCount };
    }
)

export const loadDownloadedWallsAsync = createAsyncThunk(
    'dashboard/loadDownloadedWalls',
    async ({userId, page}, { dispatch }) => {
        const downloadedWalls = await fetchUserDownloadedWallsData({userId, page});
        const downloadedWallsCount = await fetchUserDownloadedWallsCount({userId});
        if (downloadedWalls && downloadedWalls.error) {
            dispatch(showToast({ status: "error", message: "Oops, something went wrong!"}));
            setTimeout(() => dispatch(hideToast()), 3000);
        }
        return { downloadedWalls, downloadedWallsCount };
    }
)

export const updateProfileAsync = createAsyncThunk(
    'dashboard/updateProfile',
    async (body, { dispatch, rejectWithValue }) => {
        const updatedData = await updateProfile(body);
        if (updatedData && updatedData.error) {
            dispatch(showToast({ status: "error", message: "Oops, something went wrong!"}));
            setTimeout(() => dispatch(hideToast()), 3000);
            return rejectWithValue('No user found');
        } else {
            dispatch(showToast({ status: "success", message: "Updated Successfully"}));
            setTimeout(() => dispatch(hideToast()), 3000);
            return updatedData;
        }
    }
)

export const updateProfilePicAsync = createAsyncThunk(
    'dashboard/updateProfilePic',
    async (formData, { dispatch, rejectWithValue }) => {
        const updatedData = await updateProfilePic(formData);
        if (updatedData && updatedData.error) {
            if (updatedData.code === 413) {
                dispatch(showToast({ status: "error", message: "Bro, Image size is too much, should be less than 10 MB!"}));
            } else {
                dispatch(showToast({ status: "error", message: "Oops, could not upload!"}));
            }
            setTimeout(() => dispatch(hideToast()), 5000);
            return rejectWithValue('Could not upload');
        } else {
            dispatch(showToast({ status: "success", message: "Uploaded Successfully"}));
            setTimeout(() => dispatch(hideToast()), 3000);
            return updatedData;
        }
    }
)

export const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        toggleSidebar: (state) => {
            state.sidebarOpened = !state.sidebarOpened;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadWallsAndUserAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loadWallsAndUserAsync.fulfilled, (state, action) => {
                const { userData, count } = action.payload;
                state.status = 'idle';
                state.username = userData.username ? userData.username : state.username;
                state.page = state.page + 1;
                state.walls = [...state.walls, ...userData.walls];
                state.avatar_file_url = userData.avatar_file_url;
                state.userId = userData.userID;
                state.totalNumberOfWalls = count;
                state.description = userData.description ? userData.description : state.description;
                state.donationLinks = userData.donationLinks ? userData.donationLinks : state.donationLinks;
                state.socialMediaLinks = userData.socialMediaLinks ? userData.socialMediaLinks : state.socialMediaLinks;
            })
            .addCase(loadLikedWallsAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loadDownloadedWallsAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loadLikedWallsAsync.fulfilled, (state, action) => {
                state.status = 'idle';
                state.likedWalls = action.payload.likedWalls;
                state.likedPage = state.likedPage + 1;
                state.totalNumberOfLikedWalls = action.payload.likedWallsCount;
            })
            .addCase(loadDownloadedWallsAsync.fulfilled, (state, action) => {
                state.status = 'idle';
                state.downloadedWalls = action.payload.downloadedWalls;
                state.downloadedPage = state.downloadedPage + 1;
                state.totalNumberOfDownloadedWalls = action.payload.downloadedWallsCount;
            })
            .addCase(updateProfileAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateProfileAsync.rejected, (state) => {
                state.status = 'idle';
            })
            .addCase(updateProfileAsync.fulfilled, (state, action) => {
                const { username, description, socialMediaLinks, donationLinks } = action.payload;

                state.status = 'idle';
                state.username = username;
                state.description = description;
                state.socialMediaLinks = socialMediaLinks;
                state.donationLinks = donationLinks;
            })
            .addCase(updateProfilePicAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateProfilePicAsync.rejected, (state) => {
                state.status = 'idle';
            })
            .addCase(updateProfilePicAsync.fulfilled, (state, action) => {
                const { avatar_file_url } = action.payload;

                state.status = 'idle';
                state.avatar_file_url = avatar_file_url;
            })
    }
});

export const { toggleSidebar } = dashboardSlice.actions;

export default dashboardSlice.reducer; 