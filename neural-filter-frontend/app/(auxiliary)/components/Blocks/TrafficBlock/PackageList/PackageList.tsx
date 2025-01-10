import React, {FC, useEffect, useMemo, useState} from 'react';

import _headerItems from "@/data/trafficData/headerSimpleItems.json"

import {HeaderItemsType, TrafficPackageType} from "@/app/(auxiliary)/types/AxiosTypes/AllTraffic";

import styles from "./PackageList.module.scss";
import RegularText from "@/app/(auxiliary)/components/UI/TextTemplates/RegularText";
import Scrollbar from "@/app/(auxiliary)/components/UI/Scrollbar/Scrollbar";
import PackageItem from "@/app/(auxiliary)/components/Blocks/TrafficBlock/PackageList/PackageItem/PackageItem";
import {InitialTrafficStateType, selectorTraffic, useSelector} from "@/app/(auxiliary)/lib/redux/store";
import Fuse from "fuse.js";


interface PropsType {
    packages: TrafficPackageType[]
}

const PackageList: FC<PropsType> = ({
                                        packages
                                    }) => {

    const {currentSearchQuery}: InitialTrafficStateType = useSelector(selectorTraffic)

    const [formattedPackages, setFormattedPackages] =
        useState(() => (packages))

    useEffect(() => {
        setFormattedPackages(() => (packages))
    }, [packages]);

    useEffect(() => {
        if (currentSearchQuery) {
            const fuseOptions = {
                keys: [
                    "time",
                    "source",
                    "destination",
                    "protocol",
                ],
                minMatchCharLength: 2,
                findAllMatches: true,
                threshold: 0.2,
                useExtendedSearch: true,
                includeMatches: true,

                ignoreLocation: true
            }

            const fuse = new Fuse(packages, fuseOptions)
            const filteredPackages = fuse.search(currentSearchQuery).map((foundPackage) => foundPackage.item)
            setFormattedPackages(() => (filteredPackages))
        } else {
            setFormattedPackages(() => [])
        }

        return () => {
            setFormattedPackages(() => [])
        }
    }, [currentSearchQuery, packages]);

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
                        (formattedPackages.length ? formattedPackages : packages).map((item) => (
                            <PackageItem key={`key=${item.id}+${Math.random()}`} packageItem={item}/>
                        ))
                    }
                </div>
            </Scrollbar>

            <div className={styles.underLine}></div>
        </div>
    );
};

export default PackageList;