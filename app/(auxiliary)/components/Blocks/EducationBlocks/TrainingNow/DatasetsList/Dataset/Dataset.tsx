import React, {FC, useState} from 'react';
import {DatasetType} from "@/app/(auxiliary)/types/FilesType/DatasetsType";
import goHover from "@/public/go-hover.svg";
import go from "@/public/go.svg";
import styles from "./Dataset.module.scss";
import Image from "next/image";


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
    const [datasetHover, setDatasetHover] = useState<boolean>(false)

    if(!Object.keys(dataset).length) {
        return <div className={styles.datasetSimple} style={{
            borderRadius: 15
        }}></div>
    }

    console.log(dataset)

    return (
        <div className={`${styles.datasetWrapper} ${datasetHover ? styles.datasetHover : styles.datasetSimple}`}
             onMouseEnter={() => setDatasetHover((prevState) => (!prevState))}
             onMouseLeave={() => setDatasetHover((prevState) => (!prevState))}
        >
            <div className={styles.datasetTitle}>
                <Image src={datasetHover ? goHover : go} alt={'go'}/>

                <span className={styles.datasetText}>{dataset.dataset_title}</span>
            </div>

            <div className={styles.datasetLine}></div>

            <div className={styles.datasetStatistics}>
                <span className={styles.datasetText}>loss: {dataset.loss === 0 ? "0.0" : dataset.loss}</span>
                <span className={styles.datasetText}>accuracy: {dataset.accuracy === 0 ? "0.0" : dataset.accuracy}</span>
            </div>
        </div>
    );
};

export default Dataset;