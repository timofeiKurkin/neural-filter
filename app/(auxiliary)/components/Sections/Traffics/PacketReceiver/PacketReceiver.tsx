"use client"

import React, {FC, useEffect, useState} from 'react';

import {WS_URL_SERVER} from "@/app/(auxiliary)/lib/axios";

import PackageList from "@/app/(auxiliary)/components/Sections/Traffics/PacketReceiver/PackageList/PackageList";

import {TrafficPackageType} from "@/app/(auxiliary)/types/AxiosTypes/AllTraffic";

import {selectorTraffic, useSelector} from "@/app/(auxiliary)/lib/redux/store";


const PacketReceiver: FC = () => {
    const {currentInterface} = useSelector(selectorTraffic)

    const [packages, setPackages] = useState<TrafficPackageType[]>([])

    useEffect(() => {
        if(currentInterface) {
            const url = `${WS_URL_SERVER}/ws/packet/`
            let socket = new WebSocket(url)

            /**
             * Произошло соединение
             */
            socket.onopen = (e) => {
                console.log('Произошло соединение\n', e)

                socket.send(JSON.stringify({
                    interface: currentInterface
                }))
            }

            /**
             * Событие, которое срабатывает при получении сообщения
             * @param event
             */
            socket.onmessage = (event) => {
                const data = JSON.parse(event.data)

                if (typeof data === 'object' && !Array.isArray(data) && data !== null) {
                    setPackages((prevState) => ([...prevState, data]))
                }
            }

            /**
             * Событие с ошибкой
             * @param e
             */
            socket.onerror = (e) => {
                console.log('Произошла ошибка\n', e)
            }

            /**
             * Соединение с сервером закрыто
             * @param e
             */
            socket.onclose = (e) => {
                console.log('Соединение с сервером закрыто\n', e)
            }

            /**
             *
             */
            if (socket.CONNECTING) {
                console.log('connecting', socket.CONNECTING)
            }

            return () => {
                socket.close()
                setPackages([])
            }
        }
    }, [currentInterface]);

    return <PackageList packages={packages}/>
};

export default PacketReceiver;