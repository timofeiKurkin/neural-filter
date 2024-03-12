import React, {FC} from 'react';

import {ChildrenType} from "@/app/(auxiliary)/types/AppTypes/AppTypes";

import styles from "@/styles/FontsStyle/fontsStyle.module.scss";


const LogoText: FC<ChildrenType> = ({children}) => {
    return (
        <h2 className={styles.logoTextStyle}>{children}</h2>
    );
};

export default LogoText;