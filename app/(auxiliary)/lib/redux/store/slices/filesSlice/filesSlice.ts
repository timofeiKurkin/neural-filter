import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {FileType} from "@/app/(auxiliary)/types/FilesType/FilesType";
import {DatasetType} from "@/app/(auxiliary)/types/FilesType/DatasetsType";

interface InitialStateType {
    files: FileType[];
    datasets: DatasetType[];
}

const initialState: InitialStateType = {
    files: [],
    datasets: [],
}

export const filesSlice = createSlice({
    name: 'files',
    initialState,
    reducers: {
        setFiles: (state, action: PayloadAction<FileType[]>) => {
            state.files = action.payload
        },
        setDatasets: (state, action: PayloadAction<DatasetType[]>) => {
            state.datasets = action.payload
        }
    }
})

export const {
    setFiles,
    setDatasets,
} = filesSlice.actions