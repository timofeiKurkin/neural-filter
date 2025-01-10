import React, {FC} from "react";

import {ChildrenType} from "@/app/(auxiliary)/types/AppTypes/AppTypes";

import styleText from "@/styles/FontsStyle/fontsStyle.module.scss"

const RegularText: FC<ChildrenType> = ({children}) => {
    return <p className={styleText.regularTextStyle}>{children}</p>
};

export default RegularText;