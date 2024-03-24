import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {StateOfEducationType} from "@/app/(auxiliary)/types/NeuralNetwork&EducationTypes/NeuralNetwork&EducationTypes";

interface InitialStateType {
    startEducation: StateOfEducationType;
    ws: WebSocket;
}

const initialState: InitialStateType = {
    startEducation: {
        signal: false,
        datasetID: ""
    },
    ws: {} as WebSocket,
}

export const neuralNetworkSlice = createSlice({
    name: "application",
    initialState,
    reducers: {
        setStartEducation: (state, action: PayloadAction<StateOfEducationType>) => {
            state.startEducation = action.payload
        },
        setWebSocket: (state, action: PayloadAction<WebSocket>) => {
            state.ws = action.payload
        }
    }
})


export const {
    setStartEducation,
    setWebSocket,
} = neuralNetworkSlice.actions
