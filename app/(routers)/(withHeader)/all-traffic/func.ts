import axios, {AxiosResponse} from "axios";
import {AuthResponse, AxiosErrorType, UnknownError} from "@/app/(auxiliary)/types/AxiosTypes/AxiosTypes";
import All_traffic from "@/app/(auxiliary)/lib/axios/services/all_traffic/all_traffic";

type GetInterfaceType = () => Promise<AxiosResponse<AuthResponse> | AxiosErrorType | UnknownError>
export const getInterface: GetInterfaceType = async () => {
    try {
        // return await axios.get(`${API_URL_SERVER}all-traffic/get-interface`, {withCredentials: true})
        return await All_traffic.getInterface()
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