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
        <PackageAnomalyList workDataStatus={currentModelStatus.workStatus}/>
        // ws && ws instanceof WebSocket && (
        //     currentModelStatus.workStatus ? (
        //         <PackageAnomalyList/>
        //     ) : (
        //         <div>
        //             <LogoText>
        //                 Run an already trained model or create a new one on the page <Link
        //                 href={"/education-ai"}>/education-ai</Link> page
        //             </LogoText>
        //         </div>
        //     )
        // )
    );
};

export default PacketAnomalyReceiver;