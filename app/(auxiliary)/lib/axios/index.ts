import axios from "axios";
import {AuthTokens} from "@/app/(auxiliary)/types/AppTypes/AuthTokens";

export const WS_URL_SERVER = "ws://localhost:8010"
export const API_URL_SERVER = "http://localhost:8010/"


const $api = axios.create({
    baseURL: API_URL_SERVER,
    withCredentials: true,
    xsrfCookieName: "csrftoken",
    xsrfHeaderName: "X-CSRFTOKEN"
})

const tokens = typeof window !== 'undefined' ? localStorage.getItem('authTokens') : null
let tokensJSON: AuthTokens = JSON.parse(tokens ? tokens : '')

$api.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${tokensJSON.access}`
    return config
})

export default $api