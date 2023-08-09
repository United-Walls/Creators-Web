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

export const fetchCategoryById = async ({ categoryId, page }) => {
    try {
        const response = await api.get(`category/walls/queries?categoryId=${categoryId}&page=${page}`);
        return response.data;
    } catch(err) {
        console.error('DEBUG - ', err);
        return { error: true, msg: err.response.data };
    }
}

export const fetchCategoryWallCount = async ({ categoryId }) => {
    try {
        const response = await api.get(`category/walls/count?categoryId=${categoryId}`);
        return response.data;
    } catch(err) {
        console.error('DEBUG - ', err);
        return { error: true };
    }
}