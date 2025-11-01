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
    const {currentModelStatus}: InitialNeuralNetworkStateType = useSelector(selectorNeuralNetwork)

    return (
        <PackageAnomalyList workDataStatus={currentModelStatus.workStatus}/>
    );
};

export default PacketAnomalyReceiver;