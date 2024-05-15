import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {CustomErrorType} from "@/app/(auxiliary)/types/AppTypes/Errors";

interface InitialStateType {
    errorList: CustomErrorType[];
    rememberPath: string;
    CSRFToken: string;
}

const initialState: InitialStateType = {
    errorList: [],
    rememberPath: "",
    CSRFToken: ""
}

export const applicationSlice = createSlice({
    name: "application",
    initialState,
    reducers: {
        setError: (state, action: PayloadAction<CustomErrorType[]>) => {
            state.errorList = action.payload
        },
        setPath: (state, action: PayloadAction<string>) => {
            state.rememberPath = action.payload
        },
        setCSRFToken: (state, action: PayloadAction<string>) => {
            state.CSRFToken = action.payload
        }
    }
})


export const {
    setError,
    setPath,
    setCSRFToken
} = applicationSlice.actions
