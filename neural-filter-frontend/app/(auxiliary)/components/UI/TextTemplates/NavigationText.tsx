import React, {FC} from "react";

import {ChildrenType} from "@/app/(auxiliary)/types/AppTypes/AppTypes";

import styleText from "@/styles/FontsStyle/fontsStyle.module.scss";

const NavigationText: FC<ChildrenType> = ({children}) => {
    return <p className={styleText.navigationTextStyle}>{children}</p>
};

export default NavigationText;