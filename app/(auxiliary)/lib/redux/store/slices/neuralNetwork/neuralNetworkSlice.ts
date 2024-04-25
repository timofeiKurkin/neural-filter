import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {
    ModelMetricType
} from "@/app/(auxiliary)/types/NeuralNetwork&EducationTypes/EducationTypes";
import {StateOfCurrentModelID} from "@/app/(auxiliary)/types/NeuralNetwork&EducationTypes/NeuralNetwork";

export interface InitialNeuralNetworkStateType {
    currentModelStatus: StateOfCurrentModelID;
    ws: WebSocket;
    modelMetric: ModelMetricType;
}

const initialState: InitialNeuralNetworkStateType = {
    currentModelStatus: {
        workStatus: false,
        modelID: ""
    },
    ws: {} as WebSocket,
    modelMetric: {} as ModelMetricType
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
        }
    }
})


export const {
    setCurrentModelStatus,
    setWebSocket,
    setModelMetric
} = neuralNetworkSlice.actions
