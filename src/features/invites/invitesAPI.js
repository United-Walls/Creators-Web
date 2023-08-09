import api from "../../utils/api";

export const fetchInvites = async () => {
    try {
        const response = await api.get('creators/invitations/admin');
        return response.data;
    } catch(err) {
        console.error('DEBUG - ', err);
        return { error: true, msg: err.response.data };
    }
}