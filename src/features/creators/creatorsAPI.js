import api from "../../utils/api";

export const fetchCreators = async () => {
    try {
        const response = await api.get('uploaders');
        return response.data;
    } catch(err) {
        console.error('DEBUG - ', err);
        return { error: true, msg: err.response.data };
    }
}

export const fetchCreatorById = async ({ userId, page }) => {
    try {
        const response = await api.get(`uploaders/walls/queries?userId=${userId}&page=${page}`);
        return response.data;
    } catch(err) {
        console.error("DEBUG - ", err);
        return { error: true, msg: err.response.data };
    }
}

export const fetchCreatorWallCount = async ({ userId }) => {
    try {
        const response = await api.get(`uploaders/walls/count?userId=${userId}`);
        return response.data;
    } catch(err) {
        console.error('DEBUG - ', err);
        return { error: true };
    }
}