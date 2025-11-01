"use client"

import React, {FC, useEffect, useRef, useState} from "react";
import Image from "next/image";

import {AxiosResponse} from "axios";
import arrowForSelect from "@/public/arrow-for-select.svg";

import RegularText from "@/app/(auxiliary)/components/UI/TextTemplates/RegularText";

import {TrafficResponse} from "@/app/(auxiliary)/types/AxiosTypes/AxiosTypes";
import {GetInterfaces} from "@/app/(auxiliary)/types/AxiosTypes/AllTraffic";

import styles from "./InterfaceHandler.module.scss";
import {setInterface, useDispatch} from "@/app/(auxiliary)/lib/redux/store";
import {axiosHandler} from "@/app/(auxiliary)/func/axiosHandler/axiosHandler";
import AllTrafficService from "@/app/(auxiliary)/lib/axios/services/AllTrafficService/AllTrafficService";
import {getAccessToken} from "@/app/(auxiliary)/func/app/getAccessToken";

const InterfaceHandler: FC = () => {
    const dispatch = useDispatch()

    const ref = useRef<HTMLDivElement>(null)

    const [allInterface, setAllInterface] = useState<GetInterfaces[]>([])
    const [selectedInterface, setSelectedInterface] = useState<GetInterfaces>()
    const [selectStatus, setSelectStatus] = useState(false)


    useEffect(() => {
        let active = true
        const fetchData = async () => {
            const accessToken = getAccessToken()
            const response = await axiosHandler(AllTrafficService.getInterface(accessToken))

            if (active) {
                if ((response as AxiosResponse<TrafficResponse>).status === 200) {
                    const responseData = (response as AxiosResponse<TrafficResponse>).data.network_interfaces
                    setAllInterface(responseData)
                    setSelectedInterface(responseData[1])
                    dispatch(setInterface(responseData[1].title))
                }
            }
        }

        fetchData().then()

        return () => {
            active = false
        }
    }, [dispatch])

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
                    Interface:
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
                        <Image src={arrowForSelect} alt={'array for select'} unoptimized/>
                    </div>
                </div>
            </div>
        );
};

export default InterfaceHandler;