export interface UploadFilesResponse {
  dataset: Dataset;
  files: File[];
}

export interface Dataset {
  dataset_title: string;
  group_file_id: string;
  loss: number;
  accuracy: number;
}

export interface File {
  file_name: string;
  group_file_id: string;
}