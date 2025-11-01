import React, {useEffect, useState} from 'react';
import styles from "./NNStatus.module.scss"
import RegularText from "@/app/(auxiliary)/components/UI/TextTemplates/RegularText";
import {color_6, color_7, color_8} from "@/styles/color";
import {WS_URL_SERVER} from "@/app/(auxiliary)/lib/axios";
import {useDispatch, useSelector} from "@/app/(auxiliary)/lib/redux/store";
import {
    setCurrentModelStatus,
    setNewAnomalyTraffic, setNoWorkStatus,
    setWebSocket
} from "@/app/(auxiliary)/lib/redux/store/slices/neuralNetwork";
import {setUpdateLossDatasets} from "@/app/(auxiliary)/lib/redux/store/slices/filesSlice";
import {
    NeuralNetworkFinishEducation,
    NeuralNetworkFoundAnomalyResponseType, NeuralNetworkNoWorkType,
    NeuralNetworkWorkResponseType
} from "@/app/(auxiliary)/types/NeuralNetwork&EducationTypes/NeuralNetwork";


// For response
interface StatusType {
    status: "no work" |
        "connection" |
        "studying" |
        "working" |
        "disconnection" |
        "preprocessing";
    statusCode: 0 | 1 | 2 | 3 | 4;
}


// For state
interface StatusRenderType extends StatusType {
    colorStatus: "#FF9494" | "#A6CF98" | "#FFD28F";
}


const NnStatus = () => {
    const dispatch = useDispatch()

    const [stateStatus, setStateStatus] = useState<StatusRenderType>({
        status: 'disconnection',
        statusCode: 0,
        colorStatus: color_6
    })

    useEffect(() => {
        const createWebSocket = () => {
            const url = `${WS_URL_SERVER}/ws/neural_network/`
            let socket = new WebSocket(url)
            dispatch(setWebSocket(socket))

            setStateStatus(() => ({status: "connection", statusCode: 1, colorStatus: color_8}))

            /**
             * Произошло соединение
             */
            socket.onopen = (e) => {
                console.log('Произошло соединение\n', e)
            }

            /**
             * Событие, которое срабатывает при получении сообщения
             * @param event
             */
            socket.onmessage = (event) => {
                const data = JSON.parse(event.data)

                if (data && Object.keys(data).length) {
                    if ((data as NeuralNetworkFoundAnomalyResponseType).send_type === "found_anomaly_traffic") {
                        const newAnomalyTraffic: NeuralNetworkFoundAnomalyResponseType = data
                        const anomalyTrafficSession = newAnomalyTraffic.data.session

                        dispatch(setNewAnomalyTraffic(newAnomalyTraffic.data.anomaly_package))
                    }

                    if (
                        (data as NeuralNetworkWorkResponseType).send_type === 'model_work' ||
                        (data as NeuralNetworkWorkResponseType).send_type === "model_study") {
                        const workResponse: NeuralNetworkWorkResponseType = data

                        if (workResponse.data.status === "success") {
                            dispatch(setCurrentModelStatus({
                                workStatus: true,
                                modelID: workResponse.data.modelID || ""
                            }))
                        }
                    }

                    if ((data as NeuralNetworkNoWorkType).send_type === "no_work") {
                        const noWorkResponse: NeuralNetworkNoWorkType = data
                        dispatch(setNoWorkStatus({modelID: noWorkResponse.data.model_id}))
                    }

                    if ((data as NeuralNetworkFinishEducation).send_type === "finish_education") {
                        const finishEducation: NeuralNetworkFinishEducation = data
                        dispatch(setUpdateLossDatasets({
                            modelID: finishEducation.data.modelID,
                            newLoss: finishEducation.data.loss
                        }))
                    }

                    if ((data as StatusRenderType).status) {
                        const statusData: StatusRenderType = data

                        if (statusData.statusCode === 2) {
                            statusData.colorStatus = color_6
                            setStateStatus(statusData)
                        } else if (statusData.statusCode === 3) {
                            statusData.colorStatus = color_8
                            setStateStatus(statusData)
                        } else if (statusData.statusCode === 4) {
                            statusData.colorStatus = color_7
                            setStateStatus(statusData)
                        }
                    }
                }
            }

            /**
             * Событие с ошибкой
             * @param e
             */
            socket.onerror = (e) => {
                console.log('Произошла ошибка\n', e)
                setTimeout(createWebSocket, 5000)
            }

            /**
             * Соединение с сервером закрыто
             * @param e
             */
            socket.onclose = (e) => {
                console.log('Соединение с сервером закрыто\n', e)
                setStateStatus({
                    status: "disconnection",
                    statusCode: 0,
                    colorStatus: color_6
                })
                dispatch(setCurrentModelStatus({
                    workStatus: false,
                    modelID: ""
                }))
                setTimeout(createWebSocket, 5000)
            }

            return () => {
                socket.close()
            };
        }

        createWebSocket()

    }, [dispatch]);

    return (
        <div className={styles.statusWrapper}>
            <div className={styles.NNStatusWrapper}>
                <RegularText>Neural network status</RegularText>
            </div>

            {
                (stateStatus && Object.keys(stateStatus).length) && (
                    <RegularText>
                        <span className={styles.currentStatus}>
                            <span className={styles.currentStatusColor} style={{
                                backgroundColor: stateStatus.colorStatus
                            }}></span>

                            <span className={styles.currentStatusText}>
                                {stateStatus.status}
                            </span>
                        </span>
                    </RegularText>
                )
            }
        </div>

    );
};

export default NnStatus;