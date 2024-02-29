import $api from "@/app/(auxiliary)/lib/axios";
import {AxiosResponse} from "axios";

export default class FileService {
    static filePath = 'file_handler/'

    static async uploadFiles(files: any): Promise<AxiosResponse> {
        return $api.post(`${this.filePath}upload_files/`, {file: files}, {})
    }
}