import React, {FC, useEffect, useState} from 'react';
import {DatasetType} from "@/app/(auxiliary)/types/FilesType/DatasetsType";

import goHover from "@/public/go-hover.svg";
import go from "@/public/go.svg";
import recycle from "@/public/recycle.svg";
import accept from "@/public/accept.svg"
import exit from "@/public/exit.svg"
import stop from "@/public/stop.svg"

import styles from "./Dataset.module.scss";
import Image from "next/image";
import {color_1, color_2, color_3, color_5} from "@/styles/color";
import {AxiosResponse} from "axios";
import {useDispatch, useSelector} from "@/app/(auxiliary)/lib/redux/store";
import {InitialFilesStateType, selectorFiles, setDatasets} from "@/app/(auxiliary)/lib/redux/store/slices/filesSlice";
import {
    InitialNeuralNetworkStateType,
    selectorNeuralNetwork, setCurrentModelStatus,
    setModelMetric, setNoWorkStatus
} from "@/app/(auxiliary)/lib/redux/store/slices/neuralNetwork";
import {
    GetModelMetricResponseType, ModelMetricType
} from "@/app/(auxiliary)/types/NeuralNetwork&EducationTypes/EducationTypes";
import {
    startEducationInstruction, stopEducationInstruction
} from "@/app/(auxiliary)/components/Blocks/EducationBlocks/TrainingNow/DatasetsList/Dataset/modelWorkInstructions";
import {axiosHandler} from "@/app/(auxiliary)/func/axiosHandler/axiosHandler";
import FileService from "@/app/(auxiliary)/lib/axios/services/FileService/FileService";
import {getAccessToken} from "@/app/(auxiliary)/func/app/getAccessToken";
import NetworkAnomaliesService
    from "@/app/(auxiliary)/lib/axios/services/NetworkAnomaliesService/NetworkAnomaliesService";


/**
 * Блок, отображающий один dataset. Является частью списком DatasetsList
 *
 * Страница: localhost/education-ai
 * @param dataset
 * @constructor
 */
interface PropsType {
    dataset: DatasetType;
}

