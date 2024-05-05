import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {
    ModelMetricType
} from "@/app/(auxiliary)/types/NeuralNetwork&EducationTypes/EducationTypes";
import {
    AnomalyTrafficObjectType,
    AnomalyTrafficStateType,
    StateOfCurrentModelID
} from "@/app/(auxiliary)/types/NeuralNetwork&EducationTypes/NeuralNetwork";
import {AnomalyTrafficPackageType, TrafficPackageType} from "@/app/(auxiliary)/types/AxiosTypes/AllTraffic";

export interface InitialNeuralNetworkStateType {
    currentModelStatus: StateOfCurrentModelID;
    ws: WebSocket;
    modelMetric: ModelMetricType;
    // anomalyTraffic: AnomalyTrafficStateType;
    anomalyTraffic: AnomalyTrafficPackageType[];
}

const initialState: InitialNeuralNetworkStateType = {
    currentModelStatus: {
        workStatus: false,
        modelID: ""
    },
    ws: {} as WebSocket,
    modelMetric: {} as ModelMetricType,
    anomalyTraffic: [],
}

export const neuralNetworkSlice = createSlice({
    name: "neuralNetwork",
    initialState,
    reducers: {
        setCurrentModelStatus: (state, action: PayloadAction<StateOfCurrentModelID>) => {
            state.currentModelStatus = action.payload
        },
        setWebSocket: (state, action: PayloadAction<WebSocket>) => {
            state.ws = action.payload
        },
        setModelMetric: (state, action: PayloadAction<ModelMetricType>) => {
            state.modelMetric = action.payload
        },
        setNewAnomalyTraffic: (state, action: PayloadAction<{[key: string]: TrafficPackageType}>) => {
            const sessionKey = Object.keys(action.payload)[0]
            state.anomalyTraffic.push(action.payload[sessionKey])

            // if (sessionKey in state.anomalyTraffic) {
            //     state.anomalyTraffic[sessionKey].push(action.payload[sessionKey])
            // } else {
            //     state.anomalyTraffic[sessionKey] = [action.payload[sessionKey]]
            // }
        }
    }
})


export const {
    setCurrentModelStatus,
    setWebSocket,
    setModelMetric,
    setNewAnomalyTraffic
} = neuralNetworkSlice.actions
