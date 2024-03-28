export interface StateOfEducationType {
    signal: boolean;
    datasetID: string;
}

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