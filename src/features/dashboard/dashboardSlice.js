import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchUserData, fetchUserDownloadedWallsCount, fetchUserDownloadedWallsData, fetchUserLikedWallsCount, fetchUserLikedWallsData, fetchUserWallCount } from "../user/userApi";
import { updateProfile, updateProfilePic } from "../profile/profileAPI";
import { hideToast, showToast } from "../toast/toastSlice";
import { deleteWallAdminById, deleteWallById, fetchWallByID, fixWallAdminById, getApprovalWalls, updateWallAdminById, updateWallById, uploadWall } from "../wall/wallAPI";
import { fetchCategories, fetchCategoryById, fetchCategoryWallCount } from "../categories/categoriesAPI";
import { fetchCreators } from "../creators/creatorsAPI";
import { fetchApprovals } from "../approvals/approvalsAPI";
import { fetchInvites } from "../invites/invitesAPI";

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
    },
    extras: {
        creatorWallsPage: 0,
        categoryWallsPage: 0,
        totalNoOfCategoryWalls: 0,
        totalNoOfCreatorWalls: 0,
        selectedCreator: null,
        selectedCategory: null,
        selectedApproval: null,
        creators: [],
        invites: [],
        approvals: [],
        categories: [],
    }
};

export const fixWallAdminByIdAsync = createAsyncThunk(
    'dashboard/fixWall',
    async ({ wallId }, { dispatch, rejectWithValue }) => {
        const response = await fixWallAdminById({ wallId });
        if (response.error && response.code === 404) {
            dispatch(showToast({ status: "error", message: response.msg}));
            setTimeout(() => dispatch(hideToast()), 3000);
            return rejectWithValue({ wallId });
        } else {
            if (response.error) {
                dispatch(showToast({ status: "error", message: "Oops, something went wrong!"}));
                setTimeout(() => dispatch(hideToast()), 3000);
                return rejectWithValue("rejected");
            }

            dispatch(showToast({ status: "success", message: "Fixed successfully"}));
            setTimeout(() => dispatch(hideToast()), 3000);
            return;
        }
    }
)

export const getCategoryByIdAsync = createAsyncThunk(
    'dashboard/getCategoryById',
    async ({ categoryId, page }, { dispatch, rejectWithValue }) => {
        const count = await fetchCategoryWallCount({ categoryId });
        const categoryData = await fetchCategoryById({ categoryId, page });
        return { categoryData, count };
    }
)

export const getExtrasAsync = createAsyncThunk(
    'dashboard/getExtras',
    async (payload, { dispatch, rejectWithValue }) => {
        const creators = await fetchCreators();
        const approvals = await fetchApprovals();
        const invites = await fetchInvites();
        if (creators && creators.error) {
            dispatch(showToast({ status: "error", message: "Oops, something went wrong!"}));
            setTimeout(() => dispatch(hideToast()), 3000);
            return rejectWithValue("rejected");
        }
        if (approvals && approvals.error) {
            dispatch(showToast({ status: "error", message: "Oops, something went wrong!"}));
            setTimeout(() => dispatch(hideToast()), 3000);
            return rejectWithValue("rejected");
        }
        if (invites && invites.error) {
            dispatch(showToast({ status: "error", message: "Oops, something went wrong!"}));
            setTimeout(() => dispatch(hideToast()), 3000);
            return rejectWithValue("rejected");
        }
        return { creators, approvals, invites }
    }
)

export const deleteWallByIdAsync = createAsyncThunk(
    'dashboard/deleteWall',
    async ({ wallId }, { dispatch, rejectWithValue }) => {
        const wall = await deleteWallById({ wallId });
        if (wall && wall.error) {
            dispatch(showToast({ status: "error", message: "Oops, something went wrong! Could not delete!"}));
            setTimeout(() => dispatch(hideToast()), 3000);
            return rejectWithValue("rejected");
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
            return rejectWithValue("rejected");
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
            return rejectWithValue("rejected");
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
            return rejectWithValue("rejected");
        }
        if (categories && categories.error) {
            dispatch(showToast({ status: "error", message: "Oops, something went wrong!"}));
            setTimeout(() => dispatch(hideToast()), 3000);
            return rejectWithValue("rejected");
        }
        if (approvalWalls && approvalWalls.error) {
            dispatch(showToast({ status: "error", message: "Oops, something went wrong!"}));
            setTimeout(() => dispatch(hideToast()), 3000);
            return rejectWithValue("rejected");
        }
        return { userData, categories, count, approvalWalls };
    }
);

