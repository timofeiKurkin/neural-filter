import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {TrafficPackageType} from "@/app/(auxiliary)/types/AxiosTypes/AllTraffic";

interface InitialStateType {
    allTraffic: TrafficPackageType[];
    anomaliesTraffic: TrafficPackageType[];
    currentInterface: string
}

const initialState: InitialStateType = {
    allTraffic: [],
    anomaliesTraffic: [],
    currentInterface: ''
}

export const trafficSlice = createSlice({
    name: "traffic",
    initialState: initialState,
    reducers: {
        setInterface: (state, action: PayloadAction<string>) => {
            state.currentInterface = action.payload
        }
    }
})

export const {
    setInterface
} = trafficSlice.actions