import React, {useEffect, useState} from 'react';
import styles from "./NNStatus.module.scss"
import RegularText from "@/app/(auxiliary)/components/UI/TextTemplates/RegularText";
import {color_6, color_7, color_8} from "@/styles/color";
import {WS_URL_SERVER} from "@/app/(auxiliary)/lib/axios";
import {useDispatch, useSelector} from "@/app/(auxiliary)/lib/redux/store";
import {
    InitialNeuralNetworkStateType,
    selectorNeuralNetwork,
    setCurrentModelStatus,
    setNewAnomalyTraffic,
    setWebSocket
} from "@/app/(auxiliary)/lib/redux/store/slices/neuralNetwork";
import {InitialFilesStateType, selectorFiles, setDatasets} from "@/app/(auxiliary)/lib/redux/store/slices/filesSlice";
import {DatasetType} from "@/app/(auxiliary)/types/FilesType/DatasetsType";
import {
    NeuralNetworkFinishEducation,
    NeuralNetworkFoundAnomalyResponseType,
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
    statusCode: 0 | 1 | 2 | 3;
}


// For state
interface StatusRenderType extends StatusType {
    colorStatus: "#FF9494" | "#A6CF98" | "#FFD28F";
}


const NnStatus = () => {
    const dispatch = useDispatch()
    const {
        currentModelStatus,
        ws
    }: InitialNeuralNetworkStateType = useSelector(selectorNeuralNetwork)

    const {
        datasets
    }: InitialFilesStateType = useSelector(selectorFiles)

    const [stateStatus, setStateStatus] = useState<StatusRenderType>({
        status: 'disconnection',
        statusCode: 0,
        colorStatus: color_6
    })

    console.log("datasets", datasets)

    useEffect(() => {
        let timeOut

        const createWebSocket = () => {
            const url = `${WS_URL_SERVER}/ws/neural_network/`
            let socket = new WebSocket(url)
            dispatch(setWebSocket(socket))

            setStateStatus(() => ({status: "connection", statusCode: 1, colorStatus: color_8}))

            /**
             * Произошло соединение
             */
            socket.onopen = (e) => {
                // console.log('Произошло соединение\n', e)

                // if (startEducation.signal && startEducation.datasetID) {
                //     socket.send(JSON.stringify({
                //         send_type: "start_education",
                //         data: startEducation.datasetID
                //     }))
                // }
            }

            /**
             * Событие, которое срабатывает при получении сообщения
             * @param event
             */
            socket.onmessage = (event) => {
                const data = JSON.parse(event.data)

                if (data && Object.keys(data).length) {

                    // if (data.type === "start_education") {
                    //     const newMetrics: {
                    //         dataset_id: string;
                    //         loss: string;
                    //         accuracy: string;
                    //     } = data.data
                    //
                    //     const updatedDataset: DatasetType[] = datasets.map((dataset: DatasetType) => {
                    //         if (dataset.group_file_id === newMetrics.dataset_id) {
                    //             return {
                    //                 ...dataset,
                    //                 loss: newMetrics.loss,
                    //                 accuracy: newMetrics.accuracy
                    //             }
                    //         }
                    //         return dataset
                    //     })
                    //
                    //     dispatch(setDatasets(updatedDataset))
                    // }

                    const statusData: StatusRenderType = data

                    // console.log("statusData", statusData)

                    if ((statusData as NeuralNetworkFoundAnomalyResponseType).send_type === "found_anomaly_traffic") {
                        const newAnomalyTraffic: NeuralNetworkFoundAnomalyResponseType = data
                        const anomalyTrafficSession = newAnomalyTraffic.data.session

                        dispatch(setNewAnomalyTraffic({
                            [anomalyTrafficSession]: newAnomalyTraffic.data.anomaly_package
                        }))
                    }

                    if (
                        (statusData as NeuralNetworkWorkResponseType).send_type === 'model_work' ||
                        (statusData as NeuralNetworkFoundAnomalyResponseType).send_type === "model_study") {
                        const workResponse: NeuralNetworkWorkResponseType = data

                        if (workResponse.data.status === "success") {
                            if (workResponse.data.modelID !== currentModelStatus.modelID) {
                                dispatch(setCurrentModelStatus({
                                    workStatus: true,
                                    modelID: workResponse.data.modelID || ""
                                }))
                            }
                        }
                    }

                    if ((statusData as NeuralNetworkFinishEducation).send_type === "finish_education") {
                        const finishEducation: NeuralNetworkFinishEducation = data
                        const updatedDatasets = datasets.map((item) => {
                            if (item.group_file_id === finishEducation.data.dataset_id) {
                                return {
                                    ...item,
                                    loss: finishEducation.data.loss
                                }
                            }
                            return item
                        })
                        dispatch(setDatasets(updatedDatasets))
                    }

                    if (statusData.status) {
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
        }

        createWebSocket()

        return () => {
            if (ws && ws instanceof WebSocket) {
                ws.close();
            }
        };
    }, [
        // ws,
        // datasets,
        // dispatch,
        // currentModelID.signal,
        // currentModelID.modelID
    ]);


    // console.log("stateStatus", stateStatus)

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