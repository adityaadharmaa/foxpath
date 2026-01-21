import axios from "axios"


const API_URL = 'http://127.0.0.1:8000/api/v1'

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token")

        if(token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if(error.response && error.response.status === 401) {
            localStorage.removeItem("token")
            localStorage.removeItem("user")

            window.location.href = "/login"
        }
        return Promise.reject(error)
    }
)

export default apiClient