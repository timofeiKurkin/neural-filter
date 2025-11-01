"use client"

import React, {useEffect, useState} from 'react';
import Button from "@/app/(auxiliary)/components/UI/Button/Button";
import {color_1, color_white} from "@/styles/color";
import {InitialTrafficStateType, selectorTraffic, useSelector} from "@/app/(auxiliary)/lib/redux/store";
import {
    InitialNeuralNetworkStateType,
    selectorNeuralNetwork
} from "@/app/(auxiliary)/lib/redux/store/slices/neuralNetwork";
import {ModelWorkInstructionsType} from "@/app/(auxiliary)/types/NeuralNetwork&EducationTypes/EducationTypes";
import {
    startScanningInstruction,
    stopScanningInstruction
} from "@/app/(auxiliary)/components/Blocks/EducationBlocks/TrainingNow/DatasetsList/Dataset/modelWorkInstructions";
import AnimationButton from "@/app/(auxiliary)/components/UI/AnimationButton/AnimationButton";


const ScanningControl = () => {
    const {currentModelStatus, ws}: InitialNeuralNetworkStateType = useSelector(selectorNeuralNetwork)
    const {currentInterface}: InitialTrafficStateType = useSelector(selectorTraffic)
    const [scanningStatus, setScanningStatus] = useState<boolean>(false)

    const scanningControlHandler = (args: {
        instruction: ModelWorkInstructionsType
        ws: WebSocket
        currentInterface: string
    }) => {
        setScanningStatus((prevState) => (!prevState))
        args.ws.send(JSON.stringify({
            ...args.instruction,
            interface: args.currentInterface
        }))
    }

    useEffect(() => {
        return () => {
            if (ws && ws instanceof WebSocket) {
                ws.send(JSON.stringify(stopScanningInstruction))
            }
            setScanningStatus(() => false)
        }
    }, [ws])

    return (
        scanningStatus ? (
            <AnimationButton
                onClick={() => scanningControlHandler({
                    instruction: stopScanningInstruction,
                    ws,
                    currentInterface
                })}>
                Stop scanning
            </AnimationButton>
        ) : (
            <Button style={{
                backgroundColor: color_white,
                color: color_1,
                border: `2px solid ${color_1}`,
                padding: "14px 32px",
            }}
                    disabled={!currentModelStatus.workStatus}
                    onClick={() => scanningControlHandler({
                        instruction: startScanningInstruction,
                        ws,
                        currentInterface
                    })}>
                Start scanning
            </Button>
        )
    );
};

export default ScanningControl;