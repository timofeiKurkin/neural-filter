import axios from "axios";


export const WS_URL_SERVER = process.env.NEXT_PUBLIC_BACKEND_WS
export const API_URL_SERVER = process.env.NEXT_PUBLIC_BACKEND_HOST
export const API_URL_CLIENT = process.env.NEXT_PUBLIC_FRONTEND_API


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
};
