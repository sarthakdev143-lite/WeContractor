import axios from 'axios';

export const AuthUtils = {
    setToken(token) {
        if (typeof window !== 'undefined') {
            localStorage.setItem('authToken', token);
        }
    },

    getToken() {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('authToken');
        }
        return null;
    },

    removeToken() {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('authToken');
        }
    },

    isAuthenticated() {
        const token = this.getToken();
        if (!token) return false;

        try {
            const decoded = this.decodeToken(token);
            return decoded.exp * 1000 > Date.now();
        } catch (error) {
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

    createAuthenticatedAxios() {
        const instance = axios.create({
            baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        instance.interceptors.request.use(
            (config) => {
                const token = this.getToken();
                if (token) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        instance.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    this.removeToken();
                    return Promise.reject({ ...error, redirect: true });
                }
                return Promise.reject(error);
            }
        );

        return instance;
    }
};