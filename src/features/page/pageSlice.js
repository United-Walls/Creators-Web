import { createSlice } from "@reduxjs/toolkit";

const initialState = [
        { name: "Home", icon: "home", active: true },
        { name: "Wallpapers", icon: "list", active: false },
        { name: "Upload", icon: "upload", active: false }
];

export const pageSlice = createSlice({
    name: 'pages',
    initialState,
    reducers: {
        makeActive: (state, action) => {
            return state.map(page => {
                return { ...page, active: page.name === action.payload.name }
            })
        }
    }
});

export const { makeActive } = pageSlice.actions;

export default pageSlice.reducer;