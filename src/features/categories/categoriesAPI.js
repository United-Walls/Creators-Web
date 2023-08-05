import api from "../../utils/api";

export const fetchCategories = async () => {
    try {
        const response = await api.get('category');
        return response.data;
    } catch(err) {
        console.error('DEBUG - ', err);
        return { error: true, msg: err.response.data };
    }
}