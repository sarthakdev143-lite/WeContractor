import { toast } from 'react-toastify';

export const notify = {
    success: (message) => {
        toast.success(message, {
            position: "top-right",
            autoClose: false,
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
            autoClose: 10000,
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
            autoClose: 7000,
            closeOnClick: true,
            draggable: true,
            style: {
                background: "#8A6D1D",
                color: "#f4d149",
            },
        });
    },

    info: (message) => {
        toast.info(message, {
            position: "top-right",
            autoClose: 7000,
            closeOnClick: true,
            draggable: true,
            style: {
                background: "#60a5fa",
                color: "#ffffff",
            },
        });
    },
};