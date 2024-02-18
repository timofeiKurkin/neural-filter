"use client"

import React, {useState} from 'react';
import Button from "@/app/(auxiliary)/components/UI/Button/Button";
import {color_1, color_white} from "@/styles/color";
import DropZone from "@/app/(auxiliary)/components/Sections/EducationAI/DragDrop/DropZone/DropZone";
import styles from "./DragDrop.module.scss";
import {AnimatePresence, Variants} from "framer-motion";
import {motion} from "framer-motion";

const DragDrop = () => {
    const [hasFiles, setHasFiles] = useState<boolean>(false)
    const [removeAllFiles, setRemoveAllFiles] = useState<boolean>(false)

    const variants: Variants = {
        'visible': {opacity: 1},
        'hidden': {opacity: 0}
    }

    const hasFilesHandler = (state: boolean) => {
        setHasFiles(state)
    }

    const removeAllFilesHandler = () => {
        setRemoveAllFiles((prevState) => (!prevState))
    }

    return (
        <div className={styles.dragDrop}>
            <DropZone setHasFiles={hasFilesHandler} removeFiles={removeAllFiles}/>

            <AnimatePresence>
                {
                    hasFiles && (
                        <motion.div
                            variants={variants}
                            initial={'hidden'}
                            animate={'visible'}
                            exit={'hidden'}
                        >
                            <Button style={{backgroundColor: color_1, textColor: color_white}}
                                    onClick={() => removeAllFilesHandler()}
                            >
                                Remove all files
                            </Button>
                        </motion.div>
                    )
                }
            </AnimatePresence>


            <div className={styles.dragDropButton}>
                <Button style={{backgroundColor: color_1, textColor: color_white}}>
                    Send & Start education
                </Button>
            </div>
        </div>
    );
};

export default DragDrop;