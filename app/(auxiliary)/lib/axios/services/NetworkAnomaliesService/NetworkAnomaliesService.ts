import {AxiosResponse} from "axios";
import $api from "@/app/(auxiliary)/lib/axios";

export default class NetworkAnomaliesService {
    static networkAnomalies = "network_anomalies/"

    static async startEducation(groupID): Promise<AxiosResponse> {
        return $api.post(`${this.networkAnomalies}start_education/`, {"dataset_ID": groupID})
    }
}