import React, {FC, useMemo} from 'react';

import _headerItems from "@/data/trafficData/headerSimpleItems.json"

import {HeaderItemsType, TrafficPackageType} from "@/app/(auxiliary)/types/AxiosTypes/AllTraffic";

import styles from "./PackageList.module.scss";
import RegularText from "@/app/(auxiliary)/components/UI/TextTemplates/RegularText";
import Scrollbar from "@/app/(auxiliary)/components/UI/Scrollbar/Scrollbar";
import PackageItem from "@/app/(auxiliary)/components/Blocks/TrafficBlock/PackageList/PackageItem/PackageItem";
import {InitialTrafficStateType, selectorTraffic, useSelector} from "@/app/(auxiliary)/lib/redux/store";


interface PropsType {
    packages: TrafficPackageType[]
}

const PackageList: FC<PropsType> = ({
                                        packages
                                    }) => {

    const {currentSearchQuery}: InitialTrafficStateType = useSelector(selectorTraffic)

    const packagesMemo = useMemo(
        () => packages, [packages]
    )

    return (
        <div className={styles.packageListWrapper}>
            <div className={`${styles.headerList} ${styles.columnWrapper} ${styles.underLine}`}>
                {
                    (_headerItems as HeaderItemsType[]).map(item => (
                        <div key={`key=${item.id}`} className={styles.headerItem}>
                            <RegularText>
                                {item.title}
                            </RegularText>
                        </div>
                    ))
                }
            </div>

            <Scrollbar trigger={packages.length}>
                <div className={`${styles.packageList}`}>
                    {
                        packages.map((item) => (
                            <div key={`key=${item.id}+${Math.random()}`}>
                                <PackageItem packageItem={item}/>
                            </div>
                        ))
                    }
                </div>
            </Scrollbar>

            <div className={styles.underLine}></div>
        </div>
    );
};

export default PackageList;