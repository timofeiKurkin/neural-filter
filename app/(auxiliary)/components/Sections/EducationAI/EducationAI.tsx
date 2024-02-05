import React from 'react';
import styles from "./EducationAI.module.scss";
import MainTitle from "@/app/(auxiliary)/components/UI/TextTemplates/MainTitle";
import DragDrop from "@/app/(auxiliary)/components/Sections/EducationAI/DragDrop/DragDrop";

const EducationAi = () => {
    return (
        <div className={styles.educationAIWrapper}>
            <div className={styles.educationAITitle}>
                <MainTitle>
                    Education AI
                </MainTitle>
            </div>

            <div className={styles.educationAI}>
                <div>
                    <DragDrop/>
                </div>

                <div>
                </div>
            </div>
        </div>
    );
};

export default EducationAi;