import React, {FC} from "react";

import {ChildrenType} from "@/app/(auxiliary)/types/AppTypes/AppTypes";

import styleText from "@/styles/FontsStyle/fontsStyle.module.scss";

const ButtonText: FC<ChildrenType> = ({children}) => {
    return <span className={styleText.buttonTextStyle}>{children}</span>
};

export default ButtonText;