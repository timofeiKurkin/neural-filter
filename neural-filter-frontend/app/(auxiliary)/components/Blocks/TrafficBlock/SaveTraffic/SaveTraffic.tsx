"use client"

import React from 'react';
import SaveIcon from "@/public/save.svg";
import Image from "next/image";
import styles from "./SaveTraffic.module.scss";
import {selectorTraffic, setSavingStatus, useDispatch, useSelector} from "@/app/(auxiliary)/lib/redux/store";


const SaveTraffic = () => {
    const dispatch = useDispatch()
    const {savingStatus} = useSelector(selectorTraffic)

    const savingHandler = () => {
        dispatch(setSavingStatus(!savingStatus))
    }


    return (
        <div className={styles.saveTrafficWrapper}>

            <div className={styles.saveTraffic} onClick={savingHandler}>
                <Image src={SaveIcon} alt={'save'} unoptimized/>
                <p className={styles.saveTrafficText}>Write packages and save</p>
            </div>
        </div>
    );
};

export default SaveTraffic;