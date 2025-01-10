import {$api} from "@/app/(auxiliary)/lib/axios";
import {AxiosResponse} from "axios";
import {DatasetsType} from "@/app/(auxiliary)/types/FilesType/DatasetsType";
import {UploadFilesResponse} from "@/app/(auxiliary)/types/FilesType/UploadFilesResponse";

export default class FileService {
    static filePath = "file_handler/"

    static async uploadFiles(
        files: any,
        accessToken: string
    ): Promise<AxiosResponse<UploadFilesResponse>> {
        return $api.post<UploadFilesResponse>(`${this.filePath}upload_files/`, files, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "multipart/form-data"
            }
        })
    }

    static async getDatasets(accessToken: string): Promise<AxiosResponse<DatasetsType>> {
        return $api.get<DatasetsType>(`${this.filePath}upload_files/`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
    }

    static async deleteDataset(
        datasetGroupID: string,
        accessToken: string
    ): Promise<AxiosResponse> {
        return $api.delete(`${this.filePath}upload_files/${datasetGroupID}/`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
    }
}