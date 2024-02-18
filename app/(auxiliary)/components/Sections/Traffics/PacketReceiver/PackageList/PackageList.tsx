import React, {FC, useEffect, useRef} from 'react';

import _headerItems from "@/data/trafficData/headerItems.json"

import {HeaderItemsType, TrafficPackageType} from "@/app/(auxiliary)/types/AxiosTypes/AllTraffic";

import styles from "./PackageList.module.scss";
import RegularText from "@/app/(auxiliary)/components/UI/TextTemplates/RegularText";
import Scrollbar from "@/app/(auxiliary)/components/UI/Scrollbar/Scrollbar";
import PackageItem
    from "@/app/(auxiliary)/components/Sections/Traffics/PacketReceiver/PackageList/PackageItem/PackageItem";
import MainTitle from "@/app/(auxiliary)/components/UI/TextTemplates/MainTitle";

interface PropsType {
    packages: TrafficPackageType[]
}

const PackageList: FC<PropsType> = ({packages}) => {

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
                    {packages.length ?
                        packages.map((item) => (
                            <div key={`key=${item.id}+${Math.random()}`}>
                                <PackageItem packageItem={item}/>
                            </div>
                        ))
                        :
                        <div className={styles.packageListIsEmpty}>
                            <MainTitle>No packages</MainTitle>
                        </div>
                    }
                </div>
            </Scrollbar>

            <div className={styles.underLine}></div>
        </div>
    );
};

export default PackageList;