export const loadLikedWallsAsync = createAsyncThunk(
    'dashboard/loadLikedWalls',
    async ({userId, page}, { dispatch, rejectWithValue }) => {
        const likedWalls = await fetchUserLikedWallsData({ userId, page });
        const likedWallsCount = await fetchUserLikedWallsCount({ userId });
        if (likedWalls && likedWalls.error) {
            dispatch(showToast({ status: "error", message: "Oops, something went wrong!"}));
            setTimeout(() => dispatch(hideToast()), 3000);
            return rejectWithValue('rejected');
        }
        return { likedWalls, likedWallsCount };
    }
)

export const loadDownloadedWallsAsync = createAsyncThunk(
    'dashboard/loadDownloadedWalls',
    async ({userId, page}, { dispatch, rejectWithValue }) => {
        const downloadedWalls = await fetchUserDownloadedWallsData({userId, page});
        const downloadedWallsCount = await fetchUserDownloadedWallsCount({userId});
        if (downloadedWalls && downloadedWalls.error) {
            dispatch(showToast({ status: "error", message: "Oops, something went wrong!"}));
            setTimeout(() => dispatch(hideToast()), 3000);
            return rejectWithValue('rejected');
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
                dispatch(showToast({ status: "error", message: "Bro, Image size is too big, should be less than 50 MB!"}));
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
            if (uploadedWall.code === 413 || uploadedWall.code === 502) {
                dispatch(showToast({ status: "error", message: "Bro, either Image size is too big or your sum total of image sizes is too big, should be less than 10 MB!"}));
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
                    walls.push(wall.wall);
                }
            }
            return { walls, approvalWalls };
        }
    }
)

export const adminWallDeleteAsync = createAsyncThunk(
    'dashboard/deleteWallAdmin',
    async ({ wallId }, { dispatch, rejectWithValue }) => {
        const wall = await deleteWallAdminById({ wallId });
        if (wall && wall.error) {
            dispatch(showToast({ status: "error", message: "Oops, something went wrong! Could not delete!"}));
            setTimeout(() => dispatch(hideToast()), 3000);
            return rejectWithValue('rejected');
        }
        dispatch(showToast({ status: "success", message: wall.file_name + " Deleted Successfully" }));
        setTimeout(() => dispatch(hideToast()), 3000);
        return wall;
    }
)

export const adminWallUpdateAsync = createAsyncThunk(
    'dashboard/updateWallAdmin',
    async ({ wallId, file_name, category }, { dispatch, rejectWithValue }) => {
        const wall = await updateWallAdminById({ wallId, file_name, category });
        if (wall && wall.error) {
            dispatch(showToast({ status: "error", message: "Oops, something went wrong! Could not delete!"}));
            setTimeout(() => dispatch(hideToast()), 3000);
            return rejectWithValue('rejected');
        }
        dispatch(showToast({ status: "success", message: wall.file_name + " Updated Successfully" }));
        setTimeout(() => dispatch(hideToast()), 3000);
        return wall;
    }
)

