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
    let copyPackage = {...anomalyPackage}
    copyPackage["time"] = formattedTime(anomalyPackage.time as number)
    copyPackage = {id: index+1, ...copyPackage}

    return (
        <div className={`${generalStyles.columnWrapper} ${styles.anomalyItem}`}>
            {Object.values(copyPackage).map((item, index) => (
                <div key={`key=${index}`} className={styles.anomalyData}>{item}</div>
            ))}
        </div>
    );
};

export default PackageAnomalyItem;