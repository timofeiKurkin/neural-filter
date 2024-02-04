import React, {FC} from 'react';
import {TrafficPackageType} from "@/app/(auxiliary)/types/AxiosTypes/AllTraffic";

import styles from "./PackageItem.module.scss";
import columnWrapper from "../PackageList.module.scss"

interface PropsType {
    packageItem: TrafficPackageType
}
const PackageItem: FC<PropsType> = ({packageItem}) => {
    const date = new Date(packageItem.time * 1000); // умножаем на 1000, потому что в JavaScript время в миллисекундах

    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')

    const formattedDate = `${hours}:${minutes}:${seconds}`;

    return (
        <div key={`key=${packageItem.id}`} className={`${columnWrapper.columnWrapper} ${styles.packageItem}`}>
            <div>{packageItem.id}</div>
            <div>{formattedDate}</div>
            <div>{packageItem.source}</div>
            <div>{packageItem.destination}</div>
            <div>{packageItem.protocol}</div>
            <div>{packageItem.length}</div>
        </div>
    );
};

export default PackageItem;