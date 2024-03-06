import React from 'react';
import styles from "./EducationAI.module.scss";
import MainTitle from "@/app/(auxiliary)/components/UI/TextTemplates/MainTitle";
import DragDrop from "@/app/(auxiliary)/components/Blocks/EducationBlocks/DragDrop/DragDrop";
import TrainingNow from "@/app/(auxiliary)/components/Blocks/EducationBlocks/TrainingNow/TrainingNow";
import LearningMetrics from "@/app/(auxiliary)/components/Blocks/EducationBlocks/LearningMetrics/LearningMetrics";

const EducationAi = () => {
    return (
        <div className={styles.contentGrid}>
            <div className={styles.contentWrapper} style={{gridArea: 'drop-zone'}}>
                <MainTitle>Education AI</MainTitle>

                <DragDrop/>
            </div>

            <div className={styles.contentWrapper} style={{gridArea: 'training-now'}}>
                <MainTitle>Training now</MainTitle>

                <TrainingNow/>
            </div>

            <div className={styles.contentWrapper} style={{gridArea: 'metrics'}}>
                <MainTitle>Learning Metrics # Dataset</MainTitle>

                <LearningMetrics/>
            </div>
        </div>

    );
};

export default EducationAi;