import React, {FC, useState} from 'react';
import {DatasetType} from "@/app/(auxiliary)/types/FilesType/DatasetsType";

import goHover from "@/public/go-hover.svg";
import go from "@/public/go.svg";
import recycle from "@/public/recycle.svg";
import accept from "@/public/accept.svg"
import exit from "@/public/exit.svg"
import stop from "@/public/stop.svg"

import styles from "./Dataset.module.scss";
import Image from "next/image";
import {color_1, color_2} from "@/styles/color";
import {deleteDataset} from "@/app/(routers)/(withHeader)/education-ai/func";
import {AxiosResponse} from "axios";
import {useDispatch, useSelector} from "@/app/(auxiliary)/lib/redux/store";
import {selectorFiles, setDatasets} from "@/app/(auxiliary)/lib/redux/store/slices/filesSlice";
import {selectorNeuralNetwork, setModelMetric} from "@/app/(auxiliary)/lib/redux/store/slices/neuralNetwork";
import {getMetricImage} from "@/app/(auxiliary)/func/educationNeuralNetwork/getMetrics";
import {
    GetModelMetricResponseType, ModelMetricType
} from "@/app/(auxiliary)/types/NeuralNetwork&EducationTypes/NeuralNetwork&EducationTypes";


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

    const {ws}: { ws: WebSocket } = useSelector(selectorNeuralNetwork)
    const {datasets}: { datasets: DatasetType[]; } = useSelector(selectorFiles)

    const [datasetHover, setDatasetHover] = useState<boolean>(false)
    const [twoFactorAccept, setTwoFactorAccept] = useState<boolean>(false)

    const [working, setWorking] = useState<boolean>(false)

    if (!Object.keys(dataset).length) {
        return <div className={styles.datasetSimple} style={{
            borderRadius: 15
        }}></div>
    }

    const deleteDatasetHandler = async (datasetGroupID: string) => {
        await deleteDataset(datasetGroupID)
            .then((r) => (r as AxiosResponse).status === 204 && dispatch(setDatasets(datasets.filter(data => (data.group_file_id !== datasetGroupID)))))
    }

    const getDatasetMetrics = async (dataset_id: string) => {
        const response = await getMetricImage(dataset_id)

        if((response as AxiosResponse<GetModelMetricResponseType>).status === 200) {
            const modelMetric: ModelMetricType = (response as AxiosResponse<GetModelMetricResponseType>).data.metric

            dispatch(setModelMetric(modelMetric))
        }
    }

    return (
        <div className={`${styles.datasetWrapper} ${datasetHover ? styles.datasetHover : styles.datasetSimple}`}
             onMouseEnter={() => setDatasetHover((prevState) => (!prevState))}
             onMouseLeave={() => setDatasetHover((prevState) => (!prevState))}
        >
            <div className={styles.datasetTitle}>
                <div
                    onClick={() => {
                        ws.send(JSON.stringify({
                            send_type: "start_education",
                            data: dataset.group_file_id
                        }))
                        setWorking((prevState) => (!prevState))
                    }}>

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

                <span className={styles.datasetText} style={{color: color_1}}>{dataset.dataset_title}</span>
            </div>

            <div className={styles.datasetLine}></div>

            <div className={styles.datasetStatistics}
                 onClick={() => getDatasetMetrics(dataset.group_file_id)}>
                <span className={styles.datasetText}
                      style={{color: color_2}}>loss: {dataset.loss === 0 ? "0.0" : dataset.loss}</span>
                <span className={styles.datasetText}
                      style={{color: color_2}}>accuracy: {dataset.accuracy === 0 ? "0.0" : dataset.accuracy}</span>
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