"use client"

import React from 'react';
import {Provider} from "react-redux";
import {storeSetup} from "@/app/(auxiliary)/lib/redux/store";

const Providers = (props: React.PropsWithChildren) => {
    return <Provider store={storeSetup ?? {}}>{props.children}</Provider>
};

export default Providers;