export interface GetModelMetricResponseType {
    metric: ModelMetricType;
}

export interface ModelMetricType {
    id: number
    dataset_title: string
    group_file_id: string
    count_files: number
    loss: number
    val_loss: number
    accuracy: number
    val_accuracy: number
    image_metric_exist: boolean
}

export interface ModelWorkInstructionsType {
    send_type: "start_education" | "stop_education" | "start_scanning" | "stop_scanning";
}