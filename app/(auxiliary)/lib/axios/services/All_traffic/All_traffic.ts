import {AxiosResponse} from "axios";
import {AuthResponse} from "@/app/(auxiliary)/types/AxiosTypes/AxiosTypes";
import $api from "@/app/(auxiliary)/lib/axios";

export default class All_traffic {
    static pageTraffic = "all-traffic/"

    static async getInterface(): Promise<AxiosResponse<AuthResponse>> {
        return $api.get<AuthResponse>(`${this.pageTraffic}get-interface/`)
    }
}