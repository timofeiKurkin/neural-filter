import {
    ModelWorkInstructionsType
} from "@/app/(auxiliary)/types/NeuralNetwork&EducationTypes/EducationTypes";

export const startEducationInstruction: ModelWorkInstructionsType = {
    send_type: "start_education"
}

export const stopEducationInstruction: ModelWorkInstructionsType = {
    send_type: "stop_education"
}

export const startScanningInstruction: ModelWorkInstructionsType = {
    send_type: "start_scanning"
}

export const stopScanningInstruction: ModelWorkInstructionsType = {
    send_type: "stop_scanning"
}