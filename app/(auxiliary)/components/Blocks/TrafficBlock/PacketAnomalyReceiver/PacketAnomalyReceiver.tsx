"use client"

import React, {useEffect} from 'react';
import {InitialTrafficStateType, selectorTraffic, useSelector} from "@/app/(auxiliary)/lib/redux/store";
import {
    InitialNeuralNetworkStateType,
    selectorNeuralNetwork
} from "@/app/(auxiliary)/lib/redux/store/slices/neuralNetwork";
import {
    startScanningInstruction,
    stopScanningInstruction
} from "@/app/(auxiliary)/components/Blocks/EducationBlocks/TrainingNow/DatasetsList/Dataset/modelWorkInstructions";
import LogoText from "@/app/(auxiliary)/components/UI/TextTemplates/LogoText";
import Link from "next/link";
import PackageAnomalyList from "@/app/(auxiliary)/components/Blocks/TrafficBlock/PackageAnomalyList/PackageAnomalyList";


const PacketAnomalyReceiver = () => {
    const {
        currentModelStatus,
        ws,
    }: InitialNeuralNetworkStateType = useSelector(selectorNeuralNetwork)

    return (
        ws && ws instanceof WebSocket && (
            currentModelStatus.workStatus ? (
                <PackageAnomalyList/>
            ) : (
                <div>
                    <LogoText>
                        Run or train a new model to identify anomalies in traffic on the <Link
                        href={"/education-ai"}>/education-ai</Link> page
                    </LogoText>
                </div>
            )
        )
    );
};

export default PacketAnomalyReceiver;