import api from "../../utils/api";

export const fetchApprovals = async () => {
    try {
        const response = await api.get('creators/approvals/admin');
        return response.data;
    } catch(err) {
        console.error('DEBUG - ', err);
        return { error: true, msg: err.response.data };
    }
}