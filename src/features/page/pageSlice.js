import { createSlice } from "@reduxjs/toolkit";

const initialState = [
        { name: "Home", icon: "home", active: true, special: false },
        { name: "Wallpapers", icon: "list", active: false, special: false },
        { name: "Upload", icon: "upload", active: false, special: false },
        { name: "Logout", icon: "right-from-bracket",  active: false, special: true }
];

export const pageSlice = createSlice({
    name: 'pages',
    initialState,
    reducers: {
        makeActive: (state, action) => {
            return state.map(page => {
                return { ...page, active: page.name === action.payload.name }
            })
        },
        addPage: (state, action) => {
            let newState = state;
            newState = newState.filter((st) => st.name !== action.payload.name);
            newState.push({ name: action.payload.name, icon: action.payload.icon, active: false, special: false });
            return newState;
        }
    }
});

export const { makeActive, addPage } = pageSlice.actions;

export default pageSlice.reducer;