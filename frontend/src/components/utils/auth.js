import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json'
    },
    // withCredentials: true 
});

export const AuthUtils = {
    setTokens(token, refreshToken) {
        if (typeof window !== 'undefined') {
            localStorage.setItem('authToken', token);
            localStorage.setItem('refreshToken', refreshToken);
        }
    },

    getTokens() {
        if (typeof window !== 'undefined') {
            return {
                token: localStorage.getItem('authToken'),
                refreshToken: localStorage.getItem('refreshToken')
            };
        }
        return { token: null, refreshToken: null };
    },

    removeTokens() {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
        }
    },

    async validateToken() {
        const { token } = this.getTokens();
        if (!token) return false;

        console.log('Attempting to validate token with:', token);

        try {
            // First try to validate the current token
            const response = await api.get('/api/auth/validate-token', {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log('Validate token response:', response.data);

            return response.data.success;
        } catch (error) {
            // If token validation fails, try to refresh
            if (error.response?.status === 401) {
                console.log('Validate token failed, attempting to refresh');
                try {
                    await this.refreshToken();
                    console.log('Refreshed token, will now be validated again');
                    window.location.href = "/user-dashboard";
                    return true;
                } catch (refreshError) {
                    console.error('Refresh token API call failed:', refreshError);
                    this.removeTokens();
                    return false;
                }
            }
            return false;
        }
    },

    async refreshToken() {
        const { refreshToken } = this.getTokens();
        if (!refreshToken) {
            console.error('No refresh token available');
            throw new Error('No refresh token available');
        }

        console.log('Attempting to refresh token with:', refreshToken);

        try {
            const response = await api.post('/api/auth/refresh-token', {
                refreshToken
            });

            console.log('Refresh token response:', response.data);

            const { authToken: newtoken, refreshToken: newRefreshToken } = response.data;
            this.setTokens(newtoken, newRefreshToken);

            console.log('New access token:', newtoken);
            console.log('New refresh token:', newRefreshToken);

            return {
                token: newtoken,
                refreshToken: newRefreshToken
            };
        } catch (error) {
            console.error('Refresh token API call failed:', error);
            this.removeTokens();
            throw error;
        }
    },

    isAuthenticated() {
        const { token } = this.getTokens();
        if (!token) return false;

        try {
            const decoded = this.decodeToken(token);
            return decoded.exp * 1000 > Date.now();
        } catch (error) {
            console.error('Token decoding failed :- ', error);
            return false;
        }
    },

    decodeToken(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            return JSON.parse(window.atob(base64));
        } catch (error) {
            console.error('Token decoding failed', error);
            return null;
        }
    },

    async logout() {
        try {
            const { token } = this.getTokens();
            if (!token) {
                console.warn('No token found during logout');
                this.removeTokens();
                return;
            }

            await api.post('/api/auth/logout', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            this.removeTokens();
        } catch (error) {
            console.error('Logout API call failed:', error);
            this.removeTokens();
            throw error;
        }
    },

    createAuthenticatedAxios() {
        const instance = axios.create({
            baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        instance.interceptors.request.use(
            (config) => {
                const { token } = this.getTokens();
                if (token) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        instance.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;

                    try {
                        const { token } = await this.refreshToken();
                        originalRequest.headers['Authorization'] = `Bearer ${token}`;
                        return instance(originalRequest);
                    } catch (refreshError) {
                        this.removeTokens();
                        window.location.href = '/form/login';
                        return Promise.reject(refreshError);
                    }
                }

                return Promise.reject(error);
            }
        );

        return instance;
    }
};