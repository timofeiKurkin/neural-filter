import React, {FC} from "react";

import {ChildrenType} from "@/app/(auxiliary)/types/AppTypes/AppTypes";

import styles from "./MainShadow.module.scss";

const MainShadow: FC<ChildrenType> = ({children}) => {
    return (
        <div className={styles.main_shadow}>
            {children}
        </div>
    );
};

export default MainShadow;