import axios from 'axios';
import { store } from '../app/store';
import { logout } from '../features/auth/authSlice';

const api = axios.create({
    baseURL: 'https://unitedwalls.paraskcd.com/api/',
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.response.use(
    (res) => res,
    (err) => {
        if(err.response.status === 401) {
            store.dispatch(logout())
        }
        return Promise.reject(err);
    }
);

export default api;