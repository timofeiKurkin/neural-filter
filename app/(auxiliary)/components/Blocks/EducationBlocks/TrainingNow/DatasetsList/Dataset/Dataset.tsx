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
import {deleteDataset} from "@/app/(routers)/(withHeader)/education-ai/func";
import {AxiosResponse} from "axios";
import {useDispatch, useSelector} from "@/app/(auxiliary)/lib/redux/store";
import {InitialFilesStateType, selectorFiles, setDatasets} from "@/app/(auxiliary)/lib/redux/store/slices/filesSlice";
import {
    InitialNeuralNetworkStateType,
    selectorNeuralNetwork,
    setModelMetric
} from "@/app/(auxiliary)/lib/redux/store/slices/neuralNetwork";
import {getMetricImage} from "@/app/(auxiliary)/func/educationNeuralNetwork/getMetrics";
import {
    GetModelMetricResponseType, ModelMetricType
} from "@/app/(auxiliary)/types/NeuralNetwork&EducationTypes/EducationTypes";
import {
    startEducationInstruction, stopEducationInstruction
} from "@/app/(auxiliary)/components/Blocks/EducationBlocks/TrainingNow/DatasetsList/Dataset/modelWorkInstructions";


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

    const {currentModelStatus, ws, modelMetric}: InitialNeuralNetworkStateType =
        useSelector(selectorNeuralNetwork)
    const {datasets}: InitialFilesStateType =
        useSelector(selectorFiles)

    const [datasetHover, setDatasetHover] =
        useState<boolean>(() => false)
    const [twoFactorAccept, setTwoFactorAccept] =
        useState<boolean>(() => false)

    const working = dataset.group_file_id === currentModelStatus.modelID && currentModelStatus.workStatus

    if (!Object.keys(dataset).length) {
        return <div className={styles.datasetSimple} style={{
            borderRadius: 15
        }}></div>
    }

    const deleteDatasetHandler = async (datasetGroupID: string) => {
        await deleteDataset(datasetGroupID)
            .then((r) => (r as AxiosResponse).status === 204 &&
                dispatch(setDatasets(
                    datasets.filter(data =>
                        (data.group_file_id !== datasetGroupID)
                    )
                )))
        setDatasetHover(false)
        setTwoFactorAccept(false)
    }

    const getDatasetMetrics = async (
        dataset_id: string,
        current_dataset_id: string
    ) => {
        if (dataset_id !== current_dataset_id) {
            const response = await getMetricImage(dataset_id)

            if ((response as AxiosResponse<GetModelMetricResponseType>).status === 200) {
                const modelMetric: ModelMetricType = (response as AxiosResponse<GetModelMetricResponseType>).data.metric

                dispatch(setModelMetric(modelMetric))
            }
        } else {
            dispatch(setModelMetric({} as ModelMetricType))
        }
    }

    const modelWordHandler = (args: {
        modelID: string,
        workStatus: boolean
    }) => {
        if (!args.workStatus) {
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

    return (
        <div className={`${styles.datasetWrapper} ${datasetHover ? styles.datasetHover : styles.datasetSimple}`}
             style={{
                 backgroundColor: currentModelStatus.modelID == dataset.group_file_id ? color_3 : ""
             }}
             onMouseEnter={() => setDatasetHover((prevState) => (!prevState))}
             onMouseLeave={() => setDatasetHover((prevState) => (!prevState))}
        >
            <div className={styles.datasetTitle}>
                <div
                    onClick={() => modelWordHandler({
                        modelID: dataset.group_file_id,
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

                <span className={styles.datasetText}
                      style={{color: color_1}}>
                    {dataset.dataset_title}
                </span>
            </div>

            <div className={styles.datasetLine}></div>

            <div className={styles.datasetStatistics}
                 onClick={() => getDatasetMetrics(dataset.group_file_id, modelMetric.group_file_id)}>
                <span className={styles.datasetText}
                      style={{color: color_2}}>
                    sessions: {dataset.sessions_count}
                </span>
                <span className={styles.datasetText}
                      style={{color: color_2}}>
                    loss: {dataset.loss === 0 ? "0.0" : dataset.loss.toFixed(3)}
                </span>
            </div>

            {
                datasetHover && (
                    <div className={styles.datasetDeleteWrapper}>
                        {
                            !twoFactorAccept ? (
                                    <div className={styles.deleteButton}
                                         onClick={() => setTwoFactorAccept((prevState) => (!prevState))}>
                                        <Image src={recycle} alt={'delete'}/>
                                    </div>
                                )
                                :
                                (
                                    <div className={styles.twoFactorAccept}>
                                        <div onClick={() => deleteDatasetHandler(dataset.group_file_id)}>
                                            <Image src={accept} alt={'delete'}/>
                                        </div>

                                        <div onClick={() => setTwoFactorAccept((prevState) => (!prevState))}>
                                            <Image src={exit} alt={'delete'}/>
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