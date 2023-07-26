import api from './api';

const setAuthToken = async (token) => {
	if (token) {
		api.defaults.headers.common['Authorization'] = token;
	} else {
        try {
            localStorage.removeItem('token');
            delete api.defaults.headers.common['Authorization']
        } catch(err) {
            console.error(err);
        }
	}
};

export default setAuthToken;