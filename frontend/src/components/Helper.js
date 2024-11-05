import axios from "axios";
export const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';
export const MYAXIOS = axios.create({
    baseURL: BASE_URL,
    timeout: 30000,
    headers: {
        'Accept': 'application/json'
    }
});