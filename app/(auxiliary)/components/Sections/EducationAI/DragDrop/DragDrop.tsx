"use client"

import React from 'react';
import Button from "@/app/(auxiliary)/components/UI/Button/Button";
import {color_1, color_white} from "@/styles/color";
import DropZone from "@/app/(auxiliary)/components/Sections/EducationAI/DragDrop/DropZone/DropZone";
import styles from "./DragDrop.module.scss";

const DragDrop = () => {
    return (
        <div className={styles.dragDrop}>
            <DropZone/>

            <div className={styles.dragDropButton}>
                <Button style={{backgroundColor: color_1, textColor: color_white}}>
                    Start education
                </Button>
            </div>
        </div>
    );
};

export default DragDrop;