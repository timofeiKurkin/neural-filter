import axios, {AxiosResponse} from "axios";
import {AxiosErrorType, UnknownError} from "@/app/(auxiliary)/types/AxiosTypes/AxiosTypes";
import FileService from "@/app/(auxiliary)/lib/axios/services/FileService/FileService";

type UploadFiles = (files: any) => Promise<AxiosResponse | AxiosErrorType | UnknownError>
export const uploadFiles: UploadFiles = async (files) => {
    try {
        return await FileService.uploadFiles(files)
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