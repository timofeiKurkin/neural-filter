import React, {FC, useEffect, useRef, useState} from "react";

import {ChildrenType} from "@/app/(auxiliary)/types/AppTypes/AppTypes";

import styles from "./Scrollbar.module.scss";

const Scrollbar: FC<{children: React.ReactNode}> = ({children}) => {

    return (
        <div className={styles.scrollbar}>
            {children}
        </div>
    );
};

export default Scrollbar;