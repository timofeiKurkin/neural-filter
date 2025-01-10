import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {DatasetType} from "@/app/(auxiliary)/types/FilesType/DatasetsType";

export interface InitialFilesStateType {
    files: File[];
    datasets: DatasetType[];
    uploadingFilesStatus: boolean;
}

const initialState: InitialFilesStateType = {
    files: [],
    datasets: [],
    uploadingFilesStatus: false,
}

export const filesSlice = createSlice({
    name: 'files',
    initialState,
    reducers: {
        setFiles: (state, action: PayloadAction<File[]>) => {
            state.files = action.payload
        },
        setDatasets: (state, action: PayloadAction<DatasetType[]>) => {
            state.datasets = action.payload
        },
        setUpdateLossDatasets: (state, action: PayloadAction<{
            modelID: string;
            newLoss: number;
        }>) => {
            state.datasets = state.datasets.map((dataset) => {
                if(dataset.modelID === action.payload.modelID) {
                    return {
                        ...dataset,
                        loss: action.payload.newLoss ?? 0
                    }
                }
                return dataset
            })
        },
        setUploadingFilesStatus: (state, action: PayloadAction<boolean>) => {
            state.uploadingFilesStatus = action.payload
        }
    }
})

export const {
    setFiles,
    setDatasets,
    setUpdateLossDatasets,
    setUploadingFilesStatus
} = filesSlice.actions