import React, {FC, useState} from 'react';
import {DatasetType} from "@/app/(auxiliary)/types/FilesType/DatasetsType";

import goHover from "@/public/go-hover.svg";
import go from "@/public/go.svg";
import recycle from "@/public/recycle.svg";
import accept from "@/public/accept.svg"
import exit from "@/public/exit.svg"

import styles from "./Dataset.module.scss";
import Image from "next/image";
import {color_1, color_2} from "@/styles/color";
import {deleteDataset} from "@/app/(routers)/(withHeader)/education-ai/func";
import {AxiosResponse} from "axios";
import {useDispatch, useSelector} from "@/app/(auxiliary)/lib/redux/store";
import {selectorFiles, setDatasets} from "@/app/(auxiliary)/lib/redux/store/slices/filesSlice";


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
    const {datasets}: { datasets: DatasetType[]; } = useSelector(selectorFiles)

    const [datasetHover, setDatasetHover] = useState<boolean>(false)
    const [twoFactorAccept, setTwoFactorAccept] = useState<boolean>(false)

    if (!Object.keys(dataset).length) {
        return <div className={styles.datasetSimple} style={{
            borderRadius: 15
        }}></div>
    }

    const deleteDatasetHandler = async (datasetGroupID: string) => {
        await deleteDataset(datasetGroupID)
            .then((r) => (r as AxiosResponse).status === 204 && dispatch(setDatasets(datasets.filter(data => (data.group_file_id !== datasetGroupID)))))
    }

    return (
        <div className={`${styles.datasetWrapper} ${datasetHover ? styles.datasetHover : styles.datasetSimple}`}
             onMouseEnter={() => setDatasetHover((prevState) => (!prevState))}
             onMouseLeave={() => setDatasetHover((prevState) => (!prevState))}
        >
            <div className={styles.datasetTitle}>
                <Image src={datasetHover ? goHover : go} alt={'go'}/>

                <span className={styles.datasetText} style={{color: color_1}}>{dataset.dataset_title}</span>
            </div>

            <div className={styles.datasetLine}></div>

            <div className={styles.datasetStatistics}>
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