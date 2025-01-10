import React, {FC} from "react";

import {ChildrenType} from "@/app/(auxiliary)/types/AppTypes/AppTypes";

import styleText from "@/styles/FontsStyle/fontsStyle.module.scss";

const MainTitle: FC<ChildrenType> = ({children}) => {
    return <h1 className={styleText.titleTextStyle}>{children}</h1>
};

export default MainTitle;