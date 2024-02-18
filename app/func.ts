import axios, {AxiosResponse} from "axios";
import {AxiosErrorType, UnknownError} from "@/app/(auxiliary)/types/AxiosTypes/AxiosTypes";
import AppService from "@/app/(auxiliary)/lib/axios/services/AppService/AppService";
import UserService from "@/app/(auxiliary)/lib/axios/services/UserService/UserService";

type GetCSRFToken = () => Promise<AxiosResponse | AxiosErrorType | UnknownError>
export const getCSRFToken: GetCSRFToken = async () => {
    try {
        return await AppService.getCSRFToken()
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

type RefreshToken = (refreshToken: string, csrfToken: string) => Promise<AxiosResponse | AxiosErrorType | UnknownError>
export const refreshToken: RefreshToken = async (refreshToken, csrfToken) => {
    try {
        return await UserService.refreshToken(refreshToken, csrfToken)
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