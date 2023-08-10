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

export const deleteWallAdminById = async ({ wallId }) => {
    try {
        const response = await api.delete(`creators/wallpapers/admin?wallId=${wallId}`);
        return response.data;
    } catch(err) {
        console.error('DEBUG - ', err);
        return { error: true, msg: err.response.data };
    }
}

export const updateWallAdminById = async ({ wallId, file_name, category }) => {
    try {
        const response = await api.post(`creators/wallpapers/admin?wallId=${wallId}`, { file_name, category });
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

export const uploadWall = async (formData) => {
    try {
        const response = await api.post('creators/wallpapers/upload', formData, {
            headers: {
            'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch(err) {
        console.error('DEBUG - ', err);
        return { error: true, code: err.response.status };
    }
}

export const getApprovalWalls = async ({ userId }) => {
    try {
        const response = await api.get(`creators/approvals/creator?userId=${userId}`);
        return response.data;
    } catch(err) {
        console.error('DEBUG - ', err);
        return { error: true, code: err.response.status };
    }
}