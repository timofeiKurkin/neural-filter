"use client"

import React from 'react';
import MainShadow from "@/app/(auxiliary)/components/UI/Borders/MainShadow/MainShadow";
import {useSelector} from "@/app/(auxiliary)/lib/redux/store";
import {ModelMetricType} from "@/app/(auxiliary)/types/NeuralNetwork&EducationTypes/EducationTypes";
import {selectorNeuralNetwork} from "@/app/(auxiliary)/lib/redux/store/slices/neuralNetwork";
import styles from "./LearningMetrics.module.scss";
import RegularText from "@/app/(auxiliary)/components/UI/TextTemplates/RegularText";
import Image from "next/image";
import LogoText from "@/app/(auxiliary)/components/UI/TextTemplates/LogoText";


const LearningMetrics = () => {
    const {modelMetric}: { modelMetric: ModelMetricType } = useSelector(selectorNeuralNetwork)

    return (
        <MainShadow>
            {
                (Object.keys(modelMetric).length > 0) ? (
                    <div className={styles.learningMetricsWrapper}>
                        <div className={styles.learningMetrics}>

                            <RegularText>{modelMetric.id}. {modelMetric.dataset_title}</RegularText>
                            <RegularText><span>Count of files: </span>{modelMetric.count_files}</RegularText>
                            <RegularText><span>Loss: </span>{modelMetric.loss}</RegularText>
                            <RegularText><span>Val_loss: </span>{modelMetric.val_loss}</RegularText>
                            <RegularText><span>Loss: </span>{modelMetric.accuracy}</RegularText>
                            <RegularText><span>Val_loss: </span>{modelMetric.val_accuracy}</RegularText>

                        </div>

                        {
                            (modelMetric.image_metric_exist) && (
                                <Image
                                    src={`http://localhost:8000/network_anomalies/get_metric_image/${modelMetric.modelID}/`}
                                    alt={"metrics-alt"}
                                    width={436}
                                    height={436}
                                    priority={true}
                                    quality={100}
                                />
                            )
                        }
                    </div>
                ) : (
                    <div className={styles.noSelectedModel}>
                        <LogoText>
                            Select a trained model to view its metrics and training schedule.
                        </LogoText>
                    </div>
                )
            }
        </MainShadow>
    );
};

export default LearningMetrics;