export const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        resetDashboard: (state) => {
            state.username = "";
            state.description = "";
            state.avatar_file_url = "";
            state.walls = [];
            state.approvalWalls = [];
            state.likedWalls = [];
            state.downloadedWalls = [];
            state.page = 0;
            state.likedPage = 0;
            state.downloadedPage = 0;
            state.totalNumberOfDownloadedWalls = 0;
            state.totalNumberOfLikedWalls = 0;
            state.totalNumberOfWalls = 0;
            state.sidebarOpened = false;
            state.userId = "";
            state.selectedWall = null;
            state.socialMediaLinks = {
                twitter: "", 
                instagram: "", 
                facebook: "", 
                mastodon: "", 
                threads: "", 
                steam: "", 
                linkedIn: "",
                link: "",
                other: [],
            };
            state.donationLinks = {
                paypal: "",
                patreon: "" ,
                otherdonations: []
            };
            state.extras = {
                creatorWallsPage: 0,
                categoryWallsPage: 0,
                totalNoOfCategoryWalls: 0,
                totalNoOfCreatorWalls: 0,
                selectedCreator: null,
                selectedCategory: null,
                selectedApproval: null,
                creators: [],
                invites: [],
                approvals: [],
                categories: [],
            }
        },
        toggleSidebar: (state) => {
            state.sidebarOpened = !state.sidebarOpened;
        },
        unselectWall: (state) => {
            state.selectedWall = null;
        },
        unselectCategory: (state) => {
            console.log("unselectCategory")
            state.extras.selectedCategory = null;
            state.extras.categoryWallsPage = 0;
            state.extras.totalNoOfCategoryWalls = 0;
        },
        unselectCreator: (state) => {
            state.extras.selectedCreator = null;
            state.extras.creatorWallsPage = 0;
            state.extras.totalNoOfCreatorWalls = 0;
        },
        unselectApproval: (state) => {
            state.extras.selectedApproval = null;
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
                state.extras.categories = categories;
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
            .addCase(adminWallDeleteAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(adminWallDeleteAsync.rejected, (state) => {
                state.status = 'idle';
            })
            .addCase(adminWallDeleteAsync.fulfilled, (state, action) => {
                state.status = 'idle';
                state.walls = state.walls.filter(wall => wall._id !== action.payload._id);
                if (state.extras.selectedCategory && state.extras.selectedCategory.walls && state.extras.selectedCategory.walls.length > 0) {
                    state.extras.selectedCategory.walls = state.extras.selectedCategory.walls.filter(wall => wall._id !== action.payload._id);
                }
                if (state.extras.selectedCreator && state.extras.selectedCreator.walls && state.extras.selectedCreator.walls.length > 0) {
                    state.extras.selectedCreator.walls = state.extras.selectedCreator.walls.filter(wall => wall._id !== action.payload._id);
                }
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
                if (state.extras.selectedCategory && state.extras.selectedCategory.walls && state.extras.selectedCategory.walls.length > 0) {
                    state.extras.selectedCategory.walls = state.extras.selectedCategory.walls.map(wall => {
                        if(wall._id === action.payload._id) {
                            return action.payload
                        } else {
                            return wall
                        }
                    });
                }
                if (state.extras.selectedCreator && state.extras.selectedCreator.walls && state.extras.selectedCreator.walls.length > 0) {
                    state.extras.selectedCreator.walls = state.extras.selectedCreator.walls.map(wall => {
                        if(wall._id === action.payload._id) {
                            return action.payload
                        } else {
                            return wall
                        }
                    });
                }
                if (state.selectedWall) {
                    state.selectedWall = action.payload;
                }
            })
            .addCase(adminWallUpdateAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(adminWallUpdateAsync.rejected, (state) => {
                state.status = 'idle';
            })
            .addCase(adminWallUpdateAsync.fulfilled, (state, action) => {
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
            })
            .addCase(getExtrasAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getExtrasAsync.rejected, (state) => {
                state.status = 'idle';
            })
            .addCase(getExtrasAsync.fulfilled, (state, action) => {
                state.status = 'idle';
                const { creators, approvals, invites } = action.payload;
                state.extras.creators = creators;
                state.extras.approvals = approvals;
                state.extras.invites = invites;
            })
            .addCase(getCategoryByIdAsync.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(getCategoryByIdAsync.rejected, (state) => {
                state.status = 'idle';
            })
            .addCase(getCategoryByIdAsync.fulfilled, (state, action) => {
                state.status = 'idle';
                const { categoryData, count } = action.payload;
                if (state.extras.selectedCategory === null) {
                    state.extras.selectedCategory = categoryData;
                    state.extras.totalNoOfCategoryWalls = count;
                } else {
                    console.log(categoryData);
                    if (categoryData.walls && categoryData.walls.length > 0) {
                        state.extras.selectedCategory.walls = [ ...state.extras.selectedCategory.walls, ...categoryData.walls ]
                    }
                }
                state.extras.categoryWallsPage = state.extras.categoryWallsPage + 1;
            })
            .addCase(fixWallAdminByIdAsync.pending, (state) => {
                state.status = 'idle'
            })
            .addCase(fixWallAdminByIdAsync.rejected, (state, action) => {
                if (action.payload.wallId) {
                    state.walls = state.walls.filter(wall => wall._id !== action.payload.wallId);
                    if (state.extras.selectedCategory && state.extras.selectedCategory.walls && state.extras.selectedCategory.walls.length > 0) {
                        state.extras.selectedCategory.walls = state.extras.selectedCategory.walls.filter(wall => wall._id !== action.payload.wallId);
                    }
                    if (state.extras.selectedCreator && state.extras.selectedCreator.walls && state.extras.selectedCreator.walls.length > 0) {
                        state.extras.selectedCreator.walls = state.extras.selectedCreator.walls.filter(wall => wall._id !== action.payload.wallId);
                    }
                }
            })
    }
});

export const { toggleSidebar, unselectWall, unselectCreator, unselectApproval, unselectCategory, resetDashboard } = dashboardSlice.actions;

export default dashboardSlice.reducer; 