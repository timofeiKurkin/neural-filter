import {AxiosResponse} from "axios";
import $api from "@/app/(auxiliary)/lib/axios";
import {
    GetModelMetricResponseType
} from "@/app/(auxiliary)/types/NeuralNetwork&EducationTypes/EducationTypes";

export default class NetworkAnomaliesService {
    static networkAnomalies = "network_anomalies/"

    static async getModelMetrics(dataset_id: string):
        Promise<AxiosResponse<GetModelMetricResponseType>>
    {
        return $api.get(`${this.networkAnomalies}get_model_metrics/?dataset_id=${dataset_id}`)
    }
}