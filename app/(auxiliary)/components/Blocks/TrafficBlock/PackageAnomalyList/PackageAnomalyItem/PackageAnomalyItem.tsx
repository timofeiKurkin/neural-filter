import React, {FC} from 'react';
import {AnomalyTrafficPackageType} from "@/app/(auxiliary)/types/AxiosTypes/AllTraffic";
import generalStyles from "../PackageAnomalyList.module.scss";
import styles from "./PackageAnomalyItem.module.scss"
import {formattedTime} from "@/app/(auxiliary)/func/traffic/timeFormat";


interface PropsType {
    anomalyPackage: AnomalyTrafficPackageType;
    index: number;
}

const PackageAnomalyItem: FC<PropsType> = ({
                                               anomalyPackage,
                                               index
                                           }) => {
    anomalyPackage["id"] = index
    anomalyPackage = {
        ...anomalyPackage,
        time: formattedTime(Number.parseFloat(anomalyPackage.time))
    }

    return (
        <div className={`${generalStyles.columnWrapper} ${styles.anomalyItem}`}>
            {Object.values(anomalyPackage).map((item, index) => (
                <div key={`key=${index}`} className={styles.anomalyData}>{item}</div>
            ))}
        </div>
    );
};

export default PackageAnomalyItem;