import axios, {AxiosResponse} from "axios";
import {AxiosErrorType, UnknownError} from "@/app/(auxiliary)/types/AxiosTypes/AxiosTypes";
import FileService from "@/app/(auxiliary)/lib/axios/services/FileService/FileService";
import {DatasetsType} from "@/app/(auxiliary)/types/FilesType/DatasetsType";
import {UploadFilesResponse} from "@/app/(auxiliary)/types/FilesType/UploadFilesResponse";


type UploadFiles = (files: any, accessToken: string) => Promise<AxiosResponse<UploadFilesResponse> | AxiosErrorType | UnknownError>
export const uploadFiles: UploadFiles = async (files, accessToken) => {
    try {
        return await FileService.uploadFiles(files, accessToken)
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


type GetDatasets = () => Promise<AxiosResponse<DatasetsType> | AxiosErrorType | UnknownError>
export const getDatasets: GetDatasets = async () => {
    try {
        return await FileService.getDatasets()
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


type DeleteDataset = (datasetGroupID: string) => Promise<AxiosResponse | AxiosErrorType | UnknownError>
export const deleteDataset: DeleteDataset = async (datasetGroupID) => {
    try {
        return await FileService.deleteDataset(datasetGroupID)
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
