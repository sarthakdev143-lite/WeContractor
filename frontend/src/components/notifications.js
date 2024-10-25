import { toast } from 'react-toastify';

export const notify = {
    success: (message) => {
        toast.success(message, {
            position: "top-right",
            autoClose: 3500,
            closeOnClick: true,
            draggable: true,
            style: {
                background: "#4ade80",
                color: "#ffffff",
            },
        });
    },

    error: (message) => {
        toast.error(message, {
            position: "top-right",
            autoClose: 8000,
            closeOnClick: true,
            draggable: true,
            style: {
                background: "#f87171",
                color: "#ffffff",
            },
        });
    },

    warning: (message) => {
        toast.warning(message, {
            position: "top-right",
            autoClose: 6000,
            closeOnClick: true,
            draggable: true,
            style: {
                background: "#fbbf24",
                color: "#ffffff",
            },
        });
    },

    info: (message) => {
        toast.info(message, {
            position: "top-right",
            autoClose: 5000,
            closeOnClick: true,
            draggable: true,
            style: {
                background: "#60a5fa",
                color: "#ffffff",
            },
        });
    },
};