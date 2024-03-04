import React, {FC} from "react";

import MainTitle from "@/app/(auxiliary)/components/UI/TextTemplates/MainTitle";
import RegularText from "@/app/(auxiliary)/components/UI/TextTemplates/RegularText";

import styles from "./AllTraffic.module.scss";
import Search from "@/app/(auxiliary)/components/UI/Inputs/Search/Search";
import InterfaceHandler from "@/app/(auxiliary)/components/Sections/Traffics/AllTraffic/InterfaceHandler/InterfaceHandler";
import PacketReceiver from "@/app/(auxiliary)/components/Sections/Traffics/PacketReceiver/PacketReceiver";
import SaveTraffic from "@/app/(auxiliary)/components/Sections/Traffics/SaveTraffic/SaveTraffic";

const AllTraffic: FC = () => {
    return (
        <div className={styles.allTrafficWrapper}>
            <div className={styles.allTrafficTitle}>
                <MainTitle>All traffic</MainTitle>
            </div>

            <div className={styles.allTrafficInter}>
                <InterfaceHandler/>
            </div>

            <div className={styles.allTrafficSave}>
                <SaveTraffic/>
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