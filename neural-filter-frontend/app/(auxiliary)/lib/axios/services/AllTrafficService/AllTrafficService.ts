import {AxiosResponse} from "axios";
import {TrafficResponse} from "@/app/(auxiliary)/types/AxiosTypes/AxiosTypes";
import {$api} from "@/app/(auxiliary)/lib/axios";

export default class AllTrafficService {
    static pageTraffic = "all-traffic/"

    static async getInterface(accessToken: string): Promise<AxiosResponse<TrafficResponse>> {
        return $api.get<TrafficResponse>(`${this.pageTraffic}get-interface/`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
    }
}