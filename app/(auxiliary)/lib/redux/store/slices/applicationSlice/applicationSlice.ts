import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {CustomErrorType} from "@/app/(auxiliary)/types/AppTypes/Errors";
import {SuccessNotificationsType} from "@/app/(auxiliary)/types/AppTypes/SuccessNotificationsType";

export interface InitialApplicationStateType {
    errorList: CustomErrorType[];
    successNotificationList: SuccessNotificationsType[];
    rememberPath: string;
    CSRFToken: string;
}

const initialState: InitialApplicationStateType = {
    errorList: [],
    rememberPath: "",
    successNotificationList: [],
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
        },

        setSuccessNotification: (state, action: PayloadAction<SuccessNotificationsType>) => {
            state.successNotificationList = [...state.successNotificationList, action.payload]
        },
        clearSuccessNotifications: (state, action) => {
            state.successNotificationList = []
        },
        deleteLastSuccessNotification: (state, action: PayloadAction) => {
            state.successNotificationList = state.successNotificationList.slice(0, -1)
        }
    }
})


export const {
    setError,
    setPath,
    setCSRFToken,
    setSuccessNotification,
    clearSuccessNotifications,
    deleteLastSuccessNotification
} = applicationSlice.actions
