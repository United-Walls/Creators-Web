import api from "../../utils/api";

export const fetchWallByID = async ({ wallId }) => {
    try {
        const response = await api.get(`walls/${wallId}`);
        return response.data;
    } catch(err) {
        console.error('DEBUG - ', err);
        return { error: true, msg: err.response.data };
    }
}

export const deleteWallById = async ({ wallId }) => {
    try {
        const response = await api.delete(`creators/wallpapers?wallId=${wallId}`);
        return response.data;
    } catch(err) {
        console.error('DEBUG - ', err);
        return { error: true, msg: err.response.data };
    }
}

export const updateWallById = async ({ wallId, file_name, category }) => {
    try {
        const response = await api.post(`creators/wallpapers?wallId=${wallId}`, { file_name, category });
        return response.data;
    } catch(err) {
        console.error('DEBUG - ', err);
        return { error: true, msg: err.response.data };
    }
}