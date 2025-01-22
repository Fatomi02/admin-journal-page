import axios from "axios";

const api = axios.create({
    baseURL: 'https://api-aco-final.onrender.com'
});

api.interceptors.request.use((config) => {
    let data = localStorage.getItem('data');
    data = JSON.parse(data)
    if(data?.token) {
        config.headers.authorization = `Bearer ${data.token}`
    } return config
}, (error) => {
    return Promise.reject(error)
}
)

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status) {
            const status = error.response.status;
            if (status === 401) {
                window.location.href = '/login'
            } else if (status === 403) {
                console.log("Access forbidden - you do not have the necessary permissions.");
            } else if (status === 404) {
                console.log("Requested resource not found.");
            } else if (status >= 500) {
                console.log("Server error - please try again later.");
            }
        }
        return Promise.reject(error);
    }
);

export default api;