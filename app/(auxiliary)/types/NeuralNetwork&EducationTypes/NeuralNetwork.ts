import {TrafficPackageType} from "@/app/(auxiliary)/types/AxiosTypes/AllTraffic";
import {string} from "prop-types";

export interface StateOfCurrentModelID {
    workStatus: boolean;
    modelID: string;
}


export interface NeuralNetworkWorkResponseType {
    send_type: "model_work";
    data: {
        status: "success" | "error";
        modelID?: string;
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
