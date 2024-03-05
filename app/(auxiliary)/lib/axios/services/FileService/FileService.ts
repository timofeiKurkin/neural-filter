import $api from "@/app/(auxiliary)/lib/axios";
import {AxiosResponse} from "axios";
import {DatasetsType} from "@/app/(auxiliary)/types/FilesType/DatasetsType";

export default class FileService {
    static filePath = 'file_handler/'

    static async uploadFiles(files: any): Promise<AxiosResponse> {
        return $api.post(`${this.filePath}upload_files/`, {data: files})
    }

    static async getDatasets(): Promise<AxiosResponse<DatasetsType>> {
        return $api.get<DatasetsType>(`${this.filePath}upload_files/`)
    }
}