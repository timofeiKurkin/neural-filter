import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {TrafficPackageType} from "@/app/(auxiliary)/types/AxiosTypes/AllTraffic";

export interface InitialTrafficStateType {
    allTraffic: TrafficPackageType[];
    currentInterface: string;
    currentSearchQuery: string;
    // savingStatus: boolean;
}

const initialState: InitialTrafficStateType = {
    allTraffic: [],
    currentInterface: "",
    currentSearchQuery: ""
    // savingStatus: false,
}

export const trafficSlice = createSlice({
    name: "traffic",
    initialState: initialState,
    reducers: {
        setInterface: (state, action: PayloadAction<string>) => {
            state.currentInterface = action.payload
        },
        setSavingStatus: (state, action: PayloadAction<boolean>) => {
            state.savingStatus = action.payload
        },
        setCurrentSearchQuery: (state, action: PayloadAction<string>) => {
            state.currentSearchQuery = action.payload
        }
    }
})

export const {
    setInterface,
    setSavingStatus,
    setCurrentSearchQuery
} = trafficSlice.actions