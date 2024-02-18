import $api from "@/app/(auxiliary)/lib/axios";
import {AxiosResponse} from "axios";

export default class AppService {
    static user = 'user/'
    static async getCSRFToken(): Promise<AxiosResponse> {
        return $api.get(`${this.user}get-csrf-token/`)
    }

    // static
}