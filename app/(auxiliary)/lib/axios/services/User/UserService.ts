import axios from "axios";
import $api, {API_URL_SERVER} from "@/app/(auxiliary)/lib/axios";

export default class UserService {
    static async login(login: string, password: string) {
        return axios.post(`${API_URL_SERVER}user/login/`, {login, password})
    }

    static async logout() {
        return axios.post('user/logout')
    }
}