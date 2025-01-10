import axios from "axios";
import {getAccessToken} from "@/app/(auxiliary)/func/app/getAccessToken";


export const WS_URL_SERVER = "ws://localhost:8000"
export const API_URL_SERVER = "http://localhost:8000/"
export const API_URL_CLIENT = "http://localhost:3020/api/"


const $api = axios.create({
    baseURL: API_URL_SERVER,
    withCredentials: true,
    xsrfCookieName: "csrftoken",
    xsrfHeaderName: "X-CSRFTOKEN"
})

const $api_client = axios.create({
    baseURL: API_URL_CLIENT,
    withCredentials: true,
})

// const accessToken = typeof window !== 'undefined' ?
//         (localStorage.getItem('access') || "").split('"').join('') : ""
// const accessToken = getAccessToken()
// console.log("accessToken: ", accessToken)

$api.interceptors.request.use((config) => {
    // if(accessToken) {
    //     config.headers.Authorization = `Bearer ${accessToken}`
    // }
    return config
})

$api_client.interceptors.request.use((config) => {
    return config
})

export {
    $api,
    $api_client
}