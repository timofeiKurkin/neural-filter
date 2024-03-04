import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {TrafficPackageType} from "@/app/(auxiliary)/types/AxiosTypes/AllTraffic";

interface InitialStateType {
    allTraffic: TrafficPackageType[];
    anomaliesTraffic: TrafficPackageType[];
    currentInterface: string;
    savingStatus: boolean;
}

const initialState: InitialStateType = {
    allTraffic: [],
    anomaliesTraffic: [],
    currentInterface: '',
    savingStatus: false,
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
        }
    }
})

export const {
    setInterface,
    setSavingStatus,
} = trafficSlice.actions