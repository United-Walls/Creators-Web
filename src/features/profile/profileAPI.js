import api from "../../utils/api";

export const updateProfile = async (body) => {
    try {
        const response = await api.post('creators/profile', body);
        return response.data;
    } catch(err) {
        console.error('DEBUG - ', err);
        return { error: true };
    }
}

export const updateProfilePic = async (formData) => {
    try {
        const response = await api.post('creators/profile/upload', formData, {
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