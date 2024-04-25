export interface StateOfCurrentModelID {
    workStatus: boolean;
    modelID: string;
}

export interface NeuralNetworkWorkResponseType {
    send_type: "model_work",
    data: {
        status: "success" | "error",
        modelID?: string
    }
}



