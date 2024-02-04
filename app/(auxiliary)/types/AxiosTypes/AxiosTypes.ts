import {GetInterfaces} from "@/app/(auxiliary)/types/AxiosTypes/AllTraffic";

export interface AuthResponse {
    network_interfaces: GetInterfaces[]
}

export type AxiosErrorType = {message: string, statusCode: number};
export type UnknownError = {errorText: string};