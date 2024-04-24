"use client"

import React, {useEffect} from 'react';
import {useSelector} from "@/app/(auxiliary)/lib/redux/store";
import {selectorNeuralNetwork} from "@/app/(auxiliary)/lib/redux/store/slices/neuralNetwork";
import {StateOfEducationType} from "@/app/(auxiliary)/types/NeuralNetwork&EducationTypes/NeuralNetwork&EducationTypes";

const PacketAnomalyReceiver = () => {

    const {
        startEducation,
        ws
    }: {
        startEducation: StateOfEducationType;
        ws: WebSocket;
    } = useSelector(selectorNeuralNetwork)

    useEffect(() => {
        if (ws && Object.keys(ws).length) {
            ws.send(JSON.stringify({
                send_type: "start_scanning",
                interface: ""
            }))
        }
    }, [])

    return (<div></div>);
};

export default PacketAnomalyReceiver;