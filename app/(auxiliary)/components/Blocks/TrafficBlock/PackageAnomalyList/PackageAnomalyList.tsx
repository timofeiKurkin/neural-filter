import React, {useEffect, useState} from 'react';
import {useSelector} from "@/app/(auxiliary)/lib/redux/store";
import {
    InitialNeuralNetworkStateType,
    selectorNeuralNetwork
} from "@/app/(auxiliary)/lib/redux/store/slices/neuralNetwork";
import {TrafficPackageType} from "@/app/(auxiliary)/types/AxiosTypes/AllTraffic";
import RegularText from "@/app/(auxiliary)/components/UI/TextTemplates/RegularText";
import PackageList from "@/app/(auxiliary)/components/Blocks/TrafficBlock/PackageList/PackageList";


const PackageAnomalyList = () => {
    const {anomalyTraffic}: InitialNeuralNetworkStateType = useSelector(selectorNeuralNetwork)

    const [anomalySessions, setAnomalySessions] = useState<TrafficPackageType[]>([])

    console.log(anomalyTraffic)
    console.log(anomalySessions)

    useEffect(() => {
        setAnomalySessions(() => (anomalyTraffic))
        // if (Object.keys(anomalyTraffic).length) {
        //     for (const anomalyTrafficSession in anomalyTraffic) {
        //         if (anomalyTraffic.length) {
        //             setAnomalySessions(() => (anomalyTraffic))
        //         }
        //     }
        // }

        // return () => {
        //     setAnomalySessions(() => [])
        // }
    }, [
        anomalyTraffic
    ])

    return (
        <PackageList packages={anomalySessions} anomalyTraffic={true}/>
    );
};

export default PackageAnomalyList;