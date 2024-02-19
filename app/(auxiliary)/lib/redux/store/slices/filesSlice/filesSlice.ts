import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IUser} from "@/app/(auxiliary)/types/UserTypes/IUser";
import {FileType} from "@/app/(auxiliary)/types/FilesType/FilesType";

interface InitialStateType {
    files: FileType[]
}

const initialState: InitialStateType = {
    files: []
}

export const filesSlice = createSlice({
    name: 'files',
    initialState,
    reducers: {
        setFiles: (state, action: PayloadAction<FileType[]>) => {
            state.files = action.payload
        }
    }
})

export const {
    setFiles,
} = filesSlice.actions