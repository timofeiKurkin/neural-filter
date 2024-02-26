"use client"

import React, {useState} from 'react';
import styles from "./NNStatus.module.scss"
import RegularText from "@/app/(auxiliary)/components/UI/TextTemplates/RegularText";
import {color_6} from "@/styles/color";


const NnStatus = () => {

    const [stateStatus, setStateStatus] = useState<{
        status: string;
        color: string;
    }>({
        status: 'no work',
        color: color_6
    })

    return (
        <div className={styles.statusWrapper}>
            <div className={styles.NNStatusWrapper}>
                <RegularText>Neural network status</RegularText>
            </div>

            <RegularText>
                <span className={styles.currentStatus}>
                    <span className={styles.currentStatusColor} style={{
                        backgroundColor: stateStatus.color
                    }}></span>

                    <span className={styles.currentStatusText}>
                        {stateStatus.status}
                    </span>
                </span>
            </RegularText>
        </div>
    );
};

export default NnStatus;