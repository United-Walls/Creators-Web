import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchUserData, fetchUserDownloadedWallsCount, fetchUserDownloadedWallsData, fetchUserLikedWallsCount, fetchUserLikedWallsData, fetchUserWallCount } from "../user/userApi";
import { updateProfile, updateProfilePic } from "../profile/profileAPI";
import { hideToast, showToast } from "../toast/toastSlice";
import { deleteWallById, fetchWallByID, getApprovalWalls, updateWallById, uploadWall } from "../wall/wallAPI";
import { fetchCategories } from "../categories/categoriesAPI";

const initialState = {
    status: 'idle',
    username: "",
    description: "",
    avatar_file_url: "",
    walls: [],
    approvalWalls: [],
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
    selectedWall: null,
    categories: [],
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

export const deleteWallByIdAsync = createAsyncThunk(
    'dashboard/deleteWall',
    async ({ wallId }, { dispatch, rejectWithValue }) => {
        const wall = await deleteWallById({ wallId });
        if (wall && wall.error) {
            dispatch(showToast({ status: "error", message: "Oops, something went wrong! Could not delete!"}));
            setTimeout(() => dispatch(hideToast()), 3000);
            rejectWithValue("rejected");
        }
        dispatch(showToast({ status: "success", message: wall.file_name + " Deleted Successfully" }));
        setTimeout(() => dispatch(hideToast()), 3000);
        return wall;
    }
)

export const updateWallByIdAsync = createAsyncThunk(
    'dashboard/updateWall',
    async ({ wallId, file_name, category }, { dispatch, rejectWithValue }) => {
        const wall = await updateWallById({ wallId, file_name, category });
        if (wall && wall.error) {
            dispatch(showToast({ status: "error", message: "Oops, something went wrong! Could not delete!"}));
            setTimeout(() => dispatch(hideToast()), 3000);
            rejectWithValue("rejected");
        }
        dispatch(showToast({ status: "success", message: wall.file_name + " Updated Successfully" }));
        setTimeout(() => dispatch(hideToast()), 3000);
        return wall;
    }
)

export const loadSelectedWallAsync = createAsyncThunk(
    'dashboard/loadSelectedWall',
    async ({ wallId }, { dispatch, rejectWithValue }) => {
        const wall = await fetchWallByID({ wallId });
        if (wall && wall.error) {
            dispatch(showToast({ status: "error", message: "Oops, something went wrong!"}));
            setTimeout(() => dispatch(hideToast()), 3000);
            rejectWithValue("rejected");
        }
        return wall;
    }
)

export const loadWallsAndUserAsync = createAsyncThunk(
    'dashboard/loadWallsAndUser',
    async ({userId, page}, { dispatch, rejectWithValue }) => {
        const userData = await fetchUserData({ userId, page });
        const categories = await fetchCategories();
        const approvalWalls = await getApprovalWalls({ userId });
        console.log(userData);
        const count = await fetchUserWallCount({ userId });
        if (userData && userData.error) {
            dispatch(showToast({ status: "error", message: "Oops, something went wrong!"}));
            setTimeout(() => dispatch(hideToast()), 3000);
            rejectWithValue("rejected");
        }
        return { userData, categories, count, approvalWalls };
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
                dispatch(showToast({ status: "error", message: "Bro, Image size is too big, should be less than 10 MB!"}));
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

export const uploadWallpaperAsync = createAsyncThunk(
    'dashboard/uploadWallpaper',
    async (formData, { dispatch, rejectWithValue }) => {
        const uploadedWall = await uploadWall(formData);
        let approvalWalls = []
        let walls = []
        if (uploadedWall && uploadedWall.error) {
            if (uploadedWall.code === 413) {
                dispatch(showToast({ status: "error", message: "Bro, Image size is too big, should be less than 10 MB!"}));
            } else {
                dispatch(showToast({ status: "error", message: "Oops, could not upload!"}));
            }
            setTimeout(() => dispatch(hideToast()), 5000);
            return rejectWithValue('Could not upload');
        } else {
            dispatch(showToast({ status: "success", message: "Uploaded Successfully"}));
            setTimeout(() => dispatch(hideToast()), 3000);
            for(let i = 0; i < uploadedWall.length; i++) {
                let wall = uploadedWall[i];
                console.log(wall);
                if (wall.wall.hidden === true) {
                    approvalWalls.push(wall);
                } else {
                    walls.push(wall);
                }
            }
            return { walls, approvalWalls };
        }
    }
)

export const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        toggleSidebar: (state) => {
            state.sidebarOpened = !state.sidebarOpened;
        },
        unselectWall: (state) => {
            state.selectedWall = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadWallsAndUserAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loadWallsAndUserAsync.rejected, (state, action) => {
                state.status = 'idle';
            })
            .addCase(loadWallsAndUserAsync.fulfilled, (state, action) => {
                const { userData, categories, count, approvalWalls } = action.payload;
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
                state.categories = categories;
                state.approvalWalls = approvalWalls;
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
            .addCase(uploadWallpaperAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(uploadWallpaperAsync.rejected, (state) => {
                state.status = 'idle';
            })
            .addCase(uploadWallpaperAsync.fulfilled, (state, action) => {
                state.status = 'idle';
                const { walls, approvalWalls } = action.payload;
                walls.forEach(wall => {
                    state.walls.unshift(wall);
                });
                approvalWalls.forEach(wall => {
                    state.approvalWalls.unshift(wall);
                })
            })
            .addCase(loadSelectedWallAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loadSelectedWallAsync.rejected, (state) => {
                state.status = 'idle';
            })
            .addCase(loadSelectedWallAsync.fulfilled, (state, action) => {
                state.status = 'idle';
                state.selectedWall = action.payload;
            })
            .addCase(deleteWallByIdAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteWallByIdAsync.rejected, (state) => {
                state.status = 'idle';
            })
            .addCase(deleteWallByIdAsync.fulfilled, (state, action) => {
                state.status = 'idle';
                state.walls = state.walls.filter(wall => wall._id !== action.payload._id);
            })
            .addCase(updateWallByIdAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateWallByIdAsync.rejected, (state) => {
                state.status = 'idle';
            })
            .addCase(updateWallByIdAsync.fulfilled, (state, action) => {
                state.status = 'idle';
                state.walls = state.walls.map(wall => {
                    if(wall._id === action.payload._id) {
                        return action.payload
                    } else {
                        return wall
                    }
                });
                if (state.selectedWall) {
                    state.selectedWall = action.payload;
                }
            });
    }
});

export const { toggleSidebar, unselectWall } = dashboardSlice.actions;

export default dashboardSlice.reducer; 