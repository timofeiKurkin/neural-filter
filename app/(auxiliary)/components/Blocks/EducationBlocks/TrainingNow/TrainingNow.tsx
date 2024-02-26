"use client"

import React, {FC} from 'react';
import MainShadow from "@/app/(auxiliary)/components/UI/Borders/MainShadow/MainShadow";
import RegularText from "@/app/(auxiliary)/components/UI/TextTemplates/RegularText";

import styles from "./TrainingNow.module.scss";


interface DatasetType {
    id: number;
    title: string;
    loss: number;
    accuracy: number;
}
const datasetsExample: DatasetType[] = [
    {
        id: 0,
        title: 'Dataset one',
        loss: 0.069,
        accuracy: 0.505
    },
    {
        id: 1,
        title: 'Dataset two',
        loss: 0.023,
        accuracy: 0.345
    },
    {
        id: 2,
        title: 'Dataset three',
        loss: 0.123,
        accuracy: 0.56
    }
]



const TrainingNow: FC = () => {



    return (
        <MainShadow>
            <div className={styles.trainingNowWrapper}>
                <RegularText>Your datasets for training</RegularText>

                <div className={styles.datasetList}>
                    {datasetsExample.map((dataset) => (
                        <div key={`key=${dataset.id}`}>
                            {dataset.title}
                        </div>
                    ))}
                </div>
            </div>
        </MainShadow>
    );
};

export default TrainingNow;