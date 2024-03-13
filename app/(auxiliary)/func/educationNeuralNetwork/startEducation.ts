import axios, {AxiosResponse} from "axios";
import {AxiosErrorType, UnknownError} from "@/app/(auxiliary)/types/AxiosTypes/AxiosTypes";
import NetworkAnomaliesService
    from "@/app/(auxiliary)/lib/axios/services/NetworkAnomaliesService/NetworkAnomaliesService";


type StartEducation = (groupID: string) => Promise<AxiosResponse | AxiosErrorType | UnknownError>
export const startEducation: StartEducation = async (groupID) => {
    try {
        return await NetworkAnomaliesService.startEducation(groupID)
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