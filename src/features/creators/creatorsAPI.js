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