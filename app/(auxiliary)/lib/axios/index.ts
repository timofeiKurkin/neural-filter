import axios from "axios";


export const WS_URL_SERVER = "ws://localhost:8010"
export const API_URL_SERVER = "http://localhost:8010/"


const $api = axios.create({
    baseURL: API_URL_SERVER,
    withCredentials: true,
    xsrfCookieName: "csrftoken",
    xsrfHeaderName: "X-CSRFTOKEN",
    headers: {
        Authorization: `Bearer ${localStorage.getItem('access')}`
    }
})

console.log(typeof window !== "undefined" ? localStorage.getItem('access') : null)

$api.interceptors.request.use((config) => {
    // config.headers.Authorization = `Bearer ${localStorage.getItem('access')}`
    return config
})

export default $api