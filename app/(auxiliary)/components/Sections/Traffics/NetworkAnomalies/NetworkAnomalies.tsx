import React, {FC} from 'react';
import MainTitle from "@/app/(auxiliary)/components/UI/TextTemplates/MainTitle";
import Search from "@/app/(auxiliary)/components/UI/Inputs/Search/Search";

import styles from "./NetworkAnomalies.module.scss";
import PacketReceiver from "@/app/(auxiliary)/components/Sections/Traffics/PacketReceiver/PacketReceiver";

const NetworkAnomalies: FC = () => {
    return (
        <div className={styles.networkAnomaliesWrapper}>
            <div className={styles.networkAnomaliesTitle}>
                <MainTitle>
                    Network anomalies
                </MainTitle>
            </div>

            <div className={styles.networkAnomaliesSearch}>
                <Search/>
            </div>

            <div className={styles.networkAnomalies}>
                <PacketReceiver/>
            </div>
        </div>
    );
};

export default NetworkAnomalies;