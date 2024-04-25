import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {DatasetType} from "@/app/(auxiliary)/types/FilesType/DatasetsType";
// import {ErrorFilesType} from "@/app/(auxiliary)/types/FilesType/ErrorFilesType";

export interface InitialFilesStateType {
    // files: FileType[];
    files: File[];
    datasets: DatasetType[];
    // errorFiles: ErrorFilesType[];
}

const initialState: InitialFilesStateType = {
    files: [],
    datasets: [],
    // errorFiles: [],
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
        // setErrorFiles: (state, action: PayloadAction<ErrorFilesType[]>) => {
        //     state.errorFiles = action.payload
        // }
    }
})

export const {
    setFiles,
    setDatasets,
    // setErrorFiles,
} = filesSlice.actions