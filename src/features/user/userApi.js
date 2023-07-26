import api from "../../utils/api";

export const fetchUserData = async ({ userId, page }) => {
    try {
        const params = { userId, page };
        const response = await api.get('uploaders/walls/queries', { params });
        return response.data;
    } catch(err) {
        console.error('DEBUG - ', err);
    }
}

export const fetchUserWallCount = async ({ userId }) => {
    try {
        const params = { userId };
        const response = await api.get('uploaders/walls/count', { params });
        return response.data;
    } catch(err) {
        console.error('DEBUG - ', err);
    }
}