import {DatasetType} from "@/app/(auxiliary)/types/FilesType/DatasetsType";

export interface GetModelMetricResponseType {
    metric: ModelMetricType;
}

export interface ModelMetricType extends DatasetType{
    count_files: number;
    val_loss: number;
    accuracy: number;
    val_accuracy: number;
    image_metric_exist: boolean;
}

export interface ModelWorkInstructionsType {
    send_type: "start_education" | "stop_education" | "start_scanning" | "stop_scanning";
}