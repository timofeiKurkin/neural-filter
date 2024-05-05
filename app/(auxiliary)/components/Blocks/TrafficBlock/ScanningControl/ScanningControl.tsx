"use client"

import React, {useEffect, useState} from 'react';
import Button from "@/app/(auxiliary)/components/UI/Button/Button";
import {color_1, color_3, color_5, color_white} from "@/styles/color";
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
                ws.send(JSON.stringify({
                    ...stopScanningInstruction
                }))
            }
            setScanningStatus(() => false)
        }
    }, [])

    return (
        scanningStatus ? (
            <Button style={{
                color: color_1,
                border: "2px solid transparent",
                borderRadius: "20px",
                backgroundClip: "padding-box, border-box",
                display: "flex",
                backgroundOrigin: "padding-box, border-box",
                justifyContent: "center",
                alignItems: "center",
                padding: "14px 32px"
            }}
                    motionAnimate={{
                        initial: {
                            backgroundImage:
                                `linear-gradient(to right, ${color_white}, ${color_white}), linear-gradient(0deg, ${color_1}, ${color_5} 60%)`
                        },
                        animate: {
                            backgroundImage:
                                `linear-gradient(to right, ${color_white}, ${color_white}), linear-gradient(360deg, ${color_1}, ${color_5} 60%)`
                        },
                        transition: {
                            type: "tween",
                            ease: [0.17, 0.67, 0.83, 0.67],
                            duration: 2,
                            repeat: Infinity,
                        },
                    }}
                    onClick={() => scanningControlHandler({
                        instruction: stopScanningInstruction,
                        ws,
                        currentInterface
                    })}>
                Stop scanning
            </Button>
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