import axios, {AxiosResponse} from "axios";
import {AxiosErrorType, UnknownError} from "@/app/(auxiliary)/types/AxiosTypes/AxiosTypes";


export const axiosHandler = async <T, D>(func: T): Promise<AxiosResponse<D> | AxiosErrorType | UnknownError> => {
    try {
        return await func as Promise<AxiosResponse<D>>
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            return {
                message: error.response?.data,
                statusCode: error.response?.status || 500
            } as AxiosErrorType
        } else {
            console.error("Unknown error")
            return {
                errorText: "Неизвестная ошибка"
            } as UnknownError
        }
    }
}