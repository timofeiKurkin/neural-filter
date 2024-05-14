import axios from "axios";


export const WS_URL_SERVER = "ws://localhost:8000"
export const API_URL_SERVER = "http://localhost:8000/"


const $api = axios.create({
    baseURL: API_URL_SERVER,
    withCredentials: true,
    xsrfCookieName: "csrftoken",
    xsrfHeaderName: "X-CSRFTOKEN"
})

const accessToken = typeof window !== "undefined" ? localStorage.getItem('access') ?? "" : ""
console.log("accessToken", accessToken.split('"').join(''))

$api.interceptors.request.use((config) => {
    config.headers.Authorization = accessToken ? `Bearer ${accessToken.split('"').join('')}` : ""
    return config
})

export default $api