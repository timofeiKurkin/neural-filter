import React, {FC} from 'react';
import MainTitle from "@/app/(auxiliary)/components/UI/TextTemplates/MainTitle";
import Search from "@/app/(auxiliary)/components/UI/Inputs/Search/Search";

import styles from "./NetworkAnomalies.module.scss";
import PacketAnomalyReceiver
    from "@/app/(auxiliary)/components/Blocks/TrafficBlock/PacketAnomalyReceiver/PacketAnomalyReceiver";
import InterfaceHandler
    from "@/app/(auxiliary)/components/Blocks/TrafficBlock/InterfaceHandler/InterfaceHandler";
import ScanningControl from "@/app/(auxiliary)/components/Blocks/TrafficBlock/ScanningControl/ScanningControl";

const NetworkAnomalies: FC = () => {
    return (
        <div className={styles.networkAnomaliesWrapper}>
            <div className={styles.networkAnomaliesTitle}>
                <MainTitle>
                    Network anomalies
                </MainTitle>
            </div>

            <div className={styles.networkAnomaliesInterface}>
                <InterfaceHandler/>
            </div>

            <div className={styles.networkAnomaliesSearch}>
                <Search/>
            </div>

            <div className={styles.networkAnomaliesControl}>
                <ScanningControl/>
            </div>

            <div className={styles.networkAnomalies}>
                <PacketAnomalyReceiver/>
            </div>
        </div>
    );
};

export default NetworkAnomalies;