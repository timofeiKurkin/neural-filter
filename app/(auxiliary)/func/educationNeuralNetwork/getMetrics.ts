import axios, {AxiosResponse} from "axios";
import {AxiosErrorType, UnknownError} from "@/app/(auxiliary)/types/AxiosTypes/AxiosTypes";
import NetworkAnomaliesService
    from "@/app/(auxiliary)/lib/axios/services/NetworkAnomaliesService/NetworkAnomaliesService";
import {
    GetModelMetricResponseType
} from "@/app/(auxiliary)/types/NeuralNetwork&EducationTypes/EducationTypes";


type GetMetricImage = (dataset_id: string) => Promise<AxiosResponse<GetModelMetricResponseType> | AxiosErrorType | UnknownError>
export const getMetricImage: GetMetricImage = async (dataset_id) => {
    try {
        return await NetworkAnomaliesService.getModelMetrics(dataset_id)
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const typedError: AxiosErrorType = {
                message: error.response?.data,
                statusCode: error.response?.status || 500
            }
            return typedError
        } else {
            console.error("Unknown error")
            return {
                errorText: "Неизвестная ошибка"
            }
        }
    }
}