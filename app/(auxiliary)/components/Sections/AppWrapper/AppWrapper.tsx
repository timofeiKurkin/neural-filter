"use client"

import React, {FC, useEffect} from 'react';
import {ChildrenType} from "@/app/(auxiliary)/types/AppTypes/AppTypes";
import {selectorUser, setAuth, useDispatch, useSelector} from "@/app/(auxiliary)/lib/redux/store";
import {useRouter} from "next/navigation";

const AppWrapper: FC<ChildrenType> = ({children}) => {
    const dispatch = useDispatch()

    const route = useRouter()

    const {user, isAuth} = useSelector(selectorUser)

    useEffect(() => {
        // if(!isAuth) {
        //     route.push('/login')
        // }

        setTimeout(() => dispatch(setAuth(true)), 3000)
    }, [isAuth]);

    return (children)
};

export default AppWrapper;