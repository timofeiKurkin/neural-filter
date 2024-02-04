import axios from "axios";

export const WS_URL_SERVER = "ws://localhost:8010"
export const API_URL_SERVER = "http://localhost:8010/"

const $api = axios.create({
    baseURL: API_URL_SERVER,
    // withCredentials: true,
    // headers: {
    //     "Access-Control-Allow-Credentials": true,
    //     "Access-Control-Allow-Headers" : "Authorization, X-Custom",
    //     "Access-Control-Request-Method": "GET, POST, PATCH",
    //     "Access-Control-Request-Max-Age": 600
    // }
    // headers: {
    //     "Content-Type": "application/json",
    //     accept: "application/json"
    // }
})


$api.interceptors.request.use((config) => {
    return config
})

export default $api