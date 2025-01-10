export interface DatasetsType {
    datasets: DatasetType[];
}

export interface DatasetType {
    dataset_title: string;
    modelID: string;
    loss: number;
    sessions_count: number;
}
