import React, {FC} from 'react';
import {TrafficPackageType} from "@/app/(auxiliary)/types/AxiosTypes/AllTraffic";
import {formattedTime} from "@/app/(auxiliary)/func/traffic/timeFormat"

import styles from "./PackageItem.module.scss";
import columnWrapper from "../PackageList.module.scss"

interface PropsType {
    packageItem: TrafficPackageType
}
const PackageItem: FC<PropsType> = ({packageItem}) => {
    const formattedDate = formattedTime(packageItem.time)

    return (
        <div className={`${columnWrapper.columnWrapper} ${styles.packageItem}`}>
            {Object.values(packageItem).map((item) => (
                <div className={styles.data}>
                    {item}
                </div>
            ))}
        </div>
    );
};

export default PackageItem;