import React, {useEffect, useState} from 'react';
import {useSelector} from "@/app/(auxiliary)/lib/redux/store";
import {
    InitialNeuralNetworkStateType,
    selectorNeuralNetwork
} from "@/app/(auxiliary)/lib/redux/store/slices/neuralNetwork";
import {
    AnomalyTrafficPackageType,
    HeaderItemsType,
    TrafficPackageType
} from "@/app/(auxiliary)/types/AxiosTypes/AllTraffic";
import _header from "@/data/trafficData/headerAnomalyItems.json";
import RegularText from "@/app/(auxiliary)/components/UI/TextTemplates/RegularText";
import styles from "./PackageAnomalyList.module.scss";
import Scrollbar from "@/app/(auxiliary)/components/UI/Scrollbar/Scrollbar";
import Image from "next/image";
import checkMark from "@/public/check-mark.svg";
import MainTitle from "@/app/(auxiliary)/components/UI/TextTemplates/MainTitle";
import PackageAnomalyItem
    from "@/app/(auxiliary)/components/Blocks/TrafficBlock/PackageAnomalyList/PackageAnomalyItem/PackageAnomalyItem";


const PackageAnomalyList = () => {
    const {anomalyTraffic}: InitialNeuralNetworkStateType =
        useSelector(selectorNeuralNetwork)

    const [anomalySessions, setAnomalySessions] =
        useState<AnomalyTrafficPackageType[]>([])


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
        <div className={styles.packageAnomalyWrapper}>
            <div className={`${styles.headerList} ${styles.columnWrapper} ${styles.underLine}`}
                 style={{
                     justifyItems: "start"
                 }}>
                {
                    (_header as HeaderItemsType[]).map((item) => (
                        <div key={`key=${item.id}`}>
                            <RegularText>
                                {item.title}
                            </RegularText>
                        </div>
                    ))
                }
            </div>

            <Scrollbar trigger={anomalySessions.length}>
                <div className={styles.packageList}>
                    {
                        anomalySessions.length ? (
                            <div className={styles.packageAnomalyList}>
                                {
                                    anomalySessions.map((item, index) => (
                                        <PackageAnomalyItem key={`key=${index}`}
                                                            anomalyPackage={item}
                                                            index={index}/>
                                    ))
                                }
                            </div>
                        ) : (
                            <div className={styles.noAnomaliesFound}>
                                <Image src={checkMark} alt={"check-mark"}/> <MainTitle>The model hasn't detected any
                                anomalies yet</MainTitle>
                            </div>
                        )
                    }
                </div>
            </Scrollbar>

            <div className={styles.underLine}></div>
        </div>
        // <PackageList packages={anomalySessions} anomalyTraffic={true}/>
    );
};

export default PackageAnomalyList;