"use client"

import React, {FC, useEffect, useRef, useState} from "react";
import Image from "next/image";

import {AxiosResponse} from "axios";
import arrowForSelect from "@/public/arrow-for-select.svg";
import {getInterface} from "@/app/(routers)/(withHeader)/all-traffic/func";

import RegularText from "@/app/(auxiliary)/components/UI/TextTemplates/RegularText";

import {AuthResponse} from "@/app/(auxiliary)/types/AxiosTypes/AxiosTypes";
import {GetInterfaces} from "@/app/(auxiliary)/types/AxiosTypes/AllTraffic";

import styles from "./InterfaceHandler.module.scss";
import {setInterface, useDispatch} from "@/app/(auxiliary)/lib/redux/store";

const InterfaceHandler: FC = () => {
    const dispatch = useDispatch()

    const ref = useRef<HTMLDivElement>(null)

    const [allInterface, setAllInterface] = useState<GetInterfaces[]>([])

    const [selectedInterface, setSelectedInterface] = useState<GetInterfaces>()

    const [selectStatus, setSelectStatus] = useState(false)

    useEffect(() => {
    }, []);

    useEffect(() => {
        let active = true
        const fetchData = async () => {
            const response = await getInterface()
            if (active) {
                if ((response as AxiosResponse<AuthResponse>).status === 200) {
                    const responseData = (response as AxiosResponse<AuthResponse>).data.network_interfaces
                    setAllInterface(responseData)
                    setSelectedInterface(responseData[0])
                    dispatch(setInterface(responseData[0].title))
                }
            }
        }

        fetchData().then()

        return () => {
            active = false
        }
    }, [])

    const selectInterface = (interfaceItem: GetInterfaces) => {
        setSelectStatus((prevState) => (!prevState))
        setSelectedInterface(interfaceItem)
        dispatch(setInterface(interfaceItem.title))
        // localStorage.setItem('i-f', JSON.stringify(interfaceItem))
    }

    if (allInterface.length > 0)
        return (
            <div className={styles.interfaceHandlerWrapper}>
                <RegularText>
                    Current interface:
                </RegularText>

                <div className={styles.interfaceHandler} onClick={() => setSelectStatus((prevState) => (!prevState))}>

                    {
                        !selectStatus ?
                            <div className={styles.interfaceItem} ref={ref}>
                                <RegularText>
                                    {selectedInterface ? selectedInterface.title : ''}
                                </RegularText>
                            </div>
                            :
                            <div className={styles.interfaceListWrapper}>
                                <ul className={styles.interfaceList}>
                                    {allInterface.map((interfaceItem) => (
                                        <li key={interfaceItem.id} className={styles.interfaceItem}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                selectInterface(interfaceItem)
                                            }}>
                                            <RegularText>
                                                {interfaceItem.title}
                                            </RegularText>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                    }

                    <div className={styles.interfaceHandlerArrow}>
                        <Image src={arrowForSelect} alt={'array for select'}/>
                    </div>
                </div>
            </div>
        );
};

export default InterfaceHandler;