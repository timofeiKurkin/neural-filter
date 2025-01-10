import {DatasetType} from "@/app/(auxiliary)/types/FilesType/DatasetsType";

export interface UploadFilesResponse {
  dataset: DatasetType;
  files: FileType[];
}

// export interface DatasetType {
//   dataset_title: string;
//   model_id: string;
//   loss: number;
//   accuracy: number;
// }

export interface FileType {
  file_name: string;
  modelID: string;
}