const Dataset: FC<PropsType> = ({dataset}) => {
    const dispatch = useDispatch()
    const accessToken = getAccessToken()

    const {currentModelStatus, ws, modelMetric}: InitialNeuralNetworkStateType =
        useSelector(selectorNeuralNetwork)
    const {datasets}: InitialFilesStateType =
        useSelector(selectorFiles)

    const [datasetHover, setDatasetHover] =
        useState<boolean>(() => false)
    const [twoFactorAccept, setTwoFactorAccept] =
        useState<boolean>(() => false)

    const [working, setWorking] =
        useState(() => dataset.modelID === currentModelStatus.modelID && currentModelStatus.workStatus)

    useEffect(() => {
        if (dataset.modelID === currentModelStatus.modelID) {
            setWorking(() => currentModelStatus.workStatus)
        } else {
            setWorking(() => false)
        }
    }, [
        dataset,
        currentModelStatus
    ]);

    if (!Object.keys(dataset).length) {
        return <div className={styles.datasetSimple} style={{
            borderRadius: 15
        }}></div>
    }

    const deleteDatasetHandler = async (args: {
        modelID: string;
        accessToken: string;
        workingStatus: boolean;
    }) => {
        if (args.workingStatus) {
            ws.send(JSON.stringify({
                ...stopEducationInstruction,
            }))
            dispatch(setNoWorkStatus({
                modelID: currentModelStatus.modelID
            }))
        }

        await axiosHandler(FileService.deleteDataset(args.modelID, args.accessToken))
            .then((r) => (r as AxiosResponse).status === 204 &&
                dispatch(setDatasets(
                    datasets.filter(data =>
                        (data.modelID !== args.modelID)
                    )
                )))
        if (modelMetric.modelID === args.modelID) {
            dispatch(setModelMetric({} as ModelMetricType))
        }
        setDatasetHover(false)
        setTwoFactorAccept(false)
    }

    const getDatasetMetrics = async (
        args: {
            modelID: string;
            currentModelID: string;
            accessToken: string;
        }
    ) => {
        if (args.modelID !== args.currentModelID) {
            const response = await axiosHandler(NetworkAnomaliesService.getModelMetrics(args.modelID, args.accessToken))

            if ((response as AxiosResponse<GetModelMetricResponseType>).status === 200) {
                const modelMetric: ModelMetricType = (response as AxiosResponse<GetModelMetricResponseType>).data.metric

                dispatch(setModelMetric(modelMetric))
            }
        } else {
            dispatch(setModelMetric({} as ModelMetricType))
        }
    }

    const modelWordHandler = (args: {
        modelID: string;
        workStatus: boolean;
    }) => {
        if (currentModelStatus.modelID !== args.modelID && currentModelStatus.workStatus) {
            ws.send(JSON.stringify({
                ...stopEducationInstruction,
            }))
            dispatch(setNoWorkStatus({
                modelID: currentModelStatus.modelID
            }))
        }

        if (!args.workStatus) {
            dispatch(setCurrentModelStatus({
                modelID: args.modelID,
                workStatus: true
            }))

            ws.send(JSON.stringify({
                ...startEducationInstruction,
                data: args.modelID
            }))
        } else {
            ws.send(JSON.stringify({
                ...stopEducationInstruction,
            }))
        }
    }

    const backgroundStyle = (currentModelStatus.modelID == dataset.modelID && currentModelStatus.workStatus) && color_3

    return (
        <div
            className={`${styles.datasetWrapper} ${datasetHover ? styles.datasetHover : styles.datasetSimple} ${(currentModelStatus.modelID == dataset.modelID && currentModelStatus.workStatus) && styles.datasetHover}`}
            onMouseEnter={() => setDatasetHover((prevState) => (!prevState))}
            onMouseLeave={() => setDatasetHover((prevState) => (!prevState))}
        >
            <div className={styles.datasetTitle}
                 onClick={() => modelWordHandler({
                     modelID: dataset.modelID,
                     workStatus: working
                 })}>
                {
                    working ? (
                            <Image src={stop} alt={"stop"}/>
                        )
                        :
                        (
                            <Image src={datasetHover ? goHover : go} alt={'go'}/>
                        )
                }
            </div>

            <div className={styles.datasetData}
                 onClick={() => getDatasetMetrics({
                     modelID: dataset.modelID,
                     currentModelID: modelMetric.modelID,
                     accessToken
                 })}>
                <span className={styles.datasetText}
                      style={{color: color_1}}>
                    {dataset.dataset_title}
                </span>

                <div className={styles.datasetLine}></div>

                <div className={styles.datasetStatistics}>
                <span className={styles.datasetText}
                      style={{color: color_2}}>
                    sessions: {dataset.sessions_count}
                </span>
                    <span className={styles.datasetText}
                          style={{color: color_2}}>
                    loss: {dataset.loss === 0 ? "0.0" : dataset.loss.toFixed(3)}
                </span>
                </div>
            </div>

            {
                datasetHover && (
                    <div className={styles.datasetDeleteWrapper}>
                        {
                            !twoFactorAccept ? (
                                    <div className={styles.deleteButton}
                                         onClick={() =>
                                             setTwoFactorAccept((prevState) => (!prevState))}>
                                        <Image src={recycle} alt={'delete'}/>
                                    </div>
                                )
                                :
                                (
                                    <div className={styles.twoFactorAccept}>
                                        <div onClick={() =>
                                            deleteDatasetHandler({
                                                modelID: dataset.modelID,
                                                accessToken,
                                                workingStatus: working
                                            })}>
                                            <Image src={accept} alt={'accept-delete'}/>
                                        </div>

                                        <div onClick={() =>
                                            setTwoFactorAccept((prevState) => (!prevState))}>
                                            <Image src={exit} alt={'exit-delete'}/>
                                        </div>
                                    </div>
                                )
                        }
                    </div>
                )
            }
        </div>
    );
};

export default Dataset;