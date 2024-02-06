import axios, {AxiosResponse} from "axios";
import {AxiosErrorType, UnknownError} from "@/app/(auxiliary)/types/AxiosTypes/AxiosTypes";
import UserService from "@/app/(auxiliary)/lib/axios/services/User/UserService";

type Login = (login: string, password: string) => Promise<AxiosResponse | AxiosErrorType | UnknownError>
export const login: Login = async (login, password) => {
    try {
        return await UserService.login(login, password)
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