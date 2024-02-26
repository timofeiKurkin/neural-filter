import axios, {AxiosResponse} from "axios";
import {TrafficResponse, AxiosErrorType, UnknownError} from "@/app/(auxiliary)/types/AxiosTypes/AxiosTypes";
import AllTrafficService from "@/app/(auxiliary)/lib/axios/services/AllTrafficService/AllTrafficService";

type GetInterfaceType = () => Promise<AxiosResponse<TrafficResponse> | AxiosErrorType | UnknownError>
export const getInterface: GetInterfaceType = async () => {
    try {
        // return await axios.get(`${API_URL_SERVER}all-traffic/get-interface`, {withCredentials: true})
        return await AllTrafficService.getInterface()
    } catch (error: unknown) {
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