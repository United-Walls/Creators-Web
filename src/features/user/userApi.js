import api from "../../utils/api";

export const fetchUserData = async ({ userId, page }) => {
    try {
        const params = { userId, page };
        const response = await api.get('uploaders/walls/queries', { params });
        return response.data;
    } catch(err) {
        console.error('DEBUG - ', err);
        return { error: true };
    }
}

export const fetchUserWallCount = async ({ userId }) => {
    try {
        const params = { userId };
        const response = await api.get('uploaders/walls/count', { params });
        return response.data;
    } catch(err) {
        console.error('DEBUG - ', err);
        return { error: true };
    }
}

export const fetchUserLikedWallsData = async ({ userId, page }) => {
    try {
        const params = { userId, page };
        const response = await api.get('uploaders/walls/liked/queries', { params });
        return response.data
    } catch(err) {
        console.error('DEBUG -', err);
        return { error: true };
    }
}

export const fetchUserLikedWallsCount = async ({ userId }) => {
    try {
        const params = { userId };
        const response = await api.get('uploaders/walls/liked/count', { params });
        return response.data
    } catch(err) {
        console.error('DEBUG -', err);
        return { error: true };
    }
}

export const fetchUserDownloadedWallsData = async ({ userId, page }) => {
    try {
        const params = { userId, page };
        const response = await api.get('uploaders/walls/downloaded/queries', { params });
        return response.data
    } catch(err) {
        console.error('DEBUG -', err);
        return { error: true };
    }
}

export const fetchUserDownloadedWallsCount = async ({ userId }) => {
    try {
        const params = { userId };
        const response = await api.get('uploaders/walls/downloaded/count', { params });
        return response.data
    } catch(err) {
        console.error('DEBUG -', err);
        return { error: true };
    }
}