export interface UploadFilesResponse {
  dataset: DatasetType;
  files: FileType[];
}

export interface DatasetType {
  dataset_title: string;
  group_file_id: string;
  loss: number;
  accuracy: number;
}

export interface FileType {
  file_name: string;
  group_file_id: string;
}