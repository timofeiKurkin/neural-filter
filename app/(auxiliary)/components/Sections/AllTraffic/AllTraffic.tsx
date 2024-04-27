import React, {FC} from "react";

import MainTitle from "@/app/(auxiliary)/components/UI/TextTemplates/MainTitle";

import styles from "./AllTraffic.module.scss";
import Search from "@/app/(auxiliary)/components/UI/Inputs/Search/Search";
import InterfaceHandler from "@/app/(auxiliary)/components/Blocks/TrafficBlock/InterfaceHandler/InterfaceHandler";
import PacketReceiver from "@/app/(auxiliary)/components/Blocks/TrafficBlock/PacketReceiver/PacketReceiver";

const AllTraffic: FC = () => {
    return (
        <div className={styles.allTrafficWrapper}>
            <div className={styles.allTrafficTitle}>
                <MainTitle>All traffic</MainTitle>
            </div>

            <div className={styles.allTrafficInter}>
                <InterfaceHandler/>
            </div>

            <div className={styles.allTrafficSearch}>
                <Search/>
            </div>

            <div className={styles.allTraffic}>
                <PacketReceiver/>
            </div>
        </div>
    );
};

export default AllTraffic;