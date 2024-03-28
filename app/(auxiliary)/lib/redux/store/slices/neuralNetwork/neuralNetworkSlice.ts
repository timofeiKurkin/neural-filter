import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {
    ModelMetricType,
    StateOfEducationType
} from "@/app/(auxiliary)/types/NeuralNetwork&EducationTypes/NeuralNetwork&EducationTypes";

interface InitialStateType {
    startEducation: StateOfEducationType;
    ws: WebSocket;
    modelMetric: ModelMetricType;
}

const initialState: InitialStateType = {
    startEducation: {
        signal: false,
        datasetID: ""
    },
    ws: {} as WebSocket,
    modelMetric: {} as ModelMetricType
}

export const neuralNetworkSlice = createSlice({
    name: "neuralNetwork",
    initialState,
    reducers: {
        setStartEducation: (state, action: PayloadAction<StateOfEducationType>) => {
            state.startEducation = action.payload
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
    setWebSocket,
    setModelMetric
} = neuralNetworkSlice.actions
