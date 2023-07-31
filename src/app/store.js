import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../features/auth/authSlice';
import dashboardReducer from "../features/dashboard/dashboardSlice";
import pageReducer from "../features/page/pageSlice";
import toastReducer from "../features/toast/toastSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        dashboard: dashboardReducer,
        pages: pageReducer,
        toast: toastReducer
    }
});