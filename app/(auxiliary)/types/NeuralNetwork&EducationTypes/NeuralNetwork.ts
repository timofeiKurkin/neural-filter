import {TrafficPackageType} from "@/app/(auxiliary)/types/AxiosTypes/AllTraffic";

export interface StateOfCurrentModelID {
    workStatus: boolean;
    modelID: string;
}


export interface NeuralNetworkWorkResponseType {
    send_type: "model_work" | "model_study";
    data: {
        status: "success" | "error";
        modelID?: string;
        loss?: number;
    }
}


export interface NeuralNetworkFinishEducation {
    send_type: "finish_education";
    data: {
        dataset_id: string;
        status: string;
        loss: number;
    }
}


export interface NeuralNetworkFoundAnomalyResponseType {
    send_type: "found_anomaly_traffic";
    data: {
        status: "success";
        session: string;
        anomaly_package: TrafficPackageType;
    }
}

export type AnomalyTrafficStateType = AnomalyTrafficObjectType[];

export interface AnomalyTrafficObjectType {
    [key: string]: TrafficPackageType[];
}
