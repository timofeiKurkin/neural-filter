export interface DatasetsType {
    datasets: DatasetType[];
}

export interface DatasetType {
    dataset_title: string;
    group_file_id: string;
    loss: number;
    sessions_count: number;
}
