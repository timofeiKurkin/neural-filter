import {AxiosResponse} from "axios";
import {TrafficResponse} from "@/app/(auxiliary)/types/AxiosTypes/AxiosTypes";
import $api from "@/app/(auxiliary)/lib/axios";

export default class All_traffic {
    static pageTraffic = "all-traffic/"

    static async getInterface(): Promise<AxiosResponse<TrafficResponse>> {
        return $api.get<TrafficResponse>(`${this.pageTraffic}get-interface/`)
    }
}