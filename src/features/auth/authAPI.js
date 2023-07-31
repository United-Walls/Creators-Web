import api from "../../utils/api";
import setAuthToken from "../../utils/setAuthToken";

export const fetchToken = async ({ username, password }) => {
    try {
        const body = { username, password }
        const response = await api.post('creators/auth', body);
        localStorage.setItem('token', response.data.token);
        setAuthToken(response.data.token)
        return { error: false };
    } catch(err) {
        console.error('DEBUG - ', err);
        return { error: true, msg: err.response.data };
    }
}

export const send2FA = async ({twoFA}) => {
    try {
        const body = { twoFA }
        const response = await api.post('/creators/auth/2fa', body);
        return response.data;
    } catch(err) {
        console.error('DEBUG - ', err);
        return { error: true };
    }
}

export const fetchUser = async () => {
    try {
        const response = await api.get('/creators/auth');
        return response.data;
    } catch(err) {
        console.error('DEBUG - ', err);
        return { error: true, msg: err.response.data };
    